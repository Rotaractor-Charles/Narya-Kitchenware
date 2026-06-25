'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/lib/types'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance'   },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'newest',    label: 'Newest'      },
]

export default function SearchResults({ query: initialQuery, page: initialPage }: { query: string; page: number }) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [query,    setQuery]    = useState(initialQuery)
  const [input,    setInput]    = useState(initialQuery)
  const [sort,     setSort]     = useState('relevance')
  const [page,     setPage]     = useState(initialPage)
  const [results,  setResults]  = useState<Product[]>([])
  const [total,    setTotal]    = useState(0)
  const [lastPage, setLastPage] = useState(1)
  const [loading,  setLoading]  = useState(false)

  const doSearch = useCallback((q: string, p: number) => {
    if (!q.trim()) { setResults([]); setTotal(0); return }
    setLoading(true)
    const qs = new URLSearchParams({ q, page: String(p), per_page: '24' })
    fetch(`/api/search?${qs}`)
      .then(r => r.json())
      .then(data => {
        let items: Product[] = data.data ?? []
        if (sort === 'price-asc')  items = [...items].sort((a, b) => a.price - b.price)
        if (sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price)
        if (sort === 'newest')     items = [...items].sort((a, b) => b.id - a.id)
        setResults(items)
        setTotal(data.meta?.total ?? 0)
        setLastPage(data.meta?.last_page ?? 1)
      })
      .finally(() => setLoading(false))
  }, [sort])

  useEffect(() => {
    doSearch(query, page)
  }, [query, page, sort, doSearch])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    setQuery(q)
    setPage(1)
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8 max-w-lg">
        <input
          type="search"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search products…"
          className="flex-1 border border-earth/20 bg-white px-4 py-2.5 text-sm text-earth placeholder:text-earth/35 focus:outline-none focus:border-terra"
        />
        <button type="submit" className="bg-earth text-ivory text-sm font-semibold px-5 py-2.5 hover:bg-terra transition-colors">
          Search
        </button>
      </form>

      {/* Header row */}
      {query && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-serif text-xl text-earth">
              {loading ? 'Searching…' : total === 0 ? `No results for "${query}"` : `Results for "${query}"`}
            </h1>
            {!loading && total > 0 && (
              <p className="text-sm text-earth/45 mt-0.5">{total} product{total !== 1 ? 's' : ''} found</p>
            )}
          </div>

          {total > 0 && (
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1) }}
              className="border border-earth/20 text-sm text-earth px-3 py-2 bg-white focus:outline-none focus:border-terra"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-earth/5 animate-pulse rounded" />
              <div className="h-3 bg-earth/5 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-earth/5 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      ) : results.length === 0 && query ? (
        <div className="py-20 text-center">
          <p className="text-earth/30 text-lg mb-2">No products matched your search.</p>
          <p className="text-earth/20 text-sm">Try different keywords or browse our categories.</p>
          <Link href="/shop" className="inline-block mt-6 bg-earth text-ivory text-sm font-semibold px-6 py-3 hover:bg-terra transition-colors">
            Browse All Products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-earth/20 text-earth disabled:opacity-30 hover:bg-earth hover:text-ivory transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-earth/50 px-3">{page} of {lastPage}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === lastPage}
                className="px-4 py-2 text-sm border border-earth/20 text-earth disabled:opacity-30 hover:bg-earth hover:text-ivory transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
