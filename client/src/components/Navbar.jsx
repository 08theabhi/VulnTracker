import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Shield, LayoutDashboard, Layers, Search, Bell,
  LogOut, FolderOpen, BarChart2, Download, Settings,
  Users, Globe, Award, User
} from 'lucide-react'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/stack', icon: Layers, label: 'My Stack' },
  { to: '/scan', icon: Search, label: 'CVE Scanner' },
  { to: '/urlscan', icon: Globe, label: 'URL Scanner' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/timeline', icon: BarChart2, label: 'Timeline' },
  { to: '/export', icon: Download, label: 'Export Reports' },
  { to: '/badge', icon: Award, label: 'Security Badge' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-cyber-surface border-r border-cyber-border flex flex-col z-50 overflow-y-auto">
      <div className="px-5 py-4 border-b border-cyber-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 flex items-center justify-center">
            <Shield size={16} className="text-cyber-accent" />
          </div>
          <div>
            <div className="font-bold text-base text-cyber-text">VulnTracker</div>
            <div className="text-xs text-cyber-muted font-mono">v3.0.0</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-cyber-card border border-cyber-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-cyber-accent/20 flex items-center justify-center text-xs font-bold text-cyber-accent">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-medium text-cyber-text truncate">{user?.email}</div>
            <div className="text-xs text-cyber-muted font-mono">Analyst</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-3 space-y-0.5 pb-2">
        <div className="text-xs font-mono text-cyber-muted px-4 mb-1.5 uppercase tracking-widest">Navigation</div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={14} />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-cyber-border pt-3 flex-shrink-0">
        <button onClick={() => { logout(); navigate('/login') }} className="nav-link hover:text-red-400 hover:bg-red-500/10">
          <LogOut size={14} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  )
}
