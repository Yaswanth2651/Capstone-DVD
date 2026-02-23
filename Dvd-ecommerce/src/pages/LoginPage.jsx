import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { useAuth } from '../state/AuthContext.jsx'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const demo = useMemo(() => auth.seedDemoUser(), [auth])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    // Keep fields blank for manual testing, but we provide a deterministic demo shortcut.
  }, [])

  return (
    <div className="container narrow">
      <h1 className="h1">Login</h1>
      <p className="muted">
        Need an account? <Link to="/register">Register</Link>
      </p>

      {error ? (
        <div className="alert" role="alert" data-testid={testIds.auth.error}>
          {error}
        </div>
      ) : null}

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault()
          setError(null)
          const res = auth.login({ email, password })
          if (!res.ok) return setError(res.error)
          navigate(from)
        }}
      >
        <label className="field">
          <span className="label">Email</span>
          <input
            data-testid={testIds.auth.email}
            className="input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="field">
          <span className="label">Password</span>
          <input
            data-testid={testIds.auth.password}
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </label>

        <div className="row gap">
          <button className="btn btnPrimary" data-testid={testIds.auth.submit} type="submit">
            Login
          </button>
          <button
            className="btn btnGhost"
            type="button"
            onClick={() => {
              setEmail(demo.email)
              setPassword(demo.password)
            }}
          >
            Use demo
          </button>
        </div>
      </form>
    </div>
  )
}

