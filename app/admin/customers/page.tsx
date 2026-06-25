'use client'

import type { Metadata } from 'next'
import { useState, useEffect } from 'react'

// Metadata can't be exported from a 'use client' component — kept as comment
// export const metadata: Metadata = { title: 'Customers — Admin' }

type Customer = {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => setCustomers(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    !search.trim() ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-5">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-ivory text-xl font-medium">Customers</h1>
        <span className="text-ivory/30 text-xs">{customers.length} total</span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="bg-white/5 border border-white/12 rounded px-3 py-1.5 text-xs text-ivory placeholder-ivory/25 focus:outline-none focus:border-white/30 w-64"
        />
      </div>

      <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-ivory/25 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-ivory/25 text-sm">No customers found.</div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Name</th>
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Email</th>
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Role</th>
                <th className="text-left px-4 py-2.5 text-ivory/30 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-ivory/70 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-ivory/50">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      c.role === 'admin'        ? 'bg-sienna/20 text-sienna' :
                      c.role === 'shop_manager' ? 'bg-blue-500/15 text-blue-400' :
                                                  'bg-white/8 text-ivory/40'
                    }`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ivory/35">{fmtDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
