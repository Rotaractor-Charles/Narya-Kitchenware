import 'server-only'
import { adminDb } from '@/lib/firebase-admin'

export type Category = {
  id:          string
  name:        string
  slug:        string
  parentId:    string | null
  description: string
  displayType: 'products' | 'subcategories' | 'both'
  thumbnail:   string
  order:       number
  count?:      number
  createdAt?:  string
  updatedAt?:  string
}

export type CategoryInput = Omit<Category, 'id' | 'count' | 'createdAt' | 'updatedAt'>

const col = () => adminDb.collection('categories')

export async function getAdminCategories(): Promise<Category[]> {
  const snap = await col().orderBy('order').get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category))
}

export async function createAdminCategory(data: CategoryInput): Promise<Category> {
  const now = new Date().toISOString()
  const ref  = col().doc()
  await ref.set({ ...data, createdAt: now, updatedAt: now })
  return { id: ref.id, ...data, createdAt: now, updatedAt: now }
}

export async function updateAdminCategory(id: string, data: Partial<CategoryInput>): Promise<void> {
  await col().doc(id).update({ ...data, updatedAt: new Date().toISOString() })
}

export async function deleteAdminCategory(id: string): Promise<void> {
  await col().doc(id).delete()
}
