'use client'

import Link        from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

function LogoMark() {
  return (
    <svg viewBox="0 0 48 64" width="24" height="32" aria-hidden="true" className="shrink-0">
      <g transform="translate(24 44)" stroke="#1C2E1C" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <g transform="rotate(20)">
          <line x1="0" y1="0" x2="0" y2="-30" />
          <line x1="-3.5" y1="-30" x2="-3.5" y2="-38" />
          <line x1="0"    y1="-30" x2="0"    y2="-40" />
          <line x1="3.5"  y1="-30" x2="3.5"  y2="-38" />
        </g>
        <g transform="rotate(-20)">
          <line x1="0" y1="0" x2="0" y2="-28" />
          <ellipse cx="0" cy="-34" rx="5" ry="7" />
        </g>
      </g>
    </svg>
  )
}

const CATEGORIES = [
  { href: '/shop/cookware',    label: 'Cookware'             },
  { href: '/shop/bakeware',    label: 'Bakeware'             },
  { href: '/shop/cutlery',     label: 'Cutlery & Knives'     },
  { href: '/shop/appliances',  label: 'Small Appliances'     },
  { href: '/shop/storage',     label: 'Storage & Org'        },
  { href: '/shop/utensils',    label: 'Utensils & Gadgets'   },
  { href: '/shop/dinnerware',  label: 'Dinnerware'           },
  { href: '/shop/coffee-tea',  label: 'Coffee & Tea'         },
  { href: '/shop/outdoor',     label: 'Outdoor & BBQ'        },
  { href: '/shop/cleaning',    label: 'Cleaning & Care'      },
  { href: '/shop/new',         label: 'New Arrivals'         },
  { href: '/shop/sale',        label: 'Sale'                 },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { openCart, itemCount } = useCart()

  return (
    <>
      {/* ── Utility bar ── */}
      <div className="bg-earth text-ivory text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
          <span className="hidden sm:inline">Mon – Fri 8am – 6pm: <strong>+1 800 000 0000</strong></span>
          <Link href="/orders/track" className="underline underline-offset-2 hover:text-cream/80">Track your order</Link>
          <span className="hidden md:inline text-cream/70">Free shipping on orders over $75</span>
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="sticky top-0 z-50 bg-ivory shadow-[0_1px_0_0_rgba(44,24,16,0.1)]">

        {/* Logo + search + icons row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-4">

          {/* Logo — fixed left */}
          <Link href="/" aria-label="Narya Kitchenware" className="flex items-center gap-2 shrink-0">
            <LogoMark />
            <span className="font-serif tracking-[0.25em] text-forest text-sm hidden sm:block select-none">
              NARYA
            </span>
          </Link>

          {/* Search — centered, bounded */}
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-xs relative">
              <input
                type="search"
                placeholder="Search products…"
                className="w-full h-9 rounded-full border border-forest/20 bg-white pl-4 pr-9 text-sm text-forest placeholder:text-forest/35 focus:outline-none focus:border-forest/50 focus:ring-1 focus:ring-forest/20 transition"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div>

          {/* Icon cluster — fixed right */}
          <div className="flex items-center gap-1 shrink-0">
            <Link href="/account" aria-label="Account" title="My Account" className="p-2 text-forest/55 hover:text-forest transition-colors hidden sm:flex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" title="My Wishlist" className="p-2 text-forest/55 hover:text-forest transition-colors hidden sm:flex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            {/* Rewards — gift box */}
            <Link href="/rewards" aria-label="My Rewards" title="My Rewards" className="p-2 text-forest/55 hover:text-forest transition-colors hidden sm:flex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"/>
                <rect x="2" y="7" width="20" height="5" rx="1"/>
                <line x1="12" y1="22" x2="12" y2="7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </Link>

            {/* Cart */}
            <button onClick={openCart} aria-label="My Cart" title="My Cart" className="relative flex p-2 text-forest/55 hover:text-forest transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Hamburger */}
            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-forest/55 hover:text-forest transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* ── Category nav — desktop ── */}
        <nav className="hidden lg:block border-t border-forest/8 relative">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-ivory to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-ivory to-transparent z-10" />

          <ul className="flex items-center gap-0 overflow-x-auto scrollbar-hide max-w-7xl mx-auto px-6 h-9">
            {CATEGORIES.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    className={`flex items-center px-3 h-9 text-[11.5px] tracking-wide whitespace-nowrap transition-colors duration-150 border-b-2 ${
                      active
                        ? 'text-terra font-semibold border-terra'
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

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-forest/10 bg-cream px-5 py-5">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
              {CATEGORIES.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <li key={href}>
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
            <div className="border-t border-forest/10 pt-4 grid grid-cols-3 gap-2">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-1.5 py-2 rounded-xl text-earth/55 hover:text-terra hover:bg-ivory-dark transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <span className="text-[10px] font-medium">Account</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-1.5 py-2 rounded-xl text-earth/55 hover:text-terra hover:bg-ivory-dark transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span className="text-[10px] font-medium">Wishlist</span>
              </Link>

              <Link
                href="/rewards"
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-1.5 py-2 rounded-xl text-earth/55 hover:text-terra hover:bg-ivory-dark transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 12 20 22 4 22 4 12"/>
                  <rect x="2" y="7" width="20" height="5" rx="1"/>
                  <line x1="12" y1="22" x2="12" y2="7"/>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
                <span className="text-[10px] font-medium">Rewards</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
