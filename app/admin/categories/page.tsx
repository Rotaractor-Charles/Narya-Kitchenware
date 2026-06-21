import type { Metadata } from 'next'
import { getAdminCategories } from '@/lib/categories-admin'
import CategoriesManager from '@/components/admin/CategoriesManager'

export const metadata: Metadata = { title: 'Product Categories — Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories().catch(() => [])
  return <CategoriesManager initialCategories={categories} />
}
