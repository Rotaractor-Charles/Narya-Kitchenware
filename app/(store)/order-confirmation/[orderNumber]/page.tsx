import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

type OrderItem = {
  id: number
  name: string
  image: string | null
  price: number
  quantity: number
  subtotal: number
}

type Order = {
  order_number: string
  status: string
  subtotal: number
  shipping_total: number
  tip_total: number
  total: number
  shipping_method: string | null
  payment_method: string
  payment_status: string
  items: OrderItem[]
  created_at: string
}

async function getOrder(orderNumber: string): Promise<Order | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return null

  const res = await fetch(`${API_URL}/api/v1/orders/${orderNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.data as Order
}

function fmt(cents: number): string {
  return `KSh ${(cents / 100).toLocaleString()}`
}

const PAYMENT_LABELS: Record<string, string> = {
  mpesa:         'M-Pesa',
  card:          'Card',
  bank_transfer: 'Bank Transfer',
  crypto:        'Crypto',
}

const DELIVERY_LABELS: Record<string, string> = {
  standard: 'Standard Delivery',
  express:  'Express Delivery',
  pickup:   'Pickup',
}

const POINTS_RATE = 10

type Props = { params: Promise<{ orderNumber: string }> }

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params
  const order = await getOrder(orderNumber)

  if (!order) notFound()

  const pointsEarned = Math.floor(order.subtotal / 100 / POINTS_RATE)

  return (
    <div className="min-h-[70vh] max-w-2xl mx-auto px-4 sm:px-6 py-16">

      {/* Success header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-terra/10 flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terra">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-earth mb-1">Order placed!</h1>
        <p className="text-sm text-earth/50 mb-1">Thank you — we&apos;ll send a confirmation shortly.</p>
        <p className="text-xs font-mono text-earth/35">{order.order_number}</p>
        <p className="mt-2 text-sm text-terra font-medium">+{pointsEarned} Narya Points earned</p>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-2xl border border-earth/10 p-5 mb-4">
        <h2 className="text-sm font-semibold text-earth mb-4">Items ordered</h2>
        <ul className="space-y-3">
          {order.items.map(item => (
            <li key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-earth font-medium truncate">{item.name}</p>
                <p className="text-xs text-earth/45 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-earth shrink-0">{fmt(item.subtotal)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-earth/8 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-earth/55">Subtotal</span>
            <span className="text-earth">{fmt(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-earth/55">
              Shipping{order.shipping_method ? ` (${DELIVERY_LABELS[order.shipping_method] ?? order.shipping_method})` : ''}
            </span>
            <span className="text-earth">{fmt(order.shipping_total)}</span>
          </div>
          {order.tip_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-earth/55">Tip</span>
              <span className="text-earth">{fmt(order.tip_total)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold pt-1">
            <span className="text-earth">Total</span>
            <span className="text-earth">{fmt(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment info */}
      <div className="bg-white rounded-2xl border border-earth/10 p-5 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-earth/55">Payment method</span>
          <span className="text-earth font-medium">{PAYMENT_LABELS[order.payment_method] ?? order.payment_method}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-earth/55">Payment status</span>
          <span className={`font-medium ${order.payment_status === 'paid' ? 'text-terra' : 'text-amber-600'}`}>
            {order.payment_status === 'paid' ? 'Paid' : 'Awaiting payment'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/shop"
          className="flex-1 text-center px-5 py-3 rounded-xl bg-earth text-ivory text-sm font-semibold hover:bg-earth/90 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account"
          className="flex-1 text-center px-5 py-3 rounded-xl border border-earth/20 text-earth text-sm hover:border-earth/40 transition-colors"
        >
          View My Orders
        </Link>
      </div>
    </div>
  )
}

