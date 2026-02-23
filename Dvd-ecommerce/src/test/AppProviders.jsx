import { AuthProvider, useAuth } from '../state/AuthContext.jsx'
import { CartProvider } from '../state/CartContext.jsx'
import { OrdersProvider } from '../state/OrdersContext.jsx'

function DataProviders({ children }) {
  const auth = useAuth()
  const userId = auth.user?.id || null

  return (
    <CartProvider key={`cart-${userId || 'guest'}`} userId={userId}>
      <OrdersProvider key={`orders-${userId || 'guest'}`} userId={userId}>
        {children}
      </OrdersProvider>
    </CartProvider>
  )
}

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <DataProviders>{children}</DataProviders>
    </AuthProvider>
  )
}

