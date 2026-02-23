import { Link, useParams } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { formatINR } from '../lib/money.js'
import { useOrders } from '../state/OrdersContext.jsx'

export function OrderDetailPage() {
  const { orderId } = useParams()
  const orders = useOrders()
  const order = orders.getById(orderId)

  if (!order) {
    return (
      <div className="container">
        <div className="panel">
          <h1 className="h1">Order not found</h1>
          <Link className="btn btnPrimary" to="/orders">
            Back
          </Link>
        </div>
      </div>
    )
  }

  const lastStatus = order.statusHistory?.[order.statusHistory.length - 1]?.status || 'Placed'
  const paymentStatus = order.payment?.status || 'Pending'

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">{order.id}</h1>
          <div className="mutedSmall">
            Created {new Date(order.createdAt).toLocaleString()} • Total{' '}
            <strong>{formatINR(order.totals.total)}</strong>
          </div>
        </div>
        <div className="row gap wrap">
          {paymentStatus !== 'Success' ? (
            <Link className="btn btnPrimary" to={`/payment/${order.id}`}>
              Pay now
            </Link>
          ) : null}
          <button
            className="btn btnGhost"
            type="button"
            data-testid={testIds.orders.advanceStatus(order.id)}
            onClick={() => orders.advanceStatus(order.id)}
          >
            Advance status (simulate)
          </button>
        </div>
      </div>

      <div className="grid2">
        <section className="panel">
          <h2 className="h2">Items</h2>
          <div className="reviewList">
            {order.items.map((it) => (
              <div key={it.productId} className="row spaceBetween">
                <span className="mutedSmall">
                  {it.title} × {it.quantity}
                </span>
                <span>{formatINR(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="row spaceBetween">
            <span className="muted">Subtotal</span>
            <span>{formatINR(order.totals.subtotal)}</span>
          </div>
          <div className="row spaceBetween">
            <span className="muted">Shipping</span>
            <span>{order.totals.shipping === 0 ? 'Free' : formatINR(order.totals.shipping)}</span>
          </div>
          <div className="row spaceBetween">
            <span className="title">Total</span>
            <span className="priceBig">{formatINR(order.totals.total)}</span>
          </div>
        </section>

        <aside className="panel">
          <h2 className="h2">Tracking</h2>
          <div className="row spaceBetween">
            <span className="muted">Current status</span>
            <span className="pill">{lastStatus}</span>
          </div>
          <div className="divider" />
          <ol className="timeline">
            {order.statusHistory.map((s, idx) => (
              <li key={idx} className="timelineItem">
                <div className="title">{s.status}</div>
                <div className="mutedSmall">{new Date(s.at).toLocaleString()}</div>
              </li>
            ))}
          </ol>

          <div className="divider" />
          <h3 className="h3">Payment</h3>
          <div className="row spaceBetween">
            <span className="muted">Status</span>
            <span className={paymentStatus === 'Success' ? 'pill pillOk' : 'pill pillBad'}>
              {paymentStatus}
            </span>
          </div>
          {order.payment?.reference ? (
            <div className="mutedSmall">
              Reference: <code>{order.payment.reference}</code>
            </div>
          ) : null}
          {order.payment?.error ? <div className="alert">{order.payment.error}</div> : null}

          <div className="divider" />
          <h3 className="h3">Shipping address</h3>
          <div className="mutedSmall">{order.shippingAddress.address1}</div>
          <div className="mutedSmall">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
          </div>
        </aside>
      </div>
    </div>
  )
}

