'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export default function TrackOrderClient() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const value = orderNumber.trim().toUpperCase()
    if (!value) {
      setError('Enter your order number.')
      return
    }

    router.push(`/orders/${encodeURIComponent(value)}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <section>
          <p className="text-[11px] tracking-[0.25em] uppercase text-terra font-medium mb-4">
            Order Tracking
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-earth leading-tight">
            Track your Narya order
          </h1>
          <p className="mt-5 text-earth/55 leading-relaxed max-w-md">
            Enter the order number from your confirmation message to view the latest status, payment details,
            delivery method, and items ordered.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-earth/10 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] text-earth/45 uppercase tracking-widest mb-1.5">
                Order number
              </label>
              <input
                value={orderNumber}
                onChange={(event) => {
                  setOrderNumber(event.target.value.toUpperCase())
                  setError('')
                }}
                placeholder="NRY-XXXXXXXX"
                className="w-full border border-earth/15 rounded-xl px-4 py-3 text-sm text-earth uppercase placeholder:normal-case placeholder:text-earth/30 focus:outline-none focus:border-terra transition-colors"
              />
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-earth text-ivory py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors"
            >
              Track Order
            </button>
          </form>

          <div className="mt-6 border-t border-earth/8 pt-5 text-sm text-earth/50 space-y-2">
            <p>Signed in customers can also view all orders from their account.</p>
            <Link href="/account?tab=orders" className="inline-flex text-terra hover:text-terra/75 transition-colors">
              View my orders
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
