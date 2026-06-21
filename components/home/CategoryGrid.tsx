import Link from 'next/link'

const CATEGORIES = [
  {
    slug:    'cookware',
    label:   'Cookware',
    desc:    'Pots, pans & more',
    bg:      'bg-forest',
    text:    'text-cream',
  },
  {
    slug:    'bakeware',
    label:   'Bakeware',
    desc:    'Tins, trays & moulds',
    bg:      'bg-cream',
    text:    'text-forest',
    border:  true,
  },
  {
    slug:    'utensils',
    label:   'Utensils',
    desc:    'Tools for every task',
    bg:      'bg-cream',
    text:    'text-forest',
    border:  true,
  },
  {
    slug:    'storage',
    label:   'Storage',
    desc:    'Keep it fresh & tidy',
    bg:      'bg-forest',
    text:    'text-cream',
  },
  {
    slug:    'cutlery',
    label:   'Cutlery',
    desc:    'Knives & sets',
    bg:      'bg-forest/10',
    text:    'text-forest',
    border:  true,
  },
  {
    slug:    'appliances',
    label:   'Appliances',
    desc:    'Small but mighty',
    bg:      'bg-forest/10',
    text:    'text-forest',
    border:  true,
  },
]

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="font-serif text-forest text-3xl sm:text-4xl mb-12 text-center">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map(({ slug, label, desc, bg, text, border }) => (
          <Link
            key={slug}
            href={`/shop/${slug}`}
            className={`
              group relative aspect-square flex flex-col justify-end p-6
              ${bg} ${text}
              ${border ? 'border border-forest/20' : ''}
              hover:scale-[1.02] transition-transform duration-300
            `}
          >
            <p className="text-xs tracking-widest uppercase opacity-60 mb-1">{desc}</p>
            <h3 className="font-serif text-2xl">{label}</h3>
            <span className="mt-3 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-60 transition-opacity duration-200">
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
