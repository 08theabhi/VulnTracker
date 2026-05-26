import { useState } from 'react'
import { Globe, Search, ExternalLink, Cpu } from 'lucide-react'
import SeverityBadge from '../components/SeverityBadge'
import api from '../services/api'
import toast from 'react-hot-toast'
export default function UrlScanner() {
  const [url,setUrl]=useState(''),[loading,setLoading]=useState(false),[result,setResult]=useState(null)
  const scan=async e=>{e.preventDefault();if(!url.trim())return;setLoading(true);setResult(null);try{const r=await api.post('/urlscan',{url});setResult(r.data);r.data.found===0?toast.success('No vulnerabilities found!'):toast.error(`Found ${r.data.found} vulnerabilities!`)}catch(err){toast.error(err.response?.data?.message||'Scan failed')}setLoading(false)}
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8"><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// URL Scanner</div><h1 className="text-2xl font-bold text-cyber-text">Website URL Scanner</h1><p className="text-cyber-muted text-sm font-mono mt-1">Enter any website URL to detect its tech stack and scan for CVEs</p></div>
      <div className="cyber-card mb-6"><form onSubmit={scan} className="flex gap-3"><div className="relative flex-1"><Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted"/><input className="cyber-input pl-9" placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)}/></div><button type="submit" disabled={loading} className="cyber-btn-primary flex items-center gap-2">{loading?<><div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin"/>Scanning...</>:<><Search size={15}/>Scan URL</>}</button></form><p className="text-xs text-cyber-muted font-mono mt-3">Detects: React, Vue, Angular, Next.js, Django, Laravel, WordPress, Bootstrap and more</p></div>
      {loading&&<div className="cyber-card flex flex-col items-center py-12 gap-4"><div className="w-12 h-12 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/><p className="font-mono text-sm text-cyber-muted">Detecting technologies and scanning CVEs...</p></div>}
      {result&&!loading&&<>
        <div className="cyber-card mb-4"><h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Detected Technologies</h2>{result.detected.length===0?<p className="text-cyber-muted font-mono text-sm">No technologies detected</p>:<div className="flex flex-wrap gap-2">{result.detected.map((t,i)=><div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border"><Cpu size={13} className="text-cyber-accent"/><span className="text-sm font-mono text-cyber-text">{t.technology_name}</span>{t.version&&<span className="text-xs text-cyber-muted">{t.version}</span>}</div>)}</div>}</div>
        <div className="cyber-card">
          <div className="flex items-center justify-between mb-4"><h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest">// Vulnerabilities ({result.found})</h2><div className="flex gap-3 text-xs font-mono"><span className="text-red-400">{result.cves.filter(c=>c.severity>=9).length} Critical</span><span className="text-orange-400">{result.cves.filter(c=>c.severity>=7&&c.severity<9).length} High</span></div></div>
          {result.cves.length===0?<div className="flex flex-col items-center py-10 gap-3"><Globe size={32} className="text-green-400 opacity-50"/><p className="text-cyber-muted font-mono text-sm">No vulnerabilities found!</p></div>
          :<div className="space-y-3">{result.cves.map((cve,i)=>(
            <div key={i} className="p-4 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className="font-mono text-sm text-cyber-accent">{cve.cve_id}</span><span className="text-xs border border-cyber-border rounded px-2 py-0.5 text-cyber-muted">{cve.technology}</span></div><p className="text-xs text-cyber-muted leading-relaxed">{cve.description}</p><p className="text-xs text-cyber-accent/60 font-mono mt-1">{cve.remediation}</p></div>
                <div className="flex flex-col items-end gap-2"><SeverityBadge score={cve.severity}/><a href={`https://nvd.nist.gov/vuln/detail/${cve.cve_id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-cyber-muted hover:text-cyber-accent font-mono">NVD <ExternalLink size={11}/></a></div>
              </div>
            </div>))}</div>}
        </div>
      </>}
    </div>
  )
}
