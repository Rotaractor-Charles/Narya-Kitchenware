import 'server-only'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
export { CATEGORIES } from '@/lib/categories'

export type Product = {
  id:             string
  slug:           string
  name:           string
  category:       string
  categorySlug:   string
  price:          number
  originalPrice?: number
  images:         string[]
  stock:          number
  rating:         number
  reviews:        number
  description:    string
  specs:          Record<string, string>
  care:           string
  isNew?:         boolean
  isActive?:      boolean
  createdAt?:     FirebaseFirestore.Timestamp
  updatedAt?:     FirebaseFirestore.Timestamp
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

const col = () => adminDb.collection('products')

export async function getProducts(): Promise<Product[]> {
  const snap = await col().orderBy('name').get()
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Product))
    .filter(p => p.isActive !== false)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const snap = await col().where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() } as Product
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const snap = await col()
    .where('categorySlug', '==', categorySlug)
    .orderBy('name')
    .get()
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Product))
    .filter(p => p.isActive !== false)
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const snap = await col()
    .where('categorySlug', '==', product.categorySlug)
    .orderBy('name')
    .limit(limit + 1)
    .get()
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Product))
    .filter(p => p.id !== product.id && p.isActive !== false)
    .slice(0, limit)
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const snap = await col().where('isNew', '==', true).orderBy('name').limit(limit + 5).get()
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Product))
    .filter(p => p.isActive !== false)
    .slice(0, limit)
}

export async function getSaleProducts(limit = 8): Promise<Product[]> {
  const snap = await col().orderBy('name').get()
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Product))
    .filter(p => p.isActive !== false && p.originalPrice && p.originalPrice > p.price)
    .slice(0, limit)
}

// ─── Admin writes ────────────────────────────────────────────────────────────

export async function createProduct(data: ProductInput): Promise<Product> {
  const ref = col().doc()
  const now = FieldValue.serverTimestamp()
  await ref.set({ ...data, isActive: data.isActive ?? true, createdAt: now, updatedAt: now })
  const snap = await ref.get()
  return { id: ref.id, ...snap.data() } as Product
}

export async function updateProduct(id: string, data: Partial<ProductInput>): Promise<void> {
  await col().doc(id).update({ ...data, updatedAt: FieldValue.serverTimestamp() })
}

export async function deleteProduct(id: string): Promise<void> {
  await col().doc(id).update({ isActive: false, updatedAt: FieldValue.serverTimestamp() })
}

export async function hardDeleteProduct(id: string): Promise<void> {
  await col().doc(id).delete()
}

