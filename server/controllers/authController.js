const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')

const makeToken = (u) => jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single()
    if (existing) return res.status(409).json({ message: 'Email already registered' })
    const password_hash = await bcrypt.hash(password, 12)
    const { data: user, error } = await supabase.from('users').insert({ email, password_hash }).select('id, email, created_at').single()
    if (error) throw error
    res.status(201).json({ token: makeToken(user), user: { id: user.id, email: user.email, created_at: user.created_at } })
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }) }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
    const { data: user } = await supabase.from('users').select('*').eq('email', email).single()
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    res.json({ token: makeToken(user), user: { id: user.id, email: user.email, created_at: user.created_at } })
  } catch (e) { res.status(500).json({ message: 'Server error' }) }
}

exports.me = async (req, res) => {
  try {
    const { data: user } = await supabase.from('users').select('id, email, created_at').eq('id', req.user.id).single()
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch { res.status(500).json({ message: 'Server error' }) }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both passwords required' })
    if (newPassword.length < 8) return res.status(400).json({ message: 'Min 8 characters' })
    const { data: user } = await supabase.from('users').select('*').eq('id', req.user.id).single()
    if (!await bcrypt.compare(currentPassword, user.password_hash)) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }
    const password_hash = await bcrypt.hash(newPassword, 12)
    await supabase.from('users').update({ password_hash }).eq('id', req.user.id)
    res.json({ message: 'Password changed successfully' })
  } catch { res.status(500).json({ message: 'Server error' }) }
}
