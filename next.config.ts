import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // firebase-admin pulls in @grpc/grpc-js which has native binaries —
  // exclude from webpack bundling so they're required at runtime instead.
  serverExternalPackages: [
    'firebase-admin',
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    '@google-cloud/firestore',
  ],

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    contentDispositionType: 'attachment',
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development'

    // In production the backend URL is the Railway/Render domain; in dev it's localhost:8000.
    const backendOrigin = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

    // CSP: tightened for production; relaxed slightly in dev for HMR websocket.
    const csp = [
      "default-src 'self'",
      // Next.js hydration requires inline scripts; nonces are the strict alternative but
      // need per-request generation. 'unsafe-inline' is acceptable until nonces are wired in.
      "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval'" : ''),
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https: ${backendOrigin}`,
      `connect-src 'self' ${backendOrigin}` + (isDev ? ' ws://localhost:*' : ''),
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',              value: 'nosniff' },
          { key: 'X-Frame-Options',                     value: 'DENY' },
          { key: 'Referrer-Policy',                     value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control',              value: 'on' },
          { key: 'X-Permitted-Cross-Domain-Policies',   value: 'none' },
          { key: 'Permissions-Policy',                  value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Content-Security-Policy',             value: csp },
          // HSTS: tell browsers to always use HTTPS for 1 year (production only — dev breaks on HTTP)
          ...(!isDev ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }] : []),
        ],
      },
      // Authenticated / private routes — never cached
      {
        source: '/(account|checkout|admin)(.*)',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      },
      // API routes — never cached
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      },
    ]
  },
}

export default nextConfig
