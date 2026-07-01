import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Narya Kitchenware — Quality Cookware & Kitchen Tools in Kenya'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1C2E1C',
          padding: '80px',
          justifyContent: 'space-between',
        }}
      >
        {/* Top: logo mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Plant/herb SVG mark */}
          <svg width="34" height="46" viewBox="0 0 17 23" fill="none">
            <path
              d="M8.5 22V8M8.5 8C8.5 8 4 6 2 2c3 0 6.5 2.5 6.5 6zM8.5 8C8.5 8 13 6 15 2c-3 0-6.5 2.5-6.5 6zM8.5 14C8.5 14 5 12.5 3 9c2.5.5 5.5 2 5.5 5zM8.5 14C8.5 14 12 12.5 14 9c-2.5.5-5.5 2-5.5 5z"
              stroke="#F5F0E8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '36px',
              color: '#F5F0E8',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            NARYA
          </span>
        </div>

        {/* Centre: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '72px',
              color: '#F5F0E8',
              lineHeight: 1.1,
              maxWidth: '800px',
            }}
          >
            Quality Kitchenware for the Kenyan Home.
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#A7C4A0',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Cast iron · Ceramic · Knives · Bakeware · Utensils
          </div>
        </div>

        {/* Bottom: domain + tagline */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              fontSize: '22px',
              color: '#F5F0E8',
              opacity: 0.45,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            narya.co.ke
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#3A6B4A',
              borderRadius: '8px',
              padding: '10px 20px',
            }}
          >
            <span style={{ fontSize: '18px', color: '#F5F0E8', fontFamily: 'system-ui, sans-serif' }}>
              Fast delivery · All 47 counties
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
