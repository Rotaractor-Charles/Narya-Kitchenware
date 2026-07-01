export const metadata = { title: 'Theme Preview | Narya Kitchenware', robots: { index: false } }

const THEMES = [
  {
    id: 1,
    name: 'Warm Earth',
    desc: 'Terracotta & espresso — artisanal, inviting',
    bg:       '#FFF8F0',
    surface:  '#F2E8DC',
    primary:  '#C1440E',
    text:     '#2C1810',
    textMid:  '#7A4A38',
    accent:   '#E8956D',
    navBg:    '#2C1810',
    navText:  '#FFF8F0',
  },
  {
    id: 2,
    name: 'Midnight Luxe',
    desc: 'Near-black & gold — premium, dramatic',
    bg:       '#F5F4EF',
    surface:  '#ECEAE2',
    primary:  '#B8860B',
    text:     '#1A1510',
    textMid:  '#6B5F45',
    accent:   '#D4AF37',
    navBg:    '#1A1510',
    navText:  '#F5F4EF',
  },
  {
    id: 3,
    name: 'Ocean Blue',
    desc: 'Deep navy & sky — fresh, modern, trustworthy',
    bg:       '#F0F6FF',
    surface:  '#E0EDFF',
    primary:  '#1B4F8A',
    text:     '#0D2340',
    textMid:  '#3D6490',
    accent:   '#3B9EDB',
    navBg:    '#0D2340',
    navText:  '#F0F6FF',
  },
  {
    id: 4,
    name: 'Rose Kitchen',
    desc: 'Deep rose & blush — warm, feminine, distinctive',
    bg:       '#FFF5F5',
    surface:  '#FAE8E8',
    primary:  '#9B2335',
    text:     '#3D0C11',
    textMid:  '#8B4455',
    accent:   '#D4607A',
    navBg:    '#3D0C11',
    navText:  '#FFF5F5',
  },
  {
    id: 5,
    name: 'Sage & Stone',
    desc: 'Vivid sage & stone — clean, natural, contemporary',
    bg:       '#F5F7F0',
    surface:  '#E8EDE0',
    primary:  '#3A6B4A',
    text:     '#1C2E1C',
    textMid:  '#4A6E4A',
    accent:   '#6BAF82',
    navBg:    '#1C2E1C',
    navText:  '#F5F7F0',
  },
]

// Mini logo SVG
function LogoMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 64" width="20" height="26" aria-hidden="true">
      <g transform="translate(24 44)" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none">
        <g transform="rotate(20)">
          <line x1="0" y1="0" x2="0" y2="-30" />
          <line x1="-3.5" y1="-30" x2="-3.5" y2="-38" />
          <line x1="0"    y1="-30" x2="0"    y2="-40" />
          <line x1="3.5"  y1="-30" x2="3.5"  y2="-38" />
        </g>
        <g transform="rotate(-20)">
          <line x1="0" y1="0" x2="0" y2="-28" />
          <ellipse cx="0" cy="-34" rx="5" ry="7" />
        </g>
      </g>
    </svg>
  )
}

const CATEGORIES = ['Cookware', 'Bakeware', 'Cutlery', 'Appliances', 'Storage', 'Utensils']

