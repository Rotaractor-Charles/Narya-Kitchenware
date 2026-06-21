'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/sample-products'

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

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (added) return
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const discount = product.originalPrice
    ? Math.round((product.originalPrice - product.price) / product.originalPrice * 100)
    : 0

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square bg-ivory-dark overflow-hidden mb-3 rounded-sm">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5">
            -{discount}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-terra text-ivory text-[10px] font-bold px-1.5 py-0.5">
            NEW
          </span>
        )}

        {/* Add to cart — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 text-xs font-semibold tracking-wide transition-colors duration-150 ${
              added
                ? 'bg-sienna text-earth'
                : 'bg-earth text-ivory hover:bg-terra'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <p className="text-[10px] text-terra font-semibold uppercase tracking-wider mb-0.5">
        {product.category}
      </p>
      <h3 className="text-sm text-earth font-medium leading-snug mb-1.5 group-hover:text-terra transition-colors">
        {product.name}
      </h3>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm font-semibold text-earth">
          KSh {product.price.toLocaleString()}
        </span>
        {product.originalPrice && (
          <span className="text-xs text-earth/35 line-through">
            KSh {product.originalPrice.toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Stars rating={product.rating} />
        <span className="text-[10px] text-earth/40">({product.reviews})</span>
      </div>

      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-[10px] text-orange-600 mt-1 font-medium">Only {product.stock} left</p>
      )}
    </Link>
  )
}
