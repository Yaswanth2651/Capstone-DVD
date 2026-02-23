import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { formatINR } from '../lib/money.js'
import { validateRequired } from '../lib/validators.js'
import { useOrders } from '../state/OrdersContext.jsx'

function digitsOnly(s) {
  return String(s || '').replace(/\D/g, '')
}

function simulatePayment({ orderId, method, cardNumber, expiry, cvv, upiId }) {
  if (method === 'cod') return { ok: true, reference: `COD-${orderId}` }

  if (method === 'card') {
    const n = digitsOnly(cardNumber)
    if (n.length !== 16) return { ok: false, error: 'Card number must be 16 digits.' }
    const exp = String(expiry || '').trim()
    if (!/^\d{2}\/\d{2}$/.test(exp)) return { ok: false, error: 'Expiry must be MM/YY.' }
    const mm = Number(exp.slice(0, 2))
    if (mm < 1 || mm > 12) return { ok: false, error: 'Expiry month must be 01–12.' }
    const c = digitsOnly(cvv)
    if (c.length !== 3) return { ok: false, error: 'CVV must be 3 digits.' }
    if (n.endsWith('0000')) return { ok: false, error: 'Card declined (simulated).' }
    return { ok: true, reference: `CARD-${orderId}` }
  }

  if (method === 'upi') {
    const id = String(upiId || '').trim()
    if (!id.includes('@')) return { ok: false, error: 'UPI ID must contain @.' }
    if (id.toLowerCase().includes('fail')) return { ok: false, error: 'UPI payment failed (simulated).' }
    return { ok: true, reference: `UPI-${orderId}` }
  }

  return { ok: false, error: 'Select a payment method.' }
}

export function PaymentPage() {
  const { orderId } = useParams()
  const orders = useOrders()
  const navigate = useNavigate()

  const order = useMemo(() => orders.getById(orderId), [orders, orderId])

  const [method, setMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111')
  const [expiry, setExpiry] = useState('12/30')
  const [cvv, setCvv] = useState('123')
  const [upiId, setUpiId] = useState('qa.user@bank')
  const [error, setError] = useState(null)

  if (!order) {
    return (
      <div className="container">
        <div className="panel">
          <h1 className="h1">Payment</h1>
          <p className="muted">Order not found.</p>
          <Link className="btn btnPrimary" to="/orders">
            Go to orders
          </Link>
        </div>
      </div>
    )
  }

  const alreadyPaid = order.payment?.status === 'Success'

  return (
    <div className="container narrow">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Payment</h1>
          <div className="mutedSmall">
            Order <code>{order.id}</code> • Total <strong>{formatINR(order.totals.total)}</strong>
          </div>
        </div>
      </div>

      {alreadyPaid ? (
        <div className="panel">
          <div className="alertOk">Payment already completed.</div>
          <Link className="btn btnPrimary" to={`/orders/${order.id}`}>
            View order
          </Link>
        </div>
      ) : (
        <div className="panel">
          {error ? (
            <div className="alert" role="alert" data-testid={testIds.payment.error}>
              {error}
            </div>
          ) : null}

          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault()
              setError(null)

              const err = validateRequired(method, 'Payment method')
              if (err) return setError(err)

              const sim = simulatePayment({ orderId: order.id, method, cardNumber, expiry, cvv, upiId })
              orders.payOrder({
                orderId: order.id,
                method,
                ok: sim.ok,
                reference: sim.reference,
                errorMessage: sim.error,
              })

              if (!sim.ok) return setError(sim.error)
              navigate(`/orders/${order.id}`)
            }}
          >
            <label className="field">
              <span className="label">Payment method</span>
              <select
                className="input"
                data-testid={testIds.payment.method}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </label>

            {method === 'card' ? (
              <>
                <label className="field">
                  <span className="label">Card number</span>
                  <input
                    className="input"
                    data-testid={testIds.payment.cardNumber}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="16 digits"
                  />
                  <span className="hint">Tip: ending with <code>0000</code> will fail (simulated).</span>
                </label>
                <div className="row gap">
                  <label className="field grow">
                    <span className="label">Expiry</span>
                    <input className="input" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                  </label>
                  <label className="field grow">
                    <span className="label">CVV</span>
                    <input className="input" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                  </label>
                </div>
              </>
            ) : null}

            {method === 'upi' ? (
              <label className="field">
                <span className="label">UPI ID</span>
                <input
                  className="input"
                  data-testid={testIds.payment.upiId}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@bank"
                />
                <span className="hint">
                  Tip: include <code>fail</code> to simulate a failure.
                </span>
              </label>
            ) : null}

            <button className="btn btnPrimary" data-testid={testIds.payment.pay} type="submit">
              Pay now
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

