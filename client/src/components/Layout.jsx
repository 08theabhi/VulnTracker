import Navbar from './Navbar'
import Topbar from './Topbar'
import { useLocation } from 'react-router-dom'

const titles = {
  '/dashboard': 'Dashboard', '/stack': 'My Stack', '/scan': 'CVE Scanner',
  '/urlscan': 'URL Scanner', '/alerts': 'Alerts', '/projects': 'Projects',
  '/team': 'Team', '/timeline': 'Timeline', '/export': 'Export Reports',
  '/badge': 'Security Badge', '/settings': 'Settings', '/profile': 'My Profile'
}

export default function Layout({ children }) {
  const { pathname } = useLocation()
  return (
    <div className="flex h-screen bg-cyber-bg overflow-hidden">
      <div className="scan-line" />
      <Navbar />
      <main className="ml-60 flex-1 overflow-y-auto flex flex-col">
        <Topbar title={titles[pathname] || 'VulnTracker'} />
        <div className="p-8 animate-fadeIn flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
