'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import type { Product } from '@/lib/types'

// ─── Notification types ───────────────────────────────────────────────────────
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

function useNotifications(isLoggedIn: boolean) {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetch_ = useCallback(async () => {
    if (!isLoggedIn) return
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.data ?? [])
      setUnreadCount(data.unread_count ?? 0)
    } catch {
      // silently ignore
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetch_()
    if (!isLoggedIn) return
    const id = setInterval(fetch_, 30_000)
    return () => clearInterval(id)
  }, [isLoggedIn, fetch_])

  const markRead = useCallback(async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    setUnreadCount((c) => Math.max(0, c - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    await fetch('/api/notifications/read-all', { method: 'POST' })
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
    setUnreadCount(0)
  }, [])

  return { notifications, unreadCount, markRead, markAllRead }
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function NotificationBell({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(isLoggedIn)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!isLoggedIn) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative flex w-8 h-8 sm:w-auto sm:h-auto sm:p-2 items-center justify-center text-forest/55 hover:text-forest transition-colors"
      >
        {/* Bell SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-terra text-ivory text-[9px] font-bold min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-2 right-2 top-[79px] z-50 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[360px] rounded-2xl border border-forest/10 bg-white shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-forest/8">
            <span className="font-semibold text-forest text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-terra hover:text-terra/70 font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto divide-y divide-forest/5">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-sm text-forest/40">
                <div className="text-3xl mb-2">🔔</div>
                You&apos;re all caught up!
              </div>
            ) : (
              notifications.map((n) => {
                const isExpanded = expandedId === n.id
                return (
                  <div
                    key={n.id}
                    className={`relative cursor-pointer transition-colors ${
                      isExpanded
                        ? 'bg-terra/8 border-b border-terra/10'
                        : !n.read_at
                        ? 'bg-terra/5 hover:bg-terra/8'
                        : 'hover:bg-forest/[0.03]'
                    }`}
                    onClick={() => {
                      setExpandedId(isExpanded ? null : n.id)
                      if (!n.read_at) markRead(n.id)
                    }}
                  >
                    {/* Unread dot */}
                    {!n.read_at && (
                      <span className="absolute left-2.5 top-4 w-1.5 h-1.5 rounded-full bg-terra" />
                    )}

                    <div className="flex gap-3 items-start px-3 py-3 pl-5">
                      <span className="text-lg leading-none mt-0.5 shrink-0">{n.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[12px] font-semibold text-forest leading-snug">{n.title}</p>
                          <span className="text-[10px] text-forest/35 shrink-0 mt-0.5 whitespace-nowrap">{timeAgo(n.created_at)}</span>
                        </div>
                        <p className={`text-[11px] text-forest/60 mt-1 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {n.body}
                        </p>

                        {/* Expanded CTA */}
                        {isExpanded && n.action_url && (
                          <Link
                            href={n.action_url}
                            onClick={(e) => { e.stopPropagation(); setOpen(false) }}
                            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-terra px-4 py-2 text-[11px] font-semibold text-ivory hover:bg-terra/85 transition-colors"
                          >
                            View order details →
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Expand hint when collapsed */}
                    {!isExpanded && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/20 text-xs">›</div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-forest/8 px-4 py-2.5 text-center">
            <Link href="/notifications" onClick={() => setOpen(false)} className="text-[11px] text-terra hover:underline font-medium">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function LogoMark() {
  return (
    <svg viewBox="0 0 48 64" width="17" height="23" aria-hidden="true" className="shrink-0">
      <g
        transform="translate(24 44)"
        stroke="#1C2E1C"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      >
        <g transform="rotate(20)">
          <line x1="0" y1="0" x2="0" y2="-30" />
          <line x1="-3.5" y1="-30" x2="-3.5" y2="-38" />
          <line x1="0" y1="-30" x2="0" y2="-40" />
          <line x1="3.5" y1="-30" x2="3.5" y2="-38" />
        </g>
        <g transform="rotate(-20)">
          <line x1="0" y1="0" x2="0" y2="-28" />
          <ellipse cx="0" cy="-34" rx="5" ry="7" />
        </g>
      </g>
    </svg>
  )
}

type NavItem = { id: number; label: string; href: string; children: NavItem[] }

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

function SearchBox({ onClose, autoFocus = false }: { onClose?: () => void; autoFocus?: boolean }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)
  const [fetching, setFetching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const doSearch = useCallback((q: string) => {
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setFetching(true)
    fetch(`/api/search?q=${encodeURIComponent(q)}&per_page=6`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.data ?? [])
        setTotal(data.meta?.total ?? 0)
        setOpen(true)
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(q), 280)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    onClose?.()
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  function handleSelect(slug: string) {
    setOpen(false)
    onClose?.()
    router.push(`/product/${slug}`)
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search products..."
          className="w-full h-10 rounded-full border border-forest/20 bg-ivory pl-5 pr-10 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest/40 focus:ring-1 focus:ring-forest/15 transition"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/45 hover:text-forest transition-colors"
        >
          {fetching ? (
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </button>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-forest/8 overflow-hidden z-50">
          {results.map((p) => {
            const img = p.images?.[0]?.url
            return (
              <button
                key={p.id}
                onMouseDown={() => handleSelect(p.slug)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-ivory text-left transition-colors"
              >
                <div className="w-10 h-10 rounded bg-ivory-dark shrink-0 overflow-hidden relative">
                  {img ? (
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      className="object-contain p-1"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full bg-forest/5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-forest font-medium truncate">{p.name}</p>
                  <p className="text-xs text-forest/45">{fmt(p.price)}</p>
                </div>
              </button>
            )
          })}
          {total > results.length && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onMouseDown={() => {
                setOpen(false)
                onClose?.()
              }}
              className="block w-full px-4 py-2.5 text-xs text-terra font-semibold text-center hover:bg-ivory border-t border-forest/8 transition-colors"
            >
              See all {total} results for &ldquo;{query}&rdquo; →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function Navbar({
  desktopNav = [],
  mobileNav = [],
}: {
  desktopNav?: NavItem[]
  mobileNav?: NavItem[]
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { openCart, itemCount } = useCart()
  const { user, logout, loading: authLoading } = useAuth()

  return (
    <>
      {/* ── Main header ── */}
      <header className="sticky top-0 z-50 bg-ivory shadow-[0_1px_0_0_rgba(44,24,16,0.1)]">
        {/* Logo + search + icons row */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-[75px] sm:h-[60px] flex items-center gap-2 sm:gap-4">
          {/* Logo — fixed left */}
          <Link
            href="/"
            aria-label="Narya Kitchenware"
            className="flex items-center gap-1.5 sm:gap-2.5 shrink-0"
          >
            <LogoMark />
            <span className="font-serif tracking-[0.18em] sm:tracking-[0.25em] text-forest text-[19px] sm:text-[23px] select-none leading-none">
              NARYA
            </span>
          </Link>

          {/* Search — desktop only (centered) */}
          <div className="hidden sm:flex flex-1 justify-center px-6">
            <div className="w-full max-w-lg">
              <SearchBox />
            </div>
          </div>

          {/* Spacer on mobile */}
          <div className="min-w-0 flex-1 sm:hidden" />

          {/* Icon cluster — fixed right */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            {/* Search icon — mobile only */}
            <button
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-forest/15 shadow-sm text-forest/60 hover:text-forest transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Account */}
            {!authLoading &&
              (user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    aria-label="Account menu"
                    className="w-8 h-8 sm:w-auto sm:h-auto sm:p-2 text-forest/55 hover:text-forest transition-colors flex items-center justify-center sm:gap-1"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    <span className="hidden sm:inline text-[11px] font-medium text-forest/70 max-w-[80px] truncate leading-none">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-forest/10 py-1 z-50 text-sm">
                        <div className="px-3 py-2 border-b border-forest/8">
                          <p className="font-medium text-forest text-[13px] truncate">
                            {user.name}
                          </p>
                          <p className="text-forest/45 text-[11px] truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 text-earth/70 hover:text-terra hover:bg-ivory transition-colors"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 text-earth/70 hover:text-terra hover:bg-ivory transition-colors"
                        >
                          Orders
                        </Link>
                        <button
                          onClick={async () => {
                            setUserMenuOpen(false)
                            await logout()
                          }}
                          className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  aria-label="Sign in"
                  title="Sign In"
                  className="w-8 h-8 sm:w-auto sm:h-auto sm:p-2 text-forest/55 hover:text-forest transition-colors flex items-center justify-center"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </Link>
              ))}

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              title="My Wishlist"
              className="w-8 h-8 sm:w-auto sm:h-auto sm:p-2 text-forest/55 hover:text-forest transition-colors flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            <Link
              href="/rewards"
              aria-label="My Rewards"
              title="My Rewards"
              className="w-8 h-8 sm:w-auto sm:h-auto sm:p-2 text-forest/55 hover:text-forest transition-colors flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" rx="1" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </Link>

            <NotificationBell isLoggedIn={!!user} />

            <button
              onClick={openCart}
              aria-label="My Cart"
              title="My Cart"
              className="relative flex w-8 h-8 sm:w-auto sm:h-auto sm:p-2 items-center justify-center text-forest/55 hover:text-forest transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                <circle cx="10" cy="21" r="1" />
                <circle cx="21" cy="21" r="1" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-terra text-ivory text-[9px] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 shrink-0 flex items-center justify-center text-forest/65 hover:text-forest transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Category nav — desktop ── */}
        <nav className="hidden lg:block border-t border-forest/8 relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-ivory to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-ivory to-transparent z-10" />
          <ul className="flex items-center gap-0 overflow-x-auto scrollbar-hide max-w-7xl mx-auto px-6 h-9">
            {desktopNav.map(({ id, href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <li key={id} className="shrink-0">
                  <Link
                    href={href}
                    className={`flex items-center px-3 h-9 text-[11.5px] font-bold tracking-wide whitespace-nowrap transition-colors duration-150 border-b-2 ${
                      active
                        ? 'text-terra border-terra'
                        : 'text-earth/60 hover:text-terra border-transparent hover:border-terra/50'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* ── Mobile search dropdown ── */}
        {searchOpen && (
          <div className="sm:hidden border-t border-forest/10 bg-white px-4 py-3 shadow-md">
            <SearchBox autoFocus onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-forest/10 bg-cream px-5 py-5">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
              {(mobileNav.length > 0 ? mobileNav : desktopNav).map(({ id, href, label }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <li key={id}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`block text-sm py-1.5 transition-colors ${active ? 'text-terra font-semibold' : 'text-earth/65 hover:text-terra'}`}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </header>
    </>
  )
}
