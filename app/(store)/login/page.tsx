import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
