import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream px-6">

      {/* Decorative watermark */}
      <svg
        viewBox="0 0 300 400"
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[480px] opacity-[0.05] pointer-events-none"
      >
        <g transform="translate(150 240)" stroke="#1C2E1C" strokeWidth="12" strokeLinecap="round" fill="none">
          <g transform="rotate(20)">
            <line x1="0" y1="0" x2="0" y2="-160" />
            <line x1="-14" y1="-160" x2="-14" y2="-200" />
            <line x1="0"   y1="-160" x2="0"   y2="-210" />
            <line x1="14"  y1="-160" x2="14"  y2="-200" />
          </g>
          <g transform="rotate(-20)">
            <line x1="0" y1="0" x2="0" y2="-155" />
            <ellipse cx="0" cy="-178" rx="22" ry="32" />
          </g>
        </g>
      </svg>

      {/* Content */}
      <div className="relative max-w-3xl text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-forest/50 mb-8">
          Premium Kitchenware
        </p>

        <h1 className="font-serif text-forest text-5xl sm:text-6xl md:text-7xl leading-tight mb-8">
          Craft your kitchen.
          <br />
          <em className="not-italic text-forest/60">Love your cooking.</em>
        </h1>

        <p className="text-forest/60 text-lg sm:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
          Thoughtfully designed tools for home cooks who care about what they use.
          Built to last a lifetime — and look beautiful doing it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-4 bg-forest text-cream text-sm tracking-widest uppercase hover:bg-forest/90 transition-colors duration-200"
          >
            Shop Now
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-4 border border-forest text-forest text-sm tracking-widest uppercase hover:bg-forest hover:text-cream transition-colors duration-200"
          >
            Our Story
          </Link>
        </div>
      </div>

    </section>
  )
}
