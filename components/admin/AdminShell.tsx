'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Login page gets no sidebar — it's a standalone full-screen page
  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="flex min-h-screen bg-[#0f1a0f] text-sm">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        {children}
      </div>
    </div>
  )
}
