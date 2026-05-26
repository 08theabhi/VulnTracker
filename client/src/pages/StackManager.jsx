import { useEffect, useState } from 'react'
import { stackAPI } from '../services/api'
import { Plus, Trash2, Edit2, Check, X, Package } from 'lucide-react'
import toast from 'react-hot-toast'
const POP = ['React','Node.js','Django','Express','Laravel','Flask','Next.js','Vue','Spring Boot','Rails']
export default function StackManager() {
  const [items, setItems] = useState([]), [form, setForm] = useState({technology_name:'',version:''}), [editing, setEditing] = useState(null), [loading, setLoading] = useState(true)
  useEffect(() => { load() }, [])
  const load = async () => { try { const r = await stackAPI.getAll(); setItems(r.data||[]) } catch { toast.error('Failed') } setLoading(false) }
  const add = async e => { e.preventDefault(); if (!form.technology_name.trim()) return; try { await stackAPI.add(form); toast.success(`${form.technology_name} added`); setForm({technology_name:'',version:''}); load() } catch { toast.error('Failed') } }
  const del = async (id,name) => { try { await stackAPI.delete(id); toast.success(`${name} removed`); load() } catch { toast.error('Failed') } }
  const save = async item => { try { await stackAPI.update(item.id,{technology_name:editing.technology_name,version:editing.version}); toast.success('Updated'); setEditing(null); load() } catch { toast.error('Failed') } }
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8"><div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Stack Manager</div><h1 className="text-2xl font-bold text-cyber-text">My Tech Stack</h1><p className="text-cyber-muted text-sm font-mono mt-1">Add technologies to monitor for CVEs</p></div>
      <div className="cyber-card mb-6">
        <h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Add Technology</h2>
        <form onSubmit={add} className="flex gap-3 flex-wrap"><input className="cyber-input flex-1 min-w-[180px]" placeholder="e.g. React, Django" value={form.technology_name} onChange={e=>setForm({...form,technology_name:e.target.value})}/><input className="cyber-input w-36" placeholder="Version" value={form.version} onChange={e=>setForm({...form,version:e.target.value})}/><button type="submit" className="cyber-btn-primary flex items-center gap-2"><Plus size={15}/>Add</button></form>
        <div className="mt-4 flex flex-wrap gap-2">{POP.map(t=><button key={t} type="button" onClick={()=>setForm({...form,technology_name:t})} className="text-xs font-mono px-3 py-1 rounded-full border border-cyber-border text-cyber-muted hover:border-cyber-accent hover:text-cyber-accent transition-all">{t}</button>)}</div>
      </div>
      <div className="cyber-card">
        <h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Tracked ({items.length})</h2>
        {loading?<div className="flex justify-center py-8"><div className="w-7 h-7 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/></div>
        :items.length===0?<div className="flex flex-col items-center py-10 gap-3"><Package size={28} className="text-cyber-muted opacity-40"/><p className="text-cyber-muted font-mono text-sm">No technologies yet</p></div>
        :<div className="space-y-2">{items.map(item=>(
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface border border-cyber-border group hover:border-cyber-border/60 transition-all">
            {editing?.id===item.id
              ?<div className="flex items-center gap-2 flex-1"><input className="cyber-input text-sm py-1.5 flex-1" value={editing.technology_name} onChange={e=>setEditing({...editing,technology_name:e.target.value})}/><input className="cyber-input text-sm py-1.5 w-28" value={editing.version} onChange={e=>setEditing({...editing,version:e.target.value})}/><button onClick={()=>save(item)} className="text-green-400 p-1"><Check size={15}/></button><button onClick={()=>setEditing(null)} className="text-cyber-muted p-1"><X size={15}/></button></div>
              :<><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center"><Package size={14} className="text-cyber-accent"/></div><div><div className="text-sm font-medium text-cyber-text">{item.technology_name}</div><div className="text-xs text-cyber-muted font-mono">{item.version||'No version'}</div></div></div><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>setEditing({id:item.id,technology_name:item.technology_name,version:item.version||''})} className="p-1.5 text-cyber-muted hover:text-cyber-accent"><Edit2 size={13}/></button><button onClick={()=>del(item.id,item.technology_name)} className="p-1.5 text-cyber-muted hover:text-red-400"><Trash2 size={13}/></button></div></>}
          </div>))}</div>}
      </div>
    </div>
  )
}
