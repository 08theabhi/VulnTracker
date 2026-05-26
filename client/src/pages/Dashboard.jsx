import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { cveAPI, stackAPI, projectAPI } from '../services/api'
import StatCard from '../components/StatCard'
import SeverityBadge from '../components/SeverityBadge'
import RiskScoreCard from '../components/RiskScoreCard'
import { ShieldAlert, Layers, AlertTriangle, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, stacks: 0 })
  const [risk, setRisk] = useState({ score: 100, critical: 0, high: 0, medium: 0, low: 0, total: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [cr, sr, rr] = await Promise.all([
        cveAPI.getResults().catch(() => ({ data: [] })),
        stackAPI.getAll().catch(() => ({ data: [] })),
        projectAPI.getRiskScore().catch(() => ({ data: { score: 100 } }))
      ])
      const cves = cr.data || [], stacks = sr.data || []
      setStats({
        total: cves.length,
        critical: cves.filter(c => c.severity >= 9).length,
        high: cves.filter(c => c.severity >= 7 && c.severity < 9).length,
        stacks: stacks.length
      })
      setRisk(rr.data)
      setRecent(cves.slice(0, 5))
    } catch { }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="text-xs font-mono text-cyber-accent mb-1 uppercase tracking-widest">// Overview</div>
          <h1 className="text-2xl font-bold text-cyber-text">
            Welcome, <span className="text-gradient-cyan">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-cyber-muted text-sm font-mono mt-1">VulnTracker v3.0 — Real-Time Vulnerability Intelligence</p>
        </div>
        <button onClick={fetchData} className="cyber-btn-outline flex items-center gap-2 text-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-1"><RiskScoreCard {...risk} /></div>
        <div className="xl:col-span-2 grid grid-cols-2 gap-4">
          <StatCard label="Total CVEs" value={stats.total} icon={ShieldAlert} color="cyan" />
          <StatCard label="Critical" value={stats.critical} icon={AlertTriangle} color="red" />
          <StatCard label="High" value={stats.high} icon={AlertTriangle} color="amber" />
          <StatCard label="Stack Items" value={stats.stacks} icon={Layers} color="purple" />
        </div>
      </div>

      <div className="cyber-card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-mono text-cyber-muted uppercase tracking-widest">// Recent Vulnerabilities</h2>
          <Link to="/scan" className="flex items-center gap-1 text-xs text-cyber-accent font-mono hover:underline">
            Run scan <ArrowRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <CheckCircle size={32} className="text-cyber-green opacity-50" />
            <p className="text-cyber-muted font-mono text-sm">No vulnerabilities yet</p>
            <Link to="/scan" className="cyber-btn-outline text-sm">Run your first scan</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-accent/30 transition-colors">
                <div>
                  <div className="font-mono text-sm text-cyber-accent">{c.cve_id}</div>
                  <div className="text-xs text-cyber-muted mt-0.5 truncate max-w-sm">{c.description}</div>
                </div>
                <SeverityBadge score={c.severity} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
