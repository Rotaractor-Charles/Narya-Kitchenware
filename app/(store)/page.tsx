import HeroCarousel   from '@/components/home/HeroCarousel'
import QuickShortcuts from '@/components/home/QuickShortcuts'
import FlashSale      from '@/components/home/FlashSale'
import ProductRow     from '@/components/home/ProductRow'
import CategoryTiles  from '@/components/home/CategoryTiles'
import Newsletter     from '@/components/home/Newsletter'
import { getProducts } from '@/lib/api/products'

const FLASH_SALE_ENDS = new Date(
  new Date().setHours(23, 59, 59, 0)
).toISOString()

export default async function HomePage() {
  const [{ data: featured }, { data: allProducts }] = await Promise.all([
    getProducts({ featured: true, per_page: 8 }),
    getProducts({ per_page: 50 }),
  ])

  const onSale    = allProducts.filter(p => p.compare_at_price !== null).slice(0, 8)
  const topSellers = [...allProducts]
    .sort((a, b) => b.reviews_count - a.reviews_count)
    .slice(0, 8)
  const newArrivals = [...allProducts]
    .sort((a, b) => b.id - a.id)
    .slice(0, 8)

  const flashProducts = onSale.slice(0, 4).map(p => ({
    id:            String(p.id),
    slug:          p.slug,
    name:          p.name,
    price:         p.price / 100,
    originalPrice: p.compare_at_price ? p.compare_at_price / 100 : undefined,
    image:         p.images?.find(i => i.is_primary)?.url ?? p.images?.[0]?.url ?? '/products/placeholder.svg',
    stock:         p.stock_quantity,
  }))

  return (
    <>
      <HeroCarousel />
      <QuickShortcuts />

      <ProductRow
        title="Deals of the Day"
        seeAllHref="/shop/sale"
        products={onSale}
      />

      <FlashSale endsAt={FLASH_SALE_ENDS} products={flashProducts} />

      <CategoryTiles />

      <ProductRow
        title="Top Sellers"
        seeAllHref="/shop?sort=best-selling"
        products={topSellers}
      />

      <ProductRow
        title="New Arrivals"
        seeAllHref="/shop/new"
        products={newArrivals}
      />

      <Newsletter />
    </>
  )
}
