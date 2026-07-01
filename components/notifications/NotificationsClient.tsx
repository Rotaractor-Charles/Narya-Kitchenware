'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

type CustomerNotification = {
  id: number
  type: string
  emoji: string
  title: string
  body: string
  action_url: string | null
  read_at: string | null
  created_at: string
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 86400 * 2) return 'yesterday'
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function groupByDate(notifications: CustomerNotification[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const groups: { label: string; items: CustomerNotification[] }[] = []
  const todayItems: CustomerNotification[] = []
  const yesterdayItems: CustomerNotification[] = []
  const olderItems: CustomerNotification[] = []

  for (const n of notifications) {
    const d = new Date(n.created_at)
    d.setHours(0, 0, 0, 0)
    if (d.getTime() === today.getTime()) todayItems.push(n)
    else if (d.getTime() === yesterday.getTime()) yesterdayItems.push(n)
    else olderItems.push(n)
  }

  if (todayItems.length) groups.push({ label: 'Today', items: todayItems })
  if (yesterdayItems.length) groups.push({ label: 'Yesterday', items: yesterdayItems })
  if (olderItems.length) groups.push({ label: 'Earlier', items: olderItems })
  return groups
}

const TYPE_STYLES: Record<string, { bg: string; border: string }> = {
  order_status:   { bg: 'bg-indigo-50',  border: 'border-indigo-100' },
  payment_status: { bg: 'bg-terra/5',    border: 'border-terra/15' },
}

export default function NotificationsClient() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [notifications, setNotifications] = useState<CustomerNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.data ?? [])
      setUnreadCount(data.unread_count ?? 0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/notifications')
      return
    }
    if (user) fetchNotifications()
  }, [user, authLoading, router, fetchNotifications])

  const markRead = useCallback(async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    await fetch('/api/notifications/read-all', { method: 'POST' })
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
    setUnreadCount(0)
  }, [])

  const groups = groupByDate(notifications)

  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-sm text-earth/40">
        Loading notifications…
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-earth">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-earth/50">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="shrink-0 rounded-xl border border-terra/30 px-4 py-2 text-xs font-semibold text-terra hover:bg-terra/5 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 && (
        <div className="rounded-2xl border border-earth/10 bg-white py-20 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <p className="text-sm font-medium text-earth">No notifications yet</p>
          <p className="mt-1 text-xs text-earth/45">
            We&apos;ll notify you here when your orders are updated.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-xl bg-terra px-5 py-2.5 text-xs font-semibold text-ivory hover:bg-terra/85 transition-colors"
          >
            Start shopping
          </Link>
        </div>
      )}

      {/* Grouped notifications */}
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-earth/35">
              {group.label}
            </p>
            <div className="space-y-3">
              {group.items.map((n) => {
                const style = TYPE_STYLES[n.type] ?? { bg: 'bg-white', border: 'border-earth/10' }
                return (
                  <div
                    key={n.id}
                    onClick={() => { if (!n.read_at) markRead(n.id) }}
                    className={`relative rounded-2xl border p-5 transition-all ${style.bg} ${style.border} ${
                      !n.read_at ? 'shadow-sm' : 'opacity-80'
                    }`}
                  >
                    {/* Unread dot */}
                    {!n.read_at && (
                      <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-terra" />
                    )}

                    <div className="flex gap-4 items-start">
                      {/* Emoji icon in circle */}
                      <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-earth/10 text-2xl shadow-xs">
                        {n.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-earth leading-snug">{n.title}</p>
                          <span className="shrink-0 text-[11px] text-earth/35 mt-0.5">{timeAgo(n.created_at)}</span>
                        </div>
                        <p className="mt-1.5 text-sm text-earth/60 leading-relaxed">{n.body}</p>

                        {n.action_url && (
                          <Link
                            href={n.action_url}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-earth px-4 py-2 text-xs font-semibold text-ivory hover:bg-earth/85 transition-colors"
                          >
                            View order details
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
