'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import type { Address } from '@/lib/types'

const POINTS_RATE = 10       // 1 point per KSh 10
type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer' | 'crypto'
type DeliveryOption = 'standard' | 'express' | 'pickup'

const DELIVERY_OPTIONS: [DeliveryOption, string, string, number][] = [
  ['standard', 'Standard Delivery', '2-4 business days', 350],
  ['express', 'Express Delivery', 'Same or next business day', 700],
  ['pickup', 'Pickup', 'Collect from store', 0],
]

const PAYMENT_OPTIONS: [PaymentMethod, string, string][] = [
  ['mpesa', 'M-Pesa', 'Pay via M-Pesa Paybill'],
  ['card', 'Card', 'Visa or Mastercard'],
  ['bank_transfer', 'Bank Transfer', 'Direct bank deposit'],
  ['crypto', 'Crypto', 'Pay with supported crypto'],
]

const TIP_OPTIONS = [0, 100, 250, 500]

const REDEEM_OPTIONS = [
  { points: 300, valueKes: 50 },
  { points: 3000, valueKes: 500 },
  { points: 6000, valueKes: 1000 },
]

type ShippingSnapshot = {
  name: string
  phone: string
  address_line_1: string
  city: string
  county: string
  country: string
  postal_code: string
}

function snapshotFromAddress(
  address: Address | null | undefined,
  fallbackName: string
): ShippingSnapshot {
  return {
    name: address?.name ?? fallbackName,
    phone: address?.phone ?? '',
    address_line_1: address?.address_line_1 ?? '',
    city: address?.city ?? '',
    county: address?.county ?? '',
    country: address?.country ?? 'KE',
    postal_code: address?.postal_code ?? '',
  }
}