function ThemePreview({ t }: { t: typeof THEMES[number] }) {
  return (
    <article style={{ background: t.bg, border: `1px solid ${t.surface}` }} className="rounded-xl overflow-hidden shadow-lg">

      {/* ── Header ── */}
      <div style={{ background: t.navBg }} className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoMark color={t.navText} />
          <span style={{ color: t.navText, fontFamily: 'Georgia, serif', letterSpacing: '0.2em', fontSize: 13 }}>
            NARYA
          </span>
        </div>
        <div style={{ background: `${t.navText}18`, borderRadius: 20 }} className="flex-1 mx-4 h-6" />
        <div className="flex gap-2">
          {['☺','♡','🛍'].map((ic) => (
            <span key={ic} style={{ color: `${t.navText}80`, fontSize: 14 }}>{ic}</span>
          ))}
        </div>
      </div>

      {/* Category strip */}
      <div style={{ background: t.navBg, borderTop: `1px solid ${t.navText}18` }}
        className="px-4 py-1.5 flex gap-4 overflow-hidden">
        {CATEGORIES.map((c) => (
          <span key={c} style={{ color: `${t.navText}80`, fontSize: 10, whiteSpace: 'nowrap' }}>{c}</span>
        ))}
      </div>

      {/* ── Hero ── */}
      <div style={{ background: t.primary, position: 'relative', overflow: 'hidden' }} className="px-8 py-10">
        {/* Watermark */}
        <svg viewBox="0 0 200 260" aria-hidden="true"
          style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', width: 140, opacity: 0.07 }}>
          <g transform="translate(100 160)" stroke={t.navText} strokeWidth="8" strokeLinecap="round" fill="none">
            <g transform="rotate(20)">
              <line x1="0" y1="0" x2="0" y2="-100" />
              <line x1="-9" y1="-100" x2="-9" y2="-128" />
              <line x1="0"  y1="-100" x2="0"  y2="-134" />
              <line x1="9"  y1="-100" x2="9"  y2="-128" />
            </g>
            <g transform="rotate(-20)">
              <line x1="0" y1="0" x2="0" y2="-96" />
              <ellipse cx="0" cy="-110" rx="14" ry="20" />
            </g>
          </g>
        </svg>
        <p style={{ color: `${t.navText}70`, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>
          New Collection
        </p>
        <h2 style={{ color: t.navText, fontFamily: 'Georgia, serif', fontSize: 22, lineHeight: 1.3, marginBottom: 10 }}>
          Craft your kitchen.<br />Love your cooking.
        </h2>
        <p style={{ color: `${t.navText}70`, fontSize: 11, marginBottom: 16, maxWidth: 240, lineHeight: 1.5 }}>
          Thoughtfully designed tools for home cooks who care about what they use.
        </p>
        <div className="flex gap-2">
          <span style={{
            border: `1.5px solid ${t.navText}`,
            color: t.navText,
            padding: '6px 16px',
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Shop Now
          </span>
          <span style={{
            border: `1.5px solid ${t.navText}60`,
            color: `${t.navText}80`,
            padding: '6px 16px',
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Our Story
          </span>
        </div>
      </div>

      {/* ── Category tiles ── */}
      <div className="grid grid-cols-3 gap-1 p-2">
        {[
          { label: 'Cookware',    bg: t.primary,   color: t.navText },
          { label: 'Bakeware',    bg: t.surface,   color: t.text    },
          { label: 'Cutlery',     bg: t.text,      color: t.bg      },
          { label: 'Appliances',  bg: t.surface,   color: t.text    },
          { label: 'Storage',     bg: t.accent,    color: t.text    },
          { label: 'Clearance',   bg: '#DC2626',   color: '#fff'    },
        ].map(({ label, bg, color }) => (
          <div key={label} style={{ background: bg, padding: '10px 8px', aspectRatio: '4/3', display: 'flex', alignItems: 'flex-end' }}>
            <span style={{ color, fontFamily: 'Georgia, serif', fontSize: 10 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── CTA bar ── */}
      <div style={{ background: t.primary }} className="px-6 py-5 text-center">
        <p style={{ color: t.navText, fontFamily: 'Georgia, serif', fontSize: 14, marginBottom: 10 }}>
          Stay in the kitchen loop
        </p>
        <div className="flex gap-2 max-w-[240px] mx-auto">
          <div style={{ flex: 1, background: `${t.navText}18`, height: 32, borderRadius: 2 }} />
          <div style={{ background: t.navText, color: t.primary, padding: '0 12px', height: 32, display: 'flex', alignItems: 'center', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
            Subscribe
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background: t.text }} className="px-6 py-4 flex items-center justify-between">
        <span style={{ color: t.bg, fontFamily: 'Georgia, serif', letterSpacing: '0.2em', fontSize: 11 }}>NARYA</span>
        <div className="flex gap-3">
          {['Shop', 'Learn', 'Company'].map((l) => (
            <span key={l} style={{ color: `${t.bg}50`, fontSize: 9 }}>{l}</span>
          ))}
        </div>
      </div>

      {/* ── Swatch strip ── */}
      <div className="flex p-3 gap-2 items-center" style={{ background: t.bg }}>
        {[t.primary, t.accent, t.text, t.surface, t.bg].map((hex, i) => (
          <div key={i} title={hex}
            style={{ background: hex, width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
        ))}
        <span style={{ color: t.textMid, fontSize: 10, marginLeft: 4 }}>
          {[t.primary, t.accent, t.text].join(' · ')}
        </span>
      </div>

    </article>
  )
}

export default function ThemesPage() {
  return (
    <div style={{ background: '#F0EEE9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, textAlign: 'center', marginBottom: 6, color: '#1a1a1a' }}>
          Theme Previews
        </h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: 13, marginBottom: 40 }}>
          Each preview shows: utility bar → main header → category nav → hero → tiles → newsletter → footer
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {THEMES.map((t) => (
            <div key={t.id}>
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                  {t.id}. {t.name}
                </span>
                <p style={{ fontSize: 11, color: '#777', marginTop: 2 }}>{t.desc}</p>
              </div>
              <ThemePreview t={t} />
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 32 }}>
          Tell me the number (1–5) and I&apos;ll apply it across the whole site.
        </p>
      </div>
    </div>
  )
}
