import { useState } from 'react'
import { exportAPI } from '../services/api'
import { Download, FileText, FileJson, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
export default function ExportReports() {
  const [loading,setLoading]=useState('')
  const dl=async type=>{setLoading(type);try{const r=type==='csv'?await exportAPI.csv():await exportAPI.json();const url=window.URL.createObjectURL(new Blob([r.data]));const a=document.createElement('a');a.href=url;a.download=`vulntracker.${type}`;a.click();window.URL.revokeObjectURL(url);toast.success(`${type.toUpperCase()} downloaded!`)}catch{toast.error('Failed')}setLoading('')}
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8"><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Export</div><h1 className="text-2xl font-bold text-cyber-text">Export Reports</h1></div>
      <div className="grid gap-4 mb-8">
        {[{type:'csv',icon:FileText,label:'CSV Spreadsheet',desc:'Open in Excel or Google Sheets — all CVEs with severity and status',color:'text-green-400 bg-green-500/10 border-green-500/20'},{type:'json',icon:FileJson,label:'JSON Report',desc:'Full machine-readable report with stack info and all vulnerabilities',color:'text-blue-400 bg-blue-500/10 border-blue-500/20'}].map(({type,icon:Icon,label,desc,color})=>(
          <div key={type} className="cyber-card flex items-center justify-between gap-6">
            <div className="flex items-start gap-4"><div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={22}/></div><div><h3 className="font-medium text-cyber-text">{label}</h3><p className="text-xs text-cyber-muted font-mono mt-1">{desc}</p></div></div>
            <button onClick={()=>dl(type)} disabled={loading===type} className="cyber-btn-primary flex items-center gap-2 flex-shrink-0">{loading===type?<div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin"/>:<Download size={15}/>}{loading===type?'Exporting...':'Download'}</button>
          </div>
        ))}
      </div>
      <div className="cyber-card"><h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Included in Reports</h2><div className="grid grid-cols-2 gap-3">{['CVE ID and description','Severity score and level','Affected technology','Published date','Fix availability','Full tech stack','Summary statistics','Scan timestamp'].map(i=><div key={i} className="flex items-center gap-2 text-sm text-cyber-muted font-mono"><Shield size={12} className="text-cyber-accent flex-shrink-0"/>{i}</div>)}</div></div>
    </div>
  )
}
