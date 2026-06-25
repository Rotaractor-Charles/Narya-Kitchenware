import 'server-only'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: { message?: string; errors?: Record<string, string[]> },
  ) {
    super(data.message ?? `HTTP ${status}`)
    this.name = 'ApiError'
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // cookies() throws outside a request scope (e.g. generateStaticParams at build time)
  let token: string | undefined
  try {
    const cookieStore = await cookies()
    token = cookieStore.get('narya_token')?.value
  } catch {
    // no request scope — unauthenticated fetch (fine for public data like categories)
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
    // Never cache authenticated responses; let Next.js ISR handle public data caching
    next: options.next,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new ApiError(res.status, data)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, init?: Pick<RequestInit, 'next' | 'cache'>) =>
    apiFetch<T>(path, { method: 'GET', ...init }),

  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string) =>
    apiFetch<T>(path, { method: 'DELETE' }),
}
