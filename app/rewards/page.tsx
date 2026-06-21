import type { Metadata } from 'next'
import RewardsClient from '@/components/rewards/RewardsClient'

export const metadata: Metadata = { title: 'Rewards' }

export default function RewardsPage() {
  return <RewardsClient />
}
