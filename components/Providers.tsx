'use client'

import { CartProvider } from '@/lib/cart-context'
import CartDrawer from '@/components/cart/CartDrawer'
import type { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
