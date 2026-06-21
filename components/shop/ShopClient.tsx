'use client'

import { useState, useMemo } from 'react'
import { PRODUCTS, CATEGORIES } from '@/lib/sample-products'
import ProductCard from './ProductCard'

type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc'

const SORT_LABELS: Record<Sort, string> = {
  featured:    'Featured',
  newest:      'Newest',
  'price-asc': 'Price: Low → High',
  'price-desc':'Price: High → Low',
}

const MAX_PRICE = 12000

function FilterPanel({
  category, setCategory,
  maxPrice, setMaxPrice,
  inStock, setInStock,
  hideCategory,
  onClose,
}: {
  category: string
  setCategory: (c: string) => void
  maxPrice: number
  setMaxPrice: (n: number) => void
  inStock: boolean
  setInStock: (b: boolean) => void
  hideCategory?: boolean
  onClose?: () => void
}) {
  return (
    <div className="space-y-7">
      {/* Category — hidden on special pages like New Arrivals / Sale */}
      {!hideCategory && (
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-earth/50 mb-3">Category</p>
          <ul className="space-y-2">
            {[{ slug: 'all', label: 'All Products' }, ...CATEGORIES.filter(c => !SPECIAL.includes(c.slug))].map(c => (
              <li key={c.slug}>
                <button
                  onClick={() => { setCategory(c.slug); onClose?.() }}
                  className={`text-sm w-full text-left transition-colors ${
                    category === c.slug
                      ? 'text-terra font-semibold'
                      : 'text-earth/65 hover:text-earth'
                  }`}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price range */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-earth/50 mb-3">
          Max Price — <span className="text-earth normal-case">KSh {maxPrice.toLocaleString()}</span>
        </p>
        <input
          type="range" min={1000} max={MAX_PRICE} step={500}
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          className="w-full accent-terra"
        />
        <div className="flex justify-between text-[10px] text-earth/35 mt-1">
          <span>KSh 1,000</span>
          <span>KSh {MAX_PRICE.toLocaleString()}</span>
        </div>
      </div>

      {/* In stock */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox" checked={inStock}
          onChange={e => setInStock(e.target.checked)}
          className="accent-terra w-3.5 h-3.5"
        />
        <span className="text-sm text-earth/70">In stock only</span>
      </label>
    </div>
  )
}

const SPECIAL = ['new', 'sale']

export default function ShopClient({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory)
  const [sort,     setSort]     = useState<Sort>('featured')
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [inStock,  setInStock]  = useState(false)
  const [drawer,   setDrawer]   = useState(false)

  const results = useMemo(() => {
    let list = PRODUCTS
    if (category === 'new')       list = list.filter(p => p.isNew)
    else if (category === 'sale') list = list.filter(p => !!p.originalPrice)
    else if (category !== 'all')  list = list.filter(p => p.categorySlug === category)
    list = list.filter(p => p.price <= maxPrice)
    if (inStock) list = list.filter(p => p.stock > 0)
    switch (sort) {
      case 'newest':     return [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      case 'price-asc':  return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      default:           return list
    }
  }, [category, sort, maxPrice, inStock])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex gap-10">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden md:block w-52 shrink-0 pt-1">
          <FilterPanel
            category={category} setCategory={setCategory}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            inStock={inStock} setInStock={setInStock}
            hideCategory={false}
          />
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">

          {/* Sort / filter bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setDrawer(true)}
                className="md:hidden flex items-center gap-1.5 border border-earth/20 rounded px-3 py-1.5 text-xs text-earth/70 hover:border-earth/40 transition-colors"
              >
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="2" y1="4" x2="14" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/>
                </svg>
                Filters
              </button>
              <span className="text-sm text-earth/45">{results.length} product{results.length !== 1 ? 's' : ''}</span>
            </div>

            <select
              value={sort}
              onChange={e => setSort(e.target.value as Sort)}
              className="text-xs border border-earth/20 rounded px-2.5 py-1.5 text-earth/70 bg-ivory focus:outline-none focus:border-terra"
            >
              {(Object.entries(SORT_LABELS) as [Sort, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Grid */}
          {results.length === 0 ? (
            <div className="py-24 text-center text-earth/40 text-sm">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="relative ml-auto w-72 h-full bg-ivory overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <span className="font-serif text-base text-earth">Filters</span>
              <button onClick={() => setDrawer(false)} className="text-earth/50 hover:text-earth text-lg leading-none">✕</button>
            </div>
            <FilterPanel
              category={category} setCategory={setCategory}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              inStock={inStock} setInStock={setInStock}
              hideCategory={false}
              onClose={() => setDrawer(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
