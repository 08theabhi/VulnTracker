const supabase = require('../config/supabase')
const lvl = s => s >= 9 ? 'CRITICAL' : s >= 7 ? 'HIGH' : s >= 4 ? 'MEDIUM' : 'LOW'
exports.exportCSV = async (req, res) => {
  try {
    const { data: cves } = await supabase.from('cve_alerts').select('*').eq('user_id', req.user.id).order('severity', { ascending: false })
    const rows = (cves || []).map(c => [c.cve_id, c.technology, c.severity, lvl(c.severity), `"${(c.description || '').replace(/"/g, "'")}"`, c.fix_available ? 'Yes' : 'No', c.published_date ? new Date(c.published_date).toLocaleDateString() : 'Unknown'].join(','))
    res.setHeader('Content-Type', 'text/csv'); res.setHeader('Content-Disposition', 'attachment; filename="vulntracker.csv"')
    res.send(['CVE ID,Technology,Score,Level,Description,Fix,Published', ...rows].join('\n'))
  } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.exportJSON = async (req, res) => {
  try {
    const { data: cves } = await supabase.from('cve_alerts').select('*').eq('user_id', req.user.id).order('severity', { ascending: false })
    const { data: stacks } = await supabase.from('user_stacks').select('*').eq('user_id', req.user.id)
    res.setHeader('Content-Type', 'application/json'); res.setHeader('Content-Disposition', 'attachment; filename="vulntracker.json"')
    res.json({ generated_at: new Date().toISOString(), summary: { total: (cves||[]).length, critical: (cves||[]).filter(c=>c.severity>=9).length, high: (cves||[]).filter(c=>c.severity>=7&&c.severity<9).length, medium: (cves||[]).filter(c=>c.severity>=4&&c.severity<7).length, low: (cves||[]).filter(c=>c.severity<4).length }, tech_stack: stacks, vulnerabilities: cves })
  } catch { res.status(500).json({ message: 'Failed' }) }
}
exports.getHistory = async (req, res) => {
  try { const { data } = await supabase.from('scan_history').select('*').eq('user_id', req.user.id).order('scanned_at', { ascending: true }).limit(30); res.json(data || []) } catch { res.status(500).json({ message: 'Failed' }) }
}
