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
  { label: 'Need help?',  desc: 'Call +1 800 000 0000',    href: '/contact'       },
  { label: 'Gift guide',  desc: 'Find the perfect gift',    href: '/guides/gifts'  },
  { label: 'Track order', desc: 'Where is my order?',       href: '/orders/track'  },
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
      <div className={`relative flex-1 min-h-[420px] md:min-h-[480px] flex flex-col justify-center px-10 py-14 overflow-hidden transition-colors duration-700 ${slide.bg} ${slide.text}`}>

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

        <p className="text-xs tracking-[0.3em] uppercase opacity-50 mb-4">{slide.eyebrow}</p>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight mb-6 whitespace-pre-line">
          {slide.heading}
        </h2>
        <p className="text-sm sm:text-base opacity-70 mb-8 max-w-md leading-relaxed">{slide.sub}</p>
        <div>
          <Link href={slide.cta.href}
            className={`inline-flex items-center px-7 py-3.5 text-sm tracking-widest uppercase border transition-colors duration-200 ${slide.btnStyle}`}>
            {slide.cta.label}
          </Link>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-10 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${slide.text === 'text-earth' ? 'bg-earth' : 'bg-ivory'} ${i === current ? 'opacity-100 scale-125' : 'opacity-35'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Side promo boxes ── */}
      <div className="flex md:flex-col gap-2 md:w-52">
        {SIDE_PROMOS.map(({ label, desc, href }) => (
          <Link key={href} href={href}
            className="flex-1 border border-earth/15 bg-ivory-dark hover:border-terra/40 hover:bg-sienna/10 transition-colors p-4 flex flex-col justify-center">
            <span className="text-xs font-semibold text-earth tracking-wide">{label}</span>
            <span className="text-xs text-earth/55 mt-0.5">{desc}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}
