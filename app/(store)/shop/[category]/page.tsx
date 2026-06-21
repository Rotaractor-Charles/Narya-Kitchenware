import { notFound } from 'next/navigation'
import ShopClient   from '@/components/shop/ShopClient'
import { CATEGORIES } from '@/lib/sample-products'

type Props = { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.slug === category)
  if (!cat) return {}
  return { title: cat.label }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.slug === category)
  if (!cat) notFound()

  return (
    <>
      <div className="bg-ivory-dark border-b border-earth/8 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-earth/40 mb-1">
            <a href="/shop" className="hover:text-earth transition-colors">Shop</a> / {cat.label}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-earth">{cat.label}</h1>
        </div>
      </div>
      <ShopClient initialCategory={category} />
    </>
  )
}
