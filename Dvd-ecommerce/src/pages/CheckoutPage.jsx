import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { formatINR } from '../lib/money.js'
import { validateRequired } from '../lib/validators.js'
import { useCart } from '../state/CartContext.jsx'
import { useOrders } from '../state/OrdersContext.jsx'

export function CheckoutPage() {
  const cart = useCart()
  const orders = useOrders()
  const navigate = useNavigate()

  const [address1, setAddress1] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [zip, setZip] = useState('')
  const [error, setError] = useState(null)

  const cartSnapshot = useMemo(
    () => ({
      lines: cart.lines,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      tax: cart.tax,
      total: cart.total,
    }),
    [cart.lines, cart.subtotal, cart.shipping, cart.tax, cart.total],
  )

  if (cart.lines.length === 0) {
    return (
      <div className="container">
        <div className="panel">
          <h1 className="h1">Checkout</h1>
          <p className="muted">Your cart is empty.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Checkout</h1>
          <div className="mutedSmall">Enter shipping address and review your order.</div>
        </div>
      </div>

      <div className="grid2">
        <section className="panel">
          {error ? (
            <div className="alert" role="alert">
              {error}
            </div>
          ) : null}

          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault()
              setError(null)

              const err =
                validateRequired(address1, 'Address') ||
                validateRequired(city, 'City') ||
                validateRequired(stateName, 'State') ||
                validateRequired(zip, 'ZIP')
              if (err) return setError(err)

              const shippingAddress = { address1, city, state: stateName, zip }
              const res = orders.createOrder({ cartSnapshot, shippingAddress })
              if (!res.ok) return setError(res.error)

              cart.clear()
              navigate(`/payment/${res.orderId}`)
            }}
          >
            <label className="field">
              <span className="label">Address line 1</span>
              <input
                className="input"
                data-testid={testIds.checkout.address1}
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="House / Street"
              />
            </label>
            <label className="field">
              <span className="label">City</span>
              <input
                className="input"
                data-testid={testIds.checkout.city}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
            <div className="row gap">
              <label className="field grow">
                <span className="label">State</span>
                <input
                  className="input"
                  data-testid={testIds.checkout.state}
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </label>
              <label className="field grow">
                <span className="label">ZIP</span>
                <input
                  className="input"
                  data-testid={testIds.checkout.zip}
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="6 digits"
                />
              </label>
            </div>

            <button className="btn btnPrimary" data-testid={testIds.checkout.continue} type="submit">
              Continue to payment
            </button>
          </form>
        </section>

        <aside className="panel">
          <h2 className="h2">Order review</h2>
          <div className="reviewList">
            {cart.lines.map((l) => (
              <div key={l.productId} className="row spaceBetween">
                <span className="mutedSmall">
                  {l.product.title} × {l.quantity}
                </span>
                <span>{formatINR(l.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="row spaceBetween">
            <span className="muted">Subtotal</span>
            <span>{formatINR(cart.subtotal)}</span>
          </div>
          <div className="row spaceBetween">
            <span className="muted">Shipping</span>
            <span>{cart.shipping === 0 ? 'Free' : formatINR(cart.shipping)}</span>
          </div>
          <div className="row spaceBetween">
            <span className="title">Total</span>
            <span className="priceBig">{formatINR(cart.total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

