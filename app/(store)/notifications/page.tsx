import type { Metadata } from 'next'
import NotificationsClient from '@/components/notifications/NotificationsClient'

export const metadata: Metadata = { title: 'Notifications — Narya Kitchenware', robots: { index: false } }

export default function NotificationsPage() {
  return <NotificationsClient />
}
