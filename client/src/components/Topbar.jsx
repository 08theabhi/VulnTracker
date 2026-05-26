import { useState, useRef, useEffect } from 'react'
import { Bell, Sun, Moon, Search, X, ExternalLink, CheckCheck } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title }) {
  const { dark, toggle } = useTheme()
  const { notifications, unread, fetchNotifications, markAllRead } = useNotifications()
  const [showNotifs, setShowNotifs] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const notifRef = useRef(null)
  const searchRef = useRef(null)
  const searchTimer = useRef(null)
  const navigate = useNavigate()

  const sc = s => s >= 9 ? 'text-red-400' : s >= 7 ? 'text-orange-400' : s >= 4 ? 'text-amber-400' : 'text-green-400'

  useEffect(() => {
    const h = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleBellClick = () => {
    const next = !showNotifs
    setShowNotifs(next)
    if (next) fetchNotifications()
  }

  const handleSearch = val => {
    setQuery(val)
    clearTimeout(searchTimer.current)
    if (!val.trim()) { setResults([]); return }
    const token = localStorage.getItem('vt_token')
    if (!token) return
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cve/results`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return
        const data = await res.json()
        setResults((data || []).filter(c =>
          c.cve_id?.toLowerCase().includes(val.toLowerCase()) ||
          c.technology?.toLowerCase().includes(val.toLowerCase()) ||
          c.description?.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 6))
      } catch {}
    }, 500)
  }

  return (
    <div className="flex items-center justify-between px-8 py-3.5 border-b border-cyber-border bg-cyber-surface sticky top-0 z-40">
      <h2 className="text-lg font-bold text-cyber-text">{title}</h2>
      <div className="flex items-center gap-2.5">

        {/* Search */}
        <div ref={searchRef} className="relative">
          <div className={`flex items-center gap-2 bg-cyber-card border rounded-lg px-3 py-2 transition-all duration-300 ${showSearch || query ? 'border-cyber-accent w-64' : 'border-cyber-border w-40'}`}>
            <Search size={13} className="text-cyber-muted flex-shrink-0" />
            <input
              className="bg-transparent text-sm font-mono text-cyber-text placeholder-cyber-muted focus:outline-none w-full"
              placeholder="Search CVEs..."
              value={query}
              onFocus={() => setShowSearch(true)}
              onChange={e => handleSearch(e.target.value)}
            />
            {query && <button onClick={() => { setQuery(''); setResults([]) }}><X size={12} className="text-cyber-muted" /></button>}
          </div>
          {showSearch && query && (
            <div className="absolute top-full right-0 mt-2 w-96 bg-cyber-card border border-cyber-border rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-cyber-border">
                <span className="text-xs font-mono text-cyber-muted">{results.length} results</span>
              </div>
              {results.length === 0
                ? <div className="px-4 py-6 text-center text-xs font-mono text-cyber-muted">No CVEs found for "{query}"</div>
                : <div className="max-h-64 overflow-y-auto">
                  {results.map((c, i) => (
                    <a key={i} href={`https://nvd.nist.gov/vuln/detail/${c.cve_id}`} target="_blank" rel="noreferrer"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-cyber-surface border-b border-cyber-border/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-cyber-accent">{c.cve_id}</span>
                          <span className="text-xs text-cyber-muted">{c.technology}</span>
                        </div>
                        <p className="text-xs text-cyber-muted mt-0.5 truncate">{c.description}</p>
                      </div>
                      <span className={`text-xs font-bold font-mono flex-shrink-0 ${sc(c.severity)}`}>{c.severity}</span>
                    </a>
                  ))}
                </div>}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button onClick={toggle}
          className="w-9 h-9 rounded-lg border border-cyber-border bg-cyber-card flex items-center justify-center hover:border-cyber-accent transition-colors"
          title={dark ? 'Light mode' : 'Dark mode'}>
          {dark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-cyber-accent" />}
        </button>

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button onClick={handleBellClick}
            className="w-9 h-9 rounded-lg border border-cyber-border bg-cyber-card flex items-center justify-center hover:border-cyber-accent transition-colors relative">
            <Bell size={15} className="text-cyber-muted" />
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-xs text-white font-bold flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-cyber-card border border-cyber-border rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
                <span className="text-xs font-mono text-cyber-muted uppercase tracking-widest">Notifications</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-mono text-cyber-accent hover:underline">
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0
                ? <div className="px-4 py-8 text-center">
                  <Bell size={22} className="text-cyber-muted opacity-30 mx-auto mb-2" />
                  <p className="text-xs font-mono text-cyber-muted">No new notifications</p>
                </div>
                : <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className="px-4 py-3 border-b border-cyber-border/50 hover:bg-cyber-surface transition-colors">
                      <div className="flex items-start gap-2">
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.severity >= 9 ? 'bg-red-400' : n.severity >= 7 ? 'bg-orange-400' : 'bg-amber-400'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-cyber-accent">{n.cve_id}</span>
                            <span className={`text-xs font-bold font-mono ${sc(n.severity)}`}>{n.severity}</span>
                          </div>
                          <p className="text-xs text-cyber-muted truncate">{n.technology}</p>
                        </div>
                        <a href={`https://nvd.nist.gov/vuln/detail/${n.cve_id}`} target="_blank" rel="noreferrer">
                          <ExternalLink size={11} className="text-cyber-muted hover:text-cyber-accent" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>}
              <div className="px-4 py-2.5 border-t border-cyber-border">
                <button onClick={() => { navigate('/alerts'); setShowNotifs(false) }}
                  className="text-xs font-mono text-cyber-accent hover:underline w-full text-center">
                  View all alerts →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
