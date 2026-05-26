import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-cyber-bg">
      <div className="w-8 h-8 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
