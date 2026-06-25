'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import type { Product, Category } from '@/lib/types'

type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc'

const SORT_LABELS: Record<Sort, string> = {
  featured: 'Featured',
  newest: 'Newest',
  'price-asc': 'Price: Low → High',
  'price-desc': 'Price: High → Low',
}

function FilterPanel({
  categories,
  activeCategory,
  maxPrice,
  setMaxPrice,
  inStock,
  setInStock,
  onClose,
}: {
  categories: Category[]
  activeCategory: string
  maxPrice: number
  setMaxPrice: (n: number) => void
  inStock: boolean
  setInStock: (b: boolean) => void
  onClose?: () => void
}) {
  const absMax = Math.max(...categories.map(() => 0), 12000)
  const hrefForCategory = (slug: string) => (slug === 'all' ? '/shop' : `/shop/${slug}`)

  return (
    <div className="space-y-7">
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-earth/50 mb-3">
          Category
        </p>
        <ul className="space-y-2">
          {[
            { slug: 'all', name: 'All Products' },
            { slug: 'new', name: 'New Arrivals' },
            { slug: 'sale', name: 'Sale' },
            ...categories,
          ].map((c) => (
            <li key={c.slug}>
              <Link
                href={hrefForCategory(c.slug)}
                onClick={() => onClose?.()}
                className={`text-sm w-full text-left transition-colors ${
                  activeCategory === c.slug
                    ? 'text-terra font-semibold'
                    : 'text-earth/65 hover:text-earth'
                }`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-earth/50 mb-3">
          Max Price —{' '}
          <span className="text-earth normal-case">KSh {maxPrice.toLocaleString()}</span>
        </p>
        <input
          type="range"
          min={1000}
          max={absMax}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-terra"
        />
        <div className="flex justify-between text-[10px] text-earth/35 mt-1">
          <span>KSh 1,000</span>
          <span>KSh {absMax.toLocaleString()}</span>
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="accent-terra w-3.5 h-3.5"
        />
        <span className="text-sm text-earth/70">In stock only</span>
      </label>
    </div>
  )
}

type Props = {
  products: Product[]
  categories: Category[]
  initialCategory?: string
}

export default function ShopClient({ products, categories, initialCategory = 'all' }: Props) {
  const maxPriceKes =
    Math.ceil(Math.max(...products.map((p) => p.price / 100), 12000) / 1000) * 1000

  const category = initialCategory
  const [sort, setSort] = useState<Sort>('featured')
  const [maxPrice, setMaxPrice] = useState(maxPriceKes)
  const [inStock, setInStock] = useState(false)
  const [drawer, setDrawer] = useState(false)

  const results = useMemo(() => {
    let list = products
    if (category === 'new') {
      list = [...list].sort((a, b) => b.id - a.id)
    } else if (category === 'sale') {
      list = list.filter((p) => p.compare_at_price && p.compare_at_price > p.price)
    } else if (category !== 'all') {
      list = list.filter((p) => p.category?.slug === category)
    }
    list = list.filter((p) => p.price / 100 <= maxPrice)
    if (inStock) list = list.filter((p) => p.stock_quantity > 0)
    switch (sort) {
      case 'newest':
        return [...list].sort((a, b) => b.id - a.id)
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      default:
        return [...list].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
    }
  }, [products, category, sort, maxPrice, inStock])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex gap-10">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden md:block w-52 shrink-0 pt-1">
          <FilterPanel
            categories={categories}
            activeCategory={category}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStock={inStock}
            setInStock={setInStock}
          />
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawer(true)}
                className="md:hidden flex items-center gap-1.5 border border-earth/20 rounded px-3 py-1.5 text-xs text-earth/70 hover:border-earth/40 transition-colors"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <line x1="2" y1="4" x2="14" y2="4" />
                  <line x1="4" y1="8" x2="12" y2="8" />
                  <line x1="6" y1="12" x2="10" y2="12" />
                </svg>
                Filters
              </button>
              <span className="text-sm text-earth/45">
                {results.length} product{results.length !== 1 ? 's' : ''}
              </span>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="text-xs border border-earth/20 rounded px-2.5 py-1.5 text-earth/70 bg-ivory focus:outline-none focus:border-terra"
            >
              {(Object.entries(SORT_LABELS) as [Sort, string][]).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {results.length === 0 ? (
            <div className="py-24 text-center text-earth/40 text-sm">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
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
              <button
                onClick={() => setDrawer(false)}
                className="text-earth/50 hover:text-earth text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <FilterPanel
              categories={categories}
              activeCategory={category}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStock={inStock}
              setInStock={setInStock}
              onClose={() => setDrawer(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
