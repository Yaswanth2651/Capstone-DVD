import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export function HomePage() {
  const auth = useAuth()

  return (
    <div className="container">
      <section className="hero">
        <div>
          <h1 className="h1">Movie DVDs, delivered fast.</h1>
          <p className="lead">
            Browse a deterministic catalog (great for automation), add to cart, checkout with a
            simulated payment gateway, and track orders end-to-end.
          </p>
          <div className="row gap">
            <Link className="btn btnPrimary" to="/catalog">
              Browse catalog
            </Link>
            {!auth.isAuthed ? (
              <Link className="btn btnGhost" to="/login">
                Login (demo user)
              </Link>
            ) : (
              <Link className="btn btnGhost" to="/orders">
                View orders
              </Link>
            )}
          </div>
        </div>
        <div className="heroCard">
          <div className="heroStat">
            <div className="statNum">6</div>
            <div className="mutedSmall">Core modules</div>
          </div>
          <div className="heroStat">
            <div className="statNum">2</div>
            <div className="mutedSmall">Test suites (unit + e2e)</div>
          </div>
          <div className="heroStat">
            <div className="statNum">100%</div>
            <div className="mutedSmall">Offline, deterministic data</div>
          </div>
        </div>
      </section>

      <section className="grid2">
        <div className="panel">
          <h2 className="h2">Testing-friendly by design</h2>
          <ul className="list">
            <li>Stable selectors via <code>data-testid</code></li>
            <li>Deterministic order IDs like <code>ORD-000001</code></li>
            <li>Payment simulation supports both success and failure paths</li>
          </ul>
        </div>
        <div className="panel">
          <h2 className="h2">Demo credentials</h2>
          <div className="mutedSmall">Seeded automatically when you open Login.</div>
          <div className="codeLike">
            demo.user@example.com / DemoPass1
          </div>
        </div>
      </section>
    </div>
  )
}

