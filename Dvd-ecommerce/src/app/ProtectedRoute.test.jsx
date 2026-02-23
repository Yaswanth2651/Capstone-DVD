import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CartPage } from '../pages/CartPage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { testIds } from './testIds.js'
import { AppProviders } from '../test/AppProviders.jsx'

describe('ProtectedRoute', () => {
  it('redirects to login and returns to protected page after login', async () => {
    const user = userEvent.setup()

    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/cart']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AppProviders>,
    )

    // Not authed -> redirected to login
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()

    // Login with seeded demo user
    await user.type(screen.getByTestId(testIds.auth.email), 'demo.user@example.com')
    await user.type(screen.getByTestId(testIds.auth.password), 'DemoPass1')
    await user.click(screen.getByTestId(testIds.auth.submit))

    // Should land back on the protected route
    expect(await screen.findByRole('heading', { name: 'Cart' })).toBeInTheDocument()
  })
})

