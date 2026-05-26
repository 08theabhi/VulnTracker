const supabase = require('../config/supabase')
exports.getSettings = async (req, res) => {
  try { const { data } = await supabase.from('scan_settings').select('*').eq('user_id', req.user.id).single(); res.json(data || { schedule: 'daily', custom_time: '08:00', email_alerts: true, slack_webhook: '' }) } catch { res.json({ schedule: 'daily', custom_time: '08:00', email_alerts: true }) }
}
exports.saveSettings = async (req, res) => {
  try {
    const { schedule, custom_time, email_alerts, slack_webhook } = req.body
    const { data: ex } = await supabase.from('scan_settings').select('id').eq('user_id', req.user.id).single()
    let result
    if (ex) { const { data } = await supabase.from('scan_settings').update({ schedule, custom_time, email_alerts, slack_webhook }).eq('user_id', req.user.id).select().single(); result = data }
    else { const { data } = await supabase.from('scan_settings').insert({ user_id: req.user.id, schedule, custom_time, email_alerts, slack_webhook }).select().single(); result = data }
    res.json(result)
  } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.parsePackageFile = async (req, res) => {
  try {
    const { content, type } = req.body
    let technologies = []
    if (type === 'package.json') { const pkg = JSON.parse(content); const deps = { ...pkg.dependencies, ...pkg.devDependencies }; technologies = Object.entries(deps).map(([name, version]) => ({ technology_name: name, version: version.replace(/[\^~>=<]/g, '').split(' ')[0] })) }
    else { technologies = content.split('\n').filter(l => l.trim() && !l.startsWith('#')).map(line => { const [name, version] = line.split(/[==>=]+/); return { technology_name: name.trim(), version: (version || '').trim() } }) }
    if (technologies.length > 0) { await supabase.from('user_stacks').delete().eq('user_id', req.user.id); await supabase.from('user_stacks').insert(technologies.map(t => ({ ...t, user_id: req.user.id }))) }
    res.json({ detected: technologies.length, technologies })
  } catch (e) { res.status(400).json({ message: 'Parse failed: ' + e.message }) }
}
