'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import type { Address } from '@/lib/types'

type OrderItem = {
  id: number
  name: string
  quantity: number
  subtotal: number
}

type Order = {
  id: number
  order_number: string
  status: string
  total: number
  payment_status: string
  items: OrderItem[]
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-50 text-blue-600',
  shipped:    'bg-indigo-50 text-indigo-600',
  delivered:  'bg-terra/10 text-terra',
  cancelled:  'bg-red-50 text-red-500',
}

function fmt(cents: number): string {
  return `KSh ${(cents / 100).toLocaleString()}`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

type Tab = 'overview' | 'orders' | 'settings'
type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer' | 'crypto'
type ShippingForm = Omit<Address, 'id' | 'is_default'>

const EMPTY_SHIPPING: ShippingForm = {
  name: '',
  phone: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  county: '',
  country: 'KE',
  postal_code: '',
}

const PAYMENT_OPTIONS: [PaymentMethod, string, string][] = [
  ['mpesa', 'M-Pesa', 'Pay via M-Pesa Paybill'],
  ['card', 'Card', 'Visa or Mastercard'],
  ['bank_transfer', 'Bank Transfer', 'Direct bank deposit'],
  ['crypto', 'Crypto', 'Pay with supported crypto'],
]

function addressToForm(address: Address | null | undefined, fallbackName: string): ShippingForm {
  if (!address) return { ...EMPTY_SHIPPING, name: fallbackName }
  return {
    name: address.name ?? fallbackName,
    phone: address.phone ?? '',
    address_line_1: address.address_line_1 ?? '',
    address_line_2: address.address_line_2 ?? '',
    city: address.city ?? '',
    county: address.county ?? '',
    country: address.country ?? 'KE',
    postal_code: address.postal_code ?? '',
  }
}

export default function AccountClient() {
  const router       = useRouter()
  const { user, logout } = useAuth()
  const [tab,    setTab]    = useState<Tab>('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [shipping, setShipping] = useState<ShippingForm>(() => addressToForm(user?.default_address, user?.name ?? ''))
  const [payment, setPayment] = useState<PaymentMethod>((user?.default_payment_method ?? 'mpesa') as PaymentMethod)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [pointsBalance, setPointsBalance] = useState(user?.points_balance ?? 0)

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab')
    if (requestedTab === 'overview' || requestedTab === 'orders' || requestedTab === 'settings') {
      setTab(requestedTab)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    setLoadingOrders(true)
    fetch('/api/orders')
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => setOrders((d.data ?? []) as Order[]))
      .catch(() => {})
      .finally(() => setLoadingOrders(false))
  }, [user])

  useEffect(() => {
    if (!user) return

    setShipping(addressToForm(user.default_address, user.name))
    setPayment((user.default_payment_method ?? 'mpesa') as PaymentMethod)

    fetch('/api/auth/profile')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        const profile = data?.user
        if (!profile) return
        setShipping(addressToForm(profile.default_address, profile.name ?? user.name))
        setPayment((profile.default_payment_method ?? 'mpesa') as PaymentMethod)
        setPointsBalance(profile.points_balance ?? 0)
      })
      .catch(() => {})
  }, [user])

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-xl text-earth mb-2">Sign in to view your account</h2>
        <Link href="/login" className="mt-4 px-6 py-2.5 bg-earth text-ivory text-sm font-semibold rounded-xl hover:bg-earth/90 transition-colors">
          Sign in
        </Link>
      </div>
    )
  }

  const avatar   = user.name.charAt(0).toUpperCase()

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  function updateShipping<K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) {
    setShipping(prev => ({ ...prev, [key]: value }))
    setProfileMessage(null)
  }

  async function saveProfileDefaults() {
    setSavingProfile(true)
    setProfileMessage(null)

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          default_payment_method: payment,
          default_address: {
            ...shipping,
            address_line_2: shipping.address_line_2 || null,
            county: shipping.county || null,
            postal_code: shipping.postal_code || null,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const message = data?.errors
          ? Object.values(data.errors as Record<string, string[]>).flat().join(' ')
          : data?.message
        throw new Error(message ?? 'Could not save profile.')
      }

      setShipping(addressToForm(data.user.default_address, data.user.name))
      setPayment((data.user.default_payment_method ?? 'mpesa') as PaymentMethod)
      setProfileMessage({ type: 'ok', text: 'Profile details saved.' })
    } catch (error) {
      setProfileMessage({
        type: 'err',
        text: error instanceof Error ? error.message : 'Could not save profile.',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Profile header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-earth flex items-center justify-center shrink-0">
          <span className="text-ivory font-serif text-2xl">{avatar}</span>
        </div>
        <div>
          <h1 className="font-serif text-2xl text-earth">{user.name}</h1>
          <p className="text-sm text-earth/50">{user.email}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Orders',       value: orders.length },
          { label: 'Narya Points', value: pointsBalance.toLocaleString() },
          { label: 'Member since', value: new Date(user.created_at ?? Date.now()).getFullYear().toString() },
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
          ['overview', 'Overview'],
          ['orders',   'Orders'],
          ['settings', 'Settings'],
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
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-earth">Recent Order</h2>
              <button onClick={() => setTab('orders')} className="text-xs text-terra hover:text-terra/70 transition-colors">
                View all →
              </button>
            </div>
            {loadingOrders ? (
              <div className="bg-white rounded-2xl border border-earth/10 p-4 text-sm text-earth/40">Loading…</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-earth/10 p-4 text-sm text-earth/40">No orders yet.</div>
            ) : (
              <Link href={`/orders/${orders[0].order_number}`} className="block bg-white rounded-2xl border border-earth/10 p-4 hover:border-terra/35 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-earth/50">{orders[0].order_number}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[orders[0].status] ?? 'bg-earth/10 text-earth'}`}>
                    {orders[0].status}
                  </span>
                </div>
                <p className="text-sm text-earth">{orders[0].items.map(i => i.name).join(', ')}</p>
                <div className="flex justify-between mt-2 text-xs text-earth/45">
                  <span>{fmtDate(orders[0].created_at)}</span>
                  <span className="font-semibold text-earth">{fmt(orders[0].total)}</span>
                </div>
              </Link>
            )}
          </div>

          <div className="bg-earth rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-sienna/80 uppercase tracking-widest mb-1">Narya Points</p>
              <p className="font-serif text-4xl text-ivory">{pointsBalance.toLocaleString()}</p>
              <p className="text-xs text-ivory/40 mt-1 italic">Tend it, watch it bloom.</p>
            </div>
            <Link
              href="/rewards"
              className="bg-sienna/20 hover:bg-sienna/30 text-ivory text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              View Rewards
            </Link>
          </div>
        </div>
      )}

      {/* ── Orders ── */}
      {tab === 'orders' && (
        <div className="space-y-3">
          {loadingOrders ? (
            <p className="text-sm text-earth/40">Loading orders…</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-earth/40 mb-4">No orders yet.</p>
              <Link href="/shop" className="text-sm text-terra hover:text-terra/70 font-medium transition-colors">
                Start shopping →
              </Link>
            </div>
          ) : orders.map(o => (
            <Link key={o.id} href={`/orders/${o.order_number}`} className="block bg-white rounded-2xl border border-earth/10 p-4 sm:p-5 hover:border-terra/35 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-xs font-mono text-earth/50 mb-0.5">{o.order_number}</p>
                  <p className="text-sm text-earth font-medium">{o.items.map(i => i.name).join(', ')}</p>
                </div>
                <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[o.status] ?? 'bg-earth/10 text-earth'}`}>
                  {o.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-earth/6">
                <span className="text-xs text-earth/45">{fmtDate(o.created_at)}</span>
                <span className="text-sm font-semibold text-earth">{fmt(o.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Settings ── */}
      {tab === 'settings' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-earth/10 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-earth">Shipping Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">Full name</label>
                <input value={shipping.name} onChange={e => updateShipping('name', e.target.value)} className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">Phone</label>
                <input value={shipping.phone} onChange={e => updateShipping('phone', e.target.value)} className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">City</label>
                <input value={shipping.city} onChange={e => updateShipping('city', e.target.value)} className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">Address</label>
                <input value={shipping.address_line_1} onChange={e => updateShipping('address_line_1', e.target.value)} className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">Address line 2</label>
                <input value={shipping.address_line_2 ?? ''} onChange={e => updateShipping('address_line_2', e.target.value)} className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">County</label>
                <input value={shipping.county ?? ''} onChange={e => updateShipping('county', e.target.value)} className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">Postal code</label>
                <input value={shipping.postal_code ?? ''} onChange={e => updateShipping('postal_code', e.target.value)} className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">Country</label>
                <input value={shipping.country} onChange={e => updateShipping('country', e.target.value.toUpperCase().slice(0, 2))} className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-earth/10 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-earth">Payment Details</h2>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map(([value, label, desc]) => (
                <label key={value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${payment === value ? 'border-terra bg-terra/5' : 'border-earth/10 hover:border-earth/25'}`}>
                  <input type="radio" name="profile-payment" value={value} checked={payment === value} onChange={() => { setPayment(value); setProfileMessage(null) }} className="accent-terra" />
                  <div>
                    <p className="text-sm font-medium text-earth">{label}</p>
                    <p className="text-xs text-earth/45">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {profileMessage && (
            <p className={`text-sm ${profileMessage.type === 'ok' ? 'text-terra' : 'text-red-500'}`}>
              {profileMessage.text}
            </p>
          )}

          <button
            onClick={() => void saveProfileDefaults()}
            disabled={savingProfile}
            className="bg-earth text-ivory text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-earth/90 transition-colors disabled:opacity-60"
          >
            {savingProfile ? 'Saving...' : 'Save Shipping & Payment Details'}
          </button>

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

          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
