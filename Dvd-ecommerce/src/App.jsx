import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './app/Layout.jsx'
import { ProtectedRoute } from './app/ProtectedRoute.jsx'
import { AuthProvider, useAuth } from './state/AuthContext.jsx'
import { CartProvider } from './state/CartContext.jsx'
import { OrdersProvider } from './state/OrdersContext.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { CatalogPage } from './pages/CatalogPage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { PaymentPage } from './pages/PaymentPage.jsx'
import { OrderHistoryPage } from './pages/OrderHistoryPage.jsx'
import { OrderDetailPage } from './pages/OrderDetailPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'

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

export default function App() {
  return (
    <AuthProvider>
      <DataProviders>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:orderId"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProviders>
    </AuthProvider>
  )
}
