import Link from 'next/link'
import type { MenuItem } from '@/lib/api/menus'

function LogoMark() {
  return (
    <svg viewBox="0 0 48 64" width="17" height="23" aria-hidden="true" className="shrink-0">
      <g transform="translate(24 44)" stroke="#F5F0E8" strokeWidth="3.5" strokeLinecap="round" fill="none">
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

const FALLBACK_LEARN: MenuItem[] = [
  { id: 0, href: '/recipes', label: 'Recipes',     sort_order: 0, children: [] },
  { id: 1, href: '/guides',  label: 'Care Guides', sort_order: 1, children: [] },
  { id: 2, href: '/blog',    label: 'Blog',        sort_order: 2, children: [] },
]

function NavList({ links }: { links: { id: number; href: string; label: string }[] }) {
  return (
    <ul className="space-y-2 mt-2.5">
      {links.map(({ id, href, label }) => (
        <li key={id}>
          <Link href={href} className="text-xs text-ivory/55 hover:text-ivory transition-colors duration-150">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function ColHeading({ children }: { children: string }) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold tracking-widest uppercase text-white">
        {children}
      </h3>
      <div className="mt-1.5 h-[1.5px] w-12 bg-white/60 rounded-full" />
    </div>
  )
}

const FALLBACK_SHOP: MenuItem[] = [
  { id: 0, label: 'All Products', href: '/shop',           sort_order: 0, children: [] },
  { id: 1, label: 'Cookware',     href: '/shop/cookware',  sort_order: 1, children: [] },
  { id: 2, label: 'Bakeware',     href: '/shop/bakeware',  sort_order: 2, children: [] },
  { id: 3, label: 'Utensils',     href: '/shop/utensils',  sort_order: 3, children: [] },
  { id: 4, label: 'Storage',      href: '/shop/storage',   sort_order: 4, children: [] },
]

const FALLBACK_COMPANY: MenuItem[] = [
  { id: 0, label: 'About',             href: '/about',            sort_order: 0, children: [] },
  { id: 1, label: 'Contact',           href: '/contact',          sort_order: 1, children: [] },
  { id: 2, label: 'Shipping & Returns',href: '/shipping-returns', sort_order: 2, children: [] },
  { id: 3, label: 'Privacy Policy',    href: '/privacy',          sort_order: 3, children: [] },
  { id: 4, label: 'Terms of Service',  href: '/terms',            sort_order: 4, children: [] },
]

export default function Footer({
  footerShop = [],
  footerLearn = [],
  footerCompany = [],
}: {
  footerShop?: MenuItem[]
  footerLearn?: MenuItem[]
  footerCompany?: MenuItem[]
}) {
  const shopLinks    = footerShop.length    > 0 ? footerShop    : FALLBACK_SHOP
  const learnLinks   = footerLearn.length   > 0 ? footerLearn   : FALLBACK_LEARN
  const companyLinks = footerCompany.length > 0 ? footerCompany : FALLBACK_COMPANY
  return (
    <footer className="bg-earth text-ivory/80 mt-24">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-7">

        {/* Brand — sits above the link grid on mobile, hidden on desktop (shown in grid) */}
        <div className="md:hidden mb-7 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <LogoMark />
            <span className="font-serif tracking-[0.25em] text-ivory text-[23px] select-none">NARYA</span>
          </div>
          <p className="text-xs leading-relaxed text-ivory/45 max-w-xs">
            Premium kitchenware made to last. Craft your kitchen. Love your cooking.
          </p>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-7">

          {/* Brand column — desktop only */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2 mb-3">
              <LogoMark />
              <span className="font-serif tracking-[0.25em] text-ivory text-[23px] select-none">NARYA</span>
            </div>
            <p className="text-xs leading-relaxed text-ivory/45 max-w-[180px]">
              Premium kitchenware made to last. Craft your kitchen. Love your cooking.
            </p>
          </div>

          {/* Shop */}
          <div>
            <ColHeading>Shop</ColHeading>
            <NavList links={shopLinks} />
          </div>

          {/* Learn */}
          <div>
            <ColHeading>Learn</ColHeading>
            <NavList links={learnLinks} />
          </div>

          {/* Company */}
          <div>
            <ColHeading>Company</ColHeading>
            <NavList links={companyLinks} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ivory/10 mt-8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-ivory/25">
          <span>© {new Date().getFullYear()} Narya Kitchenware. All rights reserved.</span>
          <span>Secure payments via Stripe</span>
        </div>
      </div>
    </footer>
  )
}
