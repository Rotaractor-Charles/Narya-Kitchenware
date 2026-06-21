import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import type { Product } from '@/lib/products'
import ProductForm from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'Edit Product — Admin' }
export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const snap   = await adminDb.collection('products').doc(id).get()

  if (!snap.exists) notFound()

  const product = { id: snap.id, ...snap.data() } as Product

  return <ProductForm product={product} mode="edit" />
}
