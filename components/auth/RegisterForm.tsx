'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

type Field = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword' | 'acceptTerms'

export default function RegisterForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') ?? '/'
  const { register } = useAuth()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', acceptTerms: false,
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({})
  const [apiError,    setApiError]    = useState('')
  const [loading,     setLoading]     = useState(false)

  function update(field: Field, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError('')

    const errs: Partial<Record<Field, string>> = {}
    if (form.firstName.trim().length < 2) errs.firstName = 'At least 2 characters'
    if (form.lastName.trim().length  < 2) errs.lastName  = 'At least 2 characters'
    if (!form.email.includes('@'))        errs.email      = 'Enter a valid email'
    if (form.password.length < 8)         errs.password   = 'At least 8 characters'
    if (!/[A-Z]/.test(form.password))     errs.password   = 'Must include an uppercase letter'
    if (!/[0-9]/.test(form.password))     errs.password   = 'Must include a number'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!form.acceptTerms)                errs.acceptTerms = 'You must accept the terms to continue'

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }

    setLoading(true)
    try {
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`
      await register(name, form.email, form.password, form.confirmPassword)
      router.push(from)
      router.refresh()
    } catch (err: unknown) {
      const data = err as { message?: string; errors?: Record<string, string[]> }
      if (data?.errors?.email?.[0])    setFieldErrors(prev => ({ ...prev, email: data.errors!.email[0] }))
      if (data?.errors?.password?.[0]) setFieldErrors(prev => ({ ...prev, password: data.errors!.password[0] }))
      setApiError(data?.message ?? 'Registration failed')
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
          fieldErrors[id] ? 'border-red-300 focus:border-red-400' : 'border-earth/15 focus:border-terra'
        }`}
      />
      {fieldErrors[id] && <p className="text-xs text-red-500 mt-1">{fieldErrors[id]}</p>}
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
        {fieldErrors.acceptTerms && <p className="text-xs text-red-500 -mt-2">{fieldErrors.acceptTerms}</p>}

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
        <Link
          href={from && from !== '/' ? `/login?from=${encodeURIComponent(from)}` : '/login'}
          className="text-terra hover:text-terra/70 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
