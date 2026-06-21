import type { Metadata } from 'next'
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
