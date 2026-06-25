'use client'

import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import CartDrawer from '@/components/cart/CartDrawer'
import type { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <CartDrawer />
      </WishlistProvider>
    </CartProvider>
  )
}
