'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, loading } = useAuth()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage || loading) return
    if (!user) { router.replace('/admin/login'); return }
    if (user.role !== 'admin' && user.role !== 'shop_manager') {
      router.replace('/')
    }
  }, [user, loading, isLoginPage, router])

  if (isLoginPage) return <>{children}</>

  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-[#0f1a0f] items-center justify-center">
        <span className="text-ivory/30 text-sm">Loading…</span>
      </div>
    )
  }

  if (user.role !== 'admin' && user.role !== 'shop_manager') return null

  return (
    <div className="flex min-h-screen bg-[#0f1a0f] text-sm">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        {children}
      </div>
    </div>
  )
}
