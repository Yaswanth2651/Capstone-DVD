import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { getProductById } from '../data/catalog.js'
import { formatINR } from '../lib/money.js'
import { useAuth } from '../state/AuthContext.jsx'
import { useCart } from '../state/CartContext.jsx'

export function ProductPage() {
  const { id } = useParams()
  const auth = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const product = useMemo(() => getProductById(id), [id])
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState(null)

  if (!product) {
    return (
      <div className="container">
        <div className="panel">
          <h1 className="h1">Not found</h1>
          <p className="muted">This DVD does not exist.</p>
          <Link to="/catalog" className="btn btnPrimary">
            Back to catalog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">{product.title}</h1>
          <div className="mutedSmall">
            {product.genre} • {product.year} • {product.runtimeMins} min
          </div>
        </div>
        {message ? <div className="toast">{message}</div> : null}
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="poster posterLarge" style={{ backgroundImage: product.posterTone }} />
          <p className="muted">{product.description}</p>
        </div>

        <div className="panel">
          <div className="row spaceBetween">
            <div className="priceBig">{formatINR(product.price)}</div>
            <span className={product.stock > 0 ? 'pill pillOk' : 'pill pillBad'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <label className="field">
            <span className="label">Quantity</span>
            <input
              className="input"
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </label>

          <div className="row gap wrap">
            <button
              className="btn btnPrimary"
              type="button"
              data-testid={testIds.product.addToCart(product.id)}
              disabled={product.stock <= 0}
              onClick={() => {
                if (!auth.isAuthed) return navigate('/login', { state: { from: `/product/${product.id}` } })
                const res = cart.add(product.id, qty)
                if (res.ok) {
                  setMessage('Added to cart.')
                  window.setTimeout(() => setMessage(null), 1200)
                }
              }}
            >
              {auth.isAuthed ? 'Add to cart' : 'Login to add'}
            </button>
            <Link className="btn btnGhost" to="/cart">
              Go to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

