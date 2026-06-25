import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products'
import ProductForm from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'Edit Product — Admin' }
export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
  const product = await getProductById(id)

  if (!product) notFound()

  return <ProductForm product={product} mode="edit" />
}
