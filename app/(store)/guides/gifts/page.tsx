import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Gift Guide',
  description: 'Kitchenware gift ideas for hosts, home cooks, newlyweds, and people building a better kitchen.',
}

const GIFT_SECTIONS = [
  {
    title: 'For the everyday home cook',
    budget: 'KSh 2,000 - 6,000',
    description: 'Reliable pieces they will reach for every week: pans, boards, knives, and utensils that make daily cooking easier.',
    href: '/shop/cookware',
    picks: ['Cast iron skillet', 'Acacia cutting board', 'Stainless steel wok'],
  },
  {
    title: 'For a new home',
    budget: 'KSh 5,000 - 15,000',
    description: 'Practical starter pieces that help someone set up a serious kitchen without buying clutter.',
    href: '/shop/new',
    picks: ['Cookware essentials', 'Storage and organization', 'Dinnerware basics'],
  },
  {
    title: 'For the host',
    budget: 'KSh 3,000 - 10,000',
    description: 'Beautiful, useful gifts for people who love serving guests and making meals feel considered.',
    href: '/shop/dinnerware',
    picks: ['Serving bowls', 'Coffee and tea pieces', 'Outdoor and BBQ tools'],
  },
]

const QUICK_RULES = [
  'Choose something useful before something decorative.',
  'If you are unsure, pick a durable everyday item rather than a niche gadget.',
  'For newlyweds or new homes, buy sets only when every piece will be used.',
  'For experienced cooks, upgrade one tool they already use often.',
]

export default function GiftGuidePage() {
  return (
    <div>
      <section className="bg-earth text-ivory px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sienna mb-4 font-medium">Gift Guide</p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">Kitchen gifts people actually use</h1>
          <p className="text-ivory/55 text-base sm:text-lg max-w-2xl">
            Thoughtful kitchenware gifts for hosts, home cooks, new homes, and anyone building a better kitchen.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GIFT_SECTIONS.map((section) => (
            <article key={section.title} className="bg-white rounded-2xl border border-earth/10 p-5 flex flex-col">
              <p className="text-[10px] uppercase tracking-widest text-terra font-semibold mb-2">{section.budget}</p>
              <h2 className="font-serif text-xl text-earth">{section.title}</h2>
              <p className="mt-3 text-sm text-earth/55 leading-relaxed">{section.description}</p>
              <ul className="mt-5 space-y-2">
                {section.picks.map((pick) => (
                  <li key={pick} className="text-xs text-earth/60 border-b border-earth/6 pb-2 last:border-0">
                    {pick}
                  </li>
                ))}
              </ul>
              <Link
                href={section.href}
                className="mt-auto pt-5 text-sm font-semibold text-terra hover:text-terra/75 transition-colors"
              >
                Shop this idea
              </Link>
            </article>
          ))}
        </section>

        <section className="bg-white rounded-2xl border border-earth/10 p-6 sm:p-7">
          <h2 className="font-serif text-2xl text-earth mb-4">How to choose well</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_RULES.map((rule, index) => (
              <div key={rule} className="flex gap-3 rounded-xl bg-ivory-dark p-4">
                <span className="shrink-0 w-6 h-6 rounded-full bg-earth text-ivory text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-sm text-earth/65 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-earth p-6 sm:p-8 text-center">
          <h2 className="font-serif text-2xl text-ivory mb-2">Still not sure?</h2>
          <p className="text-sm text-ivory/55 mb-5">
            Start with new arrivals or browse the full catalogue by category.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/shop/new" className="px-5 py-3 rounded-xl bg-sienna/20 text-ivory text-sm font-semibold hover:bg-sienna/30 transition-colors">
              Shop New Arrivals
            </Link>
            <Link href="/shop" className="px-5 py-3 rounded-xl bg-ivory text-earth text-sm font-semibold hover:bg-ivory/90 transition-colors">
              Browse Catalogue
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
