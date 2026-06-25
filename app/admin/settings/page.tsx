'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const INP = 'w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-sienna/50 transition-colors'
const CARD = 'bg-[#1a2a1a] border border-white/8 rounded-xl p-5 space-y-4'
const LBL = 'block text-[11px] text-ivory/40 uppercase tracking-widest mb-1.5'

function Notice({ type, msg }: { type: 'ok' | 'err'; msg: string }) {
  return (
    <p className={`text-xs rounded-lg px-3 py-2 ${type === 'ok' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
      {msg}
    </p>
  )
}

function ProfileSection({ user }: { user: { name: string; email: string } }) {
  const [name,  setName]  = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [msg,   setMsg]   = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    try {
      const res = await fetch('/api/auth/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email }),
      })
      setMsg(res.ok ? { type: 'ok', text: 'Profile updated.' } : { type: 'err', text: 'Failed to save.' })
    } catch {
      setMsg({ type: 'err', text: 'Network error.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className={CARD}>
      <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">Account Profile</h2>
      {msg && <Notice type={msg.type} msg={msg.text} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LBL}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className={INP} />
        </div>
        <div>
          <label className={LBL}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={INP} />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-sienna text-ivory text-xs font-semibold rounded-lg hover:bg-sienna/90 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}

function PasswordSection() {
  const [current,  setCurrent]  = useState('')
  const [next,     setNext]     = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [msg,      setMsg]      = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [saving,   setSaving]   = useState(false)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (next !== confirm) { setMsg({ type: 'err', text: 'Passwords do not match.' }); return }
    if (next.length < 8)  { setMsg({ type: 'err', text: 'Password must be at least 8 characters.' }); return }
    setSaving(true); setMsg(null)
    try {
      const res = await fetch('/api/auth/password', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ current_password: current, password: next, password_confirmation: confirm }),
      })
      if (res.ok) {
        setMsg({ type: 'ok', text: 'Password updated.' })
        setCurrent(''); setNext(''); setConfirm('')
      } else {
        const data = await res.json()
        setMsg({ type: 'err', text: data.message ?? 'Failed to update password.' })
      }
    } catch {
      setMsg({ type: 'err', text: 'Network error.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className={CARD}>
      <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">Change Password</h2>
      {msg && <Notice type={msg.type} msg={msg.text} />}
      <div>
        <label className={LBL}>Current password</label>
        <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required placeholder="••••••••" className={INP} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LBL}>New password</label>
          <input type="password" value={next} onChange={e => setNext(e.target.value)} required placeholder="••••••••" className={INP} />
        </div>
        <div>
          <label className={LBL}>Confirm new password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••" className={INP} />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-sienna text-ivory text-xs font-semibold rounded-lg hover:bg-sienna/90 transition-colors disabled:opacity-50"
      >
        {saving ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}

function StoreInfoSection() {
  return (
    <div className={CARD}>
      <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">Store Info</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Store name',  value: 'Narya Kitchenware' },
          { label: 'Currency',    value: 'KES — Kenyan Shilling' },
          { label: 'Country',     value: 'Kenya' },
          { label: 'Timezone',    value: 'Africa/Nairobi (UTC+3)' },
        ].map(f => (
          <div key={f.label}>
            <label className={LBL}>{f.label}</label>
            <input defaultValue={f.value} className={INP} readOnly />
          </div>
        ))}
      </div>
      <p className="text-ivory/20 text-[11px]">Store configuration is managed via environment variables.</p>
    </div>
  )
}

function DangerSection() {
  const router   = useRouter()
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
    router.push('/admin/login')
  }

  return (
    <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5 space-y-3">
      <h2 className="text-xs font-semibold text-red-400/70 uppercase tracking-widest">Danger Zone</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ivory/50">Sign out of admin</p>
          <p className="text-[11px] text-ivory/25">You will be redirected to the login page.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function AdminSettingsPage() {
  const { user } = useAuth()

  return (
    <div className="p-5 max-w-2xl space-y-5">
      <h1 className="text-ivory text-xl font-medium">Settings</h1>

      <StoreInfoSection />

      {user && <ProfileSection user={user} />}

      <PasswordSection />

      <DangerSection />
    </div>
  )
}
