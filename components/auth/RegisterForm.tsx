'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { registerSchema } from '@/lib/validations/auth'

type Field = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword' | 'acceptTerms'

export default function RegisterForm() {
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', acceptTerms: false,
  })
  const [errors,  setErrors]  = useState<Partial<Record<Field, string>>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: Field, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError('')

    const parsed = registerSchema.safeParse({ ...form, acceptTerms: form.acceptTerms || undefined })
    if (!parsed.success) {
      const fieldErrors: Partial<Record<Field, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      // 1. Create Firebase user
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const idToken    = await credential.user.getIdToken()

      // 2. POST to our register API which creates Firestore profile + session
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...parsed.data, idToken }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Registration failed')
      }

      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setApiError(friendlyError(msg))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleRegister() {
    setApiError('')
    setLoading(true)
    try {
      const provider   = new GoogleAuthProvider()
      const credential = await signInWithPopup(auth, provider)
      const user       = credential.user
      const idToken    = await user.getIdToken()
      const [firstName = '', ...rest] = (user.displayName ?? '').split(' ')
      const lastName = rest.join(' ') || 'User'

      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          firstName, lastName,
          email: user.email,
          password: 'google-oauth', confirmPassword: 'google-oauth',
          acceptTerms: true,
          idToken,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Registration failed')
      }
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-up failed'
      setApiError(friendlyError(msg))
    } finally {
      setLoading(false)
    }
  }

  const field = (id: Field, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-earth/45 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[id] as string}
        onChange={e => update(id, e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm text-earth placeholder-earth/30 focus:outline-none transition-colors ${
          errors[id] ? 'border-red-300 focus:border-red-400' : 'border-earth/15 focus:border-terra'
        }`}
      />
      {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl text-earth mb-1">Create your account</h1>
        <p className="text-sm text-earth/50">Join Narya and start earning rewards</p>
      </div>

      {apiError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {apiError}
        </div>
      )}

      {/* Google */}
      <button
        onClick={handleGoogleRegister}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {field('firstName', 'First name', 'text', 'Jane')}
          {field('lastName',  'Last name',  'text', 'Wanjiku')}
        </div>
        {field('email',           'Email',            'email',    'jane@email.com')}
        {field('password',        'Password',         'password', '8+ characters')}
        {field('confirmPassword', 'Confirm password', 'password', 'Repeat password')}

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={e => update('acceptTerms', e.target.checked)}
            className="accent-terra mt-0.5 w-4 h-4 shrink-0"
          />
          <span className="text-xs text-earth/60">
            I agree to the{' '}
            <Link href="/terms"   target="_blank" className="text-terra underline underline-offset-2">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" target="_blank" className="text-terra underline underline-offset-2">Privacy Policy</Link>
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-red-500 -mt-2">{errors.acceptTerms}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-earth text-ivory py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-earth/45 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-terra hover:text-terra/70 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}

function friendlyError(msg: string): string {
  if (msg.includes('email-already-in-use')) return 'An account with this email already exists.'
  if (msg.includes('weak-password'))        return 'Password is too weak. Use at least 8 characters.'
  if (msg.includes('network'))              return 'Network error. Check your connection and try again.'
  return msg
}
