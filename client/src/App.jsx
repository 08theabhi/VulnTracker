import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import StackManager from './pages/StackManager'
import CVEScanner from './pages/CVEScanner'
import Alerts from './pages/Alerts'
import Projects from './pages/Projects'
import Timeline from './pages/Timeline'
import ExportReports from './pages/ExportReports'
import Settings from './pages/Settings'
import Team from './pages/Team'
import UrlScanner from './pages/UrlScanner'
import Badge from './pages/Badge'
import Profile from './pages/Profile'

const P = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
)

function AppContent() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{ style: { background: '#141C2E', color: '#E2E8F7', border: '1px solid #1E2D47' } }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/stack" element={<P><StackManager /></P>} />
          <Route path="/scan" element={<P><CVEScanner /></P>} />
          <Route path="/urlscan" element={<P><UrlScanner /></P>} />
          <Route path="/alerts" element={<P><Alerts /></P>} />
          <Route path="/projects" element={<P><Projects /></P>} />
          <Route path="/team" element={<P><Team /></P>} />
          <Route path="/timeline" element={<P><Timeline /></P>} />
          <Route path="/export" element={<P><ExportReports /></P>} />
          <Route path="/badge" element={<P><Badge /></P>} />
          <Route path="/profile" element={<P><Profile /></P>} />
          <Route path="/settings" element={<P><Settings /></P>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
