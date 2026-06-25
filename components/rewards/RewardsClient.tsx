'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

const NEXT_TIER = 'Harvest'
const NEXT_THRESHOLD = 2000

const REDEEM_OPTIONS = [
  { points: 300, valueKes: 50, label: 'Starter reward', desc: 'Small discount for your next order' },
  { points: 3000, valueKes: 500, label: 'Popular reward', desc: 'A strong saving for a full basket' },
  { points: 6000, valueKes: 1000, label: 'Premium reward', desc: 'Best value when you have enough points' },
]

const EARN_WAYS = [
  { icon: 'Cart', title: 'Every purchase', desc: '1 point per KSh 10 spent' },
  { icon: 'Star', title: 'Leave a review', desc: '50 points per verified review' },
  { icon: 'Gift', title: 'Birthday bonus', desc: '200 points on your birthday month' },
  { icon: 'Share', title: 'Refer a friend', desc: '500 points per successful referral' },
]

const HISTORY = [
  { date: 'Jun 18, 2026', action: 'Purchase - Ceramic Stockpot', points: 320, positive: true },
  { date: 'Jun 10, 2026', action: 'Product review', points: 50, positive: true },
  { date: 'May 28, 2026', action: 'Redeemed discount', points: -500, positive: false },
  { date: 'May 20, 2026', action: "Purchase - Chef's Knife Set", points: 280, positive: true },
  { date: 'May 05, 2026', action: 'Referral bonus', points: 500, positive: true },
  { date: 'Apr 15, 2026', action: 'Birthday bonus', points: 200, positive: true },
]

type RewardCoupon = {
  coupon_code: string
  discount_kes: number
  points_used: number
  expires_at?: string | null
}

type ProfilePayload = {
  user?: {
    points_balance?: number
    points_held?: number
    points_available?: number
  }
}

