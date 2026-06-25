'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

function HeartFilled({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString()}`
}

type WishProduct = {
  id: number
  name: string
  slug: string
  price: number
  compare_at_price: number | null
  stock_quantity: number
  image_url: string | null
  category: string | null
}

type WishItem = {
  id: number
  product_id: number
  product: WishProduct | null
}

export default function WishlistClient() {
  const { user }              = useAuth()
  const { ids, toggle, loading } = useWishlist()
  const { addItem, openCart } = useCart()
  const [added, setAdded]     = useState<number | null>(null)

  // Derive list from context so removals are instant
  // The WishlistProvider holds the ids; we need the full items — fetch them separately
  const [items, setItems] = useState<WishItem[]>([])
  const [fetched, setFetched] = useState(false)

  // Fetch full items on mount (when user present)
  if (!fetched && user) {
    setFetched(true)
    fetch('/api/wishlist')
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => setItems(d.data ?? []))
      .catch(() => {})
  }

  // Sync removals: filter out items no longer in context ids
  const visible = items.filter(i => i.product !== null && ids.has(i.product_id))

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <HeartFilled className="text-earth/15 w-12 h-12 mb-5" />
        <h1 className="font-serif text-2xl text-earth mb-2">Sign in to view your wishlist</h1>
        <Link href="/login" className="mt-4 bg-earth text-ivory px-7 py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors">
          Sign in
        </Link>
      </div>
    )
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-earth/40 text-sm">Loading wishlist…</p>
      </div>
    )
  }

  if (visible.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <HeartFilled className="text-earth/15 w-12 h-12 mb-5" />
        <h1 className="font-serif text-2xl text-earth mb-2">Your wishlist is empty</h1>
        <p className="text-earth/50 text-sm mb-8">Save items you love and come back to them anytime.</p>
        <Link href="/shop" className="bg-earth text-ivory px-7 py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  function handleAddToCart(item: WishItem) {
    if (!item.product) return
    const p = item.product
    addItem({
      id:            p.slug,
      slug:          p.slug,
      name:          p.name,
      image:         p.image_url ?? '/products/placeholder.svg',
      price:         p.price / 100,
      originalPrice: p.compare_at_price ? p.compare_at_price / 100 : undefined,
      productId:     p.id,
    })
    setAdded(p.id)
    setTimeout(() => setAdded(null), 2000)
    openCart()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-earth">
          My Wishlist
          <span className="ml-2 text-base text-earth/35 font-sans font-normal">
            ({visible.length} {visible.length === 1 ? 'item' : 'items'})
          </span>
        </h1>
        <Link href="/shop" className="text-xs text-earth/45 hover:text-earth/70 transition-colors">
          ← Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {visible.map(item => {
          const p    = item.product!
          const disc = p.compare_at_price
            ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)
            : null
          const inStock = p.stock_quantity > 0

          return (
            <div key={item.id} className="group bg-white rounded-2xl border border-earth/10 overflow-hidden flex flex-col">
              <div className="relative aspect-square bg-ivory-dark overflow-hidden">
                <Link href={`/product/${p.slug}`}>
                  <Image
                    src={p.image_url ?? '/products/placeholder.svg'}
                    alt={p.name}
                    fill
                    className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {disc && (
                    <span className="bg-terra text-ivory text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{disc}%
                    </span>
                  )}
                  {!inStock && (
                    <span className="bg-earth/70 text-ivory text-[10px] px-1.5 py-0.5 rounded">
                      Out of stock
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggle(p.id)}
                  aria-label="Remove from wishlist"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-400 hover:text-red-600 hover:bg-white transition-colors shadow-sm"
                >
                  <HeartFilled className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 flex flex-col flex-1 gap-2">
                {p.category && (
                  <p className="text-[10px] text-earth/35 uppercase tracking-widest">{p.category}</p>
                )}
                <Link href={`/product/${p.slug}`}
                  className="text-sm font-medium text-earth leading-snug hover:text-terra transition-colors line-clamp-2 flex-1">
                  {p.name}
                </Link>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-earth">{fmt(p.price)}</span>
                  {p.compare_at_price && (
                    <span className="text-xs text-earth/35 line-through">{fmt(p.compare_at_price)}</span>
                  )}
                </div>

                <button
                  onClick={() => inStock && handleAddToCart(item)}
                  disabled={!inStock}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    !inStock
                      ? 'bg-earth/8 text-earth/30 cursor-not-allowed'
                      : added === p.id
                      ? 'bg-terra/15 text-terra'
                      : 'bg-earth text-ivory hover:bg-earth/90 active:scale-[0.98]'
                  }`}
                >
                  {!inStock ? 'Out of Stock' : added === p.id ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
