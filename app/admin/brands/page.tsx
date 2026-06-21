import type { Metadata } from 'next'
import { getAdminBrands } from '@/lib/brands-admin'
import BrandsManager from '@/components/admin/BrandsManager'

export const metadata: Metadata = { title: 'Brands — Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands().catch(() => [])
  return <BrandsManager initialBrands={brands} />
}
