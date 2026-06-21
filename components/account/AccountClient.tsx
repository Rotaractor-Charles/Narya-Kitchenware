'use client'

import Link from 'next/link'
import { useState } from 'react'

const USER = {
  name: 'Jane Wanjiku',
  email: 'jane.wanjiku@gmail.com',
  phone: '+254 712 345 678',
  joined: 'March 2025',
  tier: 'Cultivator',
  points: 1180,
  avatar: 'J',
}

const ORDERS = [
  {
    id: 'NRY-10042',
    date: 'Jun 18, 2026',
    status: 'Delivered',
    items: ['Cast Iron Skillet 10"', 'Ceramic Mixing Bowl Set'],
    total: 9350,
  },
  {
    id: 'NRY-10031',
    date: 'May 20, 2026',
    status: 'Delivered',
    items: ["Chef's Knife Set"],
    total: 5800,
  },
  {
    id: 'NRY-10019',
    date: 'Apr 12, 2026',
    status: 'Delivered',
    items: ['Loaf Pan', 'Silicone Utensil Set'],
    total: 3600,
  },
]

const ADDRESSES = [
  {
    id: 1,
    label: 'Home',
    default: true,
    name: 'Jane Wanjiku',
    line1: '14 Waiyaki Way, Westlands',
    city: 'Nairobi',
    postal: '00100',
  },
  {
    id: 2,
    label: 'Office',
    default: false,
    name: 'Jane Wanjiku',
    line1: '2nd Floor, Upper Hill Court',
    city: 'Nairobi',
    postal: '00200',
  },
]

const STATUS_COLORS: Record<string, string> = {
  Delivered:  'bg-terra/10 text-terra',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped:    'bg-blue-50 text-blue-600',
  Cancelled:  'bg-red-50 text-red-500',
}

type Tab = 'overview' | 'orders' | 'addresses' | 'settings'

