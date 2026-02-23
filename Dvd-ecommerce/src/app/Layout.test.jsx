import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Layout } from './Layout.jsx'
import { testIds } from './testIds.js'
import { AppProviders } from '../test/AppProviders.jsx'

describe('Layout', () => {
  it('shows login/register for guests and cart count', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<div>Home</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AppProviders>,
    )

    expect(screen.getByTestId(testIds.nav.login)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.nav.register)).toBeInTheDocument()
    expect(screen.queryByTestId(testIds.nav.logout)).not.toBeInTheDocument()
    expect(screen.getByTestId(testIds.cart.count)).toHaveTextContent('0')
  })
})

