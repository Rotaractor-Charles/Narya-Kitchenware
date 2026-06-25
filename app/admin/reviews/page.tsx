'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Review } from '@/lib/types'

type AdminReview = Review & { product: { id: number; name: string; slug: string } | null }

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} viewBox="0 0 12 12" width="11" height="11"
          fill={i <= n ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1"
          className={i <= n ? 'text-amber-400' : 'text-ivory/15'}>
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/>
        </svg>
      ))}
    </div>
  )
}

export default function AdminReviewsPage() {
  const [reviews,  setReviews]  = useState<AdminReview[]>([])
  const [loading,  setLoading]  = useState(true)
  const [status,   setStatus]   = useState<'all' | 'pending' | 'approved'>('all')
  const [search,   setSearch]   = useState('')
  const [page,     setPage]     = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total,    setTotal]    = useState(0)
  const [busy,     setBusy]     = useState<number | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const qs = new URLSearchParams({ page: String(page) })
    if (status !== 'all') qs.set('status', status)
    if (search) qs.set('search', search)

    fetch(`/api/admin/reviews?${qs}`)
      .then(r => r.json())
      .then(data => {
        setReviews(data.data ?? [])
        setLastPage(data.meta?.last_page ?? 1)
        setTotal(data.meta?.total ?? 0)
      })
      .finally(() => setLoading(false))
  }, [status, search, page])

  useEffect(() => { load() }, [load])

  async function setApproved(id: number, approved: boolean) {
    setBusy(id)
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_approved: approved }),
    })
    if (res.ok) {
      const data = await res.json()
      setReviews(prev => prev.map(r => r.id === id ? { ...r, ...data.data } : r))
    }
    setBusy(null)
  }

  async function deleteReview(id: number) {
    if (!confirm('Delete this review?')) return
    setBusy(id)
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    setReviews(prev => prev.filter(r => r.id !== id))
    setTotal(t => t - 1)
    setBusy(null)
  }

  const pendingCount = reviews.filter(r => !r.is_approved).length

  return (
    <div className="p-5 max-w-5xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-ivory text-xl font-medium">Reviews</h1>
          <p className="text-ivory/30 text-xs mt-0.5">{total} total</p>
        </div>
        {pendingCount > 0 && status === 'all' && (
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex border border-ivory/10 rounded overflow-hidden">
          {(['all', 'pending', 'approved'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 text-xs capitalize transition-colors ${
                status === s
                  ? 'bg-terra text-ivory'
                  : 'text-ivory/40 hover:text-ivory'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Filter by product…"
          className="bg-ivory/5 border border-ivory/10 text-ivory text-xs px-3 py-1.5 rounded focus:outline-none focus:border-terra/50 w-48 placeholder:text-ivory/20"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-ivory/5 rounded animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-ivory/30 text-sm">No reviews found.</p>
      ) : (
        <div className="space-y-1">
          {reviews.map(r => (
            <div key={r.id} className="bg-ivory/5 rounded p-4 group">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StarRow n={r.rating} />
                    {r.title && <span className="text-xs font-medium text-ivory truncate">{r.title}</span>}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      r.is_approved ? 'bg-terra/20 text-terra' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {r.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-ivory/60 text-xs leading-relaxed line-clamp-2 mb-1.5">{r.body}</p>
                  <div className="flex items-center gap-3 text-xs text-ivory/30">
                    <span>{r.reviewer}</span>
                    {r.product && (
                      <span className="text-ivory/20">
                        on <span className="text-ivory/40">{r.product.name}</span>
                      </span>
                    )}
                    <span>
                      {new Date(r.created_at).toLocaleDateString('en-KE', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {!r.is_approved ? (
                    <button
                      onClick={() => setApproved(r.id, true)}
                      disabled={busy === r.id}
                      className="text-xs bg-terra/20 text-terra px-2.5 py-1 rounded hover:bg-terra/30 disabled:opacity-40 transition-colors"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => setApproved(r.id, false)}
                      disabled={busy === r.id}
                      className="text-xs bg-ivory/10 text-ivory/50 px-2.5 py-1 rounded hover:bg-ivory/15 disabled:opacity-40 transition-colors"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(r.id)}
                    disabled={busy === r.id}
                    className="text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded hover:bg-red-500/20 disabled:opacity-40 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs border border-ivory/10 text-ivory/50 disabled:opacity-30 hover:bg-ivory/5 transition-colors rounded"
          >
            Previous
          </button>
          <span className="text-xs text-ivory/30">{page} / {lastPage}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === lastPage}
            className="px-3 py-1.5 text-xs border border-ivory/10 text-ivory/50 disabled:opacity-30 hover:bg-ivory/5 transition-colors rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
