'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/products'
import { CATEGORIES } from '@/lib/categories'

const PAGE_SIZE = 20
type Filter = 'all' | 'active' | 'draft' | 'trash'

export default function ProductsTable({ products: initial }: { products: Product[] }) {
  const router = useRouter()
  const [products] = useState(initial)
  const [filter,       setFilter]       = useState<Filter>('all')
  const [search,       setSearch]       = useState('')
  const [catFilter,    setCatFilter]    = useState('')
  const [stockFilter,  setStockFilter]  = useState('')
  const [typeFilter,   setTypeFilter]   = useState('')
  const [selected,     setSelected]     = useState<Set<string>>(new Set())
  const [page,         setPage]         = useState(1)
  const [bulkAction,   setBulkAction]   = useState('')

  const filtered = useMemo(() => {
    let list = products
    if (filter === 'active') list = list.filter(p => p.isActive !== false)
    if (filter === 'draft')  list = list.filter(p => p.isActive === false)
    if (catFilter)    list = list.filter(p => p.categorySlug === catFilter)
    if (stockFilter === 'instock')    list = list.filter(p => p.stock > 0)
    if (stockFilter === 'outofstock') list = list.filter(p => p.stock === 0)
    if (stockFilter === 'lowstock')   list = list.filter(p => p.stock > 0 && p.stock <= 5)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    }
    return list
  }, [products, filter, catFilter, stockFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const counts = {
    all:    products.length,
    active: products.filter(p => p.isActive !== false).length,
    draft:  products.filter(p => p.isActive === false).length,
    trash:  0,
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(paged.map(p => p.id)) : new Set())
  }
  function toggleOne(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  async function applyBulk() {
    if (!bulkAction || selected.size === 0) return
    const label = bulkAction === 'trash' ? 'Move to Trash' : bulkAction === 'activate' ? 'Set Active' : 'Set Draft'
    if (!confirm(`${label} ${selected.size} product(s)?`)) return
    for (const id of selected) {
      if (bulkAction === 'trash')    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (bulkAction === 'activate') await fetch(`/api/admin/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: true }) })
      if (bulkAction === 'draft')    await fetch(`/api/admin/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: false }) })
    }
    setSelected(new Set()); router.refresh()
  }

  function stockCell(stock: number) {
    if (stock === 0) return <span className="text-red-400">Out of stock</span>
    if (stock <= 5)  return <><span className="text-amber-400">Low stock</span> <span className="text-ivory/35">({stock})</span></>
    return <><span className="text-green-400">In stock</span> <span className="text-ivory/35">({stock})</span></>
  }

  const selCls = 'appearance-none bg-[#0e1a0e] border border-white/18 rounded px-2.5 py-1.5 pr-7 text-xs text-ivory/75 focus:outline-none focus:border-sienna/50 cursor-pointer transition-colors [&>option]:bg-[#0e1a0e] [&>option]:text-ivory'

  return (
    <div className="p-5">

      {/* Page heading */}
      <div className="flex items-center gap-4 mb-3">
        <h1 className="text-ivory text-xl font-medium">Products</h1>
        <Link href="/admin/products/new" className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-300/50 rounded px-2.5 py-1 transition-colors">
          Add new product
        </Link>
      </div>

      {/* Sub-nav — All | Active | Draft | Trash */}
      <div className="flex items-center gap-0.5 text-xs mb-2 flex-wrap">
        {(['all', 'active', 'draft', 'trash'] as Filter[]).map((f, i) => (
          <span key={f} className="flex items-center gap-0.5">
            {i > 0 && <span className="text-white/15 mx-1">|</span>}
            <button
              onClick={() => { setFilter(f); setPage(1) }}
              className={`transition-colors ${filter === f ? 'text-ivory font-medium' : 'text-blue-400 hover:text-blue-300'}`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
            <span className="text-ivory/25 ml-0.5">({counts[f]})</span>
          </span>
        ))}
        <span className="text-white/15 mx-1">|</span>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">Sorting</button>
      </div>

      {/* Filter + search bar — exact WooCommerce layout */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {/* Bulk actions */}
        <div className="relative inline-flex">
          <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} className={selCls}>
            <option value="">Bulk actions</option>
            <option value="edit" disabled>Bulk edit</option>
            <option value="trash">Move to Trash</option>
            <option value="activate">Set active</option>
            <option value="draft">Set draft</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 text-[10px]">▾</span>
        </div>
        <button onClick={applyBulk} className="px-3 py-1.5 border border-white/15 text-ivory/50 hover:text-ivory/80 text-xs rounded transition-colors">
          Apply
        </button>

        {/* Category filter */}
        <div className="relative inline-flex">
          <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1) }} className={selCls}>
            <option value="">Select a category</option>
            {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 text-[10px]">▾</span>
        </div>

        {/* Product type */}
        <div className="relative inline-flex">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selCls}>
            <option value="">Filter by product type</option>
            <option value="simple">Simple product</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 text-[10px]">▾</span>
        </div>

        {/* Stock status */}
        <div className="relative inline-flex">
          <select value={stockFilter} onChange={e => { setStockFilter(e.target.value); setPage(1) }} className={selCls}>
            <option value="">Filter by stock status</option>
            <option value="instock">In stock</option>
            <option value="outofstock">Out of stock</option>
            <option value="lowstock">Low stock</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 text-[10px]">▾</span>
        </div>

        <button className="px-3 py-1.5 bg-white/6 border border-white/15 text-ivory/60 hover:text-ivory/90 text-xs rounded transition-colors">
          Filter
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Item count */}
        <span className="text-ivory/30 text-xs">{filtered.length} items</span>

        {/* Pagination — inline, WooCommerce style */}
        <div className="flex items-center gap-0.5 text-xs">
          <button onClick={() => setPage(1)} disabled={page === 1} className="px-1.5 py-1 border border-white/12 text-ivory/40 hover:text-ivory/80 disabled:opacity-25 rounded transition-colors">«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-1.5 py-1 border border-white/12 text-ivory/40 hover:text-ivory/80 disabled:opacity-25 rounded transition-colors">‹</button>
          <input
            type="number"
            value={page}
            onChange={e => setPage(Math.max(1, Math.min(totalPages, Number(e.target.value) || 1)))}
            className="w-10 text-center bg-white/6 border border-white/15 rounded px-1 py-1 text-xs text-ivory focus:outline-none"
          />
          <span className="text-ivory/25 px-1">of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-1.5 py-1 border border-white/12 text-ivory/40 hover:text-ivory/80 disabled:opacity-25 rounded transition-colors">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-1.5 py-1 border border-white/12 text-ivory/40 hover:text-ivory/80 disabled:opacity-25 rounded transition-colors">»</button>
        </div>

        {/* Search */}
        <div className="flex gap-1">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="bg-white/5 border border-white/12 rounded px-2.5 py-1.5 text-xs text-ivory placeholder-ivory/25 focus:outline-none focus:border-white/30 w-40"
          />
          <button className="px-3 py-1.5 bg-white/6 border border-white/15 text-ivory/60 hover:text-ivory/90 text-xs rounded transition-colors whitespace-nowrap">
            Search products
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-ivory/25 text-sm">
            {products.length === 0 ? 'No products — use "Seed sample data" above to import the starter catalogue.' : 'No products match your filters.'}
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className="px-4 py-2.5 w-8">
                  <input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={e => toggleAll(e.target.checked)} className="accent-sienna" />
                </th>
                <th className="px-2 py-2.5 w-10" />
                <th className="text-left px-3 py-2.5 text-ivory/30 font-medium">Name <span className="text-ivory/15">↕</span></th>
                <th className="text-left px-3 py-2.5 text-ivory/30 font-medium">SKU <span className="text-ivory/15">↕</span></th>
                <th className="text-left px-3 py-2.5 text-ivory/30 font-medium">Stock</th>
                <th className="text-left px-3 py-2.5 text-ivory/30 font-medium">Price <span className="text-ivory/15">↕</span></th>
                <th className="text-left px-3 py-2.5 text-ivory/30 font-medium">Categories</th>
                <th className="text-left px-3 py-2.5 text-ivory/30 font-medium">Tags</th>
                <th className="text-left px-3 py-2.5 text-ivory/30 font-medium">Date <span className="text-ivory/15">↕</span></th>
                <th className="px-3 py-2.5 w-6" />
              </tr>
            </thead>
            <tbody>
              {paged.map(p => {
                const onSale = p.originalPrice && p.originalPrice > p.price
                const createdAt = (p as Record<string, unknown>).createdAt
                const date = createdAt && typeof createdAt === 'object' && '_seconds' in (createdAt as object)
                  ? new Date(((createdAt as { _seconds: number })._seconds) * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : typeof createdAt === 'string' ? new Date(createdAt).toLocaleDateString('en-GB') : '—'

                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} className="accent-sienna opacity-60 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="px-2 py-3">
                      <div className="w-9 h-9 rounded-md bg-white/5 overflow-hidden flex items-center justify-center">
                        {p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-contain opacity-70" /> : <span>📦</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3 max-w-[200px]">
                      <Link href={`/admin/products/${p.id}`} className="text-blue-400 hover:text-blue-300 font-medium transition-colors truncate block">
                        {p.name}
                      </Link>
                      <div className="flex items-center gap-1 mt-0.5 min-h-[14px]">
                        {p.isActive === false && <span className="text-[10px] text-ivory/30 bg-white/6 rounded px-1">Draft</span>}
                        {p.isNew && <span className="text-[10px] text-blue-400/70 bg-blue-400/10 rounded px-1">New</span>}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${p.id}`} className="text-blue-400/60 hover:text-blue-300 transition-colors">Edit</Link>
                        <span className="text-white/15">|</span>
                        <Link href={`/product/${p.slug}`} target="_blank" className="text-blue-400/60 hover:text-blue-300 transition-colors">View</Link>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-ivory/25">—</td>
                    <td className="px-3 py-3">{stockCell(p.stock)}</td>
                    <td className="px-3 py-3">
                      {onSale ? (
                        <>
                          <span className="text-ivory/70">KSh {p.price.toLocaleString()}</span>
                          <span className="block text-ivory/30 line-through text-[11px]">KSh {p.originalPrice!.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-ivory/70">KSh {p.price.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <button className="text-blue-400/70 hover:text-blue-300 transition-colors text-left">{p.category}</button>
                    </td>
                    <td className="px-3 py-3 text-ivory/25">—</td>
                    <td className="px-3 py-3 text-ivory/35">
                      <span className="block text-ivory/50">{p.isActive !== false ? 'Published' : 'Draft'}</span>
                      <span className="text-ivory/25 text-[11px]">{date}</span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={async () => { if (!confirm('Delete?')) return; await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' }); router.refresh() }}
                        className="text-ivory/15 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-base leading-none"
                      >×</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Bottom pagination mirror */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-0.5 mt-3 text-xs">
          <span className="text-ivory/25 mr-2">{filtered.length} items</span>
          <button onClick={() => setPage(1)} disabled={page === 1} className="px-1.5 py-1 border border-white/12 text-ivory/40 hover:text-ivory/80 disabled:opacity-25 rounded transition-colors">«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-1.5 py-1 border border-white/12 text-ivory/40 hover:text-ivory/80 disabled:opacity-25 rounded transition-colors">‹</button>
          <span className="text-ivory/25 px-2">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-1.5 py-1 border border-white/12 text-ivory/40 hover:text-ivory/80 disabled:opacity-25 rounded transition-colors">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-1.5 py-1 border border-white/12 text-ivory/40 hover:text-ivory/80 disabled:opacity-25 rounded transition-colors">»</button>
        </div>
      )}
    </div>
  )
}
