'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type CartItem = {
  id: number
  slug: string
  name: string
  image: string
  price: number
  originalPrice?: number
  qty: number
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: 1,
    slug: 'cast-iron-skillet',
    name: 'Cast Iron Skillet 10"',
    image: '/products/cast-iron-skillet.svg',
    price: 3200,
    qty: 1,
  },
  {
    id: 2,
    slug: 'mixing-bowls',
    name: 'Ceramic Mixing Bowl Set',
    image: '/products/mixing-bowls.svg',
    price: 2800,
    originalPrice: 3500,
    qty: 2,
  },
]

const SHIPPING = 350
const FREE_SHIPPING_AT = 7500

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)

  function updateQty(id: number, delta: number) {
    setItems(prev =>
      prev
        .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0)
    )
  }

  function remove(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING
  const total = subtotal + shipping
  const toFreeShipping = FREE_SHIPPING_AT - subtotal

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-earth/25 mb-5">
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          <circle cx="10" cy="21" r="1"/><circle cx="21" cy="21" r="1"/>
        </svg>
        <h1 className="font-serif text-2xl text-earth mb-2">Your cart is empty</h1>
        <p className="text-earth/50 text-sm mb-8">Looks like you haven't added anything yet.</p>
        <Link
          href="/shop"
          className="bg-earth text-ivory px-7 py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-2xl sm:text-3xl text-earth mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Items list ── */}
        <div className="flex-1 space-y-3">

          {/* Free shipping progress */}
          {toFreeShipping > 0 && (
            <div className="bg-ivory-dark rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-earth/60">
                Add <span className="font-semibold text-terra">KSh {toFreeShipping.toLocaleString()}</span> more for free shipping
              </p>
              <div className="mt-1.5 h-1 bg-earth/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-terra rounded-full transition-all"
                  style={{ width: `${Math.min((subtotal / FREE_SHIPPING_AT) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {shipping === 0 && (
            <div className="bg-terra/8 rounded-xl px-4 py-2.5 mb-4 text-xs text-terra font-medium">
              You qualify for free shipping!
            </div>
          )}

          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-earth/10 p-4 flex gap-4">
              {/* Image */}
              <Link href={`/product/${item.slug}`} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-ivory-dark shrink-0 overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link href={`/product/${item.slug}`} className="text-sm font-medium text-earth leading-snug hover:text-terra transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Remove"
                    className="text-earth/30 hover:text-earth/60 transition-colors shrink-0 mt-0.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                  {/* Qty stepper */}
                  <div className="flex items-center border border-earth/15 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-earth/50 hover:text-earth hover:bg-ivory-dark transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm text-earth font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-earth/50 hover:text-earth hover:bg-ivory-dark transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-earth">
                      KSh {(item.price * item.qty).toLocaleString()}
                    </p>
                    {item.originalPrice && (
                      <p className="text-xs text-earth/35 line-through">
                        KSh {(item.originalPrice * item.qty).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/shop"
            className="inline-block mt-2 text-xs text-earth/45 hover:text-earth/70 transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* ── Order summary ── */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-earth/10 p-6 lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold text-earth mb-4">Order Summary</h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-earth/55">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="text-earth">KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth/55">Shipping</span>
                <span className={shipping === 0 ? 'text-terra font-medium' : 'text-earth'}>
                  {shipping === 0 ? 'Free' : `KSh ${shipping.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-earth/8 flex justify-between items-center">
              <span className="text-sm font-semibold text-earth">Total</span>
              <span className="bg-earth text-ivory text-sm font-bold px-3 py-1 rounded-lg">
                KSh {total.toLocaleString()}
              </span>
            </div>

            {/* Earn points */}
            <div className="mt-4 bg-earth rounded-xl px-4 py-3">
              <p className="text-[10px] text-sienna/80 uppercase tracking-widest mb-0.5">You'll earn</p>
              <p className="text-ivory font-semibold text-base">+{Math.floor(subtotal / 10)} Narya Points</p>
            </div>

            <Link
              href="/checkout"
              className="mt-4 block w-full bg-terra text-ivory py-3 rounded-xl text-sm font-semibold text-center hover:bg-terra/90 transition-colors"
            >
              Proceed to Checkout
            </Link>

            {/* Trust badges */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-earth/35">
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Secure checkout
              </span>
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Free returns
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
