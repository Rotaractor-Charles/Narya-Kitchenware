import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Care Guides',
  description: 'How to clean, season, and maintain your Narya kitchenware so it lasts a lifetime.',
}

const GUIDES = [
  {
    title: 'Seasoning Your Cast Iron',
    category: 'Cast Iron',
    time: '1 hour',
    icon: '🍳',
    summary: 'A well-seasoned cast iron pan is virtually non-stick and will outlast every other pan in your kitchen. Here\'s how to build and maintain that layer.',
    steps: [
      'Wash the pan once with soap and warm water (this is the only time soap is acceptable). Rinse and dry completely on the stovetop over medium heat for 3 minutes.',
      'Apply a very thin, even layer of flaxseed oil, vegetable oil, or shortening to the entire pan — inside, outside, and handle — using a paper towel.',
      'Wipe away any excess oil. The coating should be barely visible. Too much oil = sticky, gummy surface.',
      'Place upside down in an oven preheated to 230°C. Put a sheet of foil on the rack below to catch drips.',
      'Bake for 1 hour. Turn off the oven and let the pan cool completely inside.',
      'Repeat this process 3–4 times for a strong initial seasoning.',
    ],
    doList: [
      'Rinse with hot water and a stiff brush after each use',
      'Dry immediately and thoroughly on the stovetop',
      'Rub lightly with oil after every use to maintain the seasoning',
      'Heat gradually — cast iron distributes heat once hot',
    ],
    dontList: [
      'Never soak in water or leave wet',
      'Avoid cooking acidic foods (tomatoes, citrus) until well seasoned',
      'Don\'t put in the dishwasher',
      'Avoid drastic temperature changes',
    ],
  },
  {
    title: 'Caring for Ceramic Cookware',
    category: 'Ceramic',
    time: '5 min',
    icon: '🫕',
    summary: 'Ceramic is naturally non-stick, easy to clean, and free of synthetic coatings — but it does need gentle handling to keep its surface intact.',
    steps: [
      'Allow ceramic pots and pans to cool completely before washing. Sudden temperature changes (like cold water on a hot pan) can crack the glaze.',
      'Wash by hand with warm water, a soft sponge and mild dish soap. Avoid abrasive scrubbers.',
      'For stuck food, soak in warm soapy water for 10–15 minutes before washing. Most food will wipe away easily.',
      'Rinse and dry with a soft cloth. Ceramic can be left to air dry but towel drying prevents water spots.',
      'Store with a soft cloth or paper towel between stacked pieces to prevent chipping.',
    ],
    doList: [
      'Use silicone, wooden, or plastic utensils',
      'Heat on low to medium — ceramic retains heat well',
      'Hand wash whenever possible for longevity',
      'Soak stubborn residue rather than scrubbing',
    ],
    dontList: [
      'Metal utensils will scratch the surface',
      'Avoid extremely high heat or broiler use unless specified',
      'Don\'t drop — ceramic chips at edges more easily than metal',
      'Dishwasher use degrades the surface over time',
    ],
  },
  {
    title: 'Keeping Your Knives Sharp',
    category: 'Knives & Cutlery',
    time: '5–10 min',
    icon: '🔪',
    summary: 'A sharp knife is safer than a dull one. Learn the two-step routine that professional chefs use to keep their blades in perfect condition.',
    steps: [
      'Hone your knife before each use with a honing steel. Hold the steel vertically, tip on a cutting board. Draw the blade down the steel at a 15–20° angle, alternating sides, 5–8 strokes per side. This realigns the edge without removing metal.',
      'Sharpen 2–4 times a year using a whetstone or take it to a professional. Sharpening removes metal to create a new edge — honing simply maintains it.',
      'For whetstone sharpening: soak the stone 5 minutes, hold the blade at 15° and draw across the stone in long, even strokes. Start with the coarser grit side, finish on the finer side.',
      'Test sharpness by slicing a sheet of paper. A sharp knife cuts cleanly; a dull one tears.',
    ],
    doList: [
      'Use an acacia or soft plastic cutting board — hard boards dull blades',
      'Wash knives by hand and dry immediately',
      'Store in a knife block or on a magnetic strip',
      'Hone regularly — even before every use',
    ],
    dontList: [
      'Never put quality knives in the dishwasher',
      'Don\'t store loose in a drawer — the blade will dull and chip',
      'Avoid cutting on glass, stone, or ceramic surfaces',
      'Don\'t use a knife to pry or scrape',
    ],
  },
  {
    title: 'Maintaining Wooden Cutting Boards',
    category: 'Boards & Utensils',
    time: '10 min',
    icon: '🪵',
    summary: 'Acacia and hardwood boards are naturally antimicrobial and beautiful — with simple care they\'ll last decades.',
    steps: [
      'After each use, wash with warm soapy water and a sponge. Rinse quickly and dry immediately with a towel — do not let it sit in water or soak.',
      'Stand the board upright or prop it to allow airflow on both sides while drying. Lying flat on one side causes warping.',
      'Once a month, oil your board generously. Use food-grade mineral oil, beeswax, or a dedicated board conditioner. Apply liberally, let it soak in for at least 2 hours (or overnight), then wipe off excess.',
      'To remove odours from onion, garlic or fish: rub the board with half a lemon and coarse salt. Let sit 5 minutes, rinse and dry.',
      'For deep stains or rough spots, sand lightly with fine-grit sandpaper, then re-oil.',
    ],
    doList: [
      'Oil monthly or whenever the wood looks dry',
      'Dry immediately after washing',
      'Use both sides to prevent warping',
      'Sanitise with white vinegar after cutting meat',
    ],
    dontList: [
      'Never put in the dishwasher',
      'Don\'t soak or leave in water',
      'Avoid olive oil — it goes rancid in the wood',
      'Don\'t put near heat sources',
    ],
  },
  {
    title: 'Stainless Steel: Cleaning & Polishing',
    category: 'Stainless Steel',
    time: '5 min',
    icon: '✨',
    summary: 'Stainless steel is incredibly durable, but it can discolour and develop stubborn spots if not cleaned properly.',
    steps: [
      'For everyday cleaning, wash with warm soapy water and a soft cloth or sponge. Dry thoroughly to prevent water spots.',
      'For heat discolouration (the rainbow-coloured staining): make a paste of baking soda and water, apply and rub in the direction of the grain, then rinse.',
      'For white chalky mineral deposits: soak a cloth in white vinegar and lay over the affected area for 15 minutes. Wipe away and rinse.',
      'For a deep polish: apply a small amount of Bar Keepers Friend (or similar stainless steel cleaner) with a soft cloth, rub with the grain, rinse thoroughly.',
      'To prevent future spotting: always dry stainless steel immediately after washing.',
    ],
    doList: [
      'Always rub in the direction of the visible grain lines',
      'Rinse soap off completely to prevent film',
      'Dry immediately after washing',
      'Use non-abrasive cloths',
    ],
    dontList: [
      'Avoid steel wool — it scratches and can cause rust',
      'Don\'t use bleach-based cleaners',
      'Avoid chlorine-based cleaning products',
      'Don\'t leave salty water sitting in stainless pots',
    ],
  },
]

