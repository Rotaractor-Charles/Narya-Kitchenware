'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useAuth } from '@/lib/auth-context'

export type CartItem = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  originalPrice?: number
  qty: number
  cartItemId?: number
  productId?: number
  variantId?: number
  variantName?: string
}

type CartCtx = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'qty' | 'cartItemId'> & { qty?: number }) => void
  removeItem: (id: string) => void
  updateQty: (id: string, delta: number) => void
  clearCart: () => void
  waitForCartSync: () => Promise<void>
  itemCount: number
  subtotal: number
}

const Ctx = createContext<CartCtx | null>(null)

type ServerItem = {
  id: number
  quantity: number
  product_id: number | null
  product_variant_id: number | null
  product: {
    id: number
    name: string
    slug: string
    price: number
    compare_at_price: number | null
    image_url: string | null
  } | null
  variant: {
    id: number
    name: string
    price: number | null
    image: string | null
  } | null
}

function normalise(raw: ServerItem[]): CartItem[] {
  return raw
    .filter(i => i.product !== null)
    .map(i => {
      const price  = i.variant?.price ?? i.product!.price
      const itemId = i.variant
        ? `${i.product!.slug}-v${i.variant.id}`
        : i.product!.slug

      return {
        id:            itemId,
        slug:          i.product!.slug,
        name:          i.product!.name,
        image:         i.variant?.image ?? i.product!.image_url ?? '/products/placeholder.svg',
        price:         price / 100,
        originalPrice: i.product!.compare_at_price
          ? i.product!.compare_at_price / 100
          : undefined,
        qty:           i.quantity,
        cartItemId:    i.id,
        productId:     i.product!.id,
        variantId:     i.variant?.id,
        variantName:   i.variant?.name,
      }
    })
}

