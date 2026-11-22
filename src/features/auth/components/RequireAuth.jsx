import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'

export default function RequireAuth({ children }) {
  const { isAuthenticated, status } = useAuth()

  if (status === 'loading') {
    return <p className="text-sm text-gray-500">Cargando…</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
