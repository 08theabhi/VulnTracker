import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Copy, Check, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
export default function Badge() {
  const { user } = useAuth()
  const [copied,setCopied]=useState('')
  const base=window.location.origin.replace('3000','5000')
  const badgeUrl=`${base}/api/badge/${user?.id}`
  const md=`[![VulnTracker](${badgeUrl})](${window.location.origin}/dashboard)`
  const html=`<a href="${window.location.origin}/dashboard"><img src="${badgeUrl}" alt="VulnTracker"/></a>`
  const copy=(text,key)=>{navigator.clipboard.writeText(text);setCopied(key);toast.success('Copied!');setTimeout(()=>setCopied(''),2000)}
  const CB=({code,label,id})=>(
    <div className="mb-4"><div className="flex items-center justify-between mb-2"><span className="text-xs font-mono text-cyber-muted uppercase tracking-widest">{label}</span><button onClick={()=>copy(code,id)} className="flex items-center gap-1 text-xs font-mono text-cyber-muted hover:text-cyber-accent">{copied===id?<><Check size={12} className="text-green-400"/>Copied!</>:<><Copy size={12}/>Copy</>}</button></div><div className="bg-cyber-surface border border-cyber-border rounded-lg p-3"><code className="text-xs font-mono text-cyber-accent break-all">{code}</code></div></div>
  )
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8"><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Security Badge</div><h1 className="text-2xl font-bold text-cyber-text">Security Badge</h1><p className="text-cyber-muted text-sm font-mono mt-1">Add your VulnTracker score to your GitHub README</p></div>
      <div className="cyber-card mb-6 flex flex-col items-center py-10 gap-4"><p className="text-xs font-mono text-cyber-muted uppercase tracking-widest">// Live Badge Preview</p><img src={badgeUrl} alt="VulnTracker Badge" className="h-6" onError={e=>e.target.style.display='none'}/><p className="text-xs text-cyber-muted font-mono">Updates automatically after every scan</p></div>
      <div className="cyber-card mb-4"><h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Embed Code</h2><CB code={badgeUrl} label="Badge URL" id="url"/><CB code={md} label="Markdown (GitHub README)" id="md"/><CB code={html} label="HTML" id="html"/></div>
      <div className="cyber-card"><h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Score Guide</h2><div className="space-y-2">{[['🟢','80–100','Good — stack is mostly secure'],['🟡','60–79','Fair — medium issues found'],['🟠','40–59','Poor — high severity issues'],['🔴','0–39','Critical — multiple critical CVEs']].map(([e,r,d])=><div key={r} className="flex gap-3 text-xs text-cyber-muted font-mono"><span>{e}</span><span className="w-16">{r}</span><span>{d}</span></div>)}</div><div className="mt-4 p-3 rounded-lg bg-cyber-accent/5 border border-cyber-accent/20 flex items-center gap-2"><Shield size={14} className="text-cyber-accent"/><span className="text-xs font-mono text-cyber-accent">Run a scan first to get your accurate score!</span></div></div>
    </div>
  )
}
