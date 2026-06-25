'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

type AffiliateData = {
  id: number
  code: string
  coupon_code: string | null
  group: 'link_only' | 'coupon_code'
  status: 'pending' | 'active' | 'suspended'
  total_earned: number
  pending_earnings: number
  tier: { tier: number; name: string; color: string }
  current_month: { month: string; order_count: number; next_tier_at: number | null }
}

const TIER_COLORS: Record<string, string> = {
  gold:   'text-yellow-600 bg-yellow-50 border-yellow-200',
  purple: 'text-purple-600 bg-purple-50 border-purple-200',
  blue:   'text-blue-600   bg-blue-50   border-blue-200',
  green:  'text-terra      bg-terra/8   border-terra/20',
  gray:   'text-earth/40   bg-earth/5   border-earth/10',
}

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

export default function AffiliatePage() {
  const { user, loading: authLoading } = useAuth()
  const [affiliate, setAffiliate] = useState<AffiliateData | null | undefined>(undefined)
  const [applying, setApplying]   = useState(false)
  const [copied,   setCopied]     = useState(false)

  useEffect(() => {
    if (!user) return
    fetch('/api/affiliate')
      .then(r => r.json())
      .then(d => setAffiliate(d.data ?? null))
      .catch(() => setAffiliate(null))
  }, [user])

  async function apply() {
    setApplying(true)
    const res  = await fetch('/api/affiliate', { method: 'POST' })
    const data = await res.json()
    if (res.ok) setAffiliate(data.data)
    setApplying(false)
  }

  function copyLink() {
    if (!affiliate) return
    const url = `${window.location.origin}?ref=${affiliate.code}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (authLoading || affiliate === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="h-4 bg-earth/8 rounded w-48 mx-auto animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-earth mb-3">Narya Affiliate Program</h1>
        <p className="text-earth/55 mb-6">Sign in to apply or view your affiliate dashboard.</p>
        <Link href="/login?from=/affiliate" className="inline-block bg-earth text-ivory text-sm font-semibold px-6 py-3 hover:bg-terra transition-colors">
          Sign In
        </Link>
      </div>
    )
  }

  // Not applied yet
  if (!affiliate) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-serif text-3xl text-earth mb-4">Join the Narya Affiliate Program</h1>
        <p className="text-earth/60 leading-relaxed mb-8">
          Earn commissions promoting Narya Kitchenware. Share your unique link or coupon code and
          earn progressively higher rates as your monthly referrals grow.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { tier: 'Tier 1 — Rising',      band: 'Orders 1–50',   rate: '5%'  },
            { tier: 'Tier 2 — Established', band: 'Orders 51–100', rate: '10%' },
            { tier: 'Tier 3 — Elite',       band: 'Orders 101–200',rate: '15%' },
            { tier: 'Tier 4 — Icon',        band: 'Orders 201+',   rate: '15%' },
          ].map(row => (
            <div key={row.tier} className="border border-earth/10 p-4 rounded">
              <p className="text-xs font-semibold text-terra mb-1">{row.tier}</p>
              <p className="text-sm text-earth/60">{row.band}</p>
              <p className="text-2xl font-bold text-earth mt-1">{row.rate}</p>
            </div>
          ))}
        </div>

        <div className="bg-earth/4 border border-earth/10 rounded p-4 text-sm text-earth/60 mb-8 space-y-1">
          <p>✓ Progressive (marginal) commissions — higher referrals = higher rate on new orders</p>
          <p>✓ Unique referral link + optional coupon code</p>
          <p>✓ 30-day cookie window, last-click attribution</p>
          <p>✓ Monthly earnings reset — no locked-in tiers</p>
        </div>

        <button
          onClick={apply}
          disabled={applying}
          className="bg-earth text-ivory text-sm font-semibold px-8 py-3 hover:bg-terra transition-colors disabled:opacity-40"
        >
          {applying ? 'Applying…' : 'Apply Now'}
        </button>
      </div>
    )
  }

  // Applied / active
  const tierCls = TIER_COLORS[affiliate.tier.color] ?? TIER_COLORS.gray
  const refLink = typeof window !== 'undefined' ? `${window.location.origin}?ref=${affiliate.code}` : `https://narya.co.ke?ref=${affiliate.code}`

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-earth">Affiliate Program</h1>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${
          affiliate.status === 'active' ? 'bg-terra/10 text-terra border-terra/20' :
          affiliate.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
          'bg-red-50 text-red-600 border-red-200'
        }`}>
          {affiliate.status}
        </span>
      </div>

      {affiliate.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded mb-6">
          Your application is under review. You&apos;ll receive an email once approved.
        </div>
      )}

      {affiliate.status === 'active' && (
        <>
          {/* Tier badge */}
          <div className={`inline-flex items-center gap-2 border px-4 py-2 rounded-full mb-6 ${tierCls}`}>
            <span className="text-sm font-bold">Tier {affiliate.tier.tier}</span>
            <span className="text-sm">{affiliate.tier.name}</span>
          </div>

          {/* Earnings summary */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border border-earth/10 p-4 rounded">
              <p className="text-xs text-earth/45 uppercase tracking-wider mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-earth">{fmt(affiliate.total_earned)}</p>
            </div>
            <div className="border border-earth/10 p-4 rounded">
              <p className="text-xs text-earth/45 uppercase tracking-wider mb-1">Pending</p>
              <p className="text-2xl font-bold text-earth">{fmt(affiliate.pending_earnings)}</p>
            </div>
          </div>

          {/* This month progress */}
          <div className="border border-earth/10 p-4 rounded mb-8">
            <p className="text-xs text-earth/45 uppercase tracking-wider mb-2">This Month&apos;s Orders</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-earth">{affiliate.current_month.order_count}</span>
              {affiliate.current_month.next_tier_at && (
                <span className="text-sm text-earth/50 mb-1">
                  {affiliate.current_month.next_tier_at - affiliate.current_month.order_count} more to next tier
                </span>
              )}
              {!affiliate.current_month.next_tier_at && (
                <span className="text-sm text-terra mb-1">Maximum tier reached</span>
              )}
            </div>
          </div>

          {/* Referral link */}
          <div className="mb-6">
            <p className="text-xs text-earth/45 uppercase tracking-wider mb-2">Your Referral Link</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={refLink}
                className="flex-1 border border-earth/20 px-3 py-2 text-sm text-earth/70 bg-earth/3 focus:outline-none"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 text-sm font-semibold border border-earth text-earth hover:bg-earth hover:text-ivory transition-colors whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-earth/40 mt-1.5">
              Code: <code className="bg-earth/5 px-1 rounded">{affiliate.code}</code>
              {' · '}30-day cookie · Last-click attribution
            </p>
          </div>

          {/* Coupon code */}
          {affiliate.coupon_code && (
            <div className="mb-6">
              <p className="text-xs text-earth/45 uppercase tracking-wider mb-2">Your Coupon Code</p>
              <div className="flex items-center gap-3 border border-earth/10 bg-earth/3 px-4 py-3 rounded">
                <code className="text-lg font-bold text-earth tracking-widest">{affiliate.coupon_code}</code>
                <span className="text-xs text-earth/40 ml-auto">
                  {affiliate.group === 'coupon_code' ? 'Rate capped at 10%' : 'Full rate schedule'}
                </span>
              </div>
            </div>
          )}

          <Link
            href="/affiliate/dashboard"
            className="inline-block text-sm font-semibold text-terra hover:underline"
          >
            View detailed earnings →
          </Link>
        </>
      )}
    </div>
  )
}
