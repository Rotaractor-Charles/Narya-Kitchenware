import HeroCarousel    from '@/components/home/HeroCarousel'
import QuickShortcuts  from '@/components/home/QuickShortcuts'
import FlashSale       from '@/components/home/FlashSale'
import ProductRow      from '@/components/home/ProductRow'
import CategoryTiles   from '@/components/home/CategoryTiles'
import Newsletter      from '@/components/home/Newsletter'

const FLASH_SALE_ENDS = new Date(
  new Date().setHours(23, 59, 59, 0)
).toISOString()

// Sample products — replace with Firestore queries when backend is ready
const DEALS = [
  { id: '1', name: 'Cast Iron Skillet 10"', slug: 'cast-iron-skillet-10', price: 4200, originalPrice: 6500, image: '/products/cast-iron-skillet.svg', stock: 8,  rating: 4.8, reviews: 124 },
  { id: '2', name: 'Ceramic Stockpot 5L',   slug: 'ceramic-stockpot-5l',  price: 5800, originalPrice: 8200, image: '/products/ceramic-stockpot.svg',   stock: 3,  rating: 4.6, reviews: 87  },
  { id: '3', name: 'Acacia Cutting Board',   slug: 'acacia-cutting-board', price: 2200, originalPrice: 3100, image: '/products/cutting-board.svg',       stock: 14, rating: 4.8, reviews: 214 },
  { id: '4', name: 'Chef\'s Knife 8"',        slug: 'chefs-knife-8',        price: 3500, originalPrice: 4800, image: '/products/chefs-knife.svg',          stock: 6,  rating: 4.9, reviews: 178 },
]

const FLASH_PRODUCTS = [
  { id: '3', name: 'Acacia Cutting Board',  slug: 'acacia-cutting-board', price: 1800, originalPrice: 3100, image: '/products/cutting-board.svg',  stock: 5 },
  { id: '5', name: 'Ceramic Mixing Bowls',  slug: 'ceramic-mixing-bowls', price: 3200, originalPrice: 5200, image: '/products/mixing-bowls.svg',   stock: 2 },
  { id: '6', name: 'Non-Stick Loaf Pan',    slug: 'non-stick-loaf-pan',   price: 1400, originalPrice: 2200, image: '/products/loaf-pan.svg',        stock: 9 },
  { id: '1', name: 'Cast Iron Skillet 10"', slug: 'cast-iron-skillet-10', price: 3800, originalPrice: 6500, image: '/products/cast-iron-skillet.svg', stock: 4 },
]

const TOP_SELLERS = [
  { id: '2', name: 'Ceramic Stockpot 5L',   slug: 'ceramic-stockpot-5l',  price: 8200, image: '/products/ceramic-stockpot.svg',   stock: 20, rating: 4.6, reviews: 87  },
  { id: '1', name: 'Cast Iron Skillet 10"', slug: 'cast-iron-skillet-10', price: 6500, image: '/products/cast-iron-skillet.svg', stock: 15, rating: 4.8, reviews: 124 },
  { id: '4', name: 'Chef\'s Knife 8"',       slug: 'chefs-knife-8',        price: 4800, image: '/products/chefs-knife.svg',        stock: 30, rating: 4.9, reviews: 178 },
  { id: '3', name: 'Acacia Cutting Board',  slug: 'acacia-cutting-board', price: 3100, image: '/products/cutting-board.svg',       stock: 22, rating: 4.8, reviews: 214 },
  { id: '5', name: 'Ceramic Mixing Bowls',  slug: 'ceramic-mixing-bowls', price: 5200, image: '/products/mixing-bowls.svg',        stock: 11, rating: 4.9, reviews: 61  },
]

const NEW_ARRIVALS = [
  { id: '6', name: 'Non-Stick Loaf Pan',    slug: 'non-stick-loaf-pan',   price: 2200, image: '/products/loaf-pan.svg',           stock: 18, rating: 4.4, reviews: 39  },
  { id: '5', name: 'Ceramic Mixing Bowls',  slug: 'ceramic-mixing-bowls', price: 5200, image: '/products/mixing-bowls.svg',        stock: 7,  rating: 4.9, reviews: 61  },
  { id: '4', name: 'Chef\'s Knife 8"',       slug: 'chefs-knife-8',        price: 4800, image: '/products/chefs-knife.svg',        stock: 25, rating: 4.9, reviews: 178 },
  { id: '2', name: 'Ceramic Stockpot 5L',   slug: 'ceramic-stockpot-5l',  price: 8200, image: '/products/ceramic-stockpot.svg',   stock: 12, rating: 4.6, reviews: 87  },
]

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <QuickShortcuts />

      <ProductRow
        title="Deals of the Day"
        seeAllHref="/shop/sale"
        products={DEALS}
      />

      <FlashSale endsAt={FLASH_SALE_ENDS} products={FLASH_PRODUCTS} />

      <CategoryTiles />

      <ProductRow
        title="Top Sellers"
        seeAllHref="/shop?sort=best-selling"
        products={TOP_SELLERS}
      />

      <ProductRow
        title="New Arrivals"
        seeAllHref="/shop/new"
        products={NEW_ARRIVALS}
      />

      <Newsletter />
    </>
  )
}
