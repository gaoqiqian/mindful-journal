import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../api'

export function RequireAuth({ roles }: { roles?: Role[] }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="main">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/app/admin" replace />
    if (user.role === 'COUNSELOR') return <Navigate to="/app/counselor/alerts" replace />
    return <Navigate to="/app" replace />
  }
  return <Outlet />
}
