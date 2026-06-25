import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'
const CART_COOKIE = 'narya_cart'

type CheckoutItem = {
  id?: string
  name?: string
  product_id: number | null
  product_variant_id?: number | null
  quantity: number
}

type LaravelCartItem = {
  id: number
  product_id: number | null
  product_variant_id: number | null
  quantity: number
}

type CartSyncDebug = {
  checkoutItems: CheckoutItem[]
  initialCart: unknown
  writes: unknown[]
  verifiedCart: unknown
}

async function authHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  const cartSession = cookieStore.get(CART_COOKIE)?.value
  if (!token) return null
  return {
    Authorization:  `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept:         'application/json',
    ...(cartSession ? { 'X-Cart-Session': cartSession } : {}),
  }
}

function cartKey(item: { product_id: number | null; product_variant_id: number | null }) {
  return `${item.product_id ?? ''}:${item.product_variant_id ?? ''}`
}

async function readJson(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function extractCartItems(payload: unknown): LaravelCartItem[] {
  if (!payload || typeof payload !== 'object') return []

  const root = payload as {
    data?: unknown
    items?: unknown
    cart?: unknown
  }
  const data = root.data as {
    items?: unknown
    cart?: unknown
  } | undefined
  const cart = (data?.cart ?? root.cart) as { items?: unknown } | undefined
  const candidates = [
    data?.items,
    cart?.items,
    root.items,
    Array.isArray(root.data) ? root.data : undefined,
  ]
  const items = candidates.find(Array.isArray) ?? []

  return items.filter((item): item is LaravelCartItem => {
    if (!item || typeof item !== 'object') return false
    const row = item as Partial<LaravelCartItem>
    return typeof row.id === 'number' && typeof row.quantity === 'number'
  })
}

function extractCartSessionId(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const sessionId = (payload as { session_id?: unknown }).session_id
  return typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : null
}

async function requireLaravelOk(response: Response, action: string) {
  if (response.ok) return
  const data = await readJson(response)
  throw new Error(
    `${action} failed (${response.status}): ${data?.message ?? response.statusText}`
  )
}

async function ensureCartMatchesCheckoutItems(
  headers: Record<string, string>,
  checkoutItems: CheckoutItem[] | undefined,
): Promise<{ cartSessionId: string | null }> {
  if (!checkoutItems?.length) {
    throw new Error('Checkout did not send any cart items.')
  }

  const invalidItems = checkoutItems.filter(item => !item.product_id || item.quantity <= 0)
  if (invalidItems.length > 0) {
    const names = invalidItems.map(item => item.name ?? item.id ?? 'Unknown item').join(', ')
    throw new Error(`Checkout cart has items missing product IDs: ${names}. Refresh the cart and try again.`)
  }

  const cartSyncDebug: CartSyncDebug = {
    checkoutItems,
    initialCart: null,
    writes: [],
    verifiedCart: null,
  }

  const currentCartRes = await fetch(`${API_URL}/api/v1/cart`, { headers })
  await requireLaravelOk(currentCartRes, 'Fetching cart before order')
  const currentCart = await readJson(currentCartRes)
  cartSyncDebug.initialCart = currentCart
  let cartSessionId = extractCartSessionId(currentCart)
  const serverItems = extractCartItems(currentCart)
  const serverQtyByKey = new Map(serverItems.map(item => [cartKey(item), item.quantity]))
  const serverItemByKey = new Map(serverItems.map(item => [cartKey(item), item]))
  const checkoutQtyByKey = new Map(
    checkoutItems
      .filter(item => item.product_id && item.quantity > 0)
      .map(item => [
        cartKey({
          product_id: item.product_id,
          product_variant_id: item.product_variant_id ?? null,
        }),
        item.quantity,
      ]),
  )

  for (const serverItem of serverItems) {
    const desiredQty = checkoutQtyByKey.get(cartKey(serverItem)) ?? 0

    if (desiredQty === 0) {
      const res = await fetch(`${API_URL}/api/v1/cart/${serverItem.id}`, {
        method: 'DELETE',
        headers,
      })
      await requireLaravelOk(res, `Removing stale cart item ${serverItem.id}`)
    } else if (serverItem.quantity > desiredQty) {
      const res = await fetch(`${API_URL}/api/v1/cart/${serverItem.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ quantity: desiredQty }),
      })
      await requireLaravelOk(res, `Updating cart item ${serverItem.id}`)
    }
  }

  for (const item of checkoutItems) {
    if (!item.product_id || item.quantity <= 0) continue

    const key = cartKey({
      product_id: item.product_id,
      product_variant_id: item.product_variant_id ?? null,
    })
    const serverQty = serverQtyByKey.get(key) ?? 0
    const serverItem = serverItemByKey.get(key)
    const missingQty = item.quantity - serverQty

    if (missingQty > 0) {
      const res = await fetch(`${API_URL}/api/v1/cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          product_id:         item.product_id,
          product_variant_id: item.product_variant_id ?? null,
          quantity:           missingQty,
        }),
      })
      await requireLaravelOk(res, `Adding ${item.name ?? item.product_id} to cart`)
      const writePayload = await readJson(res)
      cartSessionId = extractCartSessionId(writePayload) ?? cartSessionId
      if (cartSessionId) headers['X-Cart-Session'] = cartSessionId
      cartSyncDebug.writes.push(writePayload)
    } else if (serverItem && serverQty !== item.quantity) {
      const res = await fetch(`${API_URL}/api/v1/cart/${serverItem.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ quantity: item.quantity }),
      })
      await requireLaravelOk(res, `Updating cart item ${serverItem.id}`)
      const writePayload = await readJson(res)
      cartSessionId = extractCartSessionId(writePayload) ?? cartSessionId
      if (cartSessionId) headers['X-Cart-Session'] = cartSessionId
      cartSyncDebug.writes.push(writePayload)
    }
  }

  const verifiedCartRes = await fetch(`${API_URL}/api/v1/cart`, { headers })
  await requireLaravelOk(verifiedCartRes, 'Verifying cart before order')
  const verifiedCart = await readJson(verifiedCartRes)
  cartSyncDebug.verifiedCart = verifiedCart
  const verifiedItems = extractCartItems(verifiedCart)
  if (verifiedItems.length === 0) {
    if (cartSessionId) return { cartSessionId }
    throw new Error(
      `Laravel cart is still empty after syncing checkout items. cartSyncDebug=${JSON.stringify(cartSyncDebug)}`
    )
  }

  return { cartSessionId }
}

