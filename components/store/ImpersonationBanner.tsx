'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ImpersonationBanner() {
  const [asEmail, setAsEmail] = useState<string | null>(null)
  const [returning, setReturning] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const map = document.cookie.split(';').reduce<Record<string, string>>((acc, c) => {
      const eq = c.indexOf('=')
      if (eq > -1) acc[c.slice(0, eq).trim()] = c.slice(eq + 1).trim()
      return acc
    }, {})

    if (map['__narya_impersonating']) {
      setAsEmail(decodeURIComponent(map['__narya_impersonating_as'] ?? ''))
    }
  }, [])

  if (!asEmail) return null

  async function returnToAdmin() {
    setReturning(true)
    document.cookie = '__narya_impersonating=; max-age=0; path=/'
    document.cookie = '__narya_impersonating_as=; max-age=0; path=/'
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-between gap-4 bg-amber-500 text-black px-5 py-2.5 shadow-lg">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>👁</span>
        <span>
          Viewing store as <strong>{asEmail}</strong>
        </span>
      </div>
      <button
        onClick={returnToAdmin}
        disabled={returning}
        className="shrink-0 bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-black transition-colors disabled:opacity-60"
      >
        {returning ? 'Returning…' : '← Return to Admin'}
      </button>
    </div>
  )
}
