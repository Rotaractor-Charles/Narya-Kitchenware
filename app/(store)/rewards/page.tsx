import type { Metadata } from 'next'
import RewardsClient from '@/components/rewards/RewardsClient'

export const metadata: Metadata = {
  title: 'Narya Rewards — Earn Points on Every Purchase | Narya Kitchenware Kenya',
  description: 'Earn Narya Points on every purchase, review, referral, and birthday. Redeem for discounts on kitchenware. Join the Narya Rewards programme — free for all customers in Kenya.',
}

export default function RewardsPage() {
  return (
    <>
      {/* Server-rendered intro — crawlable by search engines */}
      <section className="bg-earth text-ivory px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sienna mb-4 font-medium">Loyalty Programme</p>
          <h1 className="font-serif text-3xl sm:text-4xl mb-4 leading-tight">
            Earn points. Save on every order.
          </h1>
          <p className="text-ivory/60 text-base max-w-2xl leading-relaxed">
            The Narya Rewards programme gives you points for every purchase, review, referral, and birthday. Redeem them for real discounts on your next kitchenware order — no complicated tiers, no points that expire quietly. Just straightforward loyalty that saves you money.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '1 pt', label: 'per KSh 10 spent' },
              { value: '50 pts', label: 'per verified review' },
              { value: '200 pts', label: 'birthday bonus' },
              { value: '500 pts', label: 'per referral' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <p className="font-serif text-xl text-ivory mb-1">{s.value}</p>
                <p className="text-[10px] text-ivory/45 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive rewards dashboard */}
      <RewardsClient />

      {/* SEO footer */}
      <section className="bg-ivory-dark border-t border-earth/8 px-4 sm:px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-xl text-earth mb-4">How Narya Rewards works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-earth/60 leading-relaxed">
            <div>
              <h3 className="font-semibold text-earth text-sm mb-1.5">Earn on every purchase</h3>
              <p>You earn 1 Narya Point for every KSh 10 you spend on kitchenware, cookware, knives, bakeware, or any item in our collection. Points are credited automatically once your order is delivered.</p>
            </div>
            <div>
              <h3 className="font-semibold text-earth text-sm mb-1.5">Earn beyond purchases</h3>
              <p>Leave a verified product review and earn 50 points. Refer a friend who completes their first purchase and earn 500 points. Get a 200-point bonus automatically in your birthday month.</p>
            </div>
            <div>
              <h3 className="font-semibold text-earth text-sm mb-1.5">Redeem for real discounts</h3>
              <p>300 points = KSh 50 off. 3,000 points = KSh 500 off. 6,000 points = KSh 1,000 off. Discounts apply to your next order and can be combined with sale prices. No minimum order required to redeem.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
