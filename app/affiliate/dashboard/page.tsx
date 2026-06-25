'use client'

import { useEffect, useState } from 'react'

type Row = {
  position: number
  order_id: number
  product_subtotal: number
  commission_rate: number
  commission_amount: number
  attributed_via: 'link' | 'coupon'
  status: string
}

type Breakdown = {
  month: string
  order_count: number
  total_commission: number
  breakdown: Row[]
}

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

function bandLabel(n: number): string {
  if (n <= 50)  return 'Tier 1 · 5%'
  if (n <= 100) return 'Tier 2 · 10%'
  if (n <= 200) return 'Tier 3 · 15%'
  return 'Tier 4 · 15%'
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-')
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' })
}

// Build band summary from rows (spec §3 breakdown)
function bandSummary(rows: Row[]) {
  const bands = [
    { label: 'Tier 1 (orders 1–50)',   from: 1,   to: 50,  rate: 0.05 },
    { label: 'Tier 2 (orders 51–100)', from: 51,  to: 100, rate: 0.10 },
    { label: 'Tier 3 (orders 101–200)',from: 101, to: 200, rate: 0.15 },
    { label: 'Tier 4 (orders 201+)',   from: 201, to: Infinity, rate: 0.15 },
  ]

  return bands.map(b => {
    const inBand = rows.filter(r => r.position >= b.from && r.position <= b.to)
    const commission = inBand.reduce((sum, r) => sum + r.commission_amount, 0)
    return { ...b, count: inBand.length, commission }
  }).filter(b => b.count > 0)
}

export default function AffiliateDashboard() {
  const now                        = new Date()
  const defaultMonth               = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const [month,    setMonth]       = useState(defaultMonth)
  const [data,     setData]        = useState<Breakdown | null>(null)
  const [loading,  setLoading]     = useState(true)
  const [expanded, setExpanded]    = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/affiliate/earnings?month=${month}`)
      .then(r => r.json())
      .then(d => setData(d.data ?? null))
      .finally(() => setLoading(false))
  }, [month])

  // Build month picker options: current + last 11 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return { value: val, label: monthLabel(val) }
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-earth">Earnings Breakdown</h1>
        <select
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border border-earth/20 text-sm text-earth px-3 py-2 focus:outline-none focus:border-terra bg-white"
        >
          {monthOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-12 bg-earth/5 rounded animate-pulse" />)}
        </div>
      ) : !data || data.order_count === 0 ? (
        <div className="py-16 text-center text-earth/40">
          <p>No referrals recorded for {monthLabel(month)}.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="border border-earth/10 p-4 rounded">
              <p className="text-xs text-earth/45 uppercase tracking-wider mb-1">Referrals</p>
              <p className="text-2xl font-bold text-earth">{data.order_count}</p>
            </div>
            <div className="border border-earth/10 p-4 rounded">
              <p className="text-xs text-earth/45 uppercase tracking-wider mb-1">Commission</p>
              <p className="text-2xl font-bold text-earth">{fmt(data.total_commission)}</p>
            </div>
            <div className="border border-earth/10 p-4 rounded col-span-2 sm:col-span-1">
              <p className="text-xs text-earth/45 uppercase tracking-wider mb-1">Avg per order</p>
              <p className="text-2xl font-bold text-earth">
                {data.order_count > 0 ? fmt(Math.round(data.total_commission / data.order_count)) : '—'}
              </p>
            </div>
          </div>

          {/* Band summary (spec §3 QA breakdown) */}
          <div className="mb-8">
            <h2 className="text-xs text-earth/45 uppercase tracking-wider mb-3">Commission by Band</h2>
            <div className="border border-earth/10 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-earth/3 text-earth/50 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5">Band</th>
                    <th className="text-right px-4 py-2.5">Orders</th>
                    <th className="text-right px-4 py-2.5">Rate</th>
                    <th className="text-right px-4 py-2.5">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {bandSummary(data.breakdown).map((b, i) => (
                    <tr key={i} className="border-t border-earth/8">
                      <td className="px-4 py-3 text-earth/70">{b.label}</td>
                      <td className="px-4 py-3 text-right text-earth">{b.count}</td>
                      <td className="px-4 py-3 text-right text-earth">{(b.rate * 100).toFixed(0)}%</td>
                      <td className="px-4 py-3 text-right font-medium text-earth">{fmt(b.commission)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-earth/20 bg-earth/3">
                    <td className="px-4 py-3 font-semibold text-earth" colSpan={3}>Total</td>
                    <td className="px-4 py-3 text-right font-bold text-earth">{fmt(data.total_commission)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Per-order detail (collapsed by default) */}
          <div>
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-sm text-terra font-medium hover:underline mb-3"
            >
              {expanded ? 'Hide' : 'Show'} per-order detail ({data.order_count} rows)
            </button>

            {expanded && (
              <div className="border border-earth/10 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-earth/3 text-earth/50 text-xs uppercase tracking-wider">
                      <th className="text-right px-3 py-2">#</th>
                      <th className="text-right px-3 py-2">Subtotal</th>
                      <th className="text-center px-3 py-2">Via</th>
                      <th className="text-right px-3 py-2">Rate</th>
                      <th className="text-right px-3 py-2">Commission</th>
                      <th className="text-center px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.breakdown.map(r => (
                      <tr key={r.position} className="border-t border-earth/8">
                        <td className="px-3 py-2 text-right text-earth/40">{r.position}</td>
                        <td className="px-3 py-2 text-right text-earth/70">{fmt(r.product_subtotal)}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${r.attributed_via === 'coupon' ? 'bg-purple-50 text-purple-600' : 'bg-terra/8 text-terra'}`}>
                            {r.attributed_via}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-earth/70">{(r.commission_rate * 100).toFixed(0)}%</td>
                        <td className="px-3 py-2 text-right font-medium text-earth">{fmt(r.commission_amount)}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            r.status === 'approved' || r.status === 'paid' ? 'bg-terra/10 text-terra' :
                            r.status === 'clawback' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
