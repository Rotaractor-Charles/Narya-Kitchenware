'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import type { Product } from '@/lib/types'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <svg key={n} viewBox="0 0 12 12" width="11" height="11"
          fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1"
          className={n <= Math.round(rating) ? 'text-amber-400' : 'text-earth/20'}>
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/>
        </svg>
      ))}
    </div>
  )
}

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const { ids, toggle }       = useWishlist()
  const [added, setAdded]     = useState(false)
  const wishlisted            = ids.has(product.id)

  const primaryImage = product.images?.find(i => i.is_primary) ?? product.images?.[0]
  const discount     = product.compare_at_price
    ? Math.round((product.compare_at_price - product.price) / product.compare_at_price * 100)
    : 0
  const rating = parseFloat(product.average_rating)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (added) return
    addItem({
      id:            product.slug,
      slug:          product.slug,
      name:          product.name,
      image:         primaryImage?.url ?? '/products/placeholder.svg',
      price:         product.price / 100,
      originalPrice: product.compare_at_price ? product.compare_at_price / 100 : undefined,
      productId:     product.id,
      qty:           1,
    })
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square bg-ivory-dark overflow-hidden mb-3 rounded-sm">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-forest/5 flex items-center justify-center text-forest/20 text-xs">
            No image
          </div>
        )}

        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5">
            -{discount}%
          </span>
        )}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <span className="absolute bottom-10 left-2 bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5">
            Only {product.stock_quantity} left
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); void toggle(product.id) }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-colors ${
            wishlisted
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-earth/30 hover:text-red-400 hover:bg-white'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Add to cart */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 text-xs font-semibold tracking-wide transition-colors duration-150 ${
              added ? 'bg-sienna text-earth' : 'bg-earth text-ivory hover:bg-terra'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <p className="text-[10px] text-terra font-semibold uppercase tracking-wider mb-0.5">
        {product.category?.name}
      </p>
      <h3 className="text-sm text-earth font-medium leading-snug mb-1.5 group-hover:text-terra transition-colors">
        {product.name}
      </h3>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm font-semibold text-earth">{fmt(product.price)}</span>
        {product.compare_at_price && (
          <span className="text-xs text-earth/35 line-through">{fmt(product.compare_at_price)}</span>
        )}
      </div>

      {rating > 0 && (
        <div className="flex items-center gap-1.5">
          <Stars rating={rating} />
          <span className="text-[10px] text-earth/40">({product.reviews_count})</span>
        </div>
      )}
    </Link>
  )
}
