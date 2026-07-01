import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Narya Kitchen Journal | Cookware Tips, Kenyan Recipes & Care Guides',
  description: 'The Narya Kitchen Journal — buying guides for cookware, care tips for your tools, Kenyan recipes worth cooking, and ideas for building a kitchen you love. Updated regularly.',
}

const ARTICLES = [
  {
    category: 'Buying Guide',
    title: 'How to choose everyday cookware',
    href: '/guides',
    description:
      'Not all pots and pans are equal. This guide covers the key differences between cast iron, ceramic, stainless steel, and non-stick — including which material works best for Kenyan cooking staples like ugali, pilau, and beef stew. We also cover what to look for in base thickness, handle comfort, and heat compatibility.',
    readTime: '6 min read',
  },
  {
    category: 'Kenyan Recipes',
    title: 'Recipes worth keeping close',
    href: '/recipes',
    description:
      'Ten credible Kenyan recipes — from ugali and sukuma wiki to nyama choma, kenyan chapati, and mandazi — written for home cooks using real ingredients and the right tools. Each recipe includes cookware recommendations, timing notes, and the tips that separate a good result from a great one.',
    readTime: '10 min read',
  },
  {
    category: 'Care & Maintenance',
    title: 'Seasoning cast iron the right way',
    href: '/guides',
    description:
      'A well-seasoned cast iron pan is virtually non-stick, incredibly versatile, and will outlast every other pan in your kitchen. This guide walks through the complete seasoning process step by step — including which oils to use, oven temperature, timing, and how to maintain the seasoning with everyday cooking.',
    readTime: '5 min read',
  },
  {
    category: 'Buying Guide',
    title: 'Gift-ready kitchen essentials for every budget',
    href: '/shop/gift-sets',
    description:
      'The best kitchen gifts are the ones that get used every day. This guide covers our top gift picks at every price point — from a quality chef\'s knife for a new home cook to a complete cookware set for a couple setting up their first kitchen in Nairobi. All with fast delivery across Kenya.',
    readTime: '4 min read',
  },
  {
    category: 'Care & Maintenance',
    title: 'Keeping your knives sharp: the two-step method',
    href: '/guides',
    description:
      'A dull knife is more dangerous than a sharp one, and most kitchen knives lose their edge far sooner than necessary. This guide explains the difference between honing and sharpening, how often each is needed, and the simple two-step routine professional cooks use to keep their blades in perfect working condition.',
    readTime: '4 min read',
  },
  {
    category: 'Home Kitchen',
    title: 'Setting up your first kitchen: a practical checklist',
    href: '/shop',
    description:
      'Moving into a new home or helping a family member set up their kitchen? This checklist covers the essential tools every Kenyan kitchen needs — and the order to buy them in so you get the most value from your budget. Start with the fundamentals and build from there.',
    readTime: '5 min read',
  },
]

const CATEGORIES = ['All', 'Buying Guide', 'Kenyan Recipes', 'Care & Maintenance', 'Home Kitchen']

const CATEGORY_COLORS: Record<string, string> = {
  'Buying Guide':       'bg-blue-50 text-blue-700',
  'Kenyan Recipes':     'bg-amber-50 text-amber-700',
  'Care & Maintenance': 'bg-terra/10 text-terra',
  'Home Kitchen':       'bg-purple-50 text-purple-700',
}

export default function BlogPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-earth text-ivory px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sienna mb-4 font-medium">Narya Kitchen Journal</p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
            Ideas for cooking better at home.
          </h1>
          <p className="text-ivory/55 text-base sm:text-lg max-w-2xl leading-relaxed">
            Practical buying guides, care instructions for your cookware, Kenyan recipes tested in a real kitchen, and ideas for building a home kitchen you enjoy using every day. Everything here is written to be useful — not just interesting.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div className="border-b border-earth/8 bg-ivory-dark px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <span
              key={cat}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-default ${
                cat === 'All'
                  ? 'bg-earth text-ivory'
                  : 'bg-white border border-earth/15 text-earth/60'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="group bg-white rounded-2xl border border-earth/10 p-6 hover:border-terra/40 hover:shadow-sm transition-all flex flex-col"
            >
              <span className={`self-start text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${CATEGORY_COLORS[article.category] ?? 'bg-muted text-muted-foreground'}`}>
                {article.category}
              </span>
              <h2 className="font-serif text-lg text-earth mb-2 leading-snug group-hover:text-terra transition-colors">
                {article.title}
              </h2>
              <p className="text-xs text-earth/55 leading-relaxed flex-1 mb-4">
                {article.description}
              </p>
              <p className="text-[10px] text-earth/35 uppercase tracking-widest">{article.readTime}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* About the journal */}
      <section className="bg-ivory-dark border-t border-earth/8 px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-terra mb-3 font-medium">About this journal</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-earth mb-4">Written for home cooks, not food critics.</h2>
          <p className="text-sm text-earth/60 leading-relaxed mb-6 max-w-xl mx-auto">
            The Narya Kitchen Journal is where we share what we know about cooking tools, kitchen care, and Kenyan food. Our guides are written to help you get more out of the kitchenware you already own — and make better decisions about what to buy next. No fluff, no paid placements, just honest advice from a family that takes cooking seriously.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/recipes" className="bg-earth text-ivory px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors">
              Browse Recipes
            </Link>
            <Link href="/guides" className="border border-earth/20 text-earth px-6 py-2.5 rounded-xl text-sm font-semibold hover:border-earth/40 transition-colors">
              Read Care Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