export default function GuidesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-earth text-ivory px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sienna mb-4 font-medium">Knowledge</p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">Care Guides</h1>
          <p className="text-ivory/50 text-base sm:text-lg max-w-xl">
            The tools you invest in deserve proper care. Follow these guides and they\'ll outlast every kitchen trend.
          </p>
        </div>
      </section>

      {/* Guides */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {GUIDES.map((guide, i) => (
          <div key={i} className="bg-white rounded-2xl border border-earth/10 overflow-hidden">
            <div className="p-6 sm:p-7">
              <div className="flex items-start gap-4 mb-5">
                <span className="text-3xl">{guide.icon}</span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-terra font-semibold mb-0.5">{guide.category} · {guide.time}</p>
                  <h2 className="font-serif text-xl text-earth">{guide.title}</h2>
                  <p className="text-sm text-earth/55 mt-1 leading-relaxed">{guide.summary}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-earth/40 mb-3">How to do it</h3>
                <ol className="space-y-3">
                  {guide.steps.map((step, j) => (
                    <li key={j} className="flex gap-3 text-sm text-earth/65">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-earth text-ivory text-[10px] font-bold flex items-center justify-center mt-0.5">{j + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Do / Don't */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-terra/8 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-terra uppercase tracking-widest mb-2">Do</h4>
                  <ul className="space-y-1.5">
                    {guide.doList.map((d, j) => (
                      <li key={j} className="text-xs text-earth/65 flex gap-2">
                        <span className="text-terra shrink-0">✓</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-2">Don't</h4>
                  <ul className="space-y-1.5">
                    {guide.dontList.map((d, j) => (
                      <li key={j} className="text-xs text-earth/65 flex gap-2">
                        <span className="text-red-400 shrink-0">✕</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 text-center">
        <p className="text-earth/45 text-sm mb-4">Questions about a specific product?</p>
        <Link href="/contact" className="inline-block bg-earth text-ivory px-7 py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors">
          Contact Us
        </Link>
      </div>
    </div>
  )
}
