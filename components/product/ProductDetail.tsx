'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/shop/ProductCard'
import ProductReviews from '@/components/product/ProductReviews'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <svg
            key={n}
            viewBox="0 0 12 12"
            width="14"
            height="14"
            fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1"
            className={n <= Math.round(rating) ? 'text-amber-400' : 'text-earth/20'}
          >
            <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-earth/50">
        {rating.toFixed(1)} ({reviews} reviews)
      </span>
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
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="4 6 8 10 12 6" />
        </svg>
      </button>
      {open && <div className="pb-5 text-sm text-earth/65 leading-relaxed">{children}</div>}
    </div>
  )
}

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

// Build the set of unique attribute keys and their possible values from variants
function buildAttrMap(variants: Product['variants']): Record<string, string[]> {
  const map: Record<string, Set<string>> = {}
  for (const v of variants) {
    for (const [key, val] of Object.entries(v.attributes)) {
      if (!map[key]) map[key] = new Set()
      map[key].add(val)
    }
  }
  return Object.fromEntries(Object.entries(map).map(([k, s]) => [k, [...s]]))
}

export default function ProductDetail({
  product,
  related,
}: {
  product: Product
  related: Product[]
}) {
  const { addItem, openCart } = useCart()
  const { ids, toggle } = useWishlist()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const wishlisted = ids.has(product.id)

  // Variant selection state
  const attrMap = buildAttrMap(product.variants ?? [])
  const attrKeys = Object.keys(attrMap)
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    // Pre-select first value of each attribute
    return Object.fromEntries(attrKeys.map((k) => [k, attrMap[k][0] ?? '']))
  })

  const selectedVariant =
    attrKeys.length > 0
      ? ((product.variants ?? []).find((v) =>
          attrKeys.every((k) => v.attributes[k] === selected[k])
        ) ?? null)
      : null

  const effectivePrice = selectedVariant?.price ?? product.price

  const primaryImage = product.images?.[activeImg] ?? product.images?.[0]
  const rating = parseFloat(product.average_rating)
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - effectivePrice) / product.compare_at_price) * 100)
    : 0

  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : product.stock_quantity > 0

  function handleAddToCart() {
    if (added) return
    addItem({
      id: product.slug,
      slug: product.slug,
      name: product.name,
      image: selectedVariant?.image ?? product.images?.[0]?.url ?? '/products/placeholder.svg',
      price: effectivePrice / 100,
      originalPrice: product.compare_at_price ? product.compare_at_price / 100 : undefined,
      productId: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      qty,
    })
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-10 sm:py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-earth/40 flex items-center gap-1.5 mb-5 sm:mb-8">
        <Link href="/" className="hover:text-earth transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-earth transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/shop/${product.category.slug}`}
              className="hover:text-earth transition-colors capitalize"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-earth/70">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* ── Images ── */}
        <div className="space-y-3">
          <div className="aspect-square bg-ivory-dark rounded-sm overflow-hidden relative">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.name}
                fill
                priority
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-contain p-8"
              />
            ) : (
              <div className="w-full h-full bg-forest/5" />
            )}
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1">
                -{discount}%
              </span>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square bg-ivory-dark rounded-sm overflow-hidden relative ring-2 transition-all ${i === activeImg ? 'ring-terra' : 'ring-transparent hover:ring-earth/30'}`}
                >
                  <Image src={img.url} alt={img.alt ?? ''} fill className="object-contain p-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div>
          {product.category && (
            <p className="text-xs text-terra font-semibold uppercase tracking-widest mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="font-serif text-2xl sm:text-3xl text-earth leading-snug mb-3">
            {product.name}
          </h1>
          {rating > 0 && <Stars rating={rating} reviews={product.reviews_count} />}

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5 mb-5">
            <span className="text-2xl font-semibold text-earth">{fmt(effectivePrice)}</span>
            {product.compare_at_price && (
              <span className="text-base text-earth/35 line-through">
                {fmt(product.compare_at_price)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-sm font-semibold text-red-600">Save {discount}%</span>
            )}
          </div>

          {/* Variant selectors */}
          {attrKeys.length > 0 && (
            <div className="space-y-4 mb-5">
              {attrKeys.map((key) => (
                <div key={key}>
                  <p className="text-xs font-medium text-earth/60 uppercase tracking-widest mb-2">
                    {key}: <span className="text-earth normal-case">{selected[key]}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attrMap[key].map((val) => {
                      const isAvailable = (product.variants ?? []).some(
                        (v) =>
                          v.attributes[key] === val &&
                          attrKeys
                            .filter((k) => k !== key)
                            .every((k) => v.attributes[k] === selected[k]) &&
                          v.stock_quantity > 0
                      )
                      return (
                        <button
                          key={val}
                          onClick={() => setSelected((s) => ({ ...s, [key]: val }))}
                          className={`px-3 py-1.5 text-xs border rounded transition-all ${
                            selected[key] === val
                              ? 'border-earth bg-earth text-ivory'
                              : isAvailable
                                ? 'border-earth/20 text-earth hover:border-earth/50'
                                : 'border-earth/10 text-earth/25 line-through cursor-not-allowed'
                          }`}
                        >
                          {val}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stock */}
          {!inStock ? (
            <p className="text-sm text-red-600 font-medium mb-5">Out of stock</p>
          ) : (selectedVariant?.stock_quantity ?? product.stock_quantity) <= 5 ? (
            <p className="text-sm text-orange-600 font-medium mb-5">
              Only {selectedVariant?.stock_quantity ?? product.stock_quantity} left in stock
            </p>
          ) : (
            <p className="text-sm text-sienna font-medium mb-5">✓ In stock</p>
          )}

          {/* Qty + CTA */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="mx-auto flex w-32 items-center justify-between border border-earth/20 rounded">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-9 flex items-center justify-center text-earth/60 hover:text-earth transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium text-earth">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-9 flex items-center justify-center text-earth/60 hover:text-earth transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex w-full gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-all duration-150 ${
                  added ? 'bg-sienna text-earth' : 'bg-earth text-ivory hover:bg-terra'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <span className="w-[52px] shrink-0" aria-hidden="true" />
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button className="flex-1 py-3 text-sm font-semibold border border-earth text-earth hover:bg-earth hover:text-ivory transition-all duration-150">
              Buy Now
            </button>
            <button
              onClick={() => void toggle(product.id)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`px-4 py-3 border transition-all duration-150 ${
                wishlisted
                  ? 'border-red-300 bg-red-50 text-red-500'
                  : 'border-earth/20 text-earth/40 hover:border-red-300 hover:text-red-400'
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={wishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Accordions */}
          <div>
            {product.description && (
              <Accordion title="Description">
                <p>{product.description}</p>
              </Accordion>
            )}
            <Accordion title="Details">
              <dl className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-earth/50 font-medium">SKU</dt>
                  <dd>{product.sku}</dd>
                </div>
                {product.brand && (
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-earth/50 font-medium">Brand</dt>
                    <dd>{product.brand.name}</dd>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-earth/50 font-medium">In stock</dt>
                  <dd>{product.stock_quantity} units</dd>
                </div>
              </dl>
            </Accordion>
            {product.short_description && (
              <Accordion title="Care & Use">
                <p>{product.short_description}</p>
              </Accordion>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ProductReviews slug={product.slug} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-xl text-earth mb-6">
            More in {product.category?.name ?? 'the collection'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
