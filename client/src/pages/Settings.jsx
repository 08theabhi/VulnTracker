import { useEffect, useState } from 'react'
import { settingsAPI } from '../services/api'
import { Save, Upload, Clock, Mail, MessageSquare, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
export default function Settings() {
  const [s,setS]=useState({schedule:'daily',custom_time:'08:00',email_alerts:true,slack_webhook:''}),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[parsing,setParsing]=useState(false),[parsed,setParsed]=useState(null)
  useEffect(()=>{settingsAPI.get().then(r=>setS(r.data)).catch(()=>{}).finally(()=>setLoading(false))},[])
  const save=async()=>{setSaving(true);try{await settingsAPI.save(s);toast.success('Settings saved!')}catch{toast.error('Failed')}setSaving(false)}
  const parseFile=async e=>{const f=e.target.files[0];if(!f)return;setParsing(true);try{const content=await f.text();const type=f.name==='requirements.txt'?'requirements.txt':'package.json';const r=await settingsAPI.parseFile({content,type});setParsed(r.data);toast.success(`Detected ${r.data.detected} technologies!`)}catch{toast.error('Failed')}setParsing(false)}
  if(loading)return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/></div>
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8"><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Settings</div><h1 className="text-2xl font-bold text-cyber-text">Settings</h1></div>
      <div className="cyber-card mb-5">
        <div className="flex items-center gap-2 mb-1"><Upload size={15} className="text-cyber-accent"/><h2 className="text-sm font-medium text-cyber-text">Auto-Detect Stack from File</h2></div>
        <p className="text-xs text-cyber-muted font-mono mb-4">Upload package.json or requirements.txt to auto-detect all dependencies</p>
        <label className="block cursor-pointer"><div className={`border-2 border-dashed border-cyber-border rounded-lg p-6 text-center hover:border-cyber-accent/50 transition-colors ${parsing?'opacity-50':''}`}>{parsing?<div className="flex flex-col items-center gap-2"><div className="w-6 h-6 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/><span className="text-xs font-mono text-cyber-muted">Detecting...</span></div>:<><Upload size={24} className="text-cyber-muted mx-auto mb-2"/><p className="text-sm text-cyber-muted font-mono">Drop package.json or requirements.txt here</p><p className="text-xs text-cyber-muted mt-1">or click to browse</p></>}</div><input type="file" className="hidden" accept=".json,.txt" onChange={parseFile}/></label>
        {parsed&&<div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30"><div className="flex items-center gap-2 mb-2"><CheckCircle size={14} className="text-green-400"/><span className="text-sm text-green-400 font-mono">{parsed.detected} technologies detected and added!</span></div><div className="flex flex-wrap gap-1">{parsed.technologies.slice(0,8).map(t=><span key={t.technology_name} className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-border text-cyber-muted">{t.technology_name} {t.version}</span>)}</div></div>}
      </div>
      <div className="cyber-card mb-5">
        <div className="flex items-center gap-2 mb-4"><Clock size={15} className="text-cyber-accent"/><h2 className="text-sm font-medium text-cyber-text">Scan Schedule</h2></div>
        <div className="flex gap-2 flex-wrap mb-3">{['hourly','daily','weekly'].map(v=><button key={v} onClick={()=>setS({...s,schedule:v})} className={`text-sm font-mono px-4 py-2 rounded-lg border transition-all capitalize ${s.schedule===v?'border-cyber-accent text-cyber-accent bg-cyber-accent/10':'border-cyber-border text-cyber-muted hover:border-cyber-accent/50'}`}>{v==='hourly'?'Every hour':v==='daily'?'Every day':'Every week'}</button>)}</div>
        {s.schedule==='daily'&&<div className="flex items-center gap-3"><label className="text-xs font-mono text-cyber-muted">Time (UTC):</label><input type="time" className="cyber-input w-36 py-2" value={s.custom_time} onChange={e=>setS({...s,custom_time:e.target.value})}/></div>}
      </div>
      <div className="cyber-card mb-5">
        <div className="flex items-center gap-2 mb-4"><Mail size={15} className="text-cyber-accent"/><h2 className="text-sm font-medium text-cyber-text">Alert Channels</h2></div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface border border-cyber-border"><div className="flex items-center gap-3"><Mail size={15} className="text-cyber-muted"/><div><p className="text-sm font-medium text-cyber-text">Email Alerts</p><p className="text-xs text-cyber-muted font-mono">Sends to your registered email</p></div></div><button onClick={()=>setS({...s,email_alerts:!s.email_alerts})} className={`w-11 h-6 rounded-full transition-all relative ${s.email_alerts?'bg-cyber-accent':'bg-cyber-border'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${s.email_alerts?'left-6':'left-1'}`}/></button></div>
          <div className="p-3 rounded-lg bg-cyber-surface border border-cyber-border"><div className="flex items-center gap-3 mb-2"><MessageSquare size={15} className="text-cyber-muted"/><p className="text-sm font-medium text-cyber-text">Slack Webhook</p></div><input className="cyber-input text-sm" placeholder="https://hooks.slack.com/services/..." value={s.slack_webhook||''} onChange={e=>setS({...s,slack_webhook:e.target.value})}/></div>
        </div>
      </div>
      <button onClick={save} disabled={saving} className="cyber-btn-primary w-full flex items-center justify-center gap-2">{saving?<><div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin"/>Saving...</>:<><Save size={15}/>Save Settings</>}</button>
    </div>
  )
}
