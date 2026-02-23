import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { useAuth } from '../state/AuthContext.jsx'

export function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  return (
    <div className="container narrow">
      <h1 className="h1">Create account</h1>
      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
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
          const res = auth.register({ name, email, password })
          if (!res.ok) return setError(res.error)
          navigate('/catalog')
        }}
      >
        <label className="field">
          <span className="label">Name</span>
          <input
            data-testid={testIds.auth.name}
            className="input"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 chars with Aa1"
          />
        </label>

        <button className="btn btnPrimary" data-testid={testIds.auth.submit} type="submit">
          Register
        </button>
      </form>
    </div>
  )
}

