import 'server-only'
import { cookies } from 'next/headers'

export type Category = {
  id: string
  name: string
  slug: string
  description: string
  isActive: boolean
  sortOrder: number
  productCount: number
  // Legacy Firebase-shaped fields — kept optional for component compatibility
  parentId?: string | null
  displayType?: string
  thumbnail?: string
  order?: number
  count?: number
}

export type CategoryInput = {
  name: string
  slug?: string
  description?: string
  is_active?: boolean
  sort_order?: number
  // Legacy Firebase-shaped fields — silently ignored by Laravel API
  parentId?: string | null
  displayType?: string
  thumbnail?: string
  order?: number
}

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

async function adminHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return null
  return {
    Authorization:  `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept:         'application/json',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(c: any): Category {
  return {
    id:           String(c.id),
    name:         c.name,
    slug:         c.slug,
    description:  c.description ?? '',
    isActive:     c.is_active ?? true,
    sortOrder:    c.sort_order ?? 0,
    productCount: c.products_count ?? 0,
  }
}

export async function getAdminCategories(): Promise<Category[]> {
  const headers = await adminHeaders()
  if (!headers) return []

  const res = await fetch(`${API_URL}/api/v1/admin/categories`, {
    headers,
    cache: 'no-store',
  })
  if (!res.ok) return []

  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.data ?? []).map((c: any) => mapCategory(c))
}

export async function createAdminCategory(input: CategoryInput): Promise<Category> {
  const headers = await adminHeaders()
  if (!headers) throw new Error('Unauthenticated')

  const res = await fetch(`${API_URL}/api/v1/admin/categories`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  })
  const data = await res.json()
  return mapCategory(data.data)
}

export async function updateAdminCategory(id: string, input: Partial<CategoryInput>): Promise<void> {
  const headers = await adminHeaders()
  if (!headers) throw new Error('Unauthenticated')

  await fetch(`${API_URL}/api/v1/admin/categories/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(input),
  })
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const headers = await adminHeaders()
  if (!headers) throw new Error('Unauthenticated')

  await fetch(`${API_URL}/api/v1/admin/categories/${id}`, {
    method: 'DELETE',
    headers,
  })
}
