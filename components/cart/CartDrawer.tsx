'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/lib/cart-context'

const FREE_SHIPPING_AT = 7500
const SHIPPING_COST    = 350

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, itemCount, subtotal } = useCart()
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const shipping   = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_COST
  const total      = Math.max(0, subtotal + shipping - couponDiscount / 100)
  const toFree     = Math.max(FREE_SHIPPING_AT - subtotal, 0)
  const freePct    = Math.min((subtotal / FREE_SHIPPING_AT) * 100, 100)
  const pointsEarned = Math.floor(subtotal / 10)

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeCart() }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    setCoupon('')
    setCouponError('')
  }

  async function applyCoupon() {
    const code = coupon.trim()
    if (!code) return

    setApplyingCoupon(true)
    setCouponError('')

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: subtotal * 100 }),
      })
      const data = await res.json()

      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon.code)
        setCouponDiscount(data.discount)
        setCoupon(data.coupon.code)
      } else {
        setAppliedCoupon(null)
        setCouponDiscount(0)
        setCouponError(data.message ?? 'Invalid coupon code.')
      }
    } catch {
      setCouponError('Could not apply coupon.')
    } finally {
      setApplyingCoupon(false)
    }
  }

  useEffect(() => {
    if (appliedCoupon) {
      void applyCoupon()
    }
    // Revalidate discount when quantities change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal])

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col
          shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-earth/10">
          <h2 className="text-sm font-bold tracking-widest uppercase text-earth">
            Your Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-earth/40 hover:text-earth transition-colors p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                className="text-earth/20 mb-4">
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                <circle cx="10" cy="21" r="1"/><circle cx="21" cy="21" r="1"/>
              </svg>
              <p className="text-sm text-earth/50 mb-4">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="text-xs text-terra underline underline-offset-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="flex gap-3">
                  {/* Image */}
                  <Link href={`/product/${item.slug}`} onClick={closeCart}
                    className="relative w-[70px] h-[70px] shrink-0 bg-ivory-dark rounded-lg overflow-hidden border border-earth/8">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <Link href={`/product/${item.slug}`} onClick={closeCart}
                        className="text-sm font-medium text-earth leading-snug hover:text-terra transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="text-earth/25 hover:text-earth/60 transition-colors shrink-0 mt-0.5"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs text-terra font-semibold mt-0.5">
                      KSh {item.price.toLocaleString()}
                      {item.originalPrice && (
                        <span className="text-earth/35 line-through font-normal ml-1.5">
                          KSh {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </p>

                    {/* Qty stepper */}
                    <div className="flex items-center mt-2 border border-earth/15 rounded-lg w-fit overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-earth/50 hover:bg-ivory-dark hover:text-earth transition-colors text-base leading-none"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-medium text-earth">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-earth/50 hover:bg-ivory-dark hover:text-earth transition-colors text-base leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — fixed at bottom */}
        {items.length > 0 && (
          <div className="border-t border-earth/10 px-5 pt-4 pb-5 space-y-3 bg-white">

            {/* Coupon */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg border border-terra/20 bg-terra/5 px-3 py-2">
                  <div>
                    <p className="text-xs font-semibold text-terra">{appliedCoupon}</p>
                    <p className="text-[11px] text-earth/45">
                      -KSh {(couponDiscount / 100).toLocaleString()} off
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[11px] text-earth/40 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-0">
                  <input
                    value={coupon}
                    onChange={e => {
                      setCoupon(e.target.value.toUpperCase())
                      setCouponError('')
                    }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), void applyCoupon())}
                    placeholder="Coupon code"
                    className="flex-1 border border-earth/15 border-r-0 rounded-l-lg px-3 py-2 text-xs text-earth uppercase placeholder:normal-case placeholder-earth/30 focus:outline-none focus:border-terra"
                  />
                  <button
                    type="button"
                    onClick={() => void applyCoupon()}
                    disabled={applyingCoupon || !coupon.trim()}
                    className="bg-earth/80 hover:bg-earth text-ivory text-xs font-semibold px-3 rounded-r-lg transition-colors disabled:opacity-40"
                  >
                    {applyingCoupon ? '...' : 'APPLY'}
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1 border-t border-earth/8">
              {appliedCoupon && (
                <div className="flex justify-between text-xs text-terra">
                  <span>Coupon</span>
                  <span>-KSh {(couponDiscount / 100).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-earth">
                <span>Total</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Points pill */}
            <div className="bg-earth rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] text-white tracking-widest">You'll Earn</span>
              <span className="text-ivory text-xs font-semibold">+{pointsEarned} Narya Points</span>
            </div>

            {/* Checkout button */}
            <Link
              href={appliedCoupon ? `/checkout?coupon=${encodeURIComponent(appliedCoupon)}` : '/checkout'}
              onClick={closeCart}
              className="block w-full bg-earth text-ivory text-sm font-bold tracking-widest uppercase text-center py-3.5 rounded-xl hover:bg-earth/90 transition-colors"
            >
              Checkout
            </Link>

            {/* Continue shopping */}
            <button
              onClick={closeCart}
              className="block w-full text-center text-xs text-earth/45 underline underline-offset-2 hover:text-earth/70 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
