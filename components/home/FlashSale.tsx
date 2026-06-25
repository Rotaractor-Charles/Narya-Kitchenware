'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
type FlashProduct = {
  id: string
  slug: string
  name: string
  price: number
  originalPrice?: number
  image: string
  stock?: number
}

type Props = {
  endsAt: string
  products: FlashProduct[]
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function Countdown({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function tick() {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('00:00:00'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endsAt])

  return (
    <span className="font-mono text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
      {timeLeft || '––:––:––'}
    </span>
  )
}

export default function FlashSale({ endsAt, products }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 bg-red-50/60 border-y border-red-100">
      <div className="flex items-baseline justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-forest text-2xl sm:text-3xl">⚡ Flash Sale</h2>
          <div className="flex items-center gap-1.5 text-xs text-forest/60">
            <span>Ends in</span>
            <Countdown endsAt={endsAt} />
          </div>
        </div>
        <a href="/shop/sale" className="text-xs tracking-widest uppercase text-forest/50 hover:text-forest transition-colors">
          See all →
        </a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
        {products.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-44 sm:w-52">
                <div className="bg-red-100/60 aspect-square mb-2 animate-pulse" />
                <div className="h-3 bg-red-100/60 rounded mb-1 animate-pulse" />
                <div className="h-3 w-16 bg-red-100/60 rounded animate-pulse" />
              </div>
            ))
          : products.map((p) => (
              <a key={p.id} href={`/product/${p.slug}`} className="group block shrink-0 w-44 sm:w-52">
                <div className="relative bg-ivory-dark border border-red-200 aspect-square overflow-hidden mb-2">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width:640px) 176px, 208px"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.originalPrice && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                      -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                    </span>
                  )}
                  {p.stock !== undefined && p.stock <= 5 && (
                    <span className="absolute bottom-2 left-2 bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded z-10">
                      Only {p.stock} left
                    </span>
                  )}
                </div>
                <p className="text-xs text-forest leading-snug line-clamp-2 mb-1">{p.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-semibold text-red-600">${p.price.toFixed(2)}</span>
                  {p.originalPrice && (
                    <span className="text-xs text-forest/40 line-through">${p.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </a>
            ))
        }
      </div>
    </section>
  )
}