export default function RewardsClient() {
  const { user } = useAuth()
  const [pointsBalance, setPointsBalance] = useState(user?.points_balance ?? 0)
  const [pointsHeld, setPointsHeld] = useState(0)
  const [pointsAvailable, setPointsAvailable] = useState(user?.points_balance ?? 0)
  const [coupon, setCoupon] = useState<RewardCoupon | null>(null)
  const [redeeming, setRedeeming] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ProfilePayload | null) => {
        const profile = data?.user
        if (!profile) return
        const balance = profile.points_balance ?? 0
        const held = profile.points_held ?? 0
        setPointsBalance(balance)
        setPointsHeld(held)
        setPointsAvailable(profile.points_available ?? Math.max(0, balance - held))
      })
      .catch(() => {})
  }, [])

  const pct = Math.min((pointsBalance / NEXT_THRESHOLD) * 100, 100)
  const tier = pointsBalance >= NEXT_THRESHOLD ? NEXT_TIER : 'Cultivator'

  async function redeemPoints(points: number) {
    setRedeeming(points)
    setError('')
    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      })
      const data = await res.json()

      if (!res.ok || !data.coupon_code) {
        const message = data?.errors
          ? Object.values(data.errors as Record<string, string[]>).flat().join(' ')
          : data?.message
        setError(message ?? 'Could not redeem points.')
        return
      }

      setCoupon(data)
      setPointsHeld((current) => current + data.points_used)
      setPointsAvailable((current) => Math.max(0, current - data.points_used))
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setRedeeming(null)
    }
  }

  async function copyCode() {
    if (!coupon) return
    try {
      await navigator.clipboard.writeText(coupon.coupon_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('Could not copy the coupon code.')
    }
  }

  return (
    <div>
      <section className="relative bg-earth overflow-hidden py-16 px-4 sm:px-6">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
          <svg width="420" height="420" viewBox="0 0 420 420" fill="none">
            <circle cx="340" cy="210" r="220" stroke="#a7b89a" strokeOpacity="0.2" strokeWidth="1.5" />
            <circle cx="340" cy="210" r="150" stroke="#a7b89a" strokeOpacity="0.14" strokeWidth="1.5" />
            <circle cx="340" cy="210" r="80" fill="#a7b89a" fillOpacity="0.12" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <p className="text-[11px] tracking-[0.25em] uppercase text-sienna mb-4 font-medium">
            Narya Rewards
          </p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-serif text-[80px] sm:text-[110px] leading-none text-ivory">
              {pointsBalance.toLocaleString()}
            </span>
            <span className="text-3xl text-ivory/40 font-light">pts</span>
          </div>

          <p className="font-serif italic text-ivory/45 text-lg sm:text-xl mb-8">
            Tend it, watch it bloom.
          </p>

          <div className="max-w-sm">
            <div className="flex justify-between text-xs text-ivory/50 mb-2">
              <span className="text-ivory/70 font-medium">{tier}</span>
              <span>{NEXT_TIER} at {NEXT_THRESHOLD.toLocaleString()} pts</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-sienna rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[11px] text-ivory/35 mt-1.5">
              {Math.max(0, NEXT_THRESHOLD - pointsBalance).toLocaleString()} points to {NEXT_TIER}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <section>
          <h2 className="font-serif text-xl text-earth mb-5">Redeem Points</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] gap-4">
            <div className="rounded-2xl border border-earth/15 bg-white p-6">
              <p className="text-xs uppercase tracking-widest text-earth/40 mb-2">Available to redeem</p>
              <p className="font-serif text-4xl text-earth">{pointsAvailable.toLocaleString()} pts</p>
              {pointsHeld > 0 && (
                <p className="text-xs text-earth/45 mt-2">
                  {pointsHeld.toLocaleString()} points are currently held by pending reward coupons.
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {REDEEM_OPTIONS.map((option) => {
                  const canRedeem = pointsAvailable >= option.points
                  return (
                    <div
                      key={option.points}
                      className={`flex min-h-[228px] flex-col rounded-xl border p-5 transition-colors ${
                        canRedeem
                          ? 'border-earth/12 bg-ivory-dark'
                          : 'border-earth/8 bg-ivory opacity-60'
                      }`}
                    >
                      <div className="min-h-[132px]">
                        <p className="font-serif text-2xl text-earth">
                          KSh {option.valueKes.toLocaleString()} off
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-terra">
                          {option.points.toLocaleString()} pts
                        </p>
                        <p className="mt-5 text-xs text-earth/45 leading-relaxed">{option.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void redeemPoints(option.points)}
                        disabled={!canRedeem || redeeming !== null}
                        className={`mt-auto h-12 w-full rounded-xl text-sm font-semibold transition-colors ${
                          canRedeem
                            ? 'bg-earth text-ivory hover:bg-earth/90'
                            : 'bg-earth/8 text-earth/35 cursor-not-allowed'
                        } disabled:opacity-50`}
                      >
                        {redeeming === option.points ? 'Generating...' : canRedeem ? 'Redeem' : 'Need more'}
                      </button>
                    </div>
                  )
                })}
              </div>

              <p className="mt-4 text-xs text-earth/45">
                Your points are held when the coupon is created, then deducted only after checkout succeeds.
              </p>

              {error && (
                <p className="mt-4 text-sm bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-earth/15 bg-white p-6">
              <p className="text-xs uppercase tracking-widest text-earth/40 mb-3">Reward coupon</p>
              {coupon ? (
                <div className="space-y-4">
                  <div className="rounded-xl bg-terra/5 border border-terra/20 px-4 py-3">
                    <p className="font-mono text-lg font-semibold tracking-widest text-terra">
                      {coupon.coupon_code}
                    </p>
                    <p className="text-xs text-earth/45 mt-1">
                      KSh {coupon.discount_kes.toLocaleString()} off checkout
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copyCode()}
                    className="w-full px-4 py-2.5 rounded-xl border border-earth/15 text-sm font-semibold text-earth hover:border-earth/35 transition-colors"
                  >
                    {copied ? 'Copied' : 'Copy coupon'}
                  </button>
                  <Link
                    href="/checkout"
                    className="block w-full px-4 py-2.5 rounded-xl bg-terra text-center text-sm font-semibold text-ivory hover:bg-terra/90 transition-colors"
                  >
                    Go to checkout
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-earth/50 leading-relaxed">
                  Your coupon will appear here after you redeem. Apply it at checkout in the coupon field.
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-earth mb-5">Ways to Earn</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EARN_WAYS.map((way) => (
              <div key={way.title} className="bg-white rounded-2xl border border-earth/10 p-4">
                <p className="text-xs uppercase tracking-widest text-terra mb-2">{way.icon}</p>
                <p className="text-sm font-medium text-earth mb-0.5">{way.title}</p>
                <p className="text-xs text-earth/50 leading-snug">{way.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-earth mb-5">Points History</h2>
          <div className="bg-white rounded-2xl border border-earth/10 divide-y divide-earth/6">
            {HISTORY.map((item) => (
              <div key={`${item.date}-${item.action}`} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm text-earth">{item.action}</p>
                  <p className="text-xs text-earth/40 mt-0.5">{item.date}</p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ml-4 ${item.positive ? 'text-terra' : 'text-earth/40'}`}>
                  {item.positive ? '+' : ''}{item.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center pb-4">
          <p className="text-earth/50 text-sm mb-4">Ready to use your points?</p>
          <Link
            href="/shop"
            className="inline-block bg-earth text-ivory px-8 py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors"
          >
            Shop & Earn More
          </Link>
        </section>
      </div>
    </div>
  )
}
