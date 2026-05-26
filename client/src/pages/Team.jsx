import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Users, Plus, Trash2, UserPlus, Building2, Crown, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
export default function Team() {
  const { user } = useAuth()
  const [data,setData]=useState({owned:[],memberships:[]}),[members,setMembers]=useState([]),[orgName,setOrgName]=useState(''),[inviteEmail,setInviteEmail]=useState(''),[selected,setSelected]=useState(null),[loading,setLoading]=useState(true)
  useEffect(()=>{load()},[])
  useEffect(()=>{if(selected)loadMembers(selected.id)},[selected])
  const load=async()=>{try{const r=await api.get('/team');setData(r.data);if(r.data.owned[0])setSelected(r.data.owned[0])}catch{}setLoading(false)}
  const loadMembers=async id=>{try{const r=await api.get(`/team/${id}/members`);setMembers(r.data||[])}catch{}}
  const createOrg=async e=>{e.preventDefault();if(!orgName.trim())return;try{await api.post('/team/create',{name:orgName});toast.success('Created!');setOrgName('');load()}catch(err){toast.error(err.response?.data?.message||'Failed')}}
  const invite=async e=>{e.preventDefault();if(!inviteEmail||!selected)return;try{await api.post('/team/invite',{email:inviteEmail,org_id:selected.id});toast.success('Member added!');setInviteEmail('');loadMembers(selected.id)}catch(err){toast.error(err.response?.data?.message||'Failed')}}
  const remove=async uid=>{try{await api.delete(`/team/${selected.id}/members/${uid}`);toast.success('Removed');loadMembers(selected.id)}catch{}}
  const del=async id=>{try{await api.delete(`/team/${id}`);toast.success('Deleted');setSelected(null);setMembers([]);load()}catch{}}
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8"><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Team</div><h1 className="text-2xl font-bold text-cyber-text">Team & Organizations</h1></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="cyber-card"><h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Create Organization</h2><form onSubmit={createOrg} className="flex gap-2"><input className="cyber-input flex-1" placeholder="Organization name" value={orgName} onChange={e=>setOrgName(e.target.value)}/><button type="submit" className="cyber-btn-primary flex items-center gap-1"><Plus size={14}/>Create</button></form></div>
          <div className="cyber-card">
            <h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// My Organizations</h2>
            {loading?<div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/></div>
            :data.owned.length===0?<div className="flex flex-col items-center py-8 gap-2"><Building2 size={28} className="text-cyber-muted opacity-30"/><p className="text-cyber-muted font-mono text-sm">No organizations yet</p></div>
            :<div className="space-y-2">{data.owned.map(o=>(
              <div key={o.id} onClick={()=>setSelected(o)} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selected?.id===o.id?'border-cyber-accent bg-cyber-accent/5':'border-cyber-border bg-cyber-surface hover:border-cyber-accent/40'}`}>
                <div className="flex items-center gap-2"><Building2 size={14} className="text-cyber-accent"/><span className="text-sm font-medium text-cyber-text">{o.name}</span></div>
                <button onClick={e=>{e.stopPropagation();del(o.id)}} className="p-1 text-cyber-muted hover:text-red-400"><Trash2 size={13}/></button>
              </div>))}</div>}
          </div>
        </div>
        <div className="cyber-card">
          <h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// {selected?`${selected.name} Members`:'Select Organization'}</h2>
          {!selected?<div className="flex flex-col items-center py-12 gap-2"><Users size={28} className="text-cyber-muted opacity-30"/><p className="text-cyber-muted font-mono text-sm">Select an organization</p></div>
          :<>
            <form onSubmit={invite} className="flex gap-2 mb-5"><input className="cyber-input flex-1 text-sm" placeholder="email@domain.com" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}/><button type="submit" className="cyber-btn-primary text-sm flex items-center gap-1"><UserPlus size={13}/>Invite</button></form>
            <div className="space-y-2">{members.length===0?<div className="text-center py-8"><p className="text-cyber-muted font-mono text-xs">No members yet</p></div>
            :members.map(m=>(
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface border border-cyber-border">
                <div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-cyber-accent/20 flex items-center justify-center text-xs font-bold text-cyber-accent">{m.users?.email?.[0]?.toUpperCase()}</div><div><div className="text-sm text-cyber-text font-mono">{m.users?.email}</div><div className="flex items-center gap-1 mt-0.5">{m.role==='owner'?<Crown size={10} className="text-amber-400"/>:<User size={10} className="text-cyber-muted"/>}<span className="text-xs text-cyber-muted font-mono capitalize">{m.role}</span></div></div></div>
                {m.role!=='owner'&&m.users?.email!==user?.email&&<button onClick={()=>remove(m.users?.id)} className="p-1 text-cyber-muted hover:text-red-400"><Trash2 size={13}/></button>}
              </div>))}</div>
          </>}
        </div>
      </div>
    </div>
  )
}
