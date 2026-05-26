import { useState } from 'react'
import { cveAPI } from '../services/api'
import SeverityBadge from '../components/SeverityBadge'
import { Search, Shield, ExternalLink, AlertTriangle, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const SEVS = ['all', 'critical', 'high', 'medium', 'low']
const SORTS = [{ v: 'severity_desc', l: 'Severity ↓' }, { v: 'severity_asc', l: 'Severity ↑' }, { v: 'newest', l: 'Newest' }, { v: 'oldest', l: 'Oldest' }]

export default function CVEScanner() {
  const [scanning, setScanning] = useState(false)
  const [allData, setAllData] = useState(null)
  const [sevFilter, setSevFilter] = useState('all')
  const [sort, setSort] = useState('severity_desc')
  const [tech, setTech] = useState('')
  const [q, setQ] = useState('')

  const runScan = async () => {
    setScanning(true)
    try {
      const r = await cveAPI.scan()
      setAllData(r.data)
      toast.success(`Scan complete — ${r.data.found} CVEs found`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Scan failed')
    }
    setScanning(false)
  }

  const getFiltered = () => {
    if (!allData?.cves) return []
    let r = [...allData.cves]
    if (sevFilter !== 'all') {
      const ranges = { critical: [9, 10], high: [7, 8.9], medium: [4, 6.9], low: [0, 3.9] }
      const [mn, mx] = ranges[sevFilter]
      r = r.filter(c => c.severity >= mn && c.severity <= mx)
    }
    if (tech) r = r.filter(c => c.technology?.toLowerCase().includes(tech.toLowerCase()))
    if (q) r = r.filter(c => c.cve_id?.toLowerCase().includes(q.toLowerCase()) || c.description?.toLowerCase().includes(q.toLowerCase()))
    r.sort((a, b) =>
      sort === 'severity_desc' ? b.severity - a.severity
        : sort === 'severity_asc' ? a.severity - b.severity
          : sort === 'newest' ? new Date(b.published_date || 0) - new Date(a.published_date || 0)
            : new Date(a.published_date || 0) - new Date(b.published_date || 0)
    )
    return r
  }

  const techs = allData?.cves ? [...new Set(allData.cves.map(c => c.technology))] : []
  const filtered = getFiltered()

  const countBySev = (sev) => {
    if (!allData?.cves) return 0
    const ranges = { critical: [9, 10], high: [7, 8.9], medium: [4, 6.9], low: [0, 3.9] }
    const [mn, mx] = ranges[sev]
    return allData.cves.filter(c => c.severity >= mn && c.severity <= mx).length
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="cyber-card mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-cyber-text">Real-time CVE Scanner</p>
          <p className="text-xs text-cyber-muted font-mono mt-1">Queries NVD API — free, no key required</p>
        </div>
        <button onClick={runScan} disabled={scanning} className="cyber-btn-primary flex items-center gap-2">
          {scanning ? <><div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin" />Scanning...</> : <><Search size={15} />Run Scan</>}
        </button>
      </div>

      {scanning && (
        <div className="cyber-card flex flex-col items-center py-12 gap-4">
          <div className="w-12 h-12 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm text-cyber-muted">Querying NVD database... (20–40 seconds)</p>
        </div>
      )}

      {allData && !scanning && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { l: 'Scanned', v: allData.scanned, c: 'text-cyber-accent' },
              { l: 'Total CVEs', v: allData.found, c: 'text-amber-400' },
              { l: 'Critical', v: allData.cves?.filter(c => c.severity >= 9).length, c: 'text-red-400' },
              { l: 'Risk Score', v: allData.risk_score ?? '--', c: 'text-purple-400' }
            ].map(s => (
              <div key={s.l} className="cyber-card text-center py-3">
                <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
                <div className="text-xs text-cyber-muted font-mono mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="cyber-card mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={13} className="text-cyber-muted" />
              <span className="text-xs font-mono text-cyber-muted uppercase tracking-widest">Filters</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted" />
                <input className="cyber-input pl-8 py-2 text-sm" placeholder="Search CVE or description..." value={q} onChange={e => setQ(e.target.value)} />
              </div>
              <select className="cyber-input py-2 text-sm" value={tech} onChange={e => setTech(e.target.value)}>
                <option value="">All Technologies</option>
                {techs.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select className="cyber-input py-2 text-sm" value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              {SEVS.map(f => (
                <button key={f} onClick={() => setSevFilter(f)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all capitalize ${sevFilter === f ? 'border-cyber-accent text-cyber-accent bg-cyber-accent/10' : 'border-cyber-border text-cyber-muted hover:border-cyber-accent/50'}`}>
                  {f}{f !== 'all' ? ` (${countBySev(f)})` : ''}
                </button>
              ))}
              {(sevFilter !== 'all' || tech || q) && (
                <button onClick={() => { setSevFilter('all'); setTech(''); setQ('') }}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="cyber-card">
            <h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">
              // Showing {filtered.length} of {allData.found} CVEs
            </h2>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-3">
                <Shield size={32} className="text-cyber-green opacity-60" />
                <p className="text-cyber-muted font-mono text-sm">No CVEs match your filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((cve, i) => (
                  <div key={i} className="p-4 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-accent/30 transition-colors">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-sm text-cyber-accent">{cve.cve_id}</span>
                          <span className="text-xs border border-cyber-border rounded px-2 py-0.5 text-cyber-muted">{cve.technology}</span>
                          {cve.published_date && <span className="text-xs text-cyber-muted font-mono">{new Date(cve.published_date).toLocaleDateString()}</span>}
                        </div>
                        <p className="text-xs text-cyber-muted leading-relaxed">{cve.description}</p>
                        <div className="mt-2.5 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                          <p className="text-xs font-mono text-amber-400 font-medium mb-1">⚠ Precautions & Fix:</p>
                          <p className="text-xs text-cyber-muted">{cve.remediation}</p>
                          {cve.severity >= 9 && <p className="text-xs text-red-400 font-mono mt-1">🔴 CRITICAL — Update {cve.technology} immediately to prevent exploitation!</p>}
                          {cve.severity >= 7 && cve.severity < 9 && <p className="text-xs text-orange-400 font-mono mt-1">🟠 HIGH — Schedule update within 48 hours</p>}
                          {cve.severity >= 4 && cve.severity < 7 && <p className="text-xs text-amber-400 font-mono mt-1">🟡 MEDIUM — Plan update within this week</p>}
                          {cve.severity < 4 && <p className="text-xs text-green-400 font-mono mt-1">🟢 LOW — Monitor and update when convenient</p>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <SeverityBadge score={cve.severity} />
                        <a href={`https://nvd.nist.gov/vuln/detail/${cve.cve_id}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-cyber-muted hover:text-cyber-accent font-mono transition-colors">
                          Full Details <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!allData && !scanning && (
        <div className="cyber-card flex flex-col items-center py-16 gap-4">
          <AlertTriangle size={36} className="text-cyber-muted opacity-30" />
          <p className="text-cyber-muted font-mono text-sm">Click "Run Scan" to check your stack for vulnerabilities</p>
        </div>
      )}
    </div>
  )
}
