'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') ?? '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function submitToServer(idToken: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error ?? 'Login failed')
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const idToken    = await credential.user.getIdToken()
      await submitToServer(idToken)
      router.push(from)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(friendlyError(msg))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)
    try {
      const provider  = new GoogleAuthProvider()
      const credential = await signInWithPopup(auth, provider)
      const idToken    = await credential.user.getIdToken()
      await submitToServer(idToken)
      router.push(from)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed'
      setError(friendlyError(msg))
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

      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 border border-earth/20 rounded-xl py-2.5 text-sm text-earth hover:border-earth/40 hover:bg-ivory-dark transition-colors mb-5 disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-earth/10" />
        <span className="text-xs text-earth/35">or</span>
        <div className="flex-1 h-px bg-earth/10" />
      </div>

      {/* Email/password form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
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
        <Link href="/register" className="text-terra hover:text-terra/70 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  )
}

function friendlyError(msg: string): string {
  if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential'))
    return 'Incorrect email or password.'
  if (msg.includes('too-many-requests'))
    return 'Too many failed attempts. Please try again in a few minutes.'
  if (msg.includes('network'))
    return 'Network error. Check your connection and try again.'
  return msg
}
