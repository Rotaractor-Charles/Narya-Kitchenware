import Link from 'next/link'
import Image from 'next/image'

export type ProductCard = {
  id: string
  slug: string
  name: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  stock?: number
  rating?: number
  reviews?: number
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <svg key={n} viewBox="0 0 12 12" width="10" height="10"
          fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1"
          className={n <= Math.round(rating) ? 'text-amber-400' : 'text-forest/20'}>
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/>
        </svg>
      ))}
    </div>
  )
}

type Props = {
  title: string
  seeAllHref: string
  products: ProductCard[]
}

function DiscountBadge({ original, current }: { original: number; current: number }) {
  const pct = Math.round(((original - current) / original) * 100)
  return (
    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
      -{pct}%
    </span>
  )
}

function ProductCardEl({ product }: { product: ProductCard }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block shrink-0 w-44 sm:w-52">
      <div className="relative bg-white border border-forest/10 aspect-square overflow-hidden mb-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 176px, 208px"
        />
        {product.originalPrice && (
          <DiscountBadge original={product.originalPrice} current={product.price} />
        )}
        {product.badge && !product.originalPrice && (
          <span className="absolute top-2 left-2 bg-forest text-cream text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {product.badge}
          </span>
        )}
        {product.stock !== undefined && product.stock <= 5 && (
          <span className="absolute bottom-2 left-2 bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}
      </div>
      <p className="text-xs text-forest leading-snug line-clamp-2 mb-1">{product.name}</p>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-sm font-semibold text-forest">${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-xs text-forest/40 line-through">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>
      {product.rating && (
        <div className="flex items-center gap-1">
          <Stars rating={product.rating} />
          {product.reviews && (
            <span className="text-[10px] text-forest/40">({product.reviews})</span>
          )}
        </div>
      )}
    </Link>
  )
}

export default function ProductRow({ title, seeAllHref, products }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-serif text-forest text-2xl sm:text-3xl">{title}</h2>
        <Link href={seeAllHref} className="text-xs tracking-widest uppercase text-forest/50 hover:text-forest transition-colors">
          See all →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
        {products.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-44 sm:w-52">
                <div className="bg-forest/5 aspect-square mb-2 animate-pulse" />
                <div className="h-3 bg-forest/5 rounded mb-1 animate-pulse" />
                <div className="h-3 w-16 bg-forest/5 rounded animate-pulse" />
              </div>
            ))
          : products.map((p) => <ProductCardEl key={p.id} product={p} />)
        }
      </div>
    </section>
  )
}
