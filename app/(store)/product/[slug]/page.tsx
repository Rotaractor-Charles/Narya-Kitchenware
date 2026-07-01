import { notFound }    from 'next/navigation'
import Link             from 'next/link'
import ProductDetail    from '@/components/product/ProductDetail'
import { getProductBySlug, getProducts } from '@/lib/api/products'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug }   = await params
  const product    = await getProductBySlug(slug)
  if (!product) return {}

  const desc = (product.description ?? product.short_description ?? '').replace(/<[^>]*>/g, '').slice(0, 155)
  const fallbackDesc = `Buy ${product.name} in Kenya at Narya Kitchenware. Quality ${product.category?.name ?? 'kitchenware'} with fast delivery to all 47 counties. 14-day free returns. Family-owned, Nairobi-based.`

  const finalDesc = desc.length > 60 ? desc : fallbackDesc
  return {
    title:       `${product.name} | Narya Kitchenware Kenya`,
    description: finalDesc,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title:       `${product.name} — Narya Kitchenware Kenya`,
      description: finalDesc,
      url:         `/product/${product.slug}`,
      type:        'website',
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug }   = await params
  const product    = await getProductBySlug(slug)
  if (!product) notFound()

  const { data: related } = await getProducts({
    category: product.category?.slug,
    per_page: 5,
  })
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 4)

  const category = product.category

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.description ?? product.short_description ?? '').replace(/<[^>]*>/g, '').slice(0, 500),
    image: product.images?.map(i => i.url) ?? [],
    brand: { '@type': 'Brand', name: product.brand?.name ?? 'Narya Kitchenware' },
    sku: product.sku ?? product.slug,
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narya.co.ke'}/product/${product.slug}`,
      priceCurrency: 'KES',
      price: (product.price / 100).toFixed(2),
      availability: product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Narya Kitchenware' },
    },
    ...(product.reviews_count > 0 && product.average_rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.average_rating,
        reviewCount: product.reviews_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narya.co.ke' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narya.co.ke'}/shop` },
      ...(category ? [{ '@type': 'ListItem', position: 3, name: category.name, item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narya.co.ke'}/shop/${category.slug}` }] : []),
      { '@type': 'ListItem', position: category ? 4 : 3, name: product.name },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProductDetail product={product} related={relatedFiltered} />

      {/* Server-rendered SEO section — always present regardless of DB content */}
      <section className="bg-ivory-dark border-t border-earth/8 px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-earth/60 leading-relaxed">
            <div>
              <h2 className="font-semibold text-earth text-sm mb-1.5">
                Buy {product.name} online in Kenya
              </h2>
              <p>
                Order the {product.name} from Narya Kitchenware and get fast, tracked delivery to your door anywhere in Kenya — including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and all 47 counties. Orders placed before 2&nbsp;PM are dispatched the same business day.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-earth text-sm mb-1.5">Quality & returns guarantee</h2>
              <p>
                Every product sold by Narya Kitchenware comes with our 14-day free return policy. If the {product.name} does not meet your expectations when it arrives, contact us and we will arrange a free collection and full refund — no questions asked, no paperwork required.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-earth text-sm mb-1.5">
                {category ? `More ${category.name}` : 'Explore our collection'}
              </h2>
              <p>
                {category
                  ? `The ${product.name} is part of our ${category.name} collection — carefully selected tools for the Kenyan home kitchen. Browse the full ${category.name} range for complementary products that work well together.`
                  : 'Narya Kitchenware is a family-owned kitchen brand based in Nairobi, Kenya. We hand-pick every product in our collection for durability, design, and daily usefulness in a Kenyan kitchen.'}
              </p>
              {category && (
                <Link
                  href={`/shop/${category.slug}`}
                  className="inline-block mt-3 text-terra text-xs font-semibold hover:underline"
                >
                  Browse all {category.name} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
