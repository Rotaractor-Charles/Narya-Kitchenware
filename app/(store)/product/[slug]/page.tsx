import { notFound }    from 'next/navigation'
import ProductDetail   from '@/components/product/ProductDetail'
import { getProductBySlug, getProducts } from '@/lib/api/products'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product  = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title:       product.name,
    description: (product.description ?? product.short_description ?? '').slice(0, 155),
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug }   = await params
  const product    = await getProductBySlug(slug)
  if (!product) notFound()

  // Related = same category, excluding this product, up to 4
  const { data: related } = await getProducts({
    category: product.category?.slug,
    per_page: 5,
  })
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 4)

  return <ProductDetail product={product} related={relatedFiltered} />
}
