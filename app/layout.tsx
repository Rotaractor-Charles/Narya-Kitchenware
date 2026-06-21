import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Narya Kitchenware',
    template: '%s | Narya Kitchenware',
  },
  description:
    'Premium kitchenware for the home cook. Thoughtfully designed tools built to last a lifetime.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream text-forest antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
