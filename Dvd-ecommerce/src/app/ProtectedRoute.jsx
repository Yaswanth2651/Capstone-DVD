import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export function ProtectedRoute({ children }) {
  const auth = useAuth()
  const loc = useLocation()

  if (!auth.isAuthed) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }

  return children
}

