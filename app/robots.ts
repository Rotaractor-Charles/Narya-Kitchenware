import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narya.co.ke'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/account',
          '/account/',
          '/checkout',
          '/checkout/',
          '/cart',
          '/cart/',
          '/wishlist',
          '/wishlist/',
          '/orders',
          '/orders/',
          '/order-confirmation',
          '/order-confirmation/',
          '/affiliate/dashboard',
          '/notifications',
          '/search',
          '/api/',
          '/themes',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
