const supabase = require('../config/supabase')
exports.getAll = async (req, res) => {
  try { const { data } = await supabase.from('user_stacks').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }); res.json(data || []) } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.add = async (req, res) => {
  try { const { technology_name, version } = req.body; if (!technology_name) return res.status(400).json({ message: 'Name required' }); const { data } = await supabase.from('user_stacks').insert({ user_id: req.user.id, technology_name: technology_name.trim(), version: version?.trim() || null }).select().single(); res.status(201).json(data) } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.update = async (req, res) => {
  try { const { data } = await supabase.from('user_stacks').update({ technology_name: req.body.technology_name, version: req.body.version || null }).eq('id', req.params.id).eq('user_id', req.user.id).select().single(); res.json(data) } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.delete = async (req, res) => {
  try { await supabase.from('user_stacks').delete().eq('id', req.params.id).eq('user_id', req.user.id); res.json({ message: 'Deleted' }) } catch { res.status(500).json({ message: 'Failed' }) }
}
