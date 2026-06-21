'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

// ─── Define your test personas here ────────────────────────────────────────────
// Create these users in your Firebase console → Authentication → Add user
const DEV_USERS = [
  {
    label: 'Jane (Customer)',
    email: 'jane@narya.dev',
    password: 'Test1234!',
    avatar: 'J',
    color: 'bg-terra',
    description: '1,180 pts · Cultivator tier',
    redirect: '/',
  },
  {
    label: 'David (New User)',
    email: 'david@narya.dev',
    password: 'Test1234!',
    avatar: 'D',
    color: 'bg-amber-600',
    description: '0 pts · no orders yet',
    redirect: '/',
  },
  {
    label: 'Admin',
    email: 'admin@narya.dev',
    password: 'Test1234!',
    avatar: 'A',
    color: 'bg-earth',
    description: 'Full admin access',
    redirect: '/admin',
  },
]

export default function DevUserSwitcher() {
  const router   = useRouter()
  const [open,   setOpen]   = useState(false)
  const [status, setStatus] = useState('')
  const [active, setActive] = useState<string | null>(null)

  async function switchTo(user: typeof DEV_USERS[0]) {
    setStatus(`Signing in as ${user.label}…`)
    try {
      // Sign in with Firebase client SDK
      const credential = await signInWithEmailAndPassword(auth, user.email, user.password)
      const idToken    = await credential.user.getIdToken()

      // Create server session cookie
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ idToken }),
      })

      if (!res.ok) throw new Error('Session creation failed')

      setActive(user.label)
      setStatus(`✓ Signed in as ${user.label}`)
      router.push(user.redirect)
      router.refresh()
      setTimeout(() => setStatus(''), 3000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed'
      setStatus(`✕ ${msg}`)
      setTimeout(() => setStatus(''), 4000)
    }
  }

  async function handleLogout() {
    setStatus('Signing out…')
    try {
      await signOut(auth)
      await fetch('/api/auth/logout', { method: 'POST' })
      setActive(null)
      setStatus('✓ Signed out')
      router.refresh()
      setTimeout(() => setStatus(''), 2000)
    } catch {
      setStatus('Logout failed')
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-sans">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 rounded-full bg-earth text-ivory text-xs font-bold shadow-lg hover:bg-earth/90 transition-colors flex items-center justify-center"
        title="Dev User Switcher"
      >
        {open ? '✕' : '👤'}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute bottom-11 left-0 w-64 bg-white rounded-2xl border border-earth/15 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-earth px-4 py-2.5 flex items-center justify-between">
            <span className="text-ivory text-xs font-semibold tracking-wide">DEV · User Switcher</span>
            <span className="text-ivory/40 text-[10px]">dev only</span>
          </div>

          {/* Status bar */}
          {status && (
            <div className="px-4 py-2 bg-ivory-dark text-[11px] text-earth/70 border-b border-earth/8">
              {status}
            </div>
          )}

          {/* User list */}
          <ul className="divide-y divide-earth/6">
            {DEV_USERS.map(user => (
              <li key={user.email}>
                <button
                  onClick={() => switchTo(user)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-ivory-dark transition-colors text-left"
                >
                  <div className={`w-7 h-7 rounded-full ${user.color} text-ivory text-xs font-bold flex items-center justify-center shrink-0`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-earth leading-none flex items-center gap-1.5">
                      {user.label}
                      {active === user.label && (
                        <span className="w-1.5 h-1.5 rounded-full bg-terra inline-block" />
                      )}
                    </p>
                    <p className="text-[10px] text-earth/40 mt-0.5">{user.description}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout */}
          <div className="px-4 py-3 border-t border-earth/8">
            <button
              onClick={handleLogout}
              className="w-full text-xs text-earth/50 hover:text-red-500 transition-colors text-left"
            >
              → Sign out current user
            </button>
          </div>

          {/* Credentials hint */}
          <div className="px-4 py-2.5 bg-ivory-dark border-t border-earth/6">
            <p className="text-[10px] text-earth/35 leading-relaxed">
              Password for all dev users: <span className="font-mono text-earth/55">Test1234!</span><br />
              Create in Firebase Console → Authentication
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
