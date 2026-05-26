const supabase = require('../config/supabase')
const { scanUserStack } = require('../services/nvdService')
const { sendVulnAlert, sendSlackAlert } = require('../services/emailService')

exports.scan = async (req, res) => {
  try {
    const uid = req.user.id
    const { data: stacks } = await supabase.from('user_stacks').select('*').eq('user_id', uid)
    if (!stacks?.length) return res.status(400).json({ message: 'No technologies in your stack. Add some first.' })

    const cves = await scanUserStack(stacks)

    if (cves.length > 0) {
      await supabase.from('cve_alerts').delete().eq('user_id', uid)
      await supabase.from('cve_alerts').insert(cves.map(c => ({ ...c, user_id: uid, is_read: false })))
    }

    const critical = cves.filter(c => c.severity >= 9).length
    const high = cves.filter(c => c.severity >= 7 && c.severity < 9).length
    const medium = cves.filter(c => c.severity >= 4 && c.severity < 7).length
    const low = cves.filter(c => c.severity < 4).length
    const score = Math.max(0, 100 - critical * 20 - high * 10 - medium * 5)

    await supabase.from('scan_history').insert({
      user_id: uid, total_cves: cves.length,
      critical_count: critical, high_count: high, medium_count: medium, low_count: low, risk_score: score
    })

    const serious = cves.filter(c => c.severity >= 7)
    if (serious.length > 0) {
      const { data: u } = await supabase.from('users').select('email').eq('id', uid).single()
      const { data: s } = await supabase.from('scan_settings').select('*').eq('user_id', uid).single()
      if (u && s?.email_alerts !== false) sendVulnAlert(u.email, serious).catch(console.error)
      if (s?.slack_webhook) sendSlackAlert(s.slack_webhook, serious).catch(console.error)
    }

    res.json({ scanned: stacks.length, found: cves.length, cves, risk_score: score })
  } catch (e) { console.error(e); res.status(500).json({ message: 'Scan failed. Please try again.' }) }
}

exports.getResults = async (req, res) => {
  try {
    const { severity } = req.query
    let q = supabase.from('cve_alerts').select('*').eq('user_id', req.user.id).order('severity', { ascending: false })
    if (severity) {
      const r = { critical: [9, 10], high: [7, 8.9], medium: [4, 6.9], low: [0, 3.9] }[severity]
      if (r) q = q.gte('severity', r[0]).lte('severity', r[1])
    }
    const { data, error } = await q
    if (error) throw error
    res.json(data || [])
  } catch { res.status(500).json({ message: 'Failed to fetch results' }) }
}

exports.getStats = async (req, res) => {
  try {
    const { data } = await supabase.from('cve_alerts').select('severity, is_read').eq('user_id', req.user.id)
    const cves = data || []
    res.json({
      total: cves.length,
      critical: cves.filter(c => c.severity >= 9).length,
      high: cves.filter(c => c.severity >= 7 && c.severity < 9).length,
      medium: cves.filter(c => c.severity >= 4 && c.severity < 7).length,
      low: cves.filter(c => c.severity < 4).length,
      unread: cves.filter(c => !c.is_read).length
    })
  } catch { res.status(500).json({ message: 'Failed' }) }
}

exports.markRead = async (req, res) => {
  try {
    await supabase.from('cve_alerts').update({ is_read: true }).eq('id', req.params.id).eq('user_id', req.user.id)
    res.json({ message: 'Marked as read' })
  } catch { res.status(500).json({ message: 'Failed' }) }
}

exports.markAllRead = async (req, res) => {
  try {
    await supabase.from('cve_alerts').update({ is_read: true }).eq('user_id', req.user.id)
    res.json({ message: 'All marked as read' })
  } catch { res.status(500).json({ message: 'Failed' }) }
}
