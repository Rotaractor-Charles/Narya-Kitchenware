import 'server-only'
import { api } from '@/lib/api'
import {
  getFallbackProductBySlug,
  getFallbackProducts,
  shouldUseCatalogFallback,
} from '@/lib/api/catalog-fallback'
import type { Product, Paginated } from '@/lib/types'

export async function getProducts(params?: {
  category?: string
  collection?: string
  search?: string
  page?: number
  per_page?: number
  featured?: boolean
}): Promise<Paginated<Product>> {
  const query = new URLSearchParams()
  if (params?.category)  query.set('category',  params.category)
  if (params?.collection) query.set('collection', params.collection)
  if (params?.search)    query.set('search',     params.search)
  if (params?.page)      query.set('page',       String(params.page))
  if (params?.per_page)  query.set('per_page',   String(params.per_page))
  if (params?.featured)  query.set('featured',   '1')

  const qs = query.toString()
  try {
    return await api.get<Paginated<Product>>(`/api/v1/products${qs ? `?${qs}` : ''}`, {
      next: { revalidate: 60, tags: ['products'] },
    })
  } catch (error) {
    if (shouldUseCatalogFallback(error)) return getFallbackProducts(params)
    throw error
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await api.get<{ data: Product }>(`/api/v1/products/${slug}`, {
      next: { revalidate: 60, tags: [`product-${slug}`] },
    })
    return res.data
  } catch (error) {
    if (shouldUseCatalogFallback(error)) return getFallbackProductBySlug(slug)
    return null
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const res = await getProducts({ featured: true, per_page: limit })
  return res.data
}
