'use client'

import Link from 'next/link'

const MOCK_POINTS         = 1180
const MOCK_TIER           = 'Cultivator'
const MOCK_NEXT_TIER      = 'Harvest'
const MOCK_NEXT_THRESHOLD = 2000

const EARN_WAYS = [
  { icon: '🛒', title: 'Every purchase',   desc: '1 point per KSh 10 spent' },
  { icon: '⭐', title: 'Leave a review',   desc: '50 points per verified review' },
  { icon: '🎂', title: 'Birthday bonus',   desc: '200 points on your birthday month' },
  { icon: '👥', title: 'Refer a friend',   desc: '500 points per successful referral' },
]

const REDEEM_OPTIONS = [
  { points: 500,  value: 'KSh 50 off',  desc: 'Apply to any order' },
  { points: 1000, value: 'KSh 120 off', desc: 'Best value' },
  { points: 2000, value: 'KSh 300 off', desc: 'Premium reward' },
]

const HISTORY = [
  { date: 'Jun 18, 2026', action: 'Purchase – Ceramic Stockpot',  points:  320, positive: true  },
  { date: 'Jun 10, 2026', action: 'Product review',               points:   50, positive: true  },
  { date: 'May 28, 2026', action: 'Redeemed discount',            points: -500, positive: false },
  { date: 'May 20, 2026', action: "Purchase – Chef's Knife Set",  points:  280, positive: true  },
  { date: 'May 05, 2026', action: 'Referral bonus',               points:  500, positive: true  },
  { date: 'Apr 15, 2026', action: 'Birthday bonus',               points:  200, positive: true  },
]

export default function RewardsClient() {
  const pct = Math.min((MOCK_POINTS / MOCK_NEXT_THRESHOLD) * 100, 100)

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-earth overflow-hidden py-16 px-4 sm:px-6">
        {/* Decorative rings */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
          <svg width="420" height="420" viewBox="0 0 420 420" fill="none">
            <circle cx="340" cy="210" r="220" stroke="#a7b89a" strokeOpacity="0.2"  strokeWidth="1.5"/>
            <circle cx="340" cy="210" r="150" stroke="#a7b89a" strokeOpacity="0.14" strokeWidth="1.5"/>
            <circle cx="340" cy="210" r="80"  fill="#a7b89a"   fillOpacity="0.12"/>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <p className="text-[11px] tracking-[0.25em] uppercase text-sienna mb-4 font-medium">
            Narya Rewards
          </p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-serif text-[80px] sm:text-[110px] leading-none text-ivory">
              {MOCK_POINTS.toLocaleString()}
            </span>
            <span className="text-3xl text-ivory/40 font-light">pts</span>
          </div>

          <p className="font-serif italic text-ivory/45 text-lg sm:text-xl mb-8">
            Tend it, watch it bloom.
          </p>

          {/* Tier progress */}
          <div className="max-w-sm">
            <div className="flex justify-between text-xs text-ivory/50 mb-2">
              <span className="text-ivory/70 font-medium">{MOCK_TIER}</span>
              <span>{MOCK_NEXT_TIER} at {MOCK_NEXT_THRESHOLD.toLocaleString()} pts</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-sienna rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[11px] text-ivory/35 mt-1.5">
              {(MOCK_NEXT_THRESHOLD - MOCK_POINTS).toLocaleString()} points to {MOCK_NEXT_TIER}
            </p>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* Redeem */}
        <section>
          <h2 className="font-serif text-xl text-earth mb-5">Redeem Points</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {REDEEM_OPTIONS.map(opt => {
              const can = MOCK_POINTS >= opt.points
              return (
                <div
                  key={opt.points}
                  className={`rounded-2xl border p-5 flex flex-col gap-4 transition-opacity ${
                    can ? 'border-earth/15 bg-white' : 'border-earth/8 bg-ivory opacity-55'
                  }`}
                >
                  <div>
                    <p className="text-2xl font-serif text-earth">{opt.value}</p>
                    <p className="text-xs text-earth/45 mt-0.5">{opt.desc}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-terra font-semibold">
                      {opt.points.toLocaleString()} pts
                    </span>
                    <button
                      disabled={!can}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        can
                          ? 'bg-earth text-ivory hover:bg-earth/90 cursor-pointer'
                          : 'bg-earth/8 text-earth/30 cursor-not-allowed'
                      }`}
                    >
                      {can ? 'Redeem' : 'Need more'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Ways to earn */}
        <section>
          <h2 className="font-serif text-xl text-earth mb-5">Ways to Earn</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EARN_WAYS.map(w => (
              <div key={w.title} className="bg-white rounded-2xl border border-earth/10 p-4">
                <p className="text-2xl mb-2">{w.icon}</p>
                <p className="text-sm font-medium text-earth mb-0.5">{w.title}</p>
                <p className="text-xs text-earth/50 leading-snug">{w.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section>
          <h2 className="font-serif text-xl text-earth mb-5">Points History</h2>
          <div className="bg-white rounded-2xl border border-earth/10 divide-y divide-earth/6">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm text-earth">{h.action}</p>
                  <p className="text-xs text-earth/40 mt-0.5">{h.date}</p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ml-4 ${
                  h.positive ? 'text-terra' : 'text-earth/40'
                }`}>
                  {h.positive ? '+' : ''}{h.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-4">
          <p className="text-earth/50 text-sm mb-4">Ready to use your points?</p>
          <Link
            href="/shop"
            className="inline-block bg-earth text-ivory px-8 py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors"
          >
            Shop & Earn More
          </Link>
        </section>
      </div>
    </div>
  )
}
