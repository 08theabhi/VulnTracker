import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { cveAPI, stackAPI, exportAPI, authAPI } from '../services/api'
import { User, Mail, Calendar, Shield, Download, Key, Save } from 'lucide-react'
import toast from 'react-hot-toast'
export default function Profile() {
  const { user } = useAuth()
  const [stats,setStats]=useState({total:0,critical:0,stacks:0,scans:0}),[pw,setPw]=useState({current:'',newPass:'',confirm:''}),[saving,setSaving]=useState(false),[loading,setLoading]=useState(true)
  useEffect(()=>{
    Promise.all([cveAPI.getStats().catch(()=>({data:{}})),stackAPI.getAll().catch(()=>({data:[]})),exportAPI.history().catch(()=>({data:[]}))])
      .then(([c,s,h])=>setStats({total:c.data?.total||0,critical:c.data?.critical||0,stacks:s.data?.length||0,scans:h.data?.length||0})).finally(()=>setLoading(false))
  },[])
  const changePw=async e=>{e.preventDefault();if(pw.newPass!==pw.confirm)return toast.error('Passwords do not match');setSaving(true);try{await authAPI.changePassword({currentPassword:pw.current,newPassword:pw.newPass});toast.success('Password changed!');setPw({current:'',newPass:'',confirm:''})}catch(err){toast.error(err.response?.data?.message||'Failed')}setSaving(false)}
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8"><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Profile</div><h1 className="text-2xl font-bold text-cyber-text">My Profile</h1></div>
      <div className="cyber-card mb-5"><div className="flex items-center gap-5"><div className="w-16 h-16 rounded-2xl bg-cyber-accent/20 border border-cyber-accent/30 flex items-center justify-center text-2xl font-bold text-cyber-accent">{user?.email?.[0]?.toUpperCase()}</div><div><h2 className="text-lg font-bold text-cyber-text">{user?.email?.split('@')[0]}</h2><div className="flex items-center gap-2 mt-1"><Mail size={13} className="text-cyber-muted"/><span className="text-sm font-mono text-cyber-muted">{user?.email}</span></div><div className="flex items-center gap-2 mt-1"><Shield size={13} className="text-cyber-accent"/><span className="text-xs font-mono text-cyber-accent">Security Analyst</span></div></div></div></div>
      <div className="grid grid-cols-4 gap-4 mb-5">{[{l:'CVEs Found',v:stats.total,c:'text-cyber-accent'},{l:'Critical',v:stats.critical,c:'text-red-400'},{l:'Stack Items',v:stats.stacks,c:'text-purple-400'},{l:'Total Scans',v:stats.scans,c:'text-green-400'}].map(s=><div key={s.l} className="cyber-card text-center py-4"><div className={`text-2xl font-bold ${s.c}`}>{loading?'--':s.v}</div><div className="text-xs text-cyber-muted font-mono mt-1">{s.l}</div></div>)}</div>
      <div className="cyber-card mb-5"><h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Account Info</h2><div className="space-y-3">{[{icon:Mail,l:'Email',v:user?.email},{icon:User,l:'Username',v:user?.email?.split('@')[0]},{icon:Shield,l:'Role',v:'Security Analyst'},{icon:Calendar,l:'Member Since',v:user?.created_at?new Date(user.created_at).toLocaleDateString():'N/A'}].map(({icon:Icon,l,v})=><div key={l} className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface border border-cyber-border"><div className="flex items-center gap-3"><Icon size={15} className="text-cyber-muted"/><span className="text-sm text-cyber-muted font-mono">{l}</span></div><span className="text-sm font-mono text-cyber-text">{v}</span></div>)}</div></div>
      <div className="cyber-card mb-5"><div className="flex items-center gap-2 mb-4"><Key size={15} className="text-cyber-accent"/><h2 className="text-sm font-medium text-cyber-text">Change Password</h2></div>
        <form onSubmit={changePw} className="space-y-3">{[{k:'current',l:'Current Password',p:'Enter current password'},{k:'newPass',l:'New Password',p:'Min 8 characters'},{k:'confirm',l:'Confirm New Password',p:'Repeat new password'}].map(f=><div key={f.k}><label className="block text-xs font-mono text-cyber-muted mb-1.5 uppercase tracking-widest">{f.l}</label><input type="password" className="cyber-input" placeholder={f.p} value={pw[f.k]} onChange={e=>setPw({...pw,[f.k]:e.target.value})}/></div>)}
          <button type="submit" disabled={saving} className="cyber-btn-primary flex items-center gap-2">{saving?<><div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin"/>Saving...</>:<><Save size={14}/>Update Password</>}</button>
        </form>
      </div>
      <div className="cyber-card"><div className="flex items-center gap-2 mb-3"><Download size={15} className="text-cyber-accent"/><h2 className="text-sm font-medium text-cyber-text">Export My Data</h2></div><p className="text-xs text-cyber-muted font-mono mb-4">Download all your vulnerability data</p><div className="flex gap-3"><a href="/api/export/csv" className="cyber-btn-outline text-sm flex items-center gap-2"><Download size={13}/>CSV</a><a href="/api/export/json" className="cyber-btn-outline text-sm flex items-center gap-2"><Download size={13}/>JSON</a></div></div>
    </div>
  )
}
