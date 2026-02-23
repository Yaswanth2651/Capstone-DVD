import { Link, useNavigate } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { formatINR } from '../lib/money.js'
import { useCart } from '../state/CartContext.jsx'

export function CartPage() {
  const cart = useCart()
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Cart</h1>
          <div className="mutedSmall">Update quantities, remove items, proceed to checkout.</div>
        </div>
        <button
          className="btn btnGhost"
          type="button"
          data-testid={testIds.cart.clear}
          disabled={cart.lines.length === 0}
          onClick={() => cart.clear()}
        >
          Clear cart
        </button>
      </div>

      {cart.lines.length === 0 ? (
        <div className="panel">
          <p className="muted">Your cart is empty.</p>
          <Link className="btn btnPrimary" to="/catalog">
            Go to catalog
          </Link>
        </div>
      ) : (
        <div className="grid2">
          <section className="panel">
            <div className="table">
              <div className="tableHead">
                <div>Item</div>
                <div>Qty</div>
                <div>Line</div>
                <div />
              </div>
              {cart.lines.map((l) => (
                <div key={l.productId} className="tableRow">
                  <div>
                    <div className="title">{l.product.title}</div>
                    <div className="mutedSmall">
                      {l.product.genre} • {formatINR(l.product.price)}
                    </div>
                  </div>
                  <div>
                    <input
                      className="input inputSmall"
                      type="number"
                      min={1}
                      max={l.product.stock}
                      value={l.quantity}
                      data-testid={testIds.cart.itemQty(l.productId)}
                      onChange={(e) => cart.setQty(l.productId, e.target.value)}
                    />
                  </div>
                  <div className="price">{formatINR(l.lineTotal)}</div>
                  <div>
                    <button
                      className="btn btnGhost"
                      type="button"
                      data-testid={testIds.cart.itemRemove(l.productId)}
                      onClick={() => cart.remove(l.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="panel">
            <h2 className="h2">Summary</h2>
            <div className="summary">
              <div className="row spaceBetween">
                <span className="muted">Subtotal</span>
                <span>{formatINR(cart.subtotal)}</span>
              </div>
              <div className="row spaceBetween">
                <span className="muted">Shipping</span>
                <span>{cart.shipping === 0 ? 'Free' : formatINR(cart.shipping)}</span>
              </div>
              <div className="row spaceBetween">
                <span className="muted">Tax</span>
                <span>{formatINR(cart.tax)}</span>
              </div>
              <div className="divider" />
              <div className="row spaceBetween">
                <span className="title">Total</span>
                <span className="priceBig">{formatINR(cart.total)}</span>
              </div>
            </div>
            <button
              className="btn btnPrimary"
              type="button"
              data-testid={testIds.cart.checkout}
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

