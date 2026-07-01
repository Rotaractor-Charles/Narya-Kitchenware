import { ImageResponse } from 'next/og'
import { getProductBySlug } from '@/lib/api/products'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

export default async function Image({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)

  const name = product?.name ?? 'Premium Kitchenware'
  const category = product?.category?.name ?? 'Kitchenware'
  const price = product ? `KSh ${(product.price / 100).toLocaleString('en-KE')}` : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#F5F0E8',
          padding: '0',
        }}
      >
        {/* Left panel — dark */}
        <div
          style={{
            width: '55%',
            height: '100%',
            backgroundColor: '#1C2E1C',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 56px',
          }}
        >
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="24" height="32" viewBox="0 0 17 23" fill="none">
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
                fontSize: '22px',
                color: '#F5F0E8',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              NARYA
            </span>
          </div>

          {/* Product name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontSize: '13px',
                color: '#A7C4A0',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {category}
            </div>
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: name.length > 30 ? '44px' : '56px',
                color: '#F5F0E8',
                lineHeight: 1.15,
              }}
            >
              {name}
            </div>
            {price && (
              <div
                style={{
                  fontSize: '28px',
                  color: '#A7C4A0',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {price}
              </div>
            )}
          </div>

          {/* Bottom: narya.co.ke */}
          <div
            style={{
              fontSize: '18px',
              color: '#F5F0E8',
              opacity: 0.4,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            narya.co.ke
          </div>
        </div>

        {/* Right panel — light with decorative skillet */}
        <div
          style={{
            width: '45%',
            height: '100%',
            backgroundColor: '#E8E3D8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            viewBox="0 0 200 200"
            width="260"
            height="260"
            fill="none"
            stroke="#3A6B4A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.35}
          >
            <ellipse cx="100" cy="118" rx="60" ry="14" />
            <path d="M40 118 Q40 75 100 75 Q160 75 160 118" />
            <line x1="160" y1="98" x2="192" y2="74" />
            <path d="M78 64 Q81 52 78 40" strokeOpacity="0.5" />
            <path d="M100 58 Q103 46 100 34" strokeOpacity="0.5" />
            <path d="M122 64 Q125 52 122 40" strokeOpacity="0.5" />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  )
}
