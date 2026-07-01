import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShopClient from '@/components/shop/ShopClient'
import { getProducts } from '@/lib/api/products'
import { getCategories, getCategoryBySlug } from '@/lib/api/categories'

type Props = { params: Promise<{ category: string }> }

const SPECIAL_COLLECTIONS: Record<string, string> = {
  new:        'New Arrivals',
  sale:       'Sale',
  'gift-sets':'Gift Sets',
}

const CATEGORY_META: Record<string, { desc: string; seoDesc: string }> = {
  cookware: {
    desc: 'Cast iron skillets, ceramic stockpots, stainless steel pans, and everyday cooking vessels — sourced for durability and performance on all heat sources, including gas, electric, and charcoal jikos.',
    seoDesc: 'Shop cookware in Kenya. Cast iron, ceramic, and stainless steel pots and pans for ugali, stews, pilau and every Kenyan kitchen staple. Fast delivery across Kenya.',
  },
  bakeware: {
    desc: 'Loaf pans, muffin trays, roasting tins, and baking sheets built for reliable home baking. Perfect for mandazi dough, cakes, bread, and pastries — and durable enough for daily oven use.',
    seoDesc: 'Buy bakeware online in Kenya. Loaf pans, muffin trays, and baking sheets for home baking. Delivered to all 47 counties.',
  },
  cutlery: {
    desc: "Sharp, well-balanced chef's knives, paring knives, kitchen scissors, and sharpening tools. Our cutlery is selected for edge retention, comfortable grip, and the kind of performance that makes everyday prep faster and safer.",
    seoDesc: "Shop chef's knives and cutlery in Kenya. Quality kitchen knives, scissors and sharpening tools for home cooks. Buy online with fast delivery.",
  },
  appliances: {
    desc: "Compact kitchen appliances that earn their counter space. From electric kettles and blenders to toasters and rice cookers — selected for energy efficiency, durability, and Kenya's voltage standards.",
    seoDesc: 'Buy small kitchen appliances in Kenya. Kettles, blenders, toasters and more. Quality brands, fast delivery.',
  },
  storage: {
    desc: 'Acacia cutting boards, food storage containers, pantry organisers, and kitchen accessories that bring order to a busy kitchen. Practical, durable, and sized for real Kenyan kitchens.',
    seoDesc: 'Shop kitchen storage and cutting boards in Kenya. Acacia boards, food containers, and organisers. Delivered nationwide.',
  },
  utensils: {
    desc: 'The daily tools that make a kitchen run: wooden spoons, spatulas, ladles, tongs, whisks, peelers, graters, and more. All selected for grip, heat resistance, and the durability to outlast trends.',
    seoDesc: 'Buy kitchen utensils and gadgets in Kenya. Spatulas, ladles, tongs and everyday cooking tools. Fast delivery across Kenya.',
  },
  dinnerware: {
    desc: 'Plates, bowls, mugs, and serving sets that bring meals to the table beautifully. Built for daily use, chip-resistant where it matters, and sized for the generous portions Kenyan cooking calls for.',
    seoDesc: 'Shop dinnerware in Kenya. Plates, bowls, mugs and serving sets for everyday use. Family-owned, Nairobi-based. Fast delivery.',
  },
  'coffee-tea': {
    desc: "Pour-over drippers, French presses, teapots, mugs, and accessories for Kenya's coffee and tea culture. Brewed well, served right — every morning and every afternoon.",
    seoDesc: 'Buy coffee and tea equipment in Kenya. Pour-over, French press, teapots and mugs. Fast delivery from Nairobi.',
  },
  outdoor: {
    desc: 'Grilling tools, cast iron grill pans, marinading containers, and outdoor cooking essentials. For nyama choma nights, weekend braai, and every occasion that calls for cooking over fire.',
    seoDesc: 'Shop outdoor and BBQ cooking tools in Kenya. Grill pans, nyama choma tools and outdoor essentials. Delivered across Kenya.',
  },
  cleaning: {
    desc: 'Dish brushes, sponges, drying racks, cleaning sprays, and care products that keep your kitchenware in top condition. Because the tools you invest in deserve proper maintenance.',
    seoDesc: 'Buy kitchen cleaning and care products in Kenya. Brushes, racks, and cleaning tools. Part of the Narya Kitchenware range.',
  },
  new: {
    desc: 'The latest additions to the Narya Kitchenware collection — freshly sourced, carefully vetted, and now available for delivery across all 47 counties in Kenya.',
    seoDesc: 'New kitchenware arrivals in Kenya. The latest pots, pans, knives and kitchen tools added to the Narya collection.',
  },
  sale: {
    desc: 'Quality kitchenware at reduced prices — available for a limited time. Same trusted brands, same fast delivery, same Narya satisfaction guarantee. Stock is limited, so shop while it lasts.',
    seoDesc: 'Kitchenware sale in Kenya. Discounted pots, pans, knives and kitchen tools. Fast delivery across Kenya while stock lasts.',
  },
  'gift-sets': {
    desc: 'Thoughtfully curated kitchen gift sets for first homes, new couples, hosts, and anyone who loves to cook. Beautifully packaged and delivered with care across Kenya.',
    seoDesc: 'Buy kitchen gift sets in Kenya. Cookware gift bundles for new homes, weddings and special occasions. Fast delivery from Narya Kitchenware.',
  },
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return [
    ...categories.map((c) => ({ category: c.slug })),
    ...Object.keys(SPECIAL_COLLECTIONS).map((category) => ({ category })),
  ]
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params
  const meta = CATEGORY_META[category]
  const baseTitle = SPECIAL_COLLECTIONS[category] ?? null

  if (baseTitle) {
    return {
      title: `${baseTitle} — Kitchenware Kenya | Narya`,
      description: meta?.seoDesc,
      alternates: { canonical: `/shop/${category}` },
      openGraph: {
        title: `${baseTitle} — Narya Kitchenware Kenya`,
        description: meta?.seoDesc,
        url: `/shop/${category}`,
      },
    }
  }

  const cat = await getCategoryBySlug(category)
  if (!cat) return {}
  const desc = meta?.seoDesc ?? `Shop ${cat.name} in Kenya at Narya Kitchenware. Quality tools, fast delivery to all 47 counties. Family-owned, Nairobi-based.`
  return {
    title: `${cat.name} — Buy Online in Kenya | Narya Kitchenware`,
    description: desc,
    alternates: { canonical: `/shop/${category}` },
    openGraph: {
      title: `${cat.name} — Narya Kitchenware Kenya`,
      description: desc,
      url: `/shop/${category}`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const isSpecialCollection = Boolean(SPECIAL_COLLECTIONS[category])

  const [cat, productsResponse, categories] = await Promise.all([
    isSpecialCollection ? Promise.resolve(null) : getCategoryBySlug(category),
    getProducts({
      category: isSpecialCollection ? undefined : category,
      collection: category === 'gift-sets' ? 'gift-sets' : undefined,
      per_page: 100,
    }),
    getCategories(),
  ])

  if (!cat && !isSpecialCollection) notFound()

  const title = SPECIAL_COLLECTIONS[category] ?? cat!.name
  const meta = CATEGORY_META[category]

  return (
    <>
      <div className="bg-ivory-dark border-b border-earth/8 px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-earth/40 mb-1">
            <Link href="/shop" className="hover:text-earth transition-colors">Shop</Link>
            {' '}/ {title}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-earth mb-2">{title}</h1>
          {meta && (
            <p className="text-sm text-earth/55 max-w-2xl leading-relaxed">{meta.desc}</p>
          )}
        </div>
      </div>
      <ShopClient
        products={productsResponse.data}
        categories={categories}
        initialCategory={category}
      />
    </>
  )
}
