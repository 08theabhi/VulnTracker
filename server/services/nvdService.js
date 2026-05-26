const fetch = require('node-fetch')

const fetchCVEs = async (technology, version) => {
  try {
    const keyword = version ? `${technology} ${version}` : technology
    await new Promise(r => setTimeout(r, 600))
    const res = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(keyword)}&resultsPerPage=10`,
      { headers: { 'User-Agent': 'VulnTracker/3.0' }, timeout: 15000 }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.vulnerabilities || []).map(({ cve }) => {
      const m = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0] || cve.metrics?.cvssMetricV2?.[0]
      const score = parseFloat(m?.cvssData?.baseScore || 0)
      const desc = cve.descriptions?.find(d => d.lang === 'en')?.value || 'No description'
      return {
        cve_id: cve.id,
        technology,
        severity: score,
        description: desc.substring(0, 500),
        fix_available: !!(cve.configurations),
        remediation: `Check https://nvd.nist.gov/vuln/detail/${cve.id} for patches and fix details.`,
        published_date: cve.published || null
      }
    }).filter(c => c.severity > 0)
  } catch {
    return []
  }
}

const scanUserStack = async (stacks) => {
  const results = []
  for (const item of stacks) {
    const cves = await fetchCVEs(item.technology_name, item.version)
    results.push(...cves)
  }
  const seen = new Set()
  return results
    .filter(c => { if (seen.has(c.cve_id)) return false; seen.add(c.cve_id); return true })
    .sort((a, b) => b.severity - a.severity)
}

module.exports = { fetchCVEs, scanUserStack }
