import type { Metadata } from 'next'
import Link from 'next/link'
import HeroCarousel   from '@/components/home/HeroCarousel'
import QuickShortcuts from '@/components/home/QuickShortcuts'
import FlashSale      from '@/components/home/FlashSale'
import ProductRow     from '@/components/home/ProductRow'
import CategoryTiles  from '@/components/home/CategoryTiles'
import Newsletter     from '@/components/home/Newsletter'
import { getProducts } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Quality Kitchenware & Cookware Online Kenya | Narya Kitchenware',
  description: 'Shop premium kitchenware in Kenya. Cast iron pans, ceramic pots, chef\'s knives, cutting boards and kitchen essentials. Fast delivery to all 47 counties. Family-owned, Nairobi-based.',
  openGraph: {
    title: 'Narya Kitchenware — Quality Cookware & Kitchen Tools in Kenya',
    description: 'Premium kitchenware for the Kenyan home cook. Cast iron, ceramic pots, chef\'s knives and more. Fast delivery across all 47 counties.',
    url: '/',
  },
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narya.co.ke'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Narya Kitchenware',
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  description: 'Family-owned kitchenware brand based in Nairobi, Kenya. Premium cookware, knives, and kitchen tools delivered to all 47 counties.',
  address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['English', 'Swahili'] },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Narya Kitchenware',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

const CATEGORY_OVERVIEW = [
  { name: 'Cookware', desc: 'Cast iron, ceramic, and stainless pots and pans for every Kenyan kitchen staple — from ugali to biriani.', href: '/shop/cookware' },
  { name: 'Bakeware', desc: 'Loaf pans, muffin trays, and baking sheets built for reliable home baking results every time.', href: '/shop/bakeware' },
  { name: 'Cutlery & Knives', desc: 'Sharp, well-balanced chef\'s knives and kitchen scissors that stay that way with simple maintenance.', href: '/shop/cutlery' },
  { name: 'Utensils & Gadgets', desc: 'Spatulas, ladles, tongs, whisks and the everyday tools that keep a Kenyan kitchen running smoothly.', href: '/shop/utensils' },
  { name: 'Dinnerware', desc: 'Plates, bowls, and serving ware that bring the meal to the table beautifully and last through daily use.', href: '/shop/dinnerware' },
]

const FLASH_SALE_ENDS = new Date(
  new Date().setHours(23, 59, 59, 0)
).toISOString()

export default async function HomePage() {
  const [{ data: featured }, { data: allProducts }] = await Promise.all([
    getProducts({ featured: true, per_page: 8 }),
    getProducts({ per_page: 50 }),
  ])

  const onSale    = allProducts.filter(p => p.compare_at_price !== null).slice(0, 8)
  const topSellers = [...allProducts]
    .sort((a, b) => b.reviews_count - a.reviews_count)
    .slice(0, 8)
  const newArrivals = [...allProducts]
    .sort((a, b) => b.id - a.id)
    .slice(0, 8)

  const flashProducts = onSale.slice(0, 4).map(p => ({
    id:            String(p.id),
    slug:          p.slug,
    name:          p.name,
    price:         p.price / 100,
    originalPrice: p.compare_at_price ? p.compare_at_price / 100 : undefined,
    image:         p.images?.find(i => i.is_primary)?.url ?? p.images?.[0]?.url ?? '/products/placeholder.svg',
    stock:         p.stock_quantity,
  }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <HeroCarousel />
      <QuickShortcuts />

      <ProductRow
        title="Deals of the Day"
        seeAllHref="/shop/sale"
        products={onSale}
      />

      <FlashSale endsAt={FLASH_SALE_ENDS} products={flashProducts} />

      <CategoryTiles />

      <ProductRow
        title="Top Sellers"
        seeAllHref="/shop?sort=best-selling"
        products={topSellers}
      />

      <ProductRow
        title="New Arrivals"
        seeAllHref="/shop/new"
        products={newArrivals}
      />

      <Newsletter />

      {/* ── SEO Content: About Narya & Collections ── */}
      <section className="bg-ivory-dark border-t border-earth/8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Two-column prose */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-terra mb-3 font-medium">Why Narya</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-earth mb-5 leading-snug">
                Quality kitchenware, curated for the Kenyan home kitchen
              </h2>
              <div className="space-y-4 text-sm text-earth/65 leading-relaxed">
                <p>
                  Narya Kitchenware is a Nairobi-based family business dedicated to making high-quality cooking tools accessible to every Kenyan household. We hand-pick every item in our collection — from cast iron skillets and ceramic stockpots to chef&apos;s knives, acacia cutting boards, mixing bowls, and stainless steel bakeware — with one standard: would we use it in our own kitchen?
                </p>
                <p>
                  Shopping for kitchenware in Kenya has long meant choosing between cheap imports that break quickly and expensive foreign brands priced out of reach. Narya exists to close that gap. Our range is sourced for durability, designed for real cooking, and priced fairly — with fast delivery to all 47 counties, including same-day dispatch on orders placed before 2 PM.
                </p>
                <p>
                  Whether you are equipping a first home, upgrading an old pan, or looking for a thoughtful kitchen gift, Narya has a curated collection that covers every essential. Our cookware handles ugali, pilau, nyama choma, maharagwe, and every Kenyan kitchen staple with ease. Our knives arrive sharp. Our boards come ready for oil. Every piece earns its place.
                </p>
              </div>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-terra mb-3 font-medium">Our Promise</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-earth mb-5 leading-snug">
                Built to last. Backed by family.
              </h2>
              <div className="space-y-4 text-sm text-earth/65 leading-relaxed">
                <p>
                  Every product sold through Narya comes with our satisfaction guarantee. If something does not live up to what we promised, we make it right — free returns within 14 days, no paperwork, no runaround. Our support team answers every question within 24 hours on business days.
                </p>
                <p>
                  We are also committed to sharing knowledge alongside the tools. Our <Link href="/guides" className="text-terra underline underline-offset-2">Care Guides</Link> cover everything from seasoning cast iron and maintaining ceramic pans to sharpening knives and conditioning wooden boards — so your investment stays useful for years. Our <Link href="/recipes" className="text-terra underline underline-offset-2">Kenyan Recipes</Link> connect our tools to the cooking traditions they were made to serve.
                </p>
                <p>
                  We ship with trusted courier partners and provide real-time tracking on every order. Free delivery applies to all orders over KSh&nbsp;7,500 nationwide — because quality kitchenware in Kenya should not be expensive to receive.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { value: '47', label: 'Counties we deliver to' },
                  { value: '14-day', label: 'Free returns' },
                  { value: '100%', label: 'Family owned' },
                ].map(stat => (
                  <div key={stat.label} className="text-center bg-white rounded-xl border border-earth/10 py-4 px-2">
                    <p className="font-serif text-xl text-earth mb-1">{stat.value}</p>
                    <p className="text-[10px] text-earth/40 uppercase tracking-widest leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category overview */}
          <div className="border-t border-earth/8 pt-10">
            <h2 className="font-serif text-2xl text-earth mb-2 text-center">Explore Our Collections</h2>
            <p className="text-sm text-earth/45 text-center mb-7">Every category carefully selected for quality, value, and daily usefulness in Kenyan kitchens.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {CATEGORY_OVERVIEW.map(cat => (
                <Link key={cat.name} href={cat.href} className="bg-white rounded-xl border border-earth/10 p-4 hover:border-terra/40 transition-colors group">
                  <h3 className="font-semibold text-earth text-sm mb-1.5 group-hover:text-terra transition-colors">{cat.name}</h3>
                  <p className="text-xs text-earth/50 leading-relaxed">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
