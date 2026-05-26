import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 8) return toast.error('Min 8 characters')
    setLoading(true)
    try {
      const r = await authAPI.register({ email: form.email, password: form.password })
      login(r.data.user, r.data.token)
      toast.success('Welcome to VulnTracker!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cyber-bg grid-bg flex items-center justify-center px-4">
      <div className="scan-line" />
      <div className="w-full max-w-md animate-slideUp">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyber-accent/10 border border-cyber-accent/30 mb-5">
            <Shield size={28} className="text-cyber-accent" />
          </div>
          <h1 className="text-3xl font-bold text-cyber-text mb-2">Create <span className="text-gradient-cyan">Account</span></h1>
        </div>
        <div className="cyber-card">
          <form onSubmit={submit} className="space-y-4">
            {[
              { k: 'email', t: 'email', l: 'Email', p: 'analyst@domain.com' },
              { k: 'password', t: 'password', l: 'Password', p: 'Min 8 characters' },
              { k: 'confirm', t: 'password', l: 'Confirm Password', p: 'Repeat password' }
            ].map(f => (
              <div key={f.k}>
                <label className="block text-xs font-mono text-cyber-muted mb-1.5 uppercase tracking-widest">{f.l}</label>
                <input type={f.t} className="cyber-input" placeholder={f.p} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} required />
              </div>
            ))}
            <button type="submit" disabled={loading} className="cyber-btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin" />Creating...</> : 'Register'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-cyber-border text-center">
            <span className="text-cyber-muted text-sm font-mono">Have account? </span>
            <Link to="/login" className="text-cyber-accent text-sm font-mono hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
