import 'server-only'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'

type AuthResponse = { user: User; token: string }

export async function serverLogin(email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/v1/auth/login', { email, password })
}

export async function serverRegister(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/v1/auth/register', {
    name,
    email,
    password,
    password_confirmation,
  })
}

export async function serverLogout(): Promise<void> {
  await api.post<void>('/api/v1/auth/logout', {})
}

export async function getAuthUser(): Promise<User | null> {
  try {
    const res = await api.get<{ user: User }>('/api/v1/auth/me')
    return res.user
  } catch {
    return null
  }
}
