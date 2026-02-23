import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { testIds } from './testIds.js'
import { useAuth } from '../state/AuthContext.jsx'
import { useCart } from '../state/CartContext.jsx'

function NavItem({ to, testId, children }) {
  return (
    <NavLink
      to={to}
      data-testid={testId}
      className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
    >
      {children}
    </NavLink>
  )
}

export function Layout() {
  const auth = useAuth()
  const cart = useCart()
  const navigate = useNavigate()

  return (
    <div className="appShell">
      <header className="appHeader">
        <div className="brand">
          <Link to="/" className="brandLink" data-testid={testIds.nav.home}>
            DVDFlix
          </Link>
          <span className="brandTag">Movie DVD Store</span>
        </div>

        <nav className="nav">
          <NavItem to="/catalog" testId={testIds.nav.catalog}>
            Catalog
          </NavItem>
          <NavItem to="/cart" testId={testIds.nav.cart}>
            Cart{' '}
            <span className="pill" data-testid={testIds.cart.count}>
              {cart.itemCount}
            </span>
          </NavItem>
          <NavItem to="/orders" testId={testIds.nav.orders}>
            Orders
          </NavItem>
        </nav>

        <div className="authArea">
          {auth.isAuthed ? (
            <>
              <span className="muted">Hi, {auth.user.name}</span>
              <button
                type="button"
                className="btn btnGhost"
                data-testid={testIds.nav.logout}
                onClick={() => {
                  auth.logout()
                  navigate('/')
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btnGhost" to="/login" data-testid={testIds.nav.login}>
                Login
              </Link>
              <Link
                className="btn btnPrimary"
                to="/register"
                data-testid={testIds.nav.register}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="appMain">
        <Outlet />
      </main>

      <footer className="appFooter">
        <div className="mutedSmall">
          Built for end-to-end Quality Engineering practice (manual + automation).
        </div>
      </footer>
    </div>
  )
}

