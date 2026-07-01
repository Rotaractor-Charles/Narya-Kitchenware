import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping & Returns Policy | Narya Kitchenware Kenya',
  description: 'Narya Kitchenware delivers to all 47 counties in Kenya. Nairobi orders in 1–2 days from KSh 200. Free delivery over KSh 7,500. 14-day free returns on unused items.',
}

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      <div className="mb-10">
        <p className="text-[11px] tracking-[0.25em] uppercase text-terra font-medium mb-2">Policies</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-earth mb-3">Shipping & Returns</h1>
        <p className="text-earth/50 text-sm">Last updated: June 2026</p>
      </div>

      <div className="space-y-10">

        {/* Shipping */}
        <section className="bg-white rounded-2xl border border-earth/10 p-6 sm:p-7">
          <h2 className="font-serif text-xl text-earth mb-5">Shipping</h2>

          <h3 className="text-sm font-semibold text-earth mb-3">Delivery Areas</h3>
          <p className="text-sm text-earth/65 mb-5 leading-relaxed">
            We currently deliver to all 47 counties in Kenya. International shipping is not available at this time but is coming soon.
          </p>

          <h3 className="text-sm font-semibold text-earth mb-3">Delivery Times & Rates</h3>
          <div className="rounded-xl border border-earth/10 overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead className="bg-ivory-dark">
                <tr>
                  <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-widest text-earth/50 font-semibold">Zone</th>
                  <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-widest text-earth/50 font-semibold">Delivery Time</th>
                  <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-widest text-earth/50 font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth/6">
                {[
                  ['Nairobi CBD & suburbs',   '1–2 business days',  'KSh 200'],
                  ['Greater Nairobi area',    '1–3 business days',  'KSh 350'],
                  ['Other major towns',       '3–5 business days',  'KSh 500'],
                  ['Remote / rural areas',    '5–7 business days',  'KSh 700'],
                  ['Orders over KSh 7,500',   'Standard timelines', 'FREE'],
                ].map(([zone, time, cost], i) => (
                  <tr key={i} className={cost === 'FREE' ? 'bg-terra/5' : ''}>
                    <td className="px-4 py-3 text-earth/70">{zone}</td>
                    <td className="px-4 py-3 text-earth/70">{time}</td>
                    <td className={`px-4 py-3 font-semibold ${cost === 'FREE' ? 'text-terra' : 'text-earth'}`}>{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-sm font-semibold text-earth mb-2">Order Processing</h3>
          <p className="text-sm text-earth/65 leading-relaxed mb-4">
            Orders placed before 2:00 PM EAT on a business day are processed and dispatched the same day. Orders placed after 2:00 PM or on weekends are dispatched the next business day.
          </p>

          <h3 className="text-sm font-semibold text-earth mb-2">Tracking Your Order</h3>
          <p className="text-sm text-earth/65 leading-relaxed">
            You will receive an SMS and email with a tracking number once your order ships. Use the{' '}
            <Link href="/orders/track" className="text-terra underline underline-offset-2">Track Your Order</Link>{' '}
            page to follow your delivery in real time.
          </p>
        </section>

        {/* Returns */}
        <section className="bg-white rounded-2xl border border-earth/10 p-6 sm:p-7">
          <h2 className="font-serif text-xl text-earth mb-5">Returns & Exchanges</h2>

          <div className="bg-terra/8 rounded-xl px-4 py-3 mb-5 text-sm text-earth/70">
            <strong className="text-earth">14-day free returns</strong> on all unused items in original packaging.
          </div>

          <h3 className="text-sm font-semibold text-earth mb-2">Eligible Items</h3>
          <p className="text-sm text-earth/65 leading-relaxed mb-4">
            Items must be unused, in their original packaging, and returned within 14 days of the delivery date. We cannot accept returns on items that have been used, washed, or damaged after delivery.
          </p>

          <h3 className="text-sm font-semibold text-earth mb-2">How to Return</h3>
          <ol className="space-y-2 mb-5">
            {[
              'Contact us at hello@naryakitchenware.co.ke with your order number and the reason for return.',
              'We\'ll send you a prepaid return label within 1 business day.',
              'Package the item securely in its original box and attach the label.',
              'Drop it at any Posta Kenya or G4S drop point.',
              'Refunds are processed within 3–5 business days of us receiving the item.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-earth/65">
                <span className="shrink-0 w-5 h-5 rounded-full bg-earth text-ivory text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>

          <h3 className="text-sm font-semibold text-earth mb-2">Damaged or Incorrect Items</h3>
          <p className="text-sm text-earth/65 leading-relaxed mb-4">
            If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with a photo. We will replace the item at no cost and arrange collection of the incorrect one.
          </p>

          <h3 className="text-sm font-semibold text-earth mb-2">Refunds</h3>
          <p className="text-sm text-earth/65 leading-relaxed">
            Refunds are issued to the original payment method. M-Pesa refunds are processed within 24 hours; card refunds may take 5–10 business days depending on your bank.
          </p>
        </section>

        {/* Non-returnable */}
        <section className="bg-white rounded-2xl border border-earth/10 p-6 sm:p-7">
          <h2 className="font-serif text-xl text-earth mb-4">Non-Returnable Items</h2>
          <ul className="space-y-2">
            {[
              'Items marked as "Final Sale" or purchased at clearance price',
              'Gift cards and Narya Points redemptions',
              'Items returned after 14 days of delivery',
              'Items that have been used, washed, or modified',
              'Items without original packaging',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-earth/65">
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

      </div>

      <div className="mt-10 text-center">
        <p className="text-earth/45 text-sm mb-3">Still have questions about shipping or returns?</p>
        <Link href="/contact" className="inline-block bg-earth text-ivory px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors">
          Contact Us
        </Link>
      </div>
    </div>
  )
}
