'use client'

import Link    from 'next/link'
import Image   from 'next/image'
import { useState } from 'react'
import { useCart }     from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import type { Product } from '@/lib/types'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <svg key={n} viewBox="0 0 12 12" width="10" height="10"
          fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1"
          className={n <= Math.round(rating) ? 'text-amber-400' : 'text-forest/20'}>
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/>
        </svg>
      ))}
    </div>
  )
}

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

function ProductCardEl({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const { ids, toggle }       = useWishlist()
  const [added, setAdded]     = useState(false)

  const primaryImage = product.images?.find(i => i.is_primary) ?? product.images?.[0]
  const rating       = parseFloat(product.average_rating)
  const wishlisted   = ids.has(product.id)

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
    <Link href={`/product/${product.slug}`} className="group block shrink-0 w-44 sm:w-52">
      <div className="relative bg-white border border-forest/10 aspect-square overflow-hidden mb-2">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 176px, 208px"
          />
        ) : (
          <div className="w-full h-full bg-forest/5" />
        )}

        {product.compare_at_price && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
          </span>
        )}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <span className="absolute bottom-10 left-2 bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded">
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
              : 'bg-white/80 text-forest/30 hover:text-red-400 hover:bg-white'
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24"
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Add to cart — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAdd}
            className={`w-full py-2 text-xs font-semibold tracking-wide transition-colors duration-150 ${
              added ? 'bg-sienna text-earth' : 'bg-earth text-ivory hover:bg-terra'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <p className="text-xs text-forest leading-snug line-clamp-2 mb-1">{product.name}</p>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-sm font-semibold text-forest">{fmt(product.price)}</span>
        {product.compare_at_price && (
          <span className="text-xs text-forest/40 line-through">{fmt(product.compare_at_price)}</span>
        )}
      </div>
      {rating > 0 && (
        <div className="flex items-center gap-1">
          <Stars rating={rating} />
          <span className="text-[10px] text-forest/40">({product.reviews_count})</span>
        </div>
      )}
    </Link>
  )
}

type Props = {
  title: string
  seeAllHref: string
  products: Product[]
}

export default function ProductRow({ title, seeAllHref, products }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-serif text-forest text-2xl sm:text-3xl">{title}</h2>
        <Link href={seeAllHref} className="text-xs tracking-widest uppercase text-forest/50 hover:text-forest transition-colors">
          See all →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
        {products.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-44 sm:w-52">
                <div className="bg-forest/5 aspect-square mb-2 animate-pulse" />
                <div className="h-3 bg-forest/5 rounded mb-1 animate-pulse" />
                <div className="h-3 w-16 bg-forest/5 rounded animate-pulse" />
              </div>
            ))
          : products.map(p => <ProductCardEl key={p.id} product={p} />)
        }
      </div>
    </section>
  )
}
