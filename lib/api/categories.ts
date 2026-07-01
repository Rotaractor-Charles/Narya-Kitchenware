import 'server-only'
import { api } from '@/lib/api'
import {
  getFallbackCategories,
  getFallbackCategoryBySlug,
  shouldUseCatalogFallback,
} from '@/lib/api/catalog-fallback'
import type { Category } from '@/lib/types'

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await api.get<{ data: Category[] }>('/api/v1/categories', {
      next: { revalidate: 300, tags: ['categories'] },
    })
    return res.data
  } catch (error) {
    if (shouldUseCatalogFallback(error)) return getFallbackCategories()
    throw error
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await api.get<{ data: Category }>(`/api/v1/categories/${slug}`, {
      next: { revalidate: 300, tags: [`category-${slug}`] },
    })
    return res.data
  } catch (error) {
    if (shouldUseCatalogFallback(error)) return getFallbackCategoryBySlug(slug)
    return null
  }
}
