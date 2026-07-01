import { ImageResponse } from 'next/og'
import { getCategories } from '@/lib/api/categories'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ category: string }> }

const SPECIAL: Record<string, string> = {
  new: 'New Arrivals',
  sale: 'Sale — Limited Offers',
  'gift-sets': 'Gift Sets',
}

export default async function Image({ params }: Props) {
  const { category } = await params

  let title = SPECIAL[category] ?? null
  if (!title) {
    const categories = await getCategories().catch(() => [])
    const cat = categories.find((c) => c.slug === category)
    title = cat?.name ?? 'Shop Kitchenware'
  }

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
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <svg width="28" height="38" viewBox="0 0 17 23" fill="none">
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
              fontSize: '28px',
              color: '#F5F0E8',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            NARYA
          </span>
        </div>

        {/* Category headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              fontSize: '15px',
              color: '#A7C4A0',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Shop Collection
          </div>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '80px',
              color: '#F5F0E8',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '26px',
              color: '#A7C4A0',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Fast delivery · All 47 counties in Kenya
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            fontSize: '20px',
            color: '#F5F0E8',
            opacity: 0.4,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          narya.co.ke
        </div>
      </div>
    ),
    { ...size }
  )
}
