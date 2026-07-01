import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/api/products'
import { getCategories } from '@/lib/api/categories'
import { RECIPES } from '@/lib/recipes'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narya.co.ke'

function url(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified: new Date(), changeFrequency, priority }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic data — fall back to empty arrays if the API is unavailable at build time
  const [productsRes, categories] = await Promise.all([
    getProducts({ per_page: 500 }).catch(() => ({ data: [] })),
    getCategories().catch(() => []),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    url('/',                  1.0,  'daily'),
    url('/shop',              0.9,  'daily'),
    url('/shop/new',          0.8,  'daily'),
    url('/shop/sale',         0.8,  'daily'),
    url('/shop/gift-sets',    0.7,  'weekly'),
    url('/blog',              0.7,  'weekly'),
    url('/recipes',           0.7,  'weekly'),
    url('/guides',            0.6,  'monthly'),
    url('/guides/gifts',      0.6,  'monthly'),
    url('/rewards',           0.6,  'monthly'),
    url('/about',             0.5,  'monthly'),
    url('/contact',           0.5,  'monthly'),
    url('/shipping-returns',  0.4,  'monthly'),
    url('/terms',             0.3,  'monthly'),
    url('/privacy',           0.3,  'monthly'),
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) =>
    url(`/shop/${cat.slug}`, 0.8, 'daily')
  )

  const productPages: MetadataRoute.Sitemap = productsRes.data.map((product) =>
    url(`/product/${product.slug}`, 0.9, 'weekly')
  )

  const recipePages: MetadataRoute.Sitemap = RECIPES.map((recipe) =>
    url(`/recipes/${recipe.slug}`, 0.6, 'monthly')
  )

  return [...staticPages, ...categoryPages, ...productPages, ...recipePages]
}
