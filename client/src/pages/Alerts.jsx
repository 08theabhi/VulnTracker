import { useEffect, useState } from 'react'
import { cveAPI } from '../services/api'
import SeverityBadge from '../components/SeverityBadge'
import { Bell, CheckCheck, ExternalLink, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
const FILTERS = ['all','critical','high','medium','low']
export default function Alerts() {
  const [alerts,setAlerts]=useState([]),[filter,setFilter]=useState('all'),[loading,setLoading]=useState(true)
  useEffect(()=>{load()},[filter])
  const load=async()=>{setLoading(true);try{const r=await cveAPI.getResults(filter!=='all'?`?severity=${filter}`:'');setAlerts(r.data||[])}catch{toast.error('Failed')}setLoading(false)}
  const markAll=async()=>{try{await cveAPI.markAllRead();setAlerts(alerts.map(a=>({...a,is_read:true})));toast.success('All read')}catch{}}
  const mark=async id=>{try{await cveAPI.markRead(id);setAlerts(alerts.map(a=>a.id===id?{...a,is_read:true}:a))}catch{}}
  const unread=alerts.filter(a=>!a.is_read).length
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Alerts</div><h1 className="text-2xl font-bold text-cyber-text flex items-center gap-2">Vulnerability Alerts{unread>0&&<span className="text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 font-mono">{unread} new</span>}</h1></div>
        {unread>0&&<button onClick={markAll} className="cyber-btn-outline flex items-center gap-2 text-sm"><CheckCheck size={14}/>Mark all read</button>}
      </div>
      <div className="flex gap-2 mb-6 flex-wrap"><Filter size={14} className="text-cyber-muted self-center"/>
        {FILTERS.map(f=><button key={f} onClick={()=>setFilter(f)} className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all capitalize ${filter===f?'border-cyber-accent text-cyber-accent bg-cyber-accent/10':'border-cyber-border text-cyber-muted hover:border-cyber-accent/50'}`}>{f}</button>)}
      </div>
      <div className="cyber-card">
        <h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// {alerts.length} Alerts</h2>
        {loading?<div className="flex justify-center py-10"><div className="w-7 h-7 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/></div>
        :alerts.length===0?<div className="flex flex-col items-center py-12 gap-3"><Bell size={30} className="text-cyber-muted opacity-30"/><p className="text-cyber-muted font-mono text-sm">No alerts found</p></div>
        :<div className="space-y-2">{alerts.map(a=>(
          <div key={a.id} onClick={()=>!a.is_read&&mark(a.id)} className={`p-4 rounded-lg border transition-all cursor-pointer ${a.is_read?'bg-cyber-surface border-cyber-border':'bg-cyber-accent/5 border-cyber-accent/30'}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1 flex-wrap">{!a.is_read&&<span className="w-2 h-2 rounded-full bg-cyber-accent flex-shrink-0"/>}<span className="font-mono text-sm text-cyber-accent">{a.cve_id}</span><span className="text-xs border border-cyber-border rounded px-2 py-0.5 text-cyber-muted">{a.technology}</span></div><p className="text-xs text-cyber-muted leading-relaxed line-clamp-2">{a.description}</p></div>
              <div className="flex flex-col items-end gap-2"><SeverityBadge score={a.severity}/><a href={`https://nvd.nist.gov/vuln/detail/${a.cve_id}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="flex items-center gap-1 text-xs text-cyber-muted hover:text-cyber-accent font-mono">Details <ExternalLink size={11}/></a></div>
            </div>
          </div>))}</div>}
      </div>
    </div>
  )
}
