'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    // TODO: wire to email marketing API (Klaviyo/Mailchimp) via server action
    await new Promise((r) => setTimeout(r, 800))
    setStatus('done')
  }

  return (
    <section className="bg-terra text-ivory py-16 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-serif text-3xl mb-3">Stay in the kitchen loop</h2>
        <p className="text-ivory/70 text-sm mb-8 leading-relaxed">
          New arrivals, recipes, care tips, and exclusive offers — straight to your inbox. No spam, ever.
        </p>
        {status === 'done' ? (
          <p className="text-ivory/90 font-medium">You&apos;re subscribed. Thank you! 🎉</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-ivory/10 border border-ivory/25 text-ivory placeholder-ivory/40 text-sm focus:outline-none focus:border-ivory/60 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-ivory text-terra text-sm font-semibold tracking-wide hover:bg-ivory/90 transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? '…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
