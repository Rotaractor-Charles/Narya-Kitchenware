import 'server-only'
import { api } from '@/lib/api'
import type { Category } from '@/lib/types'

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<{ data: Category[] }>('/api/v1/categories', {
    next: { revalidate: 300, tags: ['categories'] },
  })
  return res.data
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await api.get<{ data: Category }>(`/api/v1/categories/${slug}`, {
      next: { revalidate: 300, tags: [`category-${slug}`] },
    })
    return res.data
  } catch {
    return null
  }
}