function mergeCartItems(current: CartItem[], serverItems: CartItem[]): CartItem[] {
  if (current.length === 0) return serverItems
  if (serverItems.length === 0) return current

  const serverById = new Map(serverItems.map(item => [item.id, item]))
  const currentOnly = current.filter(item => !serverById.has(item.id))

  return [...serverItems, ...currentOnly]
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,  setItems]  = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { user }            = useAuth()

  const prevUserId = useRef<number | null | undefined>(undefined)

  const itemsRef = useRef<CartItem[]>([])
  useEffect(() => { itemsRef.current = items }, [items])

  const addSyncQueueRef = useRef<Promise<void>>(Promise.resolve())
  const addMutationSeqRef = useRef(0)
  const latestAddMutationByItemRef = useRef(new Map<string, number>())

  const fetchCart = useCallback(async (): Promise<CartItem[] | null> => {
    try {
      const res = await fetch('/api/cart')
      if (!res.ok) return null
      const data = await res.json()
      return normalise((data?.data?.items ?? []) as ServerItem[])
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    fetchCart().then(serverItems => {
      if (serverItems === null) return
      setItems(prev => mergeCartItems(prev, serverItems))
    })
  }, [fetchCart])

  useEffect(() => {
    if (prevUserId.current === undefined) {
      prevUserId.current = user?.id ?? null
      return
    }
    if ((user?.id ?? null) === prevUserId.current) return

    const wasGuest  = prevUserId.current === null
    const nowAuthed = user !== null
    prevUserId.current = user?.id ?? null

    if (wasGuest && nowAuthed) {
      const syncGuestCart = async () => {
        const guestItems = itemsRef.current.filter(i => i.productId)
        await Promise.all(
          guestItems.map(item =>
            fetch('/api/cart', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                product_id:         item.productId,
                product_variant_id: item.variantId ?? null,
                quantity:           item.qty,
              }),
            }).catch(() => {})
          )
        )
        const merged = await fetchCart()
        if (merged !== null) setItems(prev => mergeCartItems(prev, merged))
      }
      addSyncQueueRef.current = addSyncQueueRef.current.then(syncGuestCart, syncGuestCart)
    } else if (!nowAuthed) {
      // Logout — clear cart immediately so previous user's items don't flash
      setItems([])
    } else {
      fetchCart().then(fresh => { if (fresh !== null) setItems(fresh) })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const openCart  = useCallback(() => setIsOpen(true),  [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const waitForCartSync = useCallback(
    () => addSyncQueueRef.current.catch(() => {}),
    []
  )

  const addItem = useCallback((
    incoming: Omit<CartItem, 'qty' | 'cartItemId'> & { qty?: number }
  ) => {
    const qty    = incoming.qty ?? 1
    const itemId = incoming.variantId
      ? `${incoming.slug}-v${incoming.variantId}`
      : (incoming.id || incoming.slug)

    setItems(prev => {
      const existing = prev.find(i => i.id === itemId)
      if (existing) {
        return prev.map(i => i.id === itemId ? { ...i, qty: i.qty + qty } : i)
      }
      return [...prev, { ...incoming, id: itemId, qty }]
    })
    setIsOpen(true)

    if (!incoming.productId) return

    const mutationId = ++addMutationSeqRef.current
    latestAddMutationByItemRef.current.set(itemId, mutationId)
    const isLatestMutation = () =>
      latestAddMutationByItemRef.current.get(itemId) === mutationId

    const syncAdd = async () => {
      try {
        const r = await fetch('/api/cart', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id:         incoming.productId,
            product_variant_id: incoming.variantId ?? null,
            quantity:           qty,
          }),
        })

        if (!r.ok) {
          if (r.status === 422 && isLatestMutation()) {
            setItems(prev => prev.filter(i => i.id !== itemId))
          }
          return
        }

        const data = await r.json()
        if (data?.data?.items) {
          const serverItems = normalise(data.data.items as ServerItem[])
          const serverItem  = serverItems.find(i => i.id === itemId)
          if (!isLatestMutation()) return

          setItems(prev => {
            if (serverItem) {
              return prev.map(i => {
                if (i.id !== itemId) return i
                return {
                  ...serverItem,
                  qty: Math.max(i.qty, serverItem.qty),
                }
              })
            }
            return prev
          })

          if (!serverItem) {
            const fresh = await fetchCart()
            if (fresh !== null && isLatestMutation()) {
              setItems(prev => mergeCartItems(prev, fresh))
            }
          }
        }
      } catch {
        // Keep optimistic state on network failure; next load reconciles.
      }
    }

    addSyncQueueRef.current = addSyncQueueRef.current.then(syncAdd, syncAdd)
  }, [fetchCart])

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item?.cartItemId) {
        fetch(`/api/cart/items/${item.cartItemId}`, { method: 'DELETE' })
          .then(r => { if (!r.ok) fetchCart().then(real => { if (real !== null) setItems(real) }) })
          .catch(() => {})
      }
      return prev.filter(i => i.id !== id)
    })
  }, [fetchCart])

  const updateQty = useCallback((id: string, delta: number) => {
    setItems(prev => {
      const updated = prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)

      const item        = prev.find(i => i.id === id)
      const updatedItem = updated.find(i => i.id === id)

      if (item?.cartItemId) {
        const req = updatedItem
          ? fetch(`/api/cart/items/${item.cartItemId}`, {
              method:  'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({ quantity: updatedItem.qty }),
            })
          : fetch(`/api/cart/items/${item.cartItemId}`, { method: 'DELETE' })

        req
          .then(r => { if (!r.ok) fetchCart().then(real => { if (real !== null) setItems(real) }) })
          .catch(() => {})
      }

      return updated
    })
  }, [fetchCart])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = items.reduce((s, i) => s + i.qty, 0)
  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <Ctx.Provider value={{
      items, isOpen, openCart, closeCart,
      addItem, removeItem, updateQty, clearCart, waitForCartSync,
      itemCount, subtotal,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
