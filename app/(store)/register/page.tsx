import type { Metadata } from 'next'
import { Suspense } from 'react'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
