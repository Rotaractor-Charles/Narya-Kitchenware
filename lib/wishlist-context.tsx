'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useAuth } from '@/lib/auth-context'

type WishlistItem = {
  id: number          // wishlist row id (for DELETE)
  productId: number
}

type WishlistCtx = {
  ids: Set<number>                           // product IDs currently wishlisted
  itemId: (productId: number) => number | undefined  // wishlist row id for a product
  toggle: (productId: number) => Promise<void>
  loading: boolean
}

const Ctx = createContext<WishlistCtx | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user }                      = useAuth()
  const [items,   setItems]           = useState<WishlistItem[]>([])
  const [loading, setLoading]         = useState(false)

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return }
    setLoading(true)
    try {
      const res  = await fetch('/api/wishlist')
      const data = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setItems((data.data ?? []).map((w: any) => ({ id: w.id, productId: w.product_id })))
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { void fetchWishlist() }, [fetchWishlist])

  const ids    = new Set(items.map(i => i.productId))
  const itemId = (productId: number) => items.find(i => i.productId === productId)?.id

  const toggle = useCallback(async (productId: number) => {
    if (!user) return

    const existing = items.find(i => i.productId === productId)

    if (existing) {
      // Optimistic remove
      setItems(prev => prev.filter(i => i.productId !== productId))
      await fetch(`/api/wishlist/${existing.id}`, { method: 'DELETE' })
    } else {
      // Optimistic add with temp id
      const tempId = -productId
      setItems(prev => [...prev, { id: tempId, productId }])
      const res  = await fetch('/api/wishlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ product_id: productId }),
      })
      if (res.ok) {
        const data = await res.json()
        // Replace temp id with real server id
        setItems(prev => prev.map(i => i.id === tempId ? { id: data.data.id, productId } : i))
      } else {
        // Rollback
        setItems(prev => prev.filter(i => i.id !== tempId))
      }
    }
  }, [user, items])

  return (
    <Ctx.Provider value={{ ids, itemId, toggle, loading }}>
      {children}
    </Ctx.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
