'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'

type WishItem = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  originalPrice?: number
  category: string
  inStock: boolean
}

const INITIAL_WISHLIST: WishItem[] = [
  {
    id: 'ceramic-stockpot',
    slug: 'ceramic-stockpot',
    name: 'Ceramic Stockpot 5L',
    image: '/products/ceramic-stockpot.svg',
    price: 4500,
    originalPrice: 5200,
    category: 'Cookware',
    inStock: true,
  },
  {
    id: 'chefs-knife',
    slug: 'chefs-knife',
    name: "Chef's Knife 8\"",
    image: '/products/chefs-knife.svg',
    price: 3800,
    category: 'Cutlery',
    inStock: true,
  },
  {
    id: 'loaf-pan',
    slug: 'loaf-pan',
    name: 'Non-stick Loaf Pan',
    image: '/products/loaf-pan.svg',
    price: 1800,
    category: 'Bakeware',
    inStock: false,
  },
  {
    id: 'cutting-board',
    slug: 'cutting-board',
    name: 'Acacia Cutting Board',
    image: '/products/cutting-board.svg',
    price: 2200,
    category: 'Utensils',
    inStock: true,
  },
]

function HeartFilled({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

export default function WishlistClient() {
  const [items, setItems] = useState<WishItem[]>(INITIAL_WISHLIST)
  const [added, setAdded] = useState<string | null>(null)
  const { addItem, openCart } = useCart()

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function handleAddToCart(item: WishItem) {
    addItem({
      id: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
    })
    setAdded(item.id)
    setTimeout(() => setAdded(null), 2000)
    openCart()
  }

  const discount = (item: WishItem) =>
    item.originalPrice
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : null

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <HeartFilled className="text-earth/15 w-12 h-12 mb-5" />
        <h1 className="font-serif text-2xl text-earth mb-2">Your wishlist is empty</h1>
        <p className="text-earth/50 text-sm mb-8">Save items you love and come back to them anytime.</p>
        <Link href="/shop" className="bg-earth text-ivory px-7 py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-earth">
          My Wishlist
          <span className="ml-2 text-base text-earth/35 font-sans font-normal">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>
        <Link href="/shop" className="text-xs text-earth/45 hover:text-earth/70 transition-colors">
          ← Continue Shopping
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map(item => {
          const disc = discount(item)
          return (
            <div key={item.id} className="group bg-white rounded-2xl border border-earth/10 overflow-hidden flex flex-col">
              {/* Image */}
              <div className="relative aspect-square bg-ivory-dark overflow-hidden">
                <Link href={`/product/${item.slug}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {disc && (
                    <span className="bg-terra text-ivory text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{disc}%
                    </span>
                  )}
                  {!item.inStock && (
                    <span className="bg-earth/70 text-ivory text-[10px] px-1.5 py-0.5 rounded">
                      Out of stock
                    </span>
                  )}
                </div>

                {/* Remove from wishlist */}
                <button
                  onClick={() => remove(item.id)}
                  aria-label="Remove from wishlist"
                  title="Remove from wishlist"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-400 hover:text-red-600 hover:bg-white transition-colors shadow-sm"
                >
                  <HeartFilled className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Details */}
              <div className="p-3 flex flex-col flex-1 gap-2">
                <p className="text-[10px] text-earth/35 uppercase tracking-widest">{item.category}</p>
                <Link href={`/product/${item.slug}`} className="text-sm font-medium text-earth leading-snug hover:text-terra transition-colors line-clamp-2 flex-1">
                  {item.name}
                </Link>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-earth">KSh {item.price.toLocaleString()}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-earth/35 line-through">
                      KSh {item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => item.inStock && handleAddToCart(item)}
                  disabled={!item.inStock}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    !item.inStock
                      ? 'bg-earth/8 text-earth/30 cursor-not-allowed'
                      : added === item.id
                      ? 'bg-terra/15 text-terra'
                      : 'bg-earth text-ivory hover:bg-earth/90 active:scale-[0.98]'
                  }`}
                >
                  {!item.inStock ? 'Out of Stock' : added === item.id ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