function isEmptyCartResponse(status: number, payload: unknown) {
  if (status < 400 || !payload || typeof payload !== 'object') return false
  const message = (payload as { message?: unknown }).message
  return typeof message === 'string' && message.toLowerCase().includes('cart is empty')
}

async function retryOrderWithCartSession(
  body: unknown,
  authHeaders: Record<string, string>,
  cartSessionId: string | null,
) {
  if (!cartSessionId) return null

  const headers = {
    ...authHeaders,
    'X-Cart-Session': cartSessionId,
  }

  const res = await fetch(`${API_URL}/api/v1/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await readJson(res)
  return { res, data, cartSessionId }
}

// GET /api/orders — list authenticated user's orders
export async function GET() {
  const headers = await authHeaders()
  if (!headers) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const res  = await fetch(`${API_URL}/api/v1/orders`, { headers })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

// POST /api/orders — create order from cart
export async function POST(request: NextRequest) {
  const headers = await authHeaders()
  if (!headers) return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 })

  const body = await request.json()
  const checkoutItems = body.items as CheckoutItem[] | undefined
  delete body.items

  // Forward affiliate tracking cookie to Laravel for attribution (spec §8)
  const cookieStore = await cookies()
  const affiliateRef = cookieStore.get('narya_affiliate_ref')?.value
  if (affiliateRef && !body.affiliate_code) {
    body.affiliate_code = affiliateRef
  }

  let cartSessionId: string | null = null
  try {
    ;({ cartSessionId } = await ensureCartMatchesCheckoutItems(headers, checkoutItems))
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Could not sync cart before placing order.' },
      { status: 409 },
    )
  }

  const res  = await fetch(`${API_URL}/api/v1/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (isEmptyCartResponse(res.status, data)) {
    const retry = await retryOrderWithCartSession(body, headers, cartSessionId)
    if (retry) {
      if (retry.res.status === 401) {
        return NextResponse.json(
          {
            message: 'Checkout is logged in, but Laravel rejected the cart-session order retry. Please sign out, sign in again, and try placing the order once more.',
            originalMessage: data?.message,
          },
          { status: 409 },
        )
      }

      const response = NextResponse.json(retry.data, { status: retry.res.status })
      if (retry.res.ok) {
        response.cookies.set(CART_COOKIE, retry.cartSessionId, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        })
      }
      return response
    }
  }
  return NextResponse.json(data, { status: res.status })
}
