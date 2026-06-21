import { notFound }       from 'next/navigation'
import ProductDetail        from '@/components/product/ProductDetail'
import { getProductBySlug, getRelatedProducts, PRODUCTS } from '@/lib/sample-products'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product  = getProductBySlug(slug)
  if (!product) return {}
  return {
    title:       product.name,
    description: product.description.slice(0, 155),
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product  = getProductBySlug(slug)
  if (!product) notFound()

  const related = getRelatedProducts(product)

  return <ProductDetail product={product} related={related} />
}
