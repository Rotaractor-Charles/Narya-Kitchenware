import type { Metadata } from 'next'
import { getProducts } from '@/lib/products'
import ProductsTable from '@/components/admin/ProductsTable'
import SeedButton from '@/components/admin/SeedButton'

export const metadata: Metadata = { title: 'Products — Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await getProducts().catch(() => [])

  return (
    <div className="flex-1">
      {products.length === 0 && (
        <div className="flex justify-end px-6 pt-4">
          <SeedButton />
        </div>
      )}
      <ProductsTable products={products} />
    </div>
  )
}
