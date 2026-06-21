'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const MOCK_ITEMS = [
  { id: 1, slug: 'cast-iron-skillet',  name: 'Cast Iron Skillet 10"',    image: '/products/cast-iron-skillet.svg', qty: 1, price: 3200, originalPrice: undefined },
  { id: 2, slug: 'mixing-bowls',       name: 'Ceramic Mixing Bowl Set',  image: '/products/mixing-bowls.svg',      qty: 2, price: 2800, originalPrice: 3500 },
]

const SHIPPING     = 350
const POINTS_RATE  = 10  // 1 point per KSh 10

export default function CheckoutClient() {
  const [placing, setPlacing] = useState(false)
  const [placed,  setPlaced]  = useState(false)

  const subtotal     = MOCK_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0)
  const total        = subtotal + SHIPPING
  const pointsEarned = Math.floor(total / POINTS_RATE)

  function handlePlaceOrder() {
    setPlacing(true)
    setTimeout(() => { setPlacing(false); setPlaced(true) }, 1800)
  }

  if (placed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-terra/10 flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terra">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-earth mb-2">Order placed!</h1>
        <p className="text-earth/55 text-sm mb-1">Thank you — we'll send a confirmation shortly.</p>
        <p className="text-sm text-terra font-medium mb-8">You earned +{pointsEarned} Narya Points</p>
        <div className="flex gap-4">
          <Link href="/shop"
            className="px-5 py-2.5 rounded-xl bg-earth text-ivory text-sm font-medium hover:bg-earth/90 transition-colors">
            Continue Shopping
          </Link>
          <Link href="/rewards"
            className="px-5 py-2.5 rounded-xl border border-earth/20 text-earth text-sm hover:border-earth/40 transition-colors">
            View Rewards
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-2xl sm:text-3xl text-earth mb-8">Review your order</h1>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Right column: items + shipping + payment (first on mobile) ── */}
        <div className="flex-1 space-y-4 order-1 lg:order-2">

          {/* Items */}
          <div className="bg-white rounded-2xl border border-earth/10 p-6">
            <h2 className="text-sm font-semibold text-earth mb-4">Your Items</h2>
            <ul className="space-y-4">
              {MOCK_ITEMS.map(item => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl bg-ivory-dark shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-earth font-medium leading-snug truncate">{item.name}</p>
                    <p className="text-xs text-earth/45 mt-0.5">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-earth">KSh {(item.price * item.qty).toLocaleString()}</p>
                    {item.originalPrice && (
                      <p className="text-xs text-earth/35 line-through">
                        KSh {(item.originalPrice * item.qty).toLocaleString()}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-earth/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-earth">Shipping to</h2>
              <button className="text-xs text-terra hover:text-terra/70 transition-colors">Edit</button>
            </div>
            <p className="text-sm text-earth/60">Jane Wanjiku</p>
            <p className="text-sm text-earth/60">14 Waiyaki Way, Westlands</p>
            <p className="text-sm text-earth/60">Nairobi, 00100</p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-earth/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-earth">Payment</h2>
              <button className="text-xs text-terra hover:text-terra/70 transition-colors">Edit</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 rounded bg-earth/8 border border-earth/10 flex items-center justify-center shrink-0">
                <svg width="20" height="14" viewBox="0 0 32 20" fill="none">
                  <rect width="32" height="20" rx="3" fill="#1C2E1C" fillOpacity="0.06"/>
                  <rect x="0" y="6" width="32" height="3" fill="#1C2E1C" fillOpacity="0.18"/>
                  <rect x="4" y="13" width="6" height="2" rx="1" fill="#1C2E1C" fillOpacity="0.35"/>
                </svg>
              </div>
              <span className="text-sm text-earth/60">•••• •••• •••• 4823</span>
            </div>
          </div>
        </div>

        {/* ── Left column: order summary ── */}
        <div className="lg:w-80 shrink-0 order-2 lg:order-1">
          <div className="bg-white rounded-2xl border border-earth/10 p-6 lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold text-earth mb-4">Order Summary</h2>

            <div className="border-t border-earth/8 pt-4 space-y-2.5">
              {MOCK_ITEMS.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-earth/55 truncate mr-2 flex-1">
                    {item.name} ×{item.qty}
                  </span>
                  <span className="text-earth shrink-0">KSh {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-earth/55">Shipping</span>
                <span className="text-earth">KSh {SHIPPING.toLocaleString()}</span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-earth/8 flex items-center justify-between">
              <span className="text-sm font-semibold text-earth">Total</span>
              <span className="bg-earth text-ivory text-sm font-bold px-3 py-1 rounded-lg">
                KSh {total.toLocaleString()}
              </span>
            </div>

            {/* Earn points pill */}
            <div className="mt-4 bg-earth rounded-xl px-4 py-3">
              <p className="text-[10px] text-sienna/80 uppercase tracking-widest mb-0.5">You'll earn</p>
              <p className="text-ivory font-semibold text-base">+{pointsEarned} Narya Points</p>
            </div>

            {/* Place order */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="mt-4 w-full bg-terra text-ivory py-3 rounded-xl text-sm font-semibold
                hover:bg-terra/90 active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {placing ? 'Placing order…' : 'Place Order'}
            </button>

            <Link
              href="/cart"
              className="mt-3 block text-center text-xs text-earth/40 hover:text-earth/60 transition-colors"
            >
              ← Back to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
