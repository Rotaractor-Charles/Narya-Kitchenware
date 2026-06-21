'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type CartItem = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  originalPrice?: number
  qty: number
}

type CartCtx = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void
  removeItem: (id: string) => void
  updateQty: (id: string, delta: number) => void
  itemCount: number
  subtotal: number
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'cast-iron-skillet',
      slug: 'cast-iron-skillet',
      name: 'Cast Iron Skillet 10"',
      image: '/products/cast-iron-skillet.svg',
      price: 3200,
      qty: 1,
    },
    {
      id: 'mixing-bowls',
      slug: 'mixing-bowls',
      name: 'Ceramic Mixing Bowl Set',
      image: '/products/mixing-bowls.svg',
      price: 2800,
      originalPrice: 3500,
      qty: 2,
    },
  ])
  const [isOpen, setIsOpen] = useState(false)

  const openCart  = useCallback(() => setIsOpen(true),  [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addItem = useCallback((incoming: Omit<CartItem, 'qty'> & { qty?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === incoming.id)
      if (existing) {
        return prev.map(i =>
          i.id === incoming.id ? { ...i, qty: i.qty + (incoming.qty ?? 1) } : i
        )
      }
      return [...prev, { ...incoming, qty: incoming.qty ?? 1 }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    )
  }, [])

  const itemCount = items.reduce((s, i) => s + i.qty, 0)
  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <Ctx.Provider value={{ items, isOpen, openCart, closeCart, addItem, removeItem, updateQty, itemCount, subtotal }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
