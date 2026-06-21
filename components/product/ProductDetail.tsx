'use client'

import Image   from 'next/image'
import Link    from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/sample-products'
import ProductCard from '@/components/shop/ProductCard'

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(n => (
          <svg key={n} viewBox="0 0 12 12" width="14" height="14"
            fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="1"
            className={n <= Math.round(rating) ? 'text-amber-400' : 'text-earth/20'}>
            <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/>
          </svg>
        ))}
      </div>
      <span className="text-sm text-earth/50">{rating} ({reviews} reviews)</span>
    </div>
  )
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-earth/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-medium text-earth text-left"
      >
        {title}
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <polyline points="4 6 8 10 12 6"/>
        </svg>
      </button>
      {open && <div className="pb-5 text-sm text-earth/65 leading-relaxed">{children}</div>}
    </div>
  )
}

export default function ProductDetail({
  product,
  related,
}: {
  product:  Product
  related:  Product[]
}) {
  const [qty,     setQty]     = useState(1)
  const [added,   setAdded]   = useState(false)

  const discount = product.originalPrice
    ? Math.round((product.originalPrice - product.price) / product.originalPrice * 100)
    : 0

  function addToCart() {
    if (added) return
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="text-xs text-earth/40 flex items-center gap-1.5 mb-8">
        <Link href="/" className="hover:text-earth transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-earth transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop/${product.categorySlug}`} className="hover:text-earth transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-earth/70">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* ── Images ── */}
        <div className="space-y-3">
          <div className="aspect-square bg-ivory-dark rounded-sm overflow-hidden relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-contain p-8"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-3 right-3 bg-terra text-ivory text-xs font-bold px-2 py-1">
                NEW
              </span>
            )}
          </div>

          {/* Thumbnail strip — shows same image tinted for demo */}
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className={`aspect-square bg-ivory-dark rounded-sm overflow-hidden relative cursor-pointer ring-2 transition-all ${i === 1 ? 'ring-terra' : 'ring-transparent hover:ring-earth/30'}`}>
                <Image src={product.images[0]} alt="" fill className="object-contain p-3" style={{ opacity: i === 1 ? 1 : 0.5 }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Info ── */}
        <div>
          <p className="text-xs text-terra font-semibold uppercase tracking-widest mb-2">
            {product.category}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-earth leading-snug mb-3">
            {product.name}
          </h1>
          <Stars rating={product.rating} reviews={product.reviews} />

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5 mb-5">
            <span className="text-2xl font-semibold text-earth">
              KSh {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-base text-earth/35 line-through">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className="text-sm font-semibold text-red-600">Save {discount}%</span>
            )}
          </div>

          {/* Stock */}
          {product.stock === 0 ? (
            <p className="text-sm text-red-600 font-medium mb-5">Out of stock</p>
          ) : product.stock <= 5 ? (
            <p className="text-sm text-orange-600 font-medium mb-5">Only {product.stock} left in stock</p>
          ) : (
            <p className="text-sm text-sienna font-medium mb-5">✓ In stock</p>
          )}

          {/* Qty + CTA */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-earth/20 rounded">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-10 flex items-center justify-center text-earth/60 hover:text-earth transition-colors"
              >−</button>
              <span className="w-8 text-center text-sm font-medium text-earth">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-9 h-10 flex items-center justify-center text-earth/60 hover:text-earth transition-colors"
              >+</button>
            </div>

            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-all duration-150 ${
                added
                  ? 'bg-sienna text-earth'
                  : 'bg-earth text-ivory hover:bg-terra'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>

          <button className="w-full py-3 text-sm font-semibold border border-earth text-earth hover:bg-earth hover:text-ivory transition-all duration-150 mb-8">
            Buy Now
          </button>

          {/* Accordions */}
          <div>
            <Accordion title="Description">
              <p>{product.description}</p>
            </Accordion>
            <Accordion title="Specifications">
              <dl className="space-y-2">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 gap-2">
                    <dt className="text-earth/50 font-medium">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>
            <Accordion title="Care & Use">
              <p>{product.care}</p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-xl text-earth mb-6">More in {product.category}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
