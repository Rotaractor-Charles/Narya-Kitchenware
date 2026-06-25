import Image from 'next/image'
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

type ShippingAddress = {
  name?: string
  phone?: string
  address_line_1?: string
  address_line_2?: string | null
  city?: string
  county?: string | null
  country?: string
  postal_code?: string | null
}

type Order = {
  order_number: string
  status: string
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  tip_total: number
  total: number
  shipping_method: string | null
  payment_method: string
  payment_status: string
  shipping_address: ShippingAddress | null
  items: OrderItem[]
  created_at: string
}

type Props = { params: Promise<{ orderNumber: string }> }

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-indigo-50 text-indigo-600',
  delivered: 'bg-terra/10 text-terra',
  cancelled: 'bg-red-50 text-red-500',
}

const PAYMENT_LABELS: Record<string, string> = {
  mpesa: 'M-Pesa',
  card: 'Card',
  bank_transfer: 'Bank Transfer',
  crypto: 'Crypto',
}

const DELIVERY_LABELS: Record<string, string> = {
  standard: 'Standard Delivery',
  express: 'Express Delivery',
  pickup: 'Pickup',
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

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function OrderDetailsPage({ params }: Props) {
  const { orderNumber } = await params
  const order = await getOrder(orderNumber)

  if (!order) notFound()

  const address = order.shipping_address

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <Link href="/account?tab=orders" className="text-sm text-earth/45 hover:text-earth transition-colors">
          Back to orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-earth/45">{order.order_number}</p>
          <h1 className="mt-1 font-serif text-3xl text-earth">Order details</h1>
          <p className="mt-2 text-sm text-earth/45">{fmtDate(order.created_at)}</p>
        </div>
        <span className={`w-fit text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-earth/10 text-earth'}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5">
        <div className="space-y-5">
          <section className="bg-white rounded-2xl border border-earth/10 p-5">
            <h2 className="text-sm font-semibold text-earth mb-4">Items ordered</h2>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-4 items-center">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-ivory-dark">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-earth truncate">{item.name}</p>
                    <p className="mt-1 text-xs text-earth/45">
                      Qty: {item.quantity} x {fmt(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-earth whitespace-nowrap">{fmt(item.subtotal)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-earth/10 p-5">
            <h2 className="text-sm font-semibold text-earth mb-4">Shipping details</h2>
            {address ? (
              <div className="space-y-1 text-sm text-earth/55">
                <p className="font-medium text-earth">{address.name}</p>
                <p>{address.phone}</p>
                <p>{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p>
                  {[address.city, address.county, address.postal_code].filter(Boolean).join(', ')}
                </p>
                <p>{address.country}</p>
              </div>
            ) : (
              <p className="text-sm text-earth/45">No shipping address was saved for this order.</p>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="bg-white rounded-2xl border border-earth/10 p-5">
            <h2 className="text-sm font-semibold text-earth mb-4">Order summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-earth/55">Subtotal</span>
                <span className="text-earth">{fmt(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth/55">Shipping</span>
                <span className="text-earth">{fmt(order.shipping_total)}</span>
              </div>
              {order.discount_total > 0 && (
                <div className="flex justify-between">
                  <span className="text-terra">Discount</span>
                  <span className="text-terra">-{fmt(order.discount_total)}</span>
                </div>
              )}
              {order.tip_total > 0 && (
                <div className="flex justify-between">
                  <span className="text-earth/55">Tip</span>
                  <span className="text-earth">{fmt(order.tip_total)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-earth/8 pt-3 font-semibold">
                <span className="text-earth">Total</span>
                <span className="text-earth">{fmt(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-earth/10 p-5">
            <h2 className="text-sm font-semibold text-earth mb-4">Payment and delivery</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-earth/55">Payment method</span>
                <span className="text-earth font-medium">{PAYMENT_LABELS[order.payment_method] ?? order.payment_method}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-earth/55">Payment status</span>
                <span className={`font-medium capitalize ${order.payment_status === 'paid' ? 'text-terra' : 'text-amber-600'}`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-earth/55">Delivery</span>
                <span className="text-earth font-medium">
                  {order.shipping_method ? DELIVERY_LABELS[order.shipping_method] ?? order.shipping_method : 'Not set'}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
