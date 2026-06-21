import Link from 'next/link'

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

const SHOP_LINKS = [
  { href: '/shop',             label: 'All Products'       },
  { href: '/shop/cookware',    label: 'Cookware'           },
  { href: '/shop/bakeware',    label: 'Bakeware'           },
  { href: '/shop/utensils',    label: 'Utensils'           },
  { href: '/shop/storage',     label: 'Storage'            },
]

const LEARN_LINKS = [
  { href: '/recipes', label: 'Recipes'     },
  { href: '/guides',  label: 'Care Guides' },
  { href: '/blog',    label: 'Blog'        },
]

const COMPANY_LINKS = [
  { href: '/about',            label: 'About'              },
  { href: '/contact',          label: 'Contact'            },
  { href: '/shipping-returns', label: 'Shipping & Returns' },
  { href: '/privacy',          label: 'Privacy Policy'     },
  { href: '/terms',            label: 'Terms of Service'   },
]

function NavList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-2 mt-2.5">
      {links.map(({ href, label }) => (
        <li key={href}>
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

export default function Footer() {
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
            <NavList links={SHOP_LINKS} />
          </div>

          {/* Learn */}
          <div>
            <ColHeading>Learn</ColHeading>
            <NavList links={LEARN_LINKS} />
          </div>

          {/* Company */}
          <div>
            <ColHeading>Company</ColHeading>
            <ul className="mt-2.5 grid grid-cols-1 gap-y-2">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-ivory/55 hover:text-ivory transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
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
