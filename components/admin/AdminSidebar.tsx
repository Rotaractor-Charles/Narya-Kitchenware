'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserSwitcherPanel from './UserSwitcherPanel'

const NAV = [
  {
    section: null,
    items: [{ label: 'Dashboard', href: '/admin', icon: '⊞' }],
  },
  {
    section: 'Products',
    items: [
      { label: 'All Products',    href: '/admin/products'     },
      { label: 'Add new product', href: '/admin/products/new' },
      { label: 'Brands',          href: '/admin/brands'       },
      { label: 'Categories',      href: '/admin/categories'   },
      { label: 'Tags',            href: '/admin/tags'         },
      { label: 'Attributes',      href: '/admin/attributes'   },
      { label: 'Reviews',         href: '/admin/reviews'      },
    ],
  },
  {
    section: 'Orders',
    items: [
      { label: 'All Orders', href: '/admin/orders'     },
      { label: 'Add new',    href: '/admin/orders/new' },
    ],
  },
  {
    section: 'Customers',
    items: [
      { label: 'All Customers', href: '/admin/customers' },
    ],
  },
  {
    section: 'Rewards',
    items: [
      { label: 'Points & Tiers', href: '/admin/rewards' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { label: 'General', href: '/admin/settings' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-48 shrink-0 bg-[#111d11] border-r border-white/8 min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-white/8">
        <Link href="/admin" className="text-ivory font-serif text-sm tracking-wide">Narya</Link>
        <p className="text-ivory/25 text-[10px] mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map((group, gi) => (
          <div key={gi} className="mb-1">
            {group.section && (
              <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-ivory/20 font-medium">
                {group.section}
              </p>
            )}
            {group.items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs transition-colors ${
                  isActive(item.href)
                    ? 'bg-sienna/20 text-ivory border-l-2 border-sienna'
                    : 'text-ivory/50 hover:text-ivory/80 hover:bg-white/4 border-l-2 border-transparent'
                }`}
              >
                {'icon' in item && <span className="text-sm">{(item as { icon: string }).icon}</span>}
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 px-4 py-3 space-y-1.5">
        <button
          onClick={() => setSwitcherOpen(true)}
          className="flex items-center gap-1.5 text-xs text-ivory/40 hover:text-ivory/80 transition-colors w-full text-left"
        >
          <span>⇄</span> Switch user
        </button>
        <Link href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-ivory/30 hover:text-ivory/60 transition-colors">
          <span>↗</span> View store
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="text-xs text-ivory/25 hover:text-red-400 transition-colors">
            Sign out
          </button>
        </form>
      </div>

      {switcherOpen && <UserSwitcherPanel onClose={() => setSwitcherOpen(false)} />}
    </aside>
  )
}
