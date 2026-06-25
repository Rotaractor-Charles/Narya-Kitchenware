import 'server-only'
import { cookies } from 'next/headers'

export type Brand = {
  id:           string
  name:         string
  slug:         string
  description?: string
  thumbnail?:   string
  website?:     string
  is_active?:   boolean
  order?:       number
  count?:       number
}

export type BrandInput = {
  name:         string
  slug:         string
  description?: string
  thumbnail?:   string
  website?:     string
  is_active?:   boolean
  order?:       number
}

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

async function adminHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('narya_token')?.value
  if (!token) return null
  return {
    Authorization:  `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept:         'application/json',
  }
}

export async function getAdminBrands(): Promise<Brand[]> {
  const headers = await adminHeaders()
  if (!headers) return []

  const res = await fetch(`${API_URL}/api/v1/admin/brands`, {
    headers,
    cache: 'no-store',
  })
  if (!res.ok) return []

  const data = await res.json()
  return data.data ?? []
}
