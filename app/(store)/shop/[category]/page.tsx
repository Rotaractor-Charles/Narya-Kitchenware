import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShopClient from '@/components/shop/ShopClient'
import { getProducts } from '@/lib/api/products'
import { getCategories, getCategoryBySlug } from '@/lib/api/categories'

type Props = { params: Promise<{ category: string }> }

const SPECIAL_COLLECTIONS: Record<string, string> = {
  new: 'New Arrivals',
  sale: 'Sale',
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return [
    ...categories.map((c) => ({ category: c.slug })),
    ...Object.keys(SPECIAL_COLLECTIONS).map((category) => ({ category })),
  ]
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params
  if (SPECIAL_COLLECTIONS[category]) return { title: SPECIAL_COLLECTIONS[category] }

  const cat = await getCategoryBySlug(category)
  if (!cat) return {}
  return { title: cat.name }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const isSpecialCollection = Boolean(SPECIAL_COLLECTIONS[category])

  const [cat, productsResponse, categories] = await Promise.all([
    isSpecialCollection ? Promise.resolve(null) : getCategoryBySlug(category),
    getProducts({ category: isSpecialCollection ? undefined : category, per_page: 100 }),
    getCategories(),
  ])

  if (!cat && !isSpecialCollection) notFound()

  const title = SPECIAL_COLLECTIONS[category] ?? cat!.name

  return (
    <>
      <div className="bg-ivory-dark border-b border-earth/8 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-earth/40 mb-1">
            <Link href="/shop" className="hover:text-earth transition-colors">
              Shop
            </Link>{' '}
            / {title}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-earth">{title}</h1>
        </div>
      </div>
      <ShopClient
        products={productsResponse.data}
        categories={categories}
        initialCategory={category}
      />
    </>
  )
}
