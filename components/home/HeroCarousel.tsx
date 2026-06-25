'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const SLIDES = [
  {
    id: 1,
    eyebrow: 'New Collection',
    heading: 'Craft your kitchen.\nLove your cooking.',
    sub: 'Thoughtfully designed tools for home cooks who care about what they use.',
    cta: { label: 'Shop Now', href: '/shop' },
    bg: 'bg-terra',
    text: 'text-ivory',
    btnStyle: 'border-ivory text-ivory hover:bg-ivory hover:text-terra',
  },
  {
    id: 2,
    eyebrow: 'Up to 30% off',
    heading: 'Cookware essentials\nat their best price.',
    sub: 'Premium pots and pans built to last — on sale this week only.',
    cta: { label: 'Shop Cookware', href: '/shop/cookware' },
    bg: 'bg-sienna',
    text: 'text-earth',
    btnStyle: 'border-earth text-earth hover:bg-earth hover:text-ivory',
  },
  {
    id: 3,
    eyebrow: 'Free shipping over $75',
    heading: 'Bake something\nbeautiful today.',
    sub: 'Our bakeware collection — from everyday loaf tins to celebration cake moulds.',
    cta: { label: 'Shop Bakeware', href: '/shop/bakeware' },
    bg: 'bg-earth',
    text: 'text-ivory',
    btnStyle: 'border-sienna text-sienna hover:bg-sienna hover:text-earth',
  },
]

const SIDE_PROMOS = [
  {
    label: 'Need help?', desc: 'Call +254711367192', action: 'Contact us', href: '/contact', color: 'text-blue-500',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.09 6.09l.91-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    label: 'Gift guide', desc: 'Find the perfect gift', action: 'View guide', href: '/guides/gifts', color: 'text-rose-500',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
        <path d="M20 3v4"/><path d="M22 5h-4"/>
        <path d="M4 17v2"/><path d="M5 18H3"/>
      </svg>
    ),
  },
  {
    label: 'Track order', desc: 'Where is my order?', action: 'Track order', href: '/orders/track', color: 'text-amber-500',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  const slide = SLIDES[current]

  return (
    <div className="flex flex-col md:flex-row gap-2 max-w-7xl mx-auto px-4 pt-6">

      {/* ── Main carousel ── */}
      <div className={`relative flex-1 min-h-[420px] md:min-h-[480px] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-14 overflow-hidden transition-colors duration-700 ${slide.bg} ${slide.text}`}>

        {/* Watermark sprig */}
        <svg viewBox="0 0 300 400" aria-hidden="true"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-72 opacity-[0.07] pointer-events-none">
          <g transform="translate(150 240)" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none">
            <g transform="rotate(20)">
              <line x1="0" y1="0" x2="0" y2="-160" />
              <line x1="-14" y1="-160" x2="-14" y2="-200" />
              <line x1="0"   y1="-160" x2="0"   y2="-210" />
              <line x1="14"  y1="-160" x2="14"  y2="-200" />
            </g>
            <g transform="rotate(-20)">
              <line x1="0" y1="0" x2="0" y2="-155" />
              <ellipse cx="0" cy="-178" rx="22" ry="32" />
            </g>
          </g>
        </svg>

        <div className="relative z-10 max-w-[620px]">
          <p className="text-xs tracking-[0.3em] uppercase opacity-50 mb-4">{slide.eyebrow}</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight mb-6 whitespace-pre-line max-w-[570px]">
            {slide.heading}
          </h2>
          <p className="text-sm sm:text-base opacity-70 mb-8 max-w-[440px] leading-relaxed">{slide.sub}</p>
          <div>
            <Link href={slide.cta.href}
              className={`inline-flex items-center px-7 py-3.5 text-sm tracking-widest uppercase border transition-colors duration-200 ${slide.btnStyle}`}>
              {slide.cta.label}
            </Link>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-8 sm:left-12 lg:left-16 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${slide.text === 'text-earth' ? 'bg-earth' : 'bg-ivory'} ${i === current ? 'opacity-100 scale-125' : 'opacity-35'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Side promo boxes ── */}
      <div className="flex md:flex-col gap-2 md:w-52">
        {SIDE_PROMOS.map(({ label, desc, action, href, icon, color }) => (
          <Link key={href} href={href} aria-label={`${label} ${desc}`}
            className="group flex-1 border border-earth/15 bg-ivory-dark hover:border-terra/40 hover:bg-sienna/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terra/35 transition-colors p-5 flex flex-col justify-center gap-3 cursor-pointer">
            <span className={color}>{icon}</span>
            <div>
              <span className="text-xs font-semibold text-earth tracking-wide block">{label}</span>
              <span className="text-xs text-earth/55 mt-0.5 block">{desc}</span>
              <span className="mt-4 inline-flex items-center text-xs font-semibold text-terra">
                {action}
                <span className="ml-1 transition-transform group-hover:translate-x-1">-&gt;</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}
