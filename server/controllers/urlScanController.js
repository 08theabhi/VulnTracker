const fetch = require('node-fetch')
const { scanUserStack } = require('../services/nvdService')
exports.scanUrl = async (req, res) => {
  try {
    let { url } = req.body; if (!url) return res.status(400).json({ message: 'URL required' }); if (!url.startsWith('http')) url = 'https://' + url
    const r = await fetch(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 VulnTracker/3.0' } }); const html = await r.text(); const headers = Object.fromEntries(r.headers.entries())
    const patterns = [{ name: 'React', regex: /react|ReactDOM/i }, { name: 'Vue', regex: /vue\.js|__vue/i }, { name: 'Angular', regex: /ng-version|angular\.js/i }, { name: 'jQuery', regex: /jquery[.-](\d+\.\d+)/i }, { name: 'Next.js', regex: /__NEXT_DATA__|next\/dist/i }, { name: 'WordPress', regex: /wp-content|wp-includes/i }, { name: 'Bootstrap', regex: /bootstrap\.(min\.)?css/i }, { name: 'Django', regex: /csrfmiddlewaretoken/i }, { name: 'Laravel', regex: /laravel_session/i }]
    const detected = []; for (const p of patterns) { const m = (html + JSON.stringify(headers)).match(p.regex); if (m) detected.push({ technology_name: p.name, version: m[1] || '' }) }
    const server = headers['x-powered-by'] || headers['server'] || ''; if (server) { const [name, version] = server.split('/'); if (name && !detected.find(d => d.technology_name.toLowerCase() === name.toLowerCase())) detected.push({ technology_name: name, version: version || '' }) }
    const cves = detected.length > 0 ? await scanUserStack(detected) : []
    res.json({ url, detected, cves, found: cves.length })
  } catch (e) { res.status(500).json({ message: 'Could not reach URL: ' + e.message }) }
}
