'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import type { Review, ReviewMeta } from '@/lib/types'

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 12 12" width="14" height="14"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1"
      className={filled ? 'text-amber-400' : 'text-earth/20'}>
      <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/>
    </svg>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="text-amber-400 transition-transform hover:scale-110"
        >
          <StarIcon filled={n <= (hover || value)} />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-5 border-b border-earth/8 last:border-0">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-terra/10 flex items-center justify-center text-xs font-semibold text-terra">
          {review.reviewer.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-earth">{review.reviewer}</p>
          <p className="text-xs text-earth/40">
            {new Date(review.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="ml-auto flex gap-0.5">
          {[1,2,3,4,5].map(n => <StarIcon key={n} filled={n <= review.rating} />)}
        </div>
      </div>
      {review.title && <p className="text-sm font-medium text-earth mb-1">{review.title}</p>}
      <p className="text-sm text-earth/65 leading-relaxed">{review.body}</p>
    </div>
  )
}

export default function ProductReviews({ slug }: { slug: string }) {
  const { user } = useAuth()

  const [reviews, setReviews]   = useState<Review[]>([])
  const [meta,    setMeta]      = useState<ReviewMeta | null>(null)
  const [loading, setLoading]   = useState(true)
  const [page,    setPage]      = useState(1)

  const [showForm,     setShowForm]     = useState(false)
  const [submitted,    setSubmitted]    = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const [formError,    setFormError]    = useState<string | null>(null)

  const [rating, setRating] = useState(5)
  const [title,  setTitle]  = useState('')
  const [body,   setBody]   = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products/${slug}/reviews?page=${page}`)
      .then(r => r.json())
      .then(data => {
        setReviews(data.data ?? [])
        setMeta(data.meta ?? null)
      })
      .finally(() => setLoading(false))
  }, [slug, page])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    setFormError(null)

    const res = await fetch(`/api/products/${slug}/reviews`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, title: title || null, body }),
    })
    const data = await res.json()

    if (!res.ok) {
      setFormError(data.message ?? 'Something went wrong.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setShowForm(false)
    setSubmitting(false)
  }

  const avg = meta?.average ? parseFloat(meta.average) : 0

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-earth">Customer Reviews</h2>
          {meta && meta.count > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(n => <StarIcon key={n} filled={n <= Math.round(avg)} />)}
              </div>
              <span className="text-sm text-earth/50">{avg.toFixed(1)} out of 5 ({meta.count} reviews)</span>
            </div>
          )}
        </div>

        {user && !submitted && (
          <button
            onClick={() => setShowForm(s => !s)}
            className="text-sm font-medium border border-earth/20 text-earth px-4 py-2 hover:bg-earth hover:text-ivory transition-colors"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
        {!user && (
          <p className="text-sm text-earth/40">
            <a href="/account/login" className="underline hover:text-earth">Sign in</a> to write a review
          </p>
        )}
      </div>

      {submitted && (
        <div className="mb-6 bg-terra/5 border border-terra/20 text-terra text-sm px-4 py-3">
          Thank you! Your review has been submitted and is pending approval.
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-earth/10 bg-ivory/50 space-y-4">
          <h3 className="text-sm font-medium text-earth">Your Review</h3>

          <div>
            <label className="block text-xs text-earth/60 mb-1">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-xs text-earth/60 mb-1">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Summarise your experience"
              className="w-full border border-earth/20 bg-white px-3 py-2 text-sm text-earth placeholder:text-earth/30 focus:outline-none focus:border-terra"
            />
          </div>

          <div>
            <label className="block text-xs text-earth/60 mb-1">Review *</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              minLength={10}
              rows={4}
              placeholder="What did you think of this product?"
              className="w-full border border-earth/20 bg-white px-3 py-2 text-sm text-earth placeholder:text-earth/30 focus:outline-none focus:border-terra resize-none"
            />
          </div>

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="bg-earth text-ivory text-sm font-semibold px-6 py-2.5 hover:bg-terra transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="py-5 border-b border-earth/8">
              <div className="h-3 bg-earth/8 rounded w-32 mb-3 animate-pulse" />
              <div className="h-3 bg-earth/5 rounded w-full mb-1.5 animate-pulse" />
              <div className="h-3 bg-earth/5 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center text-earth/40 text-sm">
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        <>
          <div>
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-earth/20 text-earth disabled:opacity-30 hover:bg-earth hover:text-ivory transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-earth/50">{page} / {meta.last_page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === meta.last_page}
                className="px-3 py-1.5 text-xs border border-earth/20 text-earth disabled:opacity-30 hover:bg-earth hover:text-ivory transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
