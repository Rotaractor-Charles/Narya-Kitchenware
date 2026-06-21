import Link from 'next/link'

const ROW_1 = [
  { slug: 'cookware',   label: 'Cookware',         bg: 'bg-terra',       text: 'text-ivory'        },
  { slug: 'bakeware',   label: 'Bakeware',          bg: 'bg-ivory-dark',  text: 'text-earth', border: true },
  { slug: 'cutlery',    label: 'Cutlery & Knives',  bg: 'bg-earth',       text: 'text-ivory'        },
  { slug: 'appliances', label: 'Small Appliances',  bg: 'bg-ivory-dark',  text: 'text-earth', border: true },
  { slug: 'dinnerware', label: 'Dinnerware',        bg: 'bg-sienna/30',   text: 'text-earth', border: true },
  { slug: 'storage',    label: 'Storage & Org',     bg: 'bg-terra',       text: 'text-ivory'        },
]

const ROW_2 = [
  { slug: 'coffee-tea', label: 'Coffee & Tea',      bg: 'bg-ivory-dark',  text: 'text-earth', border: true },
  { slug: 'outdoor',    label: 'Outdoor & BBQ',     bg: 'bg-earth',       text: 'text-ivory'        },
  { slug: 'utensils',   label: 'Utensils & Gadgets',bg: 'bg-sienna/20',   text: 'text-earth', border: true },
  { slug: 'new',        label: 'New Arrivals',      bg: 'bg-terra',       text: 'text-ivory'        },
  { slug: 'gift-sets',  label: 'Gift Sets',         bg: 'bg-ivory-dark',  text: 'text-earth', border: true },
  { slug: 'sale',       label: '🏷 Clearance',      bg: 'bg-red-600',     text: 'text-white'        },
]

type Tile = { slug: string; label: string; bg: string; text: string; border?: boolean }

function Tile({ slug, label, bg, text, border }: Tile) {
  return (
    <Link href={`/shop/${slug}`}
      className={`group relative aspect-[4/3] flex flex-col justify-end p-4 sm:p-5
        ${bg} ${text} ${border ? 'border border-earth/12' : ''}
        hover:scale-[1.02] transition-transform duration-300 overflow-hidden`}
    >
      <h3 className="font-serif text-base sm:text-lg leading-tight">{label}</h3>
      <span className="text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-50 transition-opacity duration-200 mt-1">
        Shop →
      </span>
    </Link>
  )
}

export default function CategoryTiles() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-serif text-earth text-2xl sm:text-3xl mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
        {ROW_1.map((t) => <Tile key={t.slug} {...t} />)}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {ROW_2.map((t) => <Tile key={t.slug} {...t} />)}
      </div>
    </section>
  )
}
