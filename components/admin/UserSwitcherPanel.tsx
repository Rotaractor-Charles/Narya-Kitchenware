'use client'

import { useState, useEffect, useCallback } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithCustomToken } from 'firebase/auth'
import { useRouter } from 'next/navigation'

type AppUser = {
  uid:         string
  email:       string
  displayName: string
  photoURL:    string | null
  role:        string
  disabled:    boolean
  lastSignIn:  string | null
}

type Tab = 'switch' | 'roles'

const ROLE_COLOR: Record<string, string> = {
  superadmin: 'text-red-400 bg-red-400/10',
  admin:      'text-amber-400 bg-amber-400/10',
  editor:     'text-blue-400 bg-blue-400/10',
  customer:   'text-ivory/30 bg-white/5',
}

export default function UserSwitcherPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab]                 = useState<Tab>('switch')
  const [users, setUsers]             = useState<AppUser[]>([])
  const [search, setSearch]           = useState('')
  const [loading, setLoading]         = useState(true)
  const [switching, setSwitching]     = useState<string | null>(null)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const [roleMsg, setRoleMsg]         = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => { setUsers(d.users ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName.toLowerCase().includes(search.toLowerCase()),
  )

  async function impersonate(user: AppUser) {
    setSwitching(user.uid)
    try {
      const res = await fetch('/api/admin/impersonate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ targetUid: user.uid }),
      })
      if (!res.ok) throw new Error('Impersonate API failed')
      const { customToken } = await res.json()

      const { user: fbUser } = await signInWithCustomToken(auth, customToken)
      const idToken = await fbUser.getIdToken()

      await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ idToken }),
      })

      // Set impersonation marker (non-httpOnly — read by banner on the store)
      const encoded = encodeURIComponent(user.email)
      document.cookie = `__narya_impersonating=1; path=/; max-age=3600`
      document.cookie = `__narya_impersonating_as=${encoded}; path=/; max-age=3600`

      router.push('/')
    } catch (err) {
      console.error('[impersonate]', err)
      setSwitching(null)
    }
  }

  async function setRole(uid: string, role: string) {
    setUpdatingRole(uid)
    setRoleMsg(null)
    try {
      const res = await fetch(`/api/admin/users/${uid}/role`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error()
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u))
      setRoleMsg({ type: 'ok', text: 'Role updated — user must sign in again for it to take effect.' })
    } catch {
      setRoleMsg({ type: 'err', text: 'Failed to update role.' })
    } finally {
      setUpdatingRole(null)
    }
  }

  function avatar(user: AppUser) {
    return user.displayName?.[0] ?? user.email?.[0]?.toUpperCase() ?? '?'
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Panel — slides in to the right of the sidebar */}
      <div className="fixed left-48 top-0 z-50 h-screen w-80 bg-[#111d11] border-r border-white/8 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 shrink-0">
          <h2 className="text-[10px] font-semibold text-ivory/50 uppercase tracking-widest">User Switcher</h2>
          <button onClick={onClose} className="text-ivory/25 hover:text-ivory transition-colors text-sm leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/8 shrink-0">
          {(['switch', 'roles'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs transition-colors ${
                tab === t
                  ? 'text-ivory border-b-2 border-sienna'
                  : 'text-ivory/35 hover:text-ivory/60'
              }`}
            >
              {t === 'switch' ? 'Switch User' : 'Manage Roles'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-3 pt-2.5 pb-2 border-b border-white/6 shrink-0">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-ivory placeholder:text-ivory/25 focus:outline-none focus:border-sienna/50"
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center text-ivory/20 text-xs py-10">Loading users…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-ivory/20 text-xs py-10">No users found.</p>
          ) : tab === 'switch' ? (

            <ul className="divide-y divide-white/5">
              {filtered.map(user => (
                <li key={user.uid}>
                  <button
                    onClick={() => impersonate(user)}
                    disabled={!!switching}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-colors text-left disabled:opacity-60 group"
                  >
                    <div className="w-7 h-7 rounded-full bg-sienna/20 border border-sienna/30 flex items-center justify-center text-[11px] font-semibold text-sienna shrink-0 select-none">
                      {avatar(user)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-ivory/80 text-xs truncate leading-tight">
                        {user.displayName || user.email}
                      </p>
                      {user.displayName && (
                        <p className="text-ivory/30 text-[10px] truncate leading-tight">{user.email}</p>
                      )}
                    </div>

                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded shrink-0 ${ROLE_COLOR[user.role] ?? 'text-ivory/20 bg-white/5'}`}>
                      {user.role}
                    </span>

                    {switching === user.uid ? (
                      <span className="text-[10px] text-sienna shrink-0">switching…</span>
                    ) : (
                      <span className="text-ivory/15 group-hover:text-ivory/50 text-xs shrink-0 transition-colors">→</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

          ) : (

            /* Roles tab */
            <div>
              {roleMsg && (
                <div className={`px-4 py-2.5 text-[11px] border-b ${
                  roleMsg.type === 'ok'
                    ? 'text-green-400 bg-green-400/5 border-green-400/10'
                    : 'text-red-400 bg-red-400/5 border-red-400/10'
                }`}>
                  {roleMsg.text}
                </div>
              )}
              <ul className="divide-y divide-white/5">
                {filtered.map(user => (
                  <li key={user.uid} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-sienna/20 border border-sienna/30 flex items-center justify-center text-[11px] font-semibold text-sienna shrink-0 select-none">
                      {avatar(user)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-ivory/70 text-xs truncate">
                        {user.displayName || user.email}
                      </p>
                      {user.displayName && (
                        <p className="text-ivory/25 text-[10px] truncate">{user.email}</p>
                      )}
                    </div>

                    <select
                      value={user.role}
                      onChange={e => setRole(user.uid, e.target.value)}
                      disabled={updatingRole === user.uid}
                      className="appearance-none bg-[#0e1a0e] border border-white/15 rounded px-2 py-1 pr-6 text-[10px] text-ivory/70 focus:outline-none focus:border-sienna/50 disabled:opacity-40 cursor-pointer [&>option]:bg-[#0e1a0e] [&>option]:text-ivory"
                    >
                      <option value="customer">Customer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-white/8 px-4 py-3 shrink-0">
          <p className="text-[10px] text-ivory/18 leading-relaxed">
            {tab === 'switch'
              ? 'Opens the store as the selected user. An orange banner lets you return here.'
              : 'Role changes take effect on the user\'s next sign-in.'}
          </p>
        </div>
      </div>
    </>
  )
}
