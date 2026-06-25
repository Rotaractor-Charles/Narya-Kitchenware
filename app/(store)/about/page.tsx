import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The family story behind Narya Kitchenware.',
}

const VALUES = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Built to Last',
    desc: 'We choose kitchenware we would be proud to use in our own home: dependable, practical, and made to stay.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: 'Thoughtful Design',
    desc: 'Every product must feel useful, look at home in a real kitchen, and make everyday cooking easier.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Made for Home Cooks',
    desc: 'Narya is built for families, first homes, busy parents, new cooks, and anyone creating meals with care.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Family First',
    desc: 'This business carries our family name, so trust, fairness, and service have to show up in every order.',
  },
]

const STATS = [
  { number: '4', label: 'Family founders' },
  { number: '100%', label: 'Family owned' },
  { number: '1', label: 'Shared vision' },
  { number: 'KE', label: 'Built in Kenya' },
]

const TEAM = [
  {
    initial: 'C',
    name: 'Charles Kamau Macharia',
    role: 'Co-founder',
    bio: "Former software engineer turned entrepreneur, Charles brings systems thinking, product discipline, and a builder's instinct to Narya.",
  },
  {
    initial: 'F',
    name: 'Faith Jebungei Kamau',
    role: 'Co-founder',
    bio: 'Former TVET trainer turned entrepreneur, Faith brings practical training experience, operational care, and a deep respect for everyday home cooks.',
  },
  {
    initial: 'A',
    name: 'Aryan Kamau',
    role: 'Investor',
    bio: 'An early believer in the Narya vision, Aryan represents the next generation investing in family, ownership, and long-term growth.',
  },
  {
    initial: 'N',
    name: 'Nyla Kamau',
    role: 'Investor',
    bio: 'Nyla is part of the founding circle backing Narya with confidence in its mission to serve homes with thoughtful kitchenware.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-earth text-ivory relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute right-0 top-0 opacity-10"
            width="600"
            height="600"
            viewBox="0 0 600 600"
          >
            <circle cx="500" cy="100" r="400" fill="none" stroke="#a7b89a" strokeWidth="1" />
            <circle cx="500" cy="100" r="280" fill="none" stroke="#a7b89a" strokeWidth="1" />
            <circle cx="500" cy="100" r="160" fill="#a7b89a" />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sienna mb-5 font-medium">
            Our Family Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6 max-w-3xl">
            Built by family, for the kitchens that hold families together.
          </h1>
          <p className="text-ivory/55 text-lg sm:text-xl max-w-xl leading-relaxed">
            Narya Kitchenware is a family business shaped by the meals, conversations, lessons, and
            everyday rituals that happen around a home kitchen.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-ivory-dark border-b border-earth/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-3xl text-earth mb-1">{s.number}</dt>
                <dd className="text-xs text-earth/45 uppercase tracking-widest">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-terra mb-4 font-medium">
              How it started
            </p>
            <h2 className="font-serif text-3xl text-earth mb-5 leading-snug">
              Narya began with a simple family question: why should good kitchenware feel out of
              reach?
            </h2>
            <div className="space-y-4 text-earth/65 text-sm leading-relaxed">
              <p>
                For Charles Kamau Macharia and Faith Jebungei Kamau, Narya was not imagined in a
                boardroom. It grew out of family life: shared meals, busy mornings, school-day
                routines, late conversations, and the quiet belief that a home deserves tools that
                make cooking easier, cleaner, and more joyful.
              </p>
              <p>
                Charles came from software engineering, where every system has to work reliably.
                Faith came from TVET training, where skill, patience, and practical knowledge
                matter. Together, they saw an opportunity to build something rooted in both worlds:
                a kitchenware brand organised with discipline, but served with the warmth and
                responsibility of family.
              </p>
              <p>
                Aryan Kamau and Nyla Kamau are part of that founding story too. Their place in Narya
                is a reminder that this business is not only about selling pans, boards, and
                utensils. It is about building something that can grow across generations: a family
                name attached to trust, honest service, and products people can welcome into their
                homes with confidence.
              </p>
              <p>
                That is why Narya does not chase clutter. We look for kitchenware that earns its
                place: pieces that feel good in the hand, hold up to real use, and make the everyday
                work of feeding people feel a little more dignified. Every order is treated like it
                is going to a neighbour, because to us, business is personal.
              </p>
            </div>
          </div>

          {/* Visual block */}
          <div className="relative">
            <div className="bg-sienna/15 rounded-3xl aspect-square flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                width="180"
                height="180"
                fill="none"
                stroke="#3A6B4A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              >
                {/* Skillet */}
                <ellipse cx="100" cy="110" rx="55" ry="12" />
                <path d="M45 110 Q45 75 100 75 Q155 75 155 110" />
                <line x1="155" y1="92" x2="185" y2="72" />
                {/* Steam lines */}
                <path d="M80 65 Q83 55 80 45" strokeOpacity="0.4" />
                <path d="M100 60 Q103 50 100 40" strokeOpacity="0.4" />
                <path d="M120 65 Q123 55 120 45" strokeOpacity="0.4" />
              </svg>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl border border-earth/10 px-4 py-3 shadow-sm">
              <p className="text-xs text-earth/45 mb-0.5">Family owned</p>
              <p className="font-serif text-2xl text-earth">100%</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-earth rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-[10px] text-sienna/70 mb-0.5">Built in</p>
              <p className="font-serif text-xl text-ivory">Kenya</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-ivory-dark py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-[11px] tracking-[0.25em] uppercase text-terra mb-3 font-medium text-center">
            What we stand for
          </p>
          <h2 className="font-serif text-3xl text-earth text-center mb-12">Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-earth/10 p-5">
                <div className="w-10 h-10 rounded-xl bg-terra/10 text-terra flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-earth text-sm mb-2">{v.title}</h3>
                <p className="text-xs text-earth/55 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-[11px] tracking-[0.25em] uppercase text-terra mb-3 font-medium">
          The people
        </p>
        <h2 className="font-serif text-3xl text-earth mb-10">Meet the team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex flex-col rounded-2xl border border-earth/10 bg-white p-5"
            >
              <div className="w-14 h-14 rounded-full bg-earth flex items-center justify-center mb-4 shrink-0 shadow-sm">
                <span className="font-serif text-2xl text-ivory">{member.initial}</span>
              </div>
              <h3 className="font-semibold text-earth text-sm leading-snug">{member.name}</h3>
              <p className="text-[11px] text-terra uppercase tracking-widest font-medium mb-2">
                {member.role}
              </p>
              <p className="text-xs text-earth/55 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Promise ── */}
      <section className="bg-earth py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-sienna mb-4 font-medium">
            Our promise
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory mb-5 leading-snug">
            If it doesn't make cooking more joyful, we won't carry it.
          </h2>
          <p className="text-ivory/45 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Every product on Narya comes with our satisfaction guarantee. If something doesn't live
            up to what we promised, we'll make it right — no paperwork, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="bg-sienna text-ivory px-7 py-3 rounded-xl text-sm font-semibold hover:bg-sienna/90 transition-colors"
            >
              Shop the Collection
            </Link>
            <Link
              href="/shop/new"
              className="border border-ivory/20 text-ivory/80 px-7 py-3 rounded-xl text-sm font-semibold hover:border-ivory/40 hover:text-ivory transition-colors"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
