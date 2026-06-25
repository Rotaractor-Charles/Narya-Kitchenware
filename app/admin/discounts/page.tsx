'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Coupon {
  id: number
  code: string
  is_active: boolean
}

interface SaleProduct {
  id: number
  name: string
  slug: string
  price: number
  compare_at_price: number
}

function formatKES(cents: number) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

function discountPct(price: number, compareAt: number) {
  return Math.round(((compareAt - price) / compareAt) * 100)
}

export default function AdminDiscountsPage() {
  const [coupons,   setCoupons]   = useState<Coupon[]>([])
  const [saleProd,  setSaleProd]  = useState<SaleProduct[]>([])
  const [loadingC,  setLoadingC]  = useState(true)
  const [loadingP,  setLoadingP]  = useState(true)

  useEffect(() => {
    fetch('/api/admin/coupons')
      .then(r => r.json())
      .then(d => setCoupons(d.data ?? []))
      .finally(() => setLoadingC(false))

    fetch('/api/admin/products?on_sale=true&per_page=100')
      .then(r => r.json())
      .then(d => {
        const items = (d.data ?? []) as SaleProduct[]
        setSaleProd(items.filter((p: SaleProduct) => p.compare_at_price && p.compare_at_price > p.price))
      })
      .finally(() => setLoadingP(false))
  }, [])

  const activeCoupons = coupons.filter(c => c.is_active)

  return (
    <div className="p-5 max-w-4xl space-y-6">
      <h1 className="text-ivory text-xl font-medium">Discounts</h1>

      {/* Coupon Codes summary */}
      <section className="bg-[#1a2a1a] border border-white/8 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-ivory/60 text-xs font-semibold uppercase tracking-widest mb-1">Coupon Codes</h2>
            {loadingC ? (
              <div className="h-8 w-24 bg-ivory/5 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-ivory font-serif text-3xl">{activeCoupons.length}</p>
                <p className="text-ivory/30 text-[11px] mt-0.5">{coupons.length} total, {activeCoupons.length} active</p>
              </>
            )}
          </div>
          <Link
            href="/admin/coupons"
            className="text-xs px-3 py-1.5 border border-ivory/15 text-ivory/50 rounded-lg hover:text-ivory hover:border-ivory/30 transition-colors"
          >
            Manage coupons →
          </Link>
        </div>
        {!loadingC && activeCoupons.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activeCoupons.slice(0, 10).map(c => (
              <span key={c.id} className="text-[11px] font-mono bg-terra/15 text-terra px-2 py-0.5 rounded">
                {c.code}
              </span>
            ))}
            {activeCoupons.length > 10 && (
              <span className="text-[11px] text-ivory/25">+{activeCoupons.length - 10} more</span>
            )}
          </div>
        )}
      </section>

      {/* Products on Sale */}
      <section className="bg-[#1a2a1a] border border-white/8 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-ivory/60 text-xs font-semibold uppercase tracking-widest mb-1">Products on Sale</h2>
            {loadingP ? (
              <div className="h-8 w-24 bg-ivory/5 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-ivory font-serif text-3xl">{saleProd.length}</p>
                <p className="text-ivory/30 text-[11px] mt-0.5">with a compare-at price set</p>
              </>
            )}
          </div>
          <Link
            href="/admin/products"
            className="text-xs px-3 py-1.5 border border-ivory/15 text-ivory/50 rounded-lg hover:text-ivory hover:border-ivory/30 transition-colors"
          >
            All products →
          </Link>
        </div>

        {loadingP ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-10 bg-ivory/5 rounded animate-pulse" />)}
          </div>
        ) : saleProd.length === 0 ? (
          <p className="text-ivory/25 text-xs">No products currently on sale. Set a compare-at price on a product to mark it as on sale.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left text-ivory/30 font-medium pb-2 pr-4">Product</th>
                  <th className="text-right text-ivory/30 font-medium pb-2 pr-4">Sale price</th>
                  <th className="text-right text-ivory/30 font-medium pb-2 pr-4">Was</th>
                  <th className="text-right text-ivory/30 font-medium pb-2 pr-4">Saving</th>
                  <th className="text-right text-ivory/30 font-medium pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {saleProd.map(p => (
                  <tr key={p.id} className="group">
                    <td className="py-2.5 pr-4 text-ivory/80">{p.name}</td>
                    <td className="py-2.5 pr-4 text-right text-terra font-medium">{formatKES(p.price)}</td>
                    <td className="py-2.5 pr-4 text-right text-ivory/40 line-through">{formatKES(p.compare_at_price)}</td>
                    <td className="py-2.5 pr-4 text-right">
                      <span className="bg-sienna/20 text-sienna px-1.5 py-0.5 rounded text-[10px] font-medium">
                        -{discountPct(p.price, p.compare_at_price)}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-ivory/30 hover:text-ivory opacity-0 group-hover:opacity-100 transition-opacity text-[11px]"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
