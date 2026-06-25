'use client'

import { useState, useEffect, useCallback } from 'react'

type OrderItem = { name: string; quantity: number }
type Order = {
  id: number
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  total: number
  items: OrderItem[]
  user?: { name: string; email: string }
  created_at: string
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-500/15 text-amber-400',
  processing: 'bg-blue-500/15 text-blue-400',
  shipped:    'bg-indigo-500/15 text-indigo-400',
  delivered:  'bg-green-500/15 text-green-400',
  cancelled:  'bg-red-500/15 text-red-400',
}

const PAY_COLORS: Record<string, string> = {
  unpaid:   'text-amber-400',
  paid:     'text-green-400',
  refunded: 'text-red-400',
}

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString()}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

const selCls = 'appearance-none bg-[#0e1a0e] border border-white/18 rounded px-2.5 py-1.5 pr-7 text-xs text-ivory/75 focus:outline-none focus:border-sienna/50 cursor-pointer transition-colors [&>option]:bg-[#0e1a0e] [&>option]:text-ivory'

export default function AdminOrdersClient() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const qs  = new URLSearchParams()
      if (statusFilter) qs.set('status', statusFilter)
      if (search.trim()) qs.set('search', search.trim())
      const res  = await fetch(`/api/admin/orders?${qs}`)
      const data = await res.json()
      setOrders(data.data ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [statusFilter, search])

  useEffect(() => { void fetchOrders() }, [fetchOrders])

  async function updateStatus(orderId: number, status: string) {
    setUpdating(orderId)
    await fetch(`/api/admin/orders/${orderId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    })
    await fetchOrders()
    setUpdating(null)
  }

  return (
    <div className="p-5">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-ivory text-xl font-medium">Orders</h1>
        <span className="text-ivory/30 text-xs">{orders.length} total</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative inline-flex">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selCls}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 text-[10px]">▾</span>
        </div>

        <div className="flex gap-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchOrders()}
            placeholder="Order # or customer…"
            className="bg-white/5 border border-white/12 rounded px-2.5 py-1.5 text-xs text-ivory placeholder-ivory/25 focus:outline-none focus:border-white/30 w-48"
          />
          <button
            onClick={() => fetchOrders()}
            className="px-3 py-1.5 bg-white/6 border border-white/15 text-ivory/60 hover:text-ivory/90 text-xs rounded transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-ivory/25 text-sm">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-ivory/25 text-sm">No orders found.</div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Order</th>
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Date</th>
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Customer</th>
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Items</th>
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Payment</th>
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Status</th>
                <th className="text-right px-4 py-2.5 text-ivory/30 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 font-mono text-ivory/60">{order.order_number}</td>
                  <td className="px-4 py-3 text-ivory/45">{fmtDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <p className="text-ivory/70">{order.user?.name ?? '—'}</p>
                    <p className="text-ivory/30 text-[11px]">{order.user?.email ?? ''}</p>
                  </td>
                  <td className="px-4 py-3 text-ivory/50 max-w-[180px] truncate">
                    {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`capitalize text-[11px] font-medium ${PAY_COLORS[order.payment_status] ?? 'text-ivory/40'}`}>
                      {order.payment_status}
                    </span>
                    <p className="text-ivory/25 text-[11px] capitalize">{order.payment_method}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-flex">
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`appearance-none text-[11px] font-semibold px-2 py-0.5 pr-5 rounded-full border-0 cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_COLORS[order.status] ?? 'bg-white/10 text-ivory/50'} [&>option]:bg-[#0e1a0e] [&>option]:text-ivory`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[8px] opacity-50">▾</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-ivory/70 font-semibold">{fmt(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
