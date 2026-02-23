import { createContext, useContext, useMemo, useReducer } from 'react'
import { readJson, writeJson } from '../lib/storage.js'
import { nextOrderId } from '../lib/ids.js'

const OrdersContext = createContext(null)

function ordersKey(userId) {
  return `dvd.orders.${userId || 'guest'}`
}

function readOrders(userId) {
  return readJson(ordersKey(userId), { orders: [] })
}

function writeOrders(userId, state) {
  writeJson(ordersKey(userId), state)
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.state
    default:
      return state
  }
}

const ORDER_STATUSES = ['Placed', 'Paid', 'Shipped', 'Delivered']

export function OrdersProvider({ userId, children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => readOrders(userId))

  const api = useMemo(() => {
    function commit(next) {
      writeOrders(userId, next)
      dispatch({ type: 'SET', state: next })
    }

    const orders = state.orders || []

    return {
      orders,
      getById: (id) => orders.find((o) => o.id === id) || null,
      createOrder: ({ cartSnapshot, shippingAddress }) => {
        if (!cartSnapshot?.lines?.length) return { ok: false, error: 'Cart is empty.' }
        const errFields = ['address1', 'city', 'state', 'zip'].filter(
          (k) => !String(shippingAddress?.[k] || '').trim(),
        )
        if (errFields.length) return { ok: false, error: 'Shipping address is incomplete.' }

        const id = nextOrderId()
        const now = new Date().toISOString()
        const order = {
          id,
          createdAt: now,
          items: cartSnapshot.lines.map((l) => ({
            productId: l.productId,
            title: l.product.title,
            price: l.product.price,
            quantity: l.quantity,
          })),
          totals: {
            subtotal: cartSnapshot.subtotal,
            shipping: cartSnapshot.shipping,
            tax: cartSnapshot.tax,
            total: cartSnapshot.total,
          },
          shippingAddress,
          payment: { status: 'Pending', method: null, reference: null },
          statusHistory: [{ status: 'Placed', at: now }],
        }
        commit({ orders: [order, ...orders] })
        return { ok: true, orderId: id }
      },
      payOrder: ({ orderId, method, ok, reference, errorMessage }) => {
        const idx = orders.findIndex((o) => o.id === orderId)
        if (idx < 0) return { ok: false, error: 'Order not found.' }
        const now = new Date().toISOString()
        const current = orders[idx]
        const next = { ...current }
        next.payment = {
          status: ok ? 'Success' : 'Failed',
          method,
          reference: ok ? reference || `TXN-${orderId}` : null,
          error: ok ? null : errorMessage || 'Payment failed.',
          at: now,
        }
        if (ok) {
          // Ensure "Paid" exists once.
          const hasPaid = next.statusHistory.some((s) => s.status === 'Paid')
          if (!hasPaid) next.statusHistory = [...next.statusHistory, { status: 'Paid', at: now }]
        }
        const nextOrders = [...orders]
        nextOrders[idx] = next
        commit({ orders: nextOrders })
        return { ok: true }
      },
      advanceStatus: (orderId) => {
        const idx = orders.findIndex((o) => o.id === orderId)
        if (idx < 0) return { ok: false, error: 'Order not found.' }
        const current = orders[idx]
        const last = current.statusHistory[current.statusHistory.length - 1]?.status
        const lastIndex = Math.max(0, ORDER_STATUSES.indexOf(last))
        const nextStatus = ORDER_STATUSES[Math.min(ORDER_STATUSES.length - 1, lastIndex + 1)]
        if (nextStatus === last) return { ok: true } // already final

        const now = new Date().toISOString()
        const next = {
          ...current,
          statusHistory: [...current.statusHistory, { status: nextStatus, at: now }],
        }
        const nextOrders = [...orders]
        nextOrders[idx] = next
        commit({ orders: nextOrders })
        return { ok: true, status: nextStatus }
      },
      reload: () => commit(readOrders(userId)),
      raw: state,
    }
  }, [state, userId])

  return <OrdersContext.Provider value={api}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider')
  return ctx
}

