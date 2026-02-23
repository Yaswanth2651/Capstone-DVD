import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container">
      <div className="panel">
        <h1 className="h1">404</h1>
        <p className="muted">That page does not exist.</p>
        <Link className="btn btnPrimary" to="/">
          Go home
        </Link>
      </div>
    </div>
  )
}