export default function AccountClient() {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Profile header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-earth flex items-center justify-center shrink-0">
          <span className="text-ivory font-serif text-2xl">{USER.avatar}</span>
        </div>
        <div>
          <h1 className="font-serif text-2xl text-earth">{USER.name}</h1>
          <p className="text-sm text-earth/50">{USER.email}</p>
          <span className="inline-block mt-1 text-[10px] font-semibold tracking-widest uppercase bg-sienna/15 text-terra px-2 py-0.5 rounded-full">
            {USER.tier}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Orders',       value: ORDERS.length },
          { label: 'Narya Points', value: USER.points.toLocaleString() },
          { label: 'Member since', value: USER.joined },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-earth/10 px-4 py-4 text-center">
            <p className="font-serif text-xl text-earth">{s.value}</p>
            <p className="text-[11px] text-earth/45 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-earth/10 mb-6 overflow-x-auto">
        {([
          ['overview',   'Overview'],
          ['orders',     'Orders'],
          ['addresses',  'Addresses'],
          ['settings',   'Settings'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === key
                ? 'border-terra text-terra'
                : 'border-transparent text-earth/50 hover:text-earth'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Recent order */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-earth">Recent Order</h2>
              <button onClick={() => setTab('orders')} className="text-xs text-terra hover:text-terra/70 transition-colors">
                View all →
              </button>
            </div>
            {ORDERS.slice(0, 1).map(o => (
              <div key={o.id} className="bg-white rounded-2xl border border-earth/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-earth/50">{o.id}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </span>
                </div>
                <p className="text-sm text-earth">{o.items.join(', ')}</p>
                <div className="flex justify-between mt-2 text-xs text-earth/45">
                  <span>{o.date}</span>
                  <span className="font-semibold text-earth">KSh {o.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Points summary */}
          <div className="bg-earth rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-sienna/80 uppercase tracking-widest mb-1">Narya Points</p>
              <p className="font-serif text-4xl text-ivory">{USER.points.toLocaleString()}</p>
              <p className="text-xs text-ivory/40 mt-1 italic">Tend it, watch it bloom.</p>
            </div>
            <Link
              href="/rewards"
              className="bg-sienna/20 hover:bg-sienna/30 text-ivory text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              View Rewards
            </Link>
          </div>

          {/* Default address */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-earth">Default Address</h2>
              <button onClick={() => setTab('addresses')} className="text-xs text-terra hover:text-terra/70 transition-colors">
                Manage →
              </button>
            </div>
            {ADDRESSES.filter(a => a.default).map(a => (
              <div key={a.id} className="bg-white rounded-2xl border border-earth/10 p-4">
                <p className="text-sm font-medium text-earth">{a.name}</p>
                <p className="text-sm text-earth/55">{a.line1}</p>
                <p className="text-sm text-earth/55">{a.city}, {a.postal}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Orders ── */}
      {tab === 'orders' && (
        <div className="space-y-3">
          {ORDERS.map(o => (
            <div key={o.id} className="bg-white rounded-2xl border border-earth/10 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-xs font-mono text-earth/50 mb-0.5">{o.id}</p>
                  <p className="text-sm text-earth font-medium">{o.items.join(', ')}</p>
                </div>
                <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>
                  {o.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-earth/6">
                <span className="text-xs text-earth/45">{o.date}</span>
                <span className="text-sm font-semibold text-earth">KSh {o.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Addresses ── */}
      {tab === 'addresses' && (
        <div className="space-y-3">
          {ADDRESSES.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-earth/10 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-earth">{a.label}</p>
                    {a.default && (
                      <span className="text-[10px] bg-terra/10 text-terra px-2 py-0.5 rounded-full font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-earth/60">{a.name}</p>
                  <p className="text-sm text-earth/60">{a.line1}</p>
                  <p className="text-sm text-earth/60">{a.city}, {a.postal}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="text-xs text-terra hover:text-terra/70 transition-colors">Edit</button>
                  {!a.default && (
                    <button className="text-xs text-earth/40 hover:text-red-500 transition-colors">Remove</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button className="w-full rounded-2xl border-2 border-dashed border-earth/15 py-4 text-sm text-earth/40 hover:border-terra hover:text-terra transition-colors">
            + Add new address
          </button>
        </div>
      )}

      {/* ── Settings ── */}
      {tab === 'settings' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-earth/10 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-earth">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'First name', value: 'Jane' },
                { label: 'Last name',  value: 'Wanjiku' },
                { label: 'Email',      value: USER.email },
                { label: 'Phone',      value: USER.phone },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">
                    {f.label}
                  </label>
                  <input
                    defaultValue={f.value}
                    className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
              ))}
            </div>
            <button className="bg-earth text-ivory text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-earth/90 transition-colors">
              Save Changes
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-earth/10 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-earth">Change Password</h2>
            {['Current password', 'New password', 'Confirm new password'].map(f => (
              <div key={f}>
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">{f}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors"
                />
              </div>
            ))}
            <button className="bg-earth text-ivory text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-earth/90 transition-colors">
              Update Password
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-earth/10 p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-earth mb-3">Notifications</h2>
            {[
              { label: 'Order updates',       desc: 'Shipping and delivery status' },
              { label: 'Promotions & offers', desc: 'Sales, discounts, and new arrivals' },
              { label: 'Points activity',     desc: 'Earn, redeem, and tier changes' },
            ].map((n, i) => (
              <label key={n.label} className={`flex items-start justify-between gap-4 py-3 ${i > 0 ? 'border-t border-earth/6' : ''} cursor-pointer`}>
                <div>
                  <p className="text-sm text-earth font-medium">{n.label}</p>
                  <p className="text-xs text-earth/45">{n.desc}</p>
                </div>
                <div className="relative shrink-0 mt-0.5">
                  <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                  <div className="w-9 h-5 bg-earth/15 peer-checked:bg-terra rounded-full transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            ))}
          </div>

          <button className="text-sm text-red-400 hover:text-red-600 transition-colors">
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
