import type { Metadata } from 'next'
import Link from 'next/link'
import ShopClient from '@/components/shop/ShopClient'
import { getProducts } from '@/lib/api/products'
import { getCategories } from '@/lib/api/categories'

export const metadata: Metadata = {
  title: 'Shop Kitchenware Online Kenya | Cookware, Knives & Kitchen Tools',
  description: 'Browse Narya\'s full collection of kitchenware in Kenya. Cookware sets, cast iron pans, ceramic pots, chef\'s knives, cutting boards, bakeware, utensils and more. Delivered across all 47 counties.',
  alternates: { canonical: '/shop' },
}

const COLLECTION_HIGHLIGHTS = [
  { label: 'New Arrivals', href: '/shop/new', desc: 'Just landed' },
  { label: 'Deals of the Day', href: '/shop/sale', desc: 'Limited offers' },
  { label: 'Cookware', href: '/shop/cookware', desc: 'Pots & pans' },
  { label: 'Knives', href: '/shop/cutlery', desc: 'Sharp & balanced' },
  { label: 'Bakeware', href: '/shop/bakeware', desc: 'Tins & trays' },
  { label: 'Utensils', href: '/shop/utensils', desc: 'Daily tools' },
]

export default async function ShopPage() {
  const [{ data: products }, categories] = await Promise.all([
    getProducts({ per_page: 100 }),
    getCategories(),
  ])

  return (
    <>
      {/* Page header */}
      <div className="bg-ivory-dark border-b border-earth/8 px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-2xl sm:text-3xl text-earth mb-2">Shop All Products</h1>
          <p className="text-sm text-earth/55 max-w-2xl mb-5">
            Thoughtfully chosen kitchenware for home cooks who care about quality. From cast iron pans and ceramic stockpots to chef&apos;s knives, cutting boards, bakeware, and everyday utensils — every item in our collection is selected to earn its place in a Kenyan kitchen and last through years of real cooking.
          </p>
          {/* Quick category links */}
          <div className="flex flex-wrap gap-2">
            {COLLECTION_HIGHLIGHTS.map(c => (
              <Link
                key={c.label}
                href={c.href}
                className="flex items-center gap-1.5 bg-white border border-earth/15 rounded-full px-3.5 py-1.5 text-xs text-earth/70 hover:border-terra/50 hover:text-terra transition-colors"
              >
                {c.label}
                <span className="text-earth/30">·</span>
                <span className="text-earth/40">{c.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ShopClient products={products} categories={categories} />

      {/* SEO footer */}
      <section className="bg-ivory-dark border-t border-earth/8 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="font-semibold text-earth text-sm mb-2">Buy Kitchenware Online in Kenya</h2>
              <p className="text-xs text-earth/55 leading-relaxed">
                Narya Kitchenware delivers quality cooking tools to all 47 counties in Kenya. Order before 2 PM for same-day dispatch. Free delivery on orders over KSh&nbsp;7,500.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-earth text-sm mb-2">Curated for Kenyan Cooking</h2>
              <p className="text-xs text-earth/55 leading-relaxed">
                Our range covers everything a Kenyan kitchen needs: heavy-base pots for ugali and stews, wide pans for frying, sharp knives for daily prep, durable boards, and bakeware built for mandazi and chapati dough.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-earth text-sm mb-2">Quality Guaranteed</h2>
              <p className="text-xs text-earth/55 leading-relaxed">
                Every product comes with our 14-day free return policy. If it does not meet your expectations, we replace or refund — no hassle. Our team responds to every message within 24 hours on business days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
