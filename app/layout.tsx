import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narya.co.ke'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Narya Kitchenware — Quality Cookware, Knives & Kitchen Tools in Kenya',
    template: '%s | Narya Kitchenware',
  },
  description:
    'Premium kitchenware for the Kenyan home cook. Cast iron, ceramic, chef\'s knives, cutting boards and kitchen essentials. Fast delivery to all 47 counties. Family-owned, Nairobi-based.',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: 'Narya Kitchenware',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@naryake',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
