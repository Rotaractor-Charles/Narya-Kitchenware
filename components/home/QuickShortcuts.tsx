'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

const SHORTCUTS = [
  { href: '/shop/cookware?sale=true',   label: 'Up to 30% off cookware', emoji: '🍳' },
  { href: '/shop/bakeware',             label: 'Bakeware essentials',     emoji: '🧁' },
  { href: '/shop/cutlery',              label: 'Knife sets',              emoji: '🔪' },
  { href: '/shop/appliances?sale=true', label: 'Appliance deals',         emoji: '⚡' },
  { href: '/shop/new',                  label: 'New arrivals',            emoji: '✨' },
  { href: '/shop/gift-sets',            label: 'Gift sets',               emoji: '🎁' },
  { href: '/shop/sale',                 label: 'Clearance',               emoji: '🏷️' },
  { href: '/shop?free-shipping=true',   label: 'Free shipping over $75',  emoji: '🚚' },
]

const SCROLL_AMOUNT = 320

export default function QuickShortcuts() {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)

  function update() {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => { update() }, [])

  function scroll(dir: 'left' | 'right') {
    ref.current?.scrollBy({ left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' })
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <div className="relative">

        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-7 h-7 rounded-full bg-ivory border border-earth/15 shadow-sm flex items-center justify-center transition-opacity duration-150 ${canLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-earth">
            <polyline points="10 4 6 8 10 12" />
          </svg>
        </button>

        {/* Scrollable row */}
        <div
          ref={ref}
          onScroll={update}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
        >
          {SHORTCUTS.map(({ href, label, emoji }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 flex flex-col items-center gap-1.5 border border-forest/15 rounded-lg px-4 py-3 bg-white hover:border-forest/40 hover:shadow-sm transition-all min-w-[110px] text-center"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-[11px] text-forest/70 leading-tight font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-7 h-7 rounded-full bg-ivory border border-earth/15 shadow-sm flex items-center justify-center transition-opacity duration-150 ${canRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-earth">
            <polyline points="6 4 10 8 6 12" />
          </svg>
        </button>

      </div>
    </section>
  )
}
