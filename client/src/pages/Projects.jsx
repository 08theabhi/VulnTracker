import { useEffect, useState } from 'react'
import { projectAPI } from '../services/api'
import { Plus, Trash2, Edit2, FolderOpen, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
const sc=s=>s>=80?'text-green-400 bg-green-500/10 border-green-500/30':s>=60?'text-amber-400 bg-amber-500/10 border-amber-500/30':s>=40?'text-orange-400 bg-orange-500/10 border-orange-500/30':'text-red-400 bg-red-500/10 border-red-500/30'
export default function Projects() {
  const [projects,setProjects]=useState([]),[form,setForm]=useState({name:'',description:''}),[editing,setEditing]=useState(null),[loading,setLoading]=useState(true),[show,setShow]=useState(false)
  useEffect(()=>{load()},[])
  const load=async()=>{try{const r=await projectAPI.getAll();setProjects(r.data||[])}catch{}setLoading(false)}
  const create=async e=>{e.preventDefault();if(!form.name.trim())return;try{await projectAPI.create(form);toast.success('Created');setForm({name:'',description:''});setShow(false);load()}catch{toast.error('Failed')}}
  const del=async id=>{try{await projectAPI.delete(id);toast.success('Deleted');load()}catch{toast.error('Failed')}}
  const save=async p=>{try{await projectAPI.update(p.id,{name:editing.name,description:editing.description});toast.success('Updated');setEditing(null);load()}catch{toast.error('Failed')}}
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between"><div><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Projects</div><h1 className="text-2xl font-bold text-cyber-text">My Projects</h1></div><button onClick={()=>setShow(!show)} className="cyber-btn-primary flex items-center gap-2"><Plus size={15}/>New Project</button></div>
      {show&&<div className="cyber-card mb-6 animate-slideUp"><form onSubmit={create} className="space-y-3"><input className="cyber-input" placeholder="Project name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><textarea className="cyber-input resize-none h-16" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><div className="flex gap-2"><button type="submit" className="cyber-btn-primary text-sm">Create</button><button type="button" onClick={()=>setShow(false)} className="cyber-btn-outline text-sm">Cancel</button></div></form></div>}
      {loading?<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/></div>
      :projects.length===0?<div className="cyber-card flex flex-col items-center py-16 gap-3"><FolderOpen size={36} className="text-cyber-muted opacity-30"/><p className="text-cyber-muted font-mono text-sm">No projects yet</p></div>
      :<div className="grid gap-4">{projects.map(p=>(
        <div key={p.id} className="cyber-card group">
          {editing?.id===p.id
            ?<div className="space-y-2"><input className="cyber-input" value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/><textarea className="cyber-input resize-none h-14" value={editing.description} onChange={e=>setEditing({...editing,description:e.target.value})}/><div className="flex gap-2"><button onClick={()=>save(p)} className="cyber-btn-primary text-sm">Save</button><button onClick={()=>setEditing(null)} className="cyber-btn-outline text-sm">Cancel</button></div></div>
            :<div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-lg bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center"><Shield size={18} className="text-cyber-accent"/></div><div><h3 className="font-medium text-cyber-text">{p.name}</h3><p className="text-xs text-cyber-muted font-mono mt-0.5">{p.description||'No description'}</p></div></div>
              <div className="flex items-center gap-2"><span className={`text-xs font-mono px-2.5 py-1 rounded-md border ${sc(p.risk_score||100)}`}>Score: {p.risk_score||100}</span><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>setEditing({id:p.id,name:p.name,description:p.description||''})} className="p-1.5 text-cyber-muted hover:text-cyber-accent"><Edit2 size={13}/></button><button onClick={()=>del(p.id)} className="p-1.5 text-cyber-muted hover:text-red-400"><Trash2 size={13}/></button></div></div>
            </div>}
        </div>))}</div>}
    </div>
  )
}
