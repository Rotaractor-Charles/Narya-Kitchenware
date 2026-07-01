import 'server-only'
import { CATEGORIES as SAMPLE_CATEGORIES, PRODUCTS as SAMPLE_PRODUCTS } from '@/lib/sample-products'
import type { Category, Paginated, Product } from '@/lib/types'

type ProductQuery = {
  category?: string
  collection?: string
  search?: string
  page?: number
  per_page?: number
  featured?: boolean
}

const LEGACY_PRODUCT_SLUGS: Record<string, string> = {
  'cast-iron-grill-pan-28cm': 'cast-iron-grill-pan',
  'dish-brush-set-3pc': 'dish-brush-set',
  'stainless-steel-wok-32cm': 'stainless-saute-pan-28',
  'french-press-1l': 'pour-over-coffee-set',
}

const fallbackCategories: Category[] = SAMPLE_CATEGORIES
  .filter((category) => !['new', 'sale'].includes(category.slug))
  .map((category, index) => ({
    id: index + 1,
    name: category.label,
    slug: category.slug,
    description: null,
    image: null,
    sort_order: index,
    parent_id: null,
  }))

const categoriesBySlug = new Map(fallbackCategories.map((category) => [category.slug, category]))

function fallbackCategoryFor(slug: string, label: string): Category {
  return categoriesBySlug.get(slug) ?? {
    id: fallbackCategories.length + 1,
    name: label,
    slug,
    description: null,
    image: null,
    sort_order: fallbackCategories.length,
    parent_id: null,
  }
}

const fallbackProducts: Product[] = SAMPLE_PRODUCTS.map((product) => ({
  id: Number(product.id),
  name: product.name,
  slug: product.slug,
  description: product.description,
  short_description: product.description.split('.')[0] || product.description,
  price: product.price,
  compare_at_price: product.originalPrice ?? null,
  sku: `NARYA-${product.id.padStart(4, '0')}`,
  stock_quantity: product.stock,
  backorders_allowed: false,
  is_active: product.stock > 0,
  is_featured: Boolean(product.originalPrice || product.isNew),
  average_rating: product.rating.toFixed(1),
  reviews_count: product.reviews,
  category: fallbackCategoryFor(product.categorySlug, product.category),
  brand: null,
  images: product.images.map((url, index) => ({
    id: Number(product.id) * 100 + index,
    url,
    alt: product.name,
    sort_order: index,
    is_primary: index === 0,
  })),
  variants: [],
}))

export function shouldUseCatalogFallback(error: unknown) {
  if (error instanceof TypeError) return true
  if (error instanceof Error) {
    return error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')
  }
  return false
}

export function getFallbackCategories(): Category[] {
  return fallbackCategories
}

export function getFallbackCategoryBySlug(slug: string): Category | null {
  return categoriesBySlug.get(slug) ?? null
}

export function getFallbackProductBySlug(slug: string): Product | null {
  const product = fallbackProducts.find((item) => item.slug === slug)
  if (product) return product

  const legacySlug = LEGACY_PRODUCT_SLUGS[slug]
  if (!legacySlug) return null

  const legacyProduct = fallbackProducts.find((item) => item.slug === legacySlug)
  return legacyProduct ? { ...legacyProduct, slug } : null
}

export function getFallbackProducts(params: ProductQuery = {}): Paginated<Product> {
  const page = Math.max(params.page ?? 1, 1)
  const perPage = Math.max(params.per_page ?? fallbackProducts.length, 1)
  const search = params.search?.trim().toLowerCase()

  let products = fallbackProducts

  if (params.category) {
    products = products.filter((product) => product.category.slug === params.category)
  }

  if (params.featured) {
    products = products.filter((product) => product.is_featured)
  }

  if (params.collection === 'gift-sets') {
    products = products.filter((product) => product.compare_at_price !== null || product.is_featured)
  }

  if (search) {
    products = products.filter((product) => {
      return [
        product.name,
        product.description,
        product.category.name,
        product.sku,
      ].some((value) => value?.toLowerCase().includes(search))
    })
  }

  const total = products.length
  const start = (page - 1) * perPage
  const data = products.slice(start, start + perPage)

  return {
    data,
    meta: {
      current_page: page,
      last_page: Math.max(Math.ceil(total / perPage), 1),
      per_page: perPage,
      total,
    },
  }
}
