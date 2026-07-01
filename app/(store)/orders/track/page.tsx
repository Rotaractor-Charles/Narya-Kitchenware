import TrackOrderClient from './TrackOrderClient'

export const metadata = {
  title: 'Track Order | Narya Kitchenware',
  description: 'Track your Narya Kitchenware order status and delivery details.',
  robots: { index: false },
}

export default function TrackOrderPage() {
  return <TrackOrderClient />
}
