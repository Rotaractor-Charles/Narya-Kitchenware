import 'server-only'
import { api } from '@/lib/api'

export type MenuItem = {
  id: number
  label: string
  href: string
  sort_order: number
  children: MenuItem[]
}

const FALLBACK_DESKTOP_NAV: MenuItem[] = [
  { id: 0, label: 'Cookware',           href: '/shop/cookware',    sort_order: 0,  children: [] },
  { id: 1, label: 'Bakeware',           href: '/shop/bakeware',    sort_order: 1,  children: [] },
  { id: 2, label: 'Cutlery & Knives',   href: '/shop/cutlery',     sort_order: 2,  children: [] },
  { id: 3, label: 'Small Appliances',   href: '/shop/appliances',  sort_order: 3,  children: [] },
  { id: 4, label: 'Storage & Org',      href: '/shop/storage',     sort_order: 4,  children: [] },
  { id: 5, label: 'Utensils & Gadgets', href: '/shop/utensils',    sort_order: 5,  children: [] },
  { id: 6, label: 'Dinnerware',         href: '/shop/dinnerware',  sort_order: 6,  children: [] },
  { id: 7, label: 'Coffee & Tea',       href: '/shop/coffee-tea',  sort_order: 7,  children: [] },
  { id: 8, label: 'Outdoor & BBQ',      href: '/shop/outdoor',     sort_order: 8,  children: [] },
  { id: 9, label: 'Cleaning & Care',    href: '/shop/cleaning',    sort_order: 9,  children: [] },
  { id: 10, label: 'New Arrivals',      href: '/shop/new',         sort_order: 10, children: [] },
  { id: 11, label: 'Sale',              href: '/shop/sale',        sort_order: 11, children: [] },
]

export async function getMenuItems(location: string): Promise<MenuItem[]> {
  try {
    const res = await api.get<{ data: MenuItem[] }>(
      `/api/v1/menus?location=${encodeURIComponent(location)}`,
      { next: { revalidate: 60, tags: ['menus', `menu-${location}`] } },
    )
    return res.data ?? []
  } catch {
    if (location === 'header_primary') return FALLBACK_DESKTOP_NAV
    return []
  }
}
