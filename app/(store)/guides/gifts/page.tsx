import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kitchen Gift Guide Kenya | Best Kitchenware Gifts for Home Cooks — Narya',
  description: 'The best kitchenware gifts in Kenya for home cooks, new homes, hosts, and newlyweds. Expert picks at every budget, with fast delivery across all 47 counties.',
}

const GIFT_SECTIONS = [
  {
    title: 'For the everyday home cook',
    budget: 'KSh 2,000 – 6,000',
    description: 'Reliable pieces they will reach for every single week: pans that sear properly, knives that stay sharp, boards that do not slip. This budget covers the tools that make daily cooking noticeably easier — without buying items that will spend most of their time in a drawer.',
    href: '/shop/cookware',
    picks: ['Cast iron skillet', 'Acacia cutting board', 'Chef\'s knife'],
  },
  {
    title: 'For a new home',
    budget: 'KSh 5,000 – 15,000',
    description: 'Practical starter pieces that help someone equip a serious kitchen from scratch. Focus on fundamentals first: a good heavy-base pot, a versatile pan, and a knife that handles everything. Skip gadgets until the basics are covered — a well-equipped Kenyan kitchen needs fewer tools than most people think.',
    href: '/shop/new',
    picks: ['Cookware starter set', 'Storage and organisation', 'Dinnerware basics'],
  },
  {
    title: 'For the host',
    budget: 'KSh 3,000 – 10,000',
    description: 'Beautiful, useful gifts for people who love serving guests and making every meal feel considered. Think serving bowls with presence, a good coffee setup, or outdoor grilling tools for the nyama choma nights that Kenyan hospitality is built around. Gifts that get used at the table, not hidden away.',
    href: '/shop/dinnerware',
    picks: ['Serving bowls', 'Coffee and tea set', 'Outdoor BBQ tools'],
  },
]

const QUICK_RULES = [
  'Choose something useful before something decorative — the best kitchen gifts earn their space every day.',
  'If you are unsure, pick a durable everyday item rather than a niche gadget. A good knife beats a specialist tool every time.',
  'For newlyweds or new homes, buy sets only when every piece in the set will genuinely be used.',
  'For experienced cooks, upgrade one tool they already use often — a better version of a familiar tool is always appreciated.',
]

const OCCASIONS = [
  { label: 'Weddings', desc: 'A quality cookware set or knife block makes a memorable wedding gift that outlasts decorative pieces and serves the couple for years.' },
  { label: 'Housewarming', desc: 'Help someone start their kitchen right. A cast iron pan, acacia cutting board, and a good chef\'s knife covers 80% of daily cooking needs.' },
  { label: 'Birthdays', desc: 'A single excellent tool — the sharpest knife they\'ve ever owned, a ceramic stockpot, or a set of mixing bowls — beats a basket of small items.' },
  { label: 'Mother\'s Day', desc: 'The best kitchen gifts show you pay attention. Think about what they cook most, and upgrade the one tool they use for it every week.' },
]

export default function GiftGuidePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-earth text-ivory px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sienna mb-4 font-medium">Gift Guide</p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">Kitchen gifts people actually use.</h1>
          <p className="text-ivory/55 text-base sm:text-lg max-w-2xl leading-relaxed">
            Thoughtful kitchenware gifts for home cooks, hosts, new homes, and newlyweds — at every budget. All delivered across Kenya with care, same-day dispatch on orders placed before 2 PM.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* Gift sections */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GIFT_SECTIONS.map((section) => (
            <article key={section.title} className="bg-white rounded-2xl border border-earth/10 p-5 flex flex-col">
              <p className="text-[10px] uppercase tracking-widest text-terra font-semibold mb-2">{section.budget}</p>
              <h2 className="font-serif text-xl text-earth mb-2">{section.title}</h2>
              <p className="text-sm text-earth/55 leading-relaxed mb-4">{section.description}</p>
              <ul className="mt-auto space-y-2 mb-5">
                {section.picks.map((pick) => (
                  <li key={pick} className="text-xs text-earth/60 border-b border-earth/6 pb-2 last:border-0 flex items-center gap-2">
                    <span className="text-terra">→</span>{pick}
                  </li>
                ))}
              </ul>
              <Link href={section.href} className="text-sm font-semibold text-terra hover:text-terra/75 transition-colors">
                Shop this idea →
              </Link>
            </article>
          ))}
        </section>

        {/* By occasion */}
        <section className="bg-white rounded-2xl border border-earth/10 p-6 sm:p-7">
          <h2 className="font-serif text-2xl text-earth mb-2">Gifts by occasion</h2>
          <p className="text-sm text-earth/50 mb-6">The right kitchen gift depends as much on the moment as the person. Here is how to think about it.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OCCASIONS.map(o => (
              <div key={o.label} className="rounded-xl bg-ivory-dark border border-earth/8 p-4">
                <h3 className="font-semibold text-earth text-sm mb-1.5">{o.label}</h3>
                <p className="text-xs text-earth/55 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to choose */}
        <section className="bg-white rounded-2xl border border-earth/10 p-6 sm:p-7">
          <h2 className="font-serif text-2xl text-earth mb-2">How to choose well</h2>
          <p className="text-sm text-earth/50 mb-5">Four principles that make every kitchen gift a good one.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_RULES.map((rule, index) => (
              <div key={index} className="flex gap-3 rounded-xl bg-ivory-dark p-4">
                <span className="shrink-0 w-6 h-6 rounded-full bg-earth text-ivory text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-sm text-earth/65 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery callout */}
        <section className="bg-ivory-dark rounded-2xl border border-earth/8 p-6 text-center">
          <h2 className="font-serif text-xl text-earth mb-2">Fast delivery across Kenya</h2>
          <p className="text-sm text-earth/55 max-w-xl mx-auto mb-5">
            All Narya orders ship with tracking to all 47 counties. Orders placed before 2 PM are dispatched the same day. Free delivery on orders over KSh&nbsp;7,500 — so larger gift sets ship free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/shop/new" className="px-5 py-3 rounded-xl bg-earth text-ivory text-sm font-semibold hover:bg-earth/90 transition-colors">
              Shop New Arrivals
            </Link>
            <Link href="/shop" className="px-5 py-3 rounded-xl border border-earth/20 text-earth text-sm font-semibold hover:border-earth/40 transition-colors">
              Browse Full Catalogue
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
