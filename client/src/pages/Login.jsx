import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { Shield, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await authAPI.login(form)
      login(r.data.user, r.data.token)
      toast.success('Access granted')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cyber-bg grid-bg flex items-center justify-center px-4">
      <div className="scan-line" />
      <div className="w-full max-w-md animate-slideUp">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyber-accent/10 border border-cyber-accent/30 mb-5">
            <Shield size={28} className="text-cyber-accent" />
          </div>
          <h1 className="text-3xl font-bold text-cyber-text mb-2">Secure <span className="text-gradient-cyan">Access</span></h1>
          <p className="text-cyber-muted font-mono text-sm">&gt; Authenticate to continue_</p>
        </div>
        <div className="cyber-card">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-cyber-muted mb-2 uppercase tracking-widest">Email</label>
              <input type="email" className="cyber-input" placeholder="analyst@domain.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyber-muted mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="cyber-input pr-11" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-accent">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="cyber-btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin" />Authenticating...</> : 'Access System'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-cyber-border text-center">
            <span className="text-cyber-muted text-sm font-mono">No account? </span>
            <Link to="/register" className="text-cyber-accent text-sm font-mono hover:underline">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
