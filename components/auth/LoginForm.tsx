'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') ?? '/'
  const { login }    = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push(from)
      router.refresh()
    } catch (err: unknown) {
      const data = err as { message?: string; errors?: Record<string, string[]> }
      const msg  = data?.errors?.email?.[0] ?? data?.message ?? 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl text-earth mb-1">Welcome back</h1>
        <p className="text-sm text-earth/50">Sign in to your Narya account</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-earth/45 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="jane@email.com"
            className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth placeholder-earth/30 focus:outline-none focus:border-terra transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[11px] uppercase tracking-widest text-earth/45">Password</label>
            <Link href="/forgot-password" className="text-[11px] text-terra hover:text-terra/70 transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth placeholder-earth/30 focus:outline-none focus:border-terra transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-earth text-ivory py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-xs text-earth/45 mt-5">
        Don't have an account?{' '}
        <Link
          href={from && from !== '/' ? `/register?from=${encodeURIComponent(from)}` : '/register'}
          className="text-terra hover:text-terra/70 font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
