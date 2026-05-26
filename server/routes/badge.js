const r = require('express').Router(), supabase = require('../config/supabase')
r.get('/:userId', async (req, res) => {
  try {
    const { data: cves } = await supabase.from('cve_alerts').select('severity').eq('user_id', req.params.userId)
    const critical = (cves||[]).filter(c => c.severity >= 9).length, high = (cves||[]).filter(c => c.severity >= 7 && c.severity < 9).length
    const score = Math.max(0, 100 - critical * 20 - high * 10)
    const color = score >= 80 ? '00c853' : score >= 60 ? 'ffb300' : score >= 40 ? 'ff6d00' : 'dd2c00'
    const label = score >= 80 ? 'Good' : score >= 60 ? 'Fair' : score >= 40 ? 'Poor' : 'Critical'
    res.setHeader('Content-Type', 'image/svg+xml'); res.setHeader('Cache-Control', 'no-cache')
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="20"><rect width="100" height="20" fill="#1e3a5f" rx="3"/><rect x="100" width="80" height="20" fill="#${color}" rx="3"/><text x="50" y="14" font-family="Arial" font-size="11" fill="white" text-anchor="middle">VulnTracker</text><text x="140" y="14" font-family="Arial" font-size="11" fill="white" text-anchor="middle">${label} ${score}/100</text></svg>`)
  } catch { res.status(500).send('Error') }
})
module.exports = r