export default function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal, clearCart, waitForCartSync } = useCart()
  const { user } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState('')
  const [addr1, setAddr1] = useState('')
  const [city, setCity] = useState('')
  const [county, setCounty] = useState('')
  const [postal, setPostal] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('mpesa')
  const [delivery, setDelivery] = useState<DeliveryOption>('standard')
  const [tipKes, setTipKes] = useState(0)
  const [customTip, setCustomTip] = useState('')
  const [saveProfile, setSaveProfile] = useState(false)
  const [profileSnapshot, setProfileSnapshot] = useState<ShippingSnapshot | null>(null)
  const [profilePayment, setProfilePayment] = useState<PaymentMethod | null>(null)
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  const [couponInput, setCouponInput] = useState('')
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const [pointsBalance, setPointsBalance] = useState(0)
  const [pointsAvailable, setPointsAvailable] = useState(0)
  const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null)
  const [generatedCouponDiscountKes, setGeneratedCouponDiscountKes] = useState(0)
  const [pointsRedeemed, setPointsRedeemed] = useState(false)
  const [redeemedPoints, setRedeemedPoints] = useState(0)
  const [redeemedDiscountKes, setRedeemedDiscountKes] = useState(0)
  const [redeemingPoints, setRedeemingPoints] = useState<number | null>(null)
  const [redeemError, setRedeemError] = useState('')
  const [copied, setCopied] = useState(false)

  // subtotal from cart context is already in KES (not cents)
  const subtotalCents = subtotal * 100
  const discountKes = couponDiscount / 100
  const shippingKes = DELIVERY_OPTIONS.find(([value]) => value === delivery)?.[3] ?? 350
  const total = subtotal + shippingKes + tipKes - discountKes
  const pointsEarned = Math.floor(subtotal / POINTS_RATE)
  const currentSnapshot: ShippingSnapshot = {
    name,
    phone,
    address_line_1: addr1,
    city,
    county,
    country: 'KE',
    postal_code: postal,
  }
  const hasProfileChanges = Boolean(
    profileSnapshot &&
    (currentSnapshot.name.trim() !== profileSnapshot.name.trim() ||
      currentSnapshot.phone.trim() !== profileSnapshot.phone.trim() ||
      currentSnapshot.address_line_1.trim() !== profileSnapshot.address_line_1.trim() ||
      currentSnapshot.city.trim() !== profileSnapshot.city.trim() ||
      currentSnapshot.county.trim() !== profileSnapshot.county.trim() ||
      currentSnapshot.postal_code.trim() !== profileSnapshot.postal_code.trim() ||
      payment !== profilePayment)
  )

  useEffect(() => {
    if (!user) return

    const applyProfile = (profile: {
      name: string
      default_address?: Address | null
      default_payment_method?: PaymentMethod | null
    }) => {
      const next = snapshotFromAddress(profile.default_address, profile.name)
      setName(next.name)
      setPhone(next.phone)
      setAddr1(next.address_line_1)
      setCity(next.city)
      setCounty(next.county)
      setPostal(next.postal_code)
      setPayment(profile.default_payment_method ?? 'mpesa')
      setProfileSnapshot(next)
      setProfilePayment(profile.default_payment_method ?? 'mpesa')
      setSaveProfile(false)
    }

    applyProfile(user)

    fetch('/api/auth/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          applyProfile(data.user)
          setPointsBalance(data.user.points_balance ?? 0)
          setPointsAvailable(data.user.points_available ?? data.user.points_balance ?? 0)
        }
      })
      .catch(() => {})
  }, [user])

  useEffect(() => {
    if (!hasProfileChanges) setSaveProfile(false)
  }, [hasProfileChanges])

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('coupon')?.trim()
    if (!code || couponCode) return
    setCouponInput(code.toUpperCase())
    void applyCoupon(code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotalCents])

  async function applyCoupon(directCode?: string): Promise<boolean> {
    const code = (directCode ?? couponInput).trim()
    if (!code) return false
    setApplyingCoupon(true)
    setCouponError('')
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: subtotalCents }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setCouponCode(data.coupon.code)
        setCouponDiscount(data.discount)
        return true
      } else {
        setCouponError(data.message ?? 'Invalid coupon.')
        setCouponCode(null)
        setCouponDiscount(0)
        return false
      }
    } catch {
      setCouponError('Could not apply coupon.')
      return false
    } finally {
      setApplyingCoupon(false)
    }
  }

  function removeCoupon() {
    setCouponCode(null)
    setCouponDiscount(0)
    setCouponInput('')
    setCouponError('')
  }

  async function redeemPoints(points: number) {
    setRedeemingPoints(points)
    setRedeemError('')
    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      })
      const data = await res.json()
      if (res.ok && data.coupon_code) {
        const applied = await applyCoupon(data.coupon_code)
        if (!applied) {
          setRedeemError('Reward coupon was created but could not be applied. Try entering the coupon code manually.')
          return
        }
        setPointsRedeemed(true)
        setRedeemedPoints(data.points_used ?? points)
        setRedeemedDiscountKes(data.discount_kes ?? (data.discount ? data.discount / 100 : 0))
        setPointsAvailable((current) => Math.max(0, current - (data.points_used ?? points)))
        setCouponInput(data.coupon_code)
      } else {
        const message = data?.errors
          ? Object.values(data.errors as Record<string, string[]>).flat().join(' ')
          : data?.message
        setRedeemError(message ?? 'Could not redeem points.')
      }
    } catch {
      setRedeemError('Network error.')
    } finally {
      setRedeemingPoints(null)
    }
  }

  async function copyAndApply() {
    if (!generatedCoupon) return
    try {
      await navigator.clipboard.writeText(generatedCoupon)
    } catch { /* clipboard unavailable — continue anyway */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    const applied = await applyCoupon(generatedCoupon)
    if (!applied) return
    setPointsRedeemed(true)
    setGeneratedCoupon(null)
    setGeneratedCouponDiscountKes(0)
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-xl text-earth mb-2">Sign in to continue</h2>
        <p className="text-sm text-earth/50 mb-6">You need an account to place an order.</p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-earth text-ivory text-sm font-semibold rounded-xl hover:bg-earth/90 transition-colors"
        >
          Sign in
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-xl text-earth mb-2">Your cart is empty</h2>
        <p className="text-sm text-earth/50 mb-6">Add some items before checking out.</p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-earth text-ivory text-sm font-semibold rounded-xl hover:bg-earth/90 transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setPlacing(true)

    try {
      await waitForCartSync()

      if (saveProfile && hasProfileChanges) {
        const profileRes = await fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            default_payment_method: payment,
            default_address: {
              name: name.trim(),
              phone: phone.trim(),
              address_line_1: addr1.trim(),
              address_line_2: null,
              city: city.trim(),
              county: county.trim() || null,
              country: 'KE',
              postal_code: postal.trim() || null,
            },
          }),
        })
        const profileData = await profileRes.json()
        if (!profileRes.ok) {
          const raw = profileData?.errors
            ? Object.values(profileData.errors as Record<string, string[]>)
                .flat()
                .join(' ')
            : (profileData?.message ?? 'Could not save profile details.')
          setError(String(raw))
          return
        }
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_address: {
            name: name.trim(),
            phone: phone.trim(),
            address_line_1: addr1.trim(),
            city: city.trim(),
            county: county.trim() || undefined,
            country: 'KE',
            postal_code: postal.trim() || undefined,
          },
          payment_method: payment,
          delivery_option: delivery,
          tip_total: tipKes * 100,
          coupon_code: couponCode ?? undefined,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            product_id: item.productId ?? null,
            product_variant_id: item.variantId ?? null,
            quantity: item.qty,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const raw = data?.errors
          ? Object.values(data.errors as Record<string, string[]>)
              .flat()
              .join(' ')
          : (data?.message ?? 'Could not place order. Please try again.')
        setError(String(raw))
        return
      }

      clearCart()
      router.push(`/order-confirmation/${data.data.order_number}`)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-2xl sm:text-3xl text-earth mb-8">Review your order</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-6">
          {/* ── Right column ── */}
          <div className="min-w-0 space-y-4 order-1 lg:order-2">
            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-earth/10 p-6">
              <h2 className="text-sm font-semibold text-earth mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">
                    Full name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">
                    Phone
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">
                    City
                  </label>
                  <input
                    required
                    placeholder="Nairobi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">
                    Address
                  </label>
                  <input
                    required
                    placeholder="Street / Estate / Building"
                    value={addr1}
                    onChange={(e) => setAddr1(e.target.value)}
                    className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">
                    County
                  </label>
                  <input
                    placeholder="Nairobi County"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">
                    Postal code
                  </label>
                  <input
                    placeholder="00100"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Delivery options */}
            <div className="bg-white rounded-2xl border border-earth/10 p-6">
              <h2 className="text-sm font-semibold text-earth mb-4">Delivery Options</h2>
              <div className="space-y-2">
                {DELIVERY_OPTIONS.map(([value, label, desc, price]) => (
                  <label
                    key={value}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      delivery === value
                        ? 'border-terra bg-terra/5'
                        : 'border-earth/10 hover:border-earth/25'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        value={value}
                        checked={delivery === value}
                        onChange={() => setDelivery(value)}
                        className="accent-terra"
                      />
                      <span>
                        <span className="block text-sm font-medium text-earth">{label}</span>
                        <span className="block text-xs text-earth/45">{desc}</span>
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-earth">
                      {price === 0 ? 'Free' : `KSh ${price.toLocaleString()}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-white rounded-2xl border border-earth/10 p-6">
              <h2 className="text-sm font-semibold text-earth mb-4">Add a Tip</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {TIP_OPTIONS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setTipKes(amount)
                      setCustomTip('')
                    }}
                    className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                      tipKes === amount && customTip === ''
                        ? 'border-terra bg-terra/5 text-terra'
                        : 'border-earth/10 text-earth/65 hover:border-earth/25'
                    }`}
                  >
                    {amount === 0 ? 'No tip' : `KSh ${amount}`}
                  </button>
                ))}
                <input
                  type="number"
                  min={0}
                  placeholder="Custom"
                  value={customTip}
                  onChange={(e) => {
                    setCustomTip(e.target.value)
                    setTipKes(Math.max(0, Number(e.target.value) || 0))
                  }}
                  className="border border-earth/15 rounded-xl px-3 py-2 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-earth/10 p-6">
              <h2 className="text-sm font-semibold text-earth mb-4">Payment Details</h2>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map(([value, label, desc]) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      payment === value
                        ? 'border-terra bg-terra/5'
                        : 'border-earth/10 hover:border-earth/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={payment === value}
                      onChange={() => setPayment(value)}
                      className="accent-terra"
                    />
                    <div>
                      <p className="text-sm font-medium text-earth">{label}</p>
                      <p className="text-xs text-earth/45">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {hasProfileChanges && (
              <label className="flex items-start gap-3 bg-white rounded-2xl border border-earth/10 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveProfile}
                  onChange={(e) => setSaveProfile(e.target.checked)}
                  className="mt-1 accent-terra"
                />
                <span>
                  <span className="block text-sm font-medium text-earth">
                    Save these changes to my profile
                  </span>
                  <span className="block text-xs text-earth/45 mt-0.5">
                    Leave unchecked if this address or payment method is only for this order.
                  </span>
                </span>
              </label>
            )}

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-earth/10 p-6">
              <h2 className="text-sm font-semibold text-earth mb-4">Coupon Code</h2>
              {couponCode ? (
                <div className="flex items-center justify-between bg-terra/5 border border-terra/20 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-terra">{couponCode}</p>
                    <p className="text-xs text-earth/50 mt-0.5">
                      −KSh {discountKes.toLocaleString()} off
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-earth/40 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase())
                      setCouponError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), void applyCoupon())}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth uppercase placeholder:normal-case placeholder:text-earth/30 focus:outline-none focus:border-terra transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => void applyCoupon()}
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="px-4 py-2.5 bg-earth text-ivory text-xs font-semibold rounded-xl hover:bg-earth/90 transition-colors disabled:opacity-40"
                  >
                    {applyingCoupon ? '…' : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && <p className="mt-2 text-xs text-red-500">{couponError}</p>}
            </div>

            {/* Redeem Points */}
            <div className="bg-white rounded-2xl border border-earth/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-earth">Narya Points</h2>
                {pointsBalance > 0 && (
                  <span className="text-xs font-medium text-earth/50 bg-earth/6 px-2.5 py-1 rounded-full">
                    {pointsBalance.toLocaleString()} pts
                  </span>
                )}
              </div>

              {pointsRedeemed ? (
                <div className="flex items-center gap-2 text-xs text-terra">
                  <span>
                    <strong>{redeemedPoints.toLocaleString()} points</strong> have been redeemed for{' '}
                    <strong>KSh {redeemedDiscountKes.toLocaleString()}</strong> successfully.
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-earth/50">
                    Choose an available reward. The coupon is created and applied automatically.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {REDEEM_OPTIONS.filter((option) => pointsAvailable >= option.points && subtotal >= option.valueKes).map((option) => (
                      <button
                        key={option.points}
                        type="button"
                        onClick={() => void redeemPoints(option.points)}
                        disabled={redeemingPoints !== null}
                        className="rounded-xl border border-earth/12 bg-ivory-dark px-3 py-3 text-left transition-colors hover:border-terra/50 disabled:opacity-50"
                      >
                        <span className="block font-serif text-lg text-earth">
                          KSh {option.valueKes.toLocaleString()} off
                        </span>
                        <span className="mt-1 block text-[11px] font-semibold uppercase tracking-widest text-terra">
                          {option.points.toLocaleString()} pts
                        </span>
                        <span className="mt-2 block h-5 text-xs font-semibold text-earth">
                          {redeemingPoints === option.points ? 'Applying...' : 'Redeem'}
                        </span>
                      </button>
                    ))}
                  </div>
                  {REDEEM_OPTIONS.every((option) => pointsAvailable < option.points || subtotal < option.valueKes) && (
                    <p className="text-xs bg-ivory-dark border border-earth/8 text-earth/45 rounded-lg px-3 py-2">
                      No reward options are available for this cart yet.
                    </p>
                  )}
                  {redeemError && (
                    <p className="text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2">
                      {redeemError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Left column: order summary ── */}
          <div className="min-w-0 order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-earth/10 p-6 lg:sticky lg:top-24">
              <h2 className="border-b border-earth/8 pb-4 text-sm font-semibold text-earth">
                Order Summary
              </h2>

              <div className="pt-5">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 text-sm"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-ivory-dark">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-earth">{item.name}</p>
                        <p className="mt-1 text-xs text-earth/45">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="whitespace-nowrap text-sm font-medium text-earth">
                          KSh {(item.price * item.qty).toLocaleString()}
                        </p>
                        {item.originalPrice && (
                          <p className="mt-1 whitespace-nowrap text-xs text-earth/35 line-through">
                            KSh {(item.originalPrice * item.qty).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 border-t border-earth/8 pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-earth/55">Shipping</span>
                    <span className="font-medium text-earth">
                      KSh {shippingKes.toLocaleString()}
                    </span>
                  </div>
                  {tipKes > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-earth/55">Tip</span>
                      <span className="font-medium text-earth">KSh {tipKes.toLocaleString()}</span>
                    </div>
                  )}
                  {couponCode && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-terra/80">Coupon ({couponCode})</span>
                      <span className="text-terra font-medium">
                        −KSh {discountKes.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-earth/8 pt-5">
                <span className="text-base font-semibold text-earth">Total</span>
                <span className="rounded-xl bg-earth px-4 py-2 text-sm font-bold text-ivory">
                  KSh {total.toLocaleString()}
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-earth px-5 py-4">
                <p className="text-[10px] text-sienna/80 uppercase tracking-widest mb-0.5">
                  You&apos;ll earn
                </p>
                <p className="text-ivory font-semibold text-base">+{pointsEarned} Narya Points</p>
              </div>

              {error && <p className="mt-3 text-xs text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                disabled={placing}
                className="mt-5 w-full bg-terra text-ivory py-3 rounded-xl text-sm font-semibold
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
      </form>
    </div>
  )
}
