'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AdminLoginForm() {
  const router  = useRouter()
  const { login } = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)

      if (user.role !== 'admin' && user.role !== 'shop_manager') {
        setError('You do not have admin access.')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(msg.includes('401') || msg.includes('credentials') ? 'Incorrect email or password.' : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-earth flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-ivory/30 text-[10px] uppercase tracking-[0.25em] mb-3">Narya Kitchenware</p>
          <h1 className="text-ivory font-serif text-2xl">Admin Portal</h1>
        </div>

        <div className="bg-white/5 border border-ivory/10 rounded-2xl p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-400/20 text-red-300 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-ivory/40 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@narya.co.ke"
                className="w-full bg-white/8 border border-ivory/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/25 focus:outline-none focus:border-sienna transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-ivory/40 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/8 border border-ivory/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/25 focus:outline-none focus:border-sienna transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sienna text-ivory py-3 rounded-xl text-sm font-semibold hover:bg-sienna/90 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-ivory/20 text-[11px] mt-6">
          Not an admin?{' '}
          <Link href="/" className="text-ivory/40 hover:text-ivory/60 transition-colors underline underline-offset-2">
            Return to store
          </Link>
        </p>
      </div>
    </div>
  )
}
