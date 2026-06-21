import 'server-only'
import { adminDb } from '@/lib/firebase-admin'

export type Brand = {
  id:          string
  name:        string
  slug:        string
  description: string
  thumbnail:   string
  website:     string
  order:       number
  count?:      number
  createdAt?:  string
  updatedAt?:  string
}

export type BrandInput = Omit<Brand, 'id' | 'count' | 'createdAt' | 'updatedAt'>

const col = () => adminDb.collection('brands')

export async function getAdminBrands(): Promise<Brand[]> {
  const snap = await col().orderBy('order').get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Brand))
}

export async function createAdminBrand(data: BrandInput): Promise<Brand> {
  const now = new Date().toISOString()
  const ref  = col().doc()
  await ref.set({ ...data, createdAt: now, updatedAt: now })
  return { id: ref.id, ...data, createdAt: now, updatedAt: now }
}

export async function updateAdminBrand(id: string, data: Partial<BrandInput>): Promise<void> {
  await col().doc(id).update({ ...data, updatedAt: new Date().toISOString() })
}

export async function deleteAdminBrand(id: string): Promise<void> {
  await col().doc(id).delete()
}
