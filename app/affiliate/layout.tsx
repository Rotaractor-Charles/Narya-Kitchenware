import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Program | Narya Kitchenware',
  robots: { index: false },
}

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
