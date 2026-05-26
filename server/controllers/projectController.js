const supabase = require('../config/supabase')
exports.getAll = async (req, res) => {
  try { const { data } = await supabase.from('projects').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }); res.json(data || []) } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.create = async (req, res) => {
  try { const { name, description } = req.body; if (!name) return res.status(400).json({ message: 'Name required' }); const { data } = await supabase.from('projects').insert({ user_id: req.user.id, name, description }).select().single(); res.status(201).json(data) } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.update = async (req, res) => {
  try { const { data } = await supabase.from('projects').update({ name: req.body.name, description: req.body.description }).eq('id', req.params.id).eq('user_id', req.user.id).select().single(); res.json(data) } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.delete = async (req, res) => {
  try { await supabase.from('projects').delete().eq('id', req.params.id).eq('user_id', req.user.id); res.json({ message: 'Deleted' }) } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.getRiskScore = async (req, res) => {
  try {
    const { data: cves } = await supabase.from('cve_alerts').select('severity').eq('user_id', req.user.id)
    const c = (cves || []), critical = c.filter(x => x.severity >= 9).length, high = c.filter(x => x.severity >= 7 && x.severity < 9).length, medium = c.filter(x => x.severity >= 4 && x.severity < 7).length, low = c.filter(x => x.severity < 4).length
    res.json({ score: Math.max(0, 100 - critical * 20 - high * 10 - medium * 5), critical, high, medium, low, total: c.length })
  } catch { res.status(500).json({ message: 'Failed' }) }
}
