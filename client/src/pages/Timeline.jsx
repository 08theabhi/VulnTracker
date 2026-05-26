import { useEffect, useState } from 'react'
import { exportAPI } from '../services/api'
import { TrendingDown, TrendingUp, BarChart2 } from 'lucide-react'
export default function Timeline() {
  const [history,setHistory]=useState([]),[loading,setLoading]=useState(true)
  useEffect(()=>{exportAPI.history().then(r=>setHistory(r.data||[])).catch(()=>{}).finally(()=>setLoading(false))},[])
  const max=Math.max(...history.map(h=>h.total_cves),1)
  const latest=history[history.length-1],prev=history[history.length-2]
  const trend=latest&&prev?latest.total_cves-prev.total_cves:0
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8"><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Timeline</div><h1 className="text-2xl font-bold text-cyber-text">CVE History Timeline</h1></div>
      {history.length>0&&<div className="grid grid-cols-3 gap-4 mb-6">
        <div className="cyber-card text-center"><div className="text-2xl font-bold text-cyber-accent">{history.length}</div><div className="text-xs text-cyber-muted font-mono mt-1">Total Scans</div></div>
        <div className="cyber-card text-center"><div className={`text-2xl font-bold flex items-center justify-center gap-1 ${trend<=0?'text-green-400':'text-red-400'}`}>{trend<=0?<TrendingDown size={20}/>:<TrendingUp size={20}/>}{Math.abs(trend)}</div><div className="text-xs text-cyber-muted font-mono mt-1">{trend<=0?'Improvement':'Increase'}</div></div>
        <div className="cyber-card text-center"><div className={`text-2xl font-bold ${(latest?.risk_score||0)>=80?'text-green-400':'text-amber-400'}`}>{latest?.risk_score||'--'}</div><div className="text-xs text-cyber-muted font-mono mt-1">Current Score</div></div>
      </div>}
      <div className="cyber-card">
        <h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-6">// CVEs Per Scan</h2>
        {loading?<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/></div>
        :history.length===0?<div className="flex flex-col items-center py-12 gap-3"><BarChart2 size={36} className="text-cyber-muted opacity-30"/><p className="text-cyber-muted font-mono text-sm">No scan history yet — run your first scan!</p></div>
        :<>
          <div className="flex items-end gap-2 h-48 mb-4">
            {history.map((h,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="text-xs text-cyber-muted font-mono opacity-0 group-hover:opacity-100">{h.total_cves}</div>
                <div className="w-full flex flex-col gap-0.5 justify-end" style={{height:'160px'}}>
                  <div className="w-full bg-green-500/60 rounded-sm" style={{height:`${(h.low_count/max)*160}px`,minHeight:h.low_count>0?2:0}}/>
                  <div className="w-full bg-amber-500/60 rounded-sm" style={{height:`${(h.medium_count/max)*160}px`,minHeight:h.medium_count>0?2:0}}/>
                  <div className="w-full bg-orange-500/60 rounded-sm" style={{height:`${(h.high_count/max)*160}px`,minHeight:h.high_count>0?2:0}}/>
                  <div className="w-full bg-red-500/60 rounded-sm" style={{height:`${(h.critical_count/max)*160}px`,minHeight:h.critical_count>0?2:0}}/>
                </div>
                <div className="text-cyber-muted font-mono" style={{fontSize:10}}>{new Date(h.scanned_at).toLocaleDateString('en',{month:'short',day:'numeric'})}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            {[['bg-red-500/60','Critical'],['bg-orange-500/60','High'],['bg-amber-500/60','Medium'],['bg-green-500/60','Low']].map(([bg,l])=>(
              <div key={l} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-sm ${bg}`}/><span className="text-xs font-mono text-cyber-muted">{l}</span></div>
            ))}
          </div>
        </>}
      </div>
    </div>
  )
}
