import ShopClient from '@/components/shop/ShopClient'

export const metadata = { title: 'Shop All Products' }

export default function ShopPage() {
  return (
    <>
      <div className="bg-ivory-dark border-b border-earth/8 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-2xl sm:text-3xl text-earth mb-1">Shop All Products</h1>
          <p className="text-sm text-earth/50">Thoughtfully designed tools for home cooks who care.</p>
        </div>
      </div>
      <ShopClient />
    </>
  )
}
