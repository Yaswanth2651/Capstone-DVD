import { Link } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { formatINR } from '../lib/money.js'
import { useOrders } from '../state/OrdersContext.jsx'

export function OrderHistoryPage() {
  const orders = useOrders()

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Order history</h1>
          <div className="mutedSmall">View past orders and track current status.</div>
        </div>
      </div>

      {orders.orders.length === 0 ? (
        <div className="panel">
          <p className="muted">No orders yet.</p>
          <Link className="btn btnPrimary" to="/catalog">
            Shop DVDs
          </Link>
        </div>
      ) : (
        <div className="panel" data-testid={testIds.orders.list}>
          <div className="table">
            <div className="tableHead">
              <div>Order</div>
              <div>Created</div>
              <div>Total</div>
              <div>Status</div>
              <div />
            </div>
            {orders.orders.map((o) => {
              const lastStatus = o.statusHistory?.[o.statusHistory.length - 1]?.status || 'Placed'
              return (
                <div key={o.id} className="tableRow">
                  <div className="title">{o.id}</div>
                  <div className="mutedSmall">{new Date(o.createdAt).toLocaleString()}</div>
                  <div className="price">{formatINR(o.totals.total)}</div>
                  <div>
                    <span className="pill">{lastStatus}</span>
                  </div>
                  <div>
                    <Link className="btn btnGhost" to={`/orders/${o.id}`} data-testid={testIds.orders.detail(o.id)}>
                      View
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

