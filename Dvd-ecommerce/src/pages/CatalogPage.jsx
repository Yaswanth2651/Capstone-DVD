import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { testIds } from '../app/testIds.js'
import { catalog, genres } from '../data/catalog.js'
import { formatINR } from '../lib/money.js'
import { useAuth } from '../state/AuthContext.jsx'
import { useCart } from '../state/CartContext.jsx'

function Star({ filled }) {
  return <span className={filled ? 'starFilled' : 'starEmpty'}>★</span>
}

function Rating({ value }) {
  const r = Math.round(value)
  return (
    <span className="rating" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < r} />
      ))}
      <span className="mutedSmall">{value.toFixed(1)}</span>
    </span>
  )
}

export function CatalogPage() {
  const auth = useAuth()
  const cartApi = useCart()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState('relevance')
  const [message, setMessage] = useState(null)

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    let items = catalog.filter((p) => {
      const matchesQuery =
        query.length === 0 ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      const matchesGenre = genre ? p.genre === genre : true
      return matchesQuery && matchesGenre
    })

    const byTitle = (a, b) => a.title.localeCompare(b.title)

    if (sort === 'title') items = [...items].sort(byTitle)
    if (sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price)
    if (sort === 'year-desc') items = [...items].sort((a, b) => b.year - a.year)
    return items
  }, [q, genre, sort])

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Catalog</h1>
          <div className="mutedSmall">Search, filter, open details, add to cart.</div>
        </div>
        {message ? <div className="toast">{message}</div> : null}
      </div>

      <section className="panel">
        <div className="filters">
          <label className="field">
            <span className="label">Search</span>
            <input
              className="input"
              data-testid={testIds.catalog.search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title or description…"
            />
          </label>

          <label className="field">
            <span className="label">Genre</span>
            <select
              className="input"
              data-testid={testIds.catalog.genre}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">All</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">Sort</span>
            <select
              className="input"
              data-testid={testIds.catalog.sort}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="title">Title (A–Z)</option>
              <option value="price-asc">Price (Low→High)</option>
              <option value="price-desc">Price (High→Low)</option>
              <option value="year-desc">Year (New→Old)</option>
            </select>
          </label>
        </div>
      </section>

      <section className="grid3" data-testid={testIds.catalog.results}>
        {results.map((p) => (
          <article key={p.id} className="card">
            <div className="poster" style={{ backgroundImage: p.posterTone }} aria-hidden="true" />
            <div className="cardBody">
              <div className="row spaceBetween">
                <div>
                  <div className="title">{p.title}</div>
                  <div className="mutedSmall">
                    {p.genre} • {p.year} • {p.runtimeMins} min
                  </div>
                </div>
                <div className="price">{formatINR(p.price)}</div>
              </div>
              <div className="row spaceBetween">
                <Rating value={p.rating} />
                <span className={p.stock > 0 ? 'pill pillOk' : 'pill pillBad'}>
                  {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="row gap wrap">
                <Link className="btn btnGhost" to={`/product/${p.id}`}>
                  View
                </Link>
                <button
                  className="btn btnPrimary"
                  type="button"
                  data-testid={testIds.product.addToCart(p.id)}
                  disabled={p.stock <= 0}
                  onClick={() => {
                    if (!auth.isAuthed) return navigate('/login', { state: { from: '/catalog' } })
                    const res = cartApi.add(p.id, 1)
                    if (res.ok) {
                      setMessage(`Added “${p.title}” to cart.`)
                      window.setTimeout(() => setMessage(null), 1200)
                    }
                  }}
                >
                  {auth.isAuthed ? 'Add to cart' : 'Login to add'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

