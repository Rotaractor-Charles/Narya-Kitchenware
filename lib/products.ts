import 'server-only'
import { cookies } from 'next/headers'

// Admin-facing product shape used by ProductsTable and ProductForm
export type Product = {
  id: string
  slug: string
  name: string
  description: string
  category: string
  categorySlug: string
  categoryId: number | null
  price: number          // KES (not cents)
  originalPrice?: number // KES (not cents)
  sku: string
  images: string[]       // array of URLs
  stock: number
  isActive: boolean
  isFeatured: boolean
  isNew?: boolean
  care?: string
  createdAt?: string
}

export type ProductInput = {
  name: string
  slug?: string
  description?: string
  price: number          // KES
  originalPrice?: number // KES
  sku: string
  stock_quantity: number
  category_id?: number | null
  is_active?: boolean
  is_featured?: boolean
}

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

async function adminToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('narya_token')?.value ?? null
}

function adminHeaders(token: string): Record<string, string> {
  return {
    Authorization:  `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept:         'application/json',
  }
}

// Map Laravel product shape → admin Product type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  return {
    id:           String(p.id),
    slug:         p.slug,
    name:         p.name,
    description:  p.description ?? '',
    category:     p.category?.name ?? '',
    categorySlug: p.category?.slug ?? '',
    categoryId:   p.category?.id ?? null,
    price:        Math.round((p.price ?? 0) / 100),
    originalPrice: p.compare_at_price ? Math.round(p.compare_at_price / 100) : undefined,
    sku:          p.sku ?? '',
    images:       (p.images ?? []).map((i: { url: string }) => i.url),
    stock:        p.stock_quantity ?? 0,
    isActive:     p.is_active ?? true,
    isFeatured:   p.is_featured ?? false,
    createdAt:    p.created_at,
  }
}

export async function getProducts(): Promise<Product[]> {
  const token = await adminToken()
  if (!token) return []

  const res = await fetch(`${API_URL}/api/v1/admin/products?per_page=100`, {
    headers: adminHeaders(token),
    cache: 'no-store',
  })
  if (!res.ok) return []

  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.data ?? []).map((p: any) => mapProduct(p))
}

export async function getProductById(id: string): Promise<Product | null> {
  const token = await adminToken()
  if (!token) return null

  const res = await fetch(`${API_URL}/api/v1/admin/products/${id}`, {
    headers: adminHeaders(token),
    cache: 'no-store',
  })
  if (!res.ok) return null

  const data = await res.json()
  return mapProduct(data.data)
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const token = await adminToken()
  if (!token) throw new Error('Unauthenticated')

  const res = await fetch(`${API_URL}/api/v1/admin/products`, {
    method: 'POST',
    headers: adminHeaders(token),
    body: JSON.stringify({
      ...input,
      price:            Math.round((input.price ?? 0) * 100),
      compare_at_price: input.originalPrice ? Math.round(input.originalPrice * 100) : null,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Create failed')
  }
  const data = await res.json()
  return mapProduct(data.data)
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  const token = await adminToken()
  if (!token) throw new Error('Unauthenticated')

  const body: Record<string, unknown> = { ...input }
  if (typeof input.price === 'number')         body.price            = Math.round(input.price * 100)
  if (typeof input.originalPrice === 'number') body.compare_at_price = Math.round(input.originalPrice * 100)
  delete body.originalPrice

  await fetch(`${API_URL}/api/v1/admin/products/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(token),
    body: JSON.stringify(body),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  const token = await adminToken()
  if (!token) throw new Error('Unauthenticated')

  await fetch(`${API_URL}/api/v1/admin/products/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(token),
  })
}
