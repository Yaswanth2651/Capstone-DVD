import { createContext, useContext, useMemo, useReducer } from 'react'
import { readJson, writeJson } from '../lib/storage.js'
import { getProductById } from '../data/catalog.js'
import { round2 } from '../lib/money.js'

const CartContext = createContext(null)

function cartKey(userId) {
  return `dvd.cart.${userId || 'guest'}`
}

function readCart(userId) {
  return readJson(cartKey(userId), { items: {} })
}

function writeCart(userId, cart) {
  writeJson(cartKey(userId), cart)
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.cart
    default:
      return state
  }
}

export function CartProvider({ userId, children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => readCart(userId))

  const api = useMemo(() => {
    const items = state.items || {}
    const lines = Object.entries(items)
      .map(([productId, qty]) => {
        const product = getProductById(productId)
        if (!product) return null
        const quantity = Math.max(1, Number(qty) || 1)
        return {
          productId,
          product,
          quantity,
          lineTotal: round2(product.price * quantity),
        }
      })
      .filter(Boolean)

    const subtotal = round2(lines.reduce((sum, l) => sum + l.lineTotal, 0))
    const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
    const tax = round2(subtotal * 0.0) // keep explicit for future
    const total = round2(subtotal + shipping + tax)
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)

    function commit(nextCart) {
      writeCart(userId, nextCart)
      dispatch({ type: 'SET', cart: nextCart })
    }

    return {
      lines,
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
      add: (productId, qty = 1) => {
        const product = getProductById(productId)
        if (!product) return { ok: false, error: 'Unknown product.' }
        const current = Number(items[productId] || 0)
        const nextQty = Math.min(product.stock, current + Math.max(1, Number(qty) || 1))
        commit({ items: { ...items, [productId]: nextQty } })
        return { ok: true }
      },
      setQty: (productId, qty) => {
        const product = getProductById(productId)
        if (!product) return { ok: false, error: 'Unknown product.' }
        const n = Math.max(1, Math.min(product.stock, Number(qty) || 1))
        commit({ items: { ...items, [productId]: n } })
        return { ok: true }
      },
      remove: (productId) => {
        const next = { ...items }
        delete next[productId]
        commit({ items: next })
        return { ok: true }
      },
      clear: () => {
        commit({ items: {} })
        return { ok: true }
      },
      reload: () => {
        commit(readCart(userId))
      },
      raw: state,
    }
  }, [state, userId])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

