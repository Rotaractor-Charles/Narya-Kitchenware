import Link from 'next/link'

export const metadata = { title: 'Reset Password', robots: { index: false } }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-earth mb-1">Reset password</h1>
          <p className="text-sm text-earth/50">
            Enter your account email and we will help you get back in.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-earth/45 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="jane@email.com"
              className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth placeholder-earth/30 focus:outline-none focus:border-terra transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-earth text-ivory py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors"
          >
            Continue
          </button>
        </form>

        <p className="text-center text-xs text-earth/45 mt-5">
          Remembered it?{' '}
          <Link href="/login" className="text-terra hover:text-terra/70 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
