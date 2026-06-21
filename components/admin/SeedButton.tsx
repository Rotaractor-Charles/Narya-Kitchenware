'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SeedButton() {
  const router = useRouter()
  const [state,  setState]  = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function seed() {
    if (state === 'loading') return
    if (!confirm('This will add all sample products to Firestore. Continue?')) return
    setState('loading')
    setErrMsg('')
    try {
      const res  = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok && res.status !== 207) throw new Error(data.error ?? 'Seed failed')
      if (data.error) {
        setErrMsg(data.error)
        setState('error')
        return
      }
      setState('done')
      router.refresh()
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Seed failed')
      setState('error')
    } finally {
      if (state === 'error') setTimeout(() => setState('idle'), 5000)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={seed}
        disabled={state === 'loading' || state === 'done'}
        className="px-4 py-2 border border-white/12 text-ivory/50 hover:text-ivory/80 hover:border-white/25 text-sm rounded-xl transition-colors disabled:opacity-40"
      >
        {{ idle: 'Seed sample data', loading: 'Seeding…', done: '✓ Seeded', error: '✕ Failed' }[state]}
      </button>
      {errMsg && (
        <p className="text-red-400 text-[11px] max-w-xs text-right">{errMsg}</p>
      )}
    </div>
  )
}
