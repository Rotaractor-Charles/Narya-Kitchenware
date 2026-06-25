// Shared TypeScript types matching Laravel API responses.
// Prices are integers in KES cents throughout.

export type User = {
  id: number
  name: string
  email: string
  role: 'customer' | 'admin' | 'shop_manager'
  default_payment_method: 'mpesa' | 'card' | 'bank_transfer' | 'crypto' | null
  default_address: Address | null
  points_balance?: number
  email_verified_at: string | null
  created_at: string
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  sort_order: number
  parent_id: number | null
  children?: Category[]
}

export type Brand = {
  id: number
  name: string
  slug: string
  logo: string | null
}

export type ProductImage = {
  id: number
  url: string
  alt: string | null
  sort_order: number
  is_primary: boolean
}

export type ProductVariant = {
  id: number
  name: string
  sku: string
  price: number | null
  stock_quantity: number
  attributes: Record<string, string>
  image: string | null
  is_active: boolean
}

export type Product = {
  id: number
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  sku: string
  stock_quantity: number
  backorders_allowed: boolean
  is_active: boolean
  is_featured: boolean
  average_rating: string
  reviews_count: number
  category: Category
  brand: Brand | null
  images: ProductImage[]
  variants: ProductVariant[]
}

export type OrderItem = {
  id: number
  product_id: number | null
  product_variant_id: number | null
  name: string
  sku: string
  image: string | null
  price: number
  quantity: number
  subtotal: number
}

export type Order = {
  id: number
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  tip_total: number
  total: number
  currency: string
  shipping_method: 'standard' | 'express' | 'pickup' | null
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'partially_refunded'
  items: OrderItem[]
  created_at: string
}

export type Address = {
  id: number
  name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  county: string | null
  country: string
  postal_code: string | null
  is_default: boolean
}

export type Review = {
  id: number
  rating: number
  title: string | null
  body: string
  is_approved: boolean
  reviewer: string
  created_at: string
  product?: { id: number; name: string; slug: string }
}

export type ReviewMeta = {
  total: number
  current_page: number
  last_page: number
  average: string | null
  count: number
}

// ── Pagination wrapper ──────────────────────────────────────────────────────

export type Paginated<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
