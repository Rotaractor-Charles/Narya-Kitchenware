import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { PRODUCTS } from '@/lib/sample-products'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed not allowed in production' }, { status: 403 })
  }

  const results: { slug: string; ok: boolean; error?: string }[] = []

  for (const product of PRODUCTS) {
    try {
      const { id: _id, ...raw } = product
      const now  = new Date().toISOString()

      // Strip undefined — Firestore rejects undefined field values
      const data: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(raw)) {
        if (v !== undefined) data[k] = v
      }
      data.isActive  = true
      data.createdAt = now
      data.updatedAt = now

      await adminDb.collection('products').add(data)
      results.push({ slug: product.slug, ok: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[seed] failed on ${product.slug}:`, msg)
      results.push({ slug: product.slug, ok: false, error: msg })
    }
  }

  const failed = results.filter(r => !r.ok)
  if (failed.length > 0) {
    return NextResponse.json({ results, error: `${failed.length} products failed` }, { status: 207 })
  }

  return NextResponse.json({ seeded: results.length, results })
}
