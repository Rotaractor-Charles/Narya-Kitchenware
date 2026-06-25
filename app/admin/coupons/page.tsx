'use client'

import { useState, useEffect, type FormEvent } from 'react'

type Coupon = {
  id: number
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order_amount: number | null
  max_uses: number | null
  uses_count: number
  expires_at: string | null
  is_active: boolean
}

const INP = 'w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-white/35 transition-colors'
const LBL = 'block text-[11px] text-ivory/45 mb-1.5 font-medium'

type CouponType = 'percentage' | 'fixed'
type FormState  = { code: string; type: CouponType; value: string; min_order_amount: string; max_uses: string; expires_at: string; is_active: boolean }
const EMPTY: FormState = { code: '', type: 'percentage', value: '', min_order_amount: '', max_uses: '', expires_at: '', is_active: true }

export default function AdminCouponsPage() {
  const [coupons,   setCoupons]   = useState<Coupon[]>([])
  const [loading,   setLoading]   = useState(true)
  const [form,      setForm]      = useState<FormState>(EMPTY)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving,    setSaving]    = useState(false)
  const [deleting,  setDeleting]  = useState<number | null>(null)
  const [notice,    setNotice]    = useState('')
  const [error,     setError]     = useState('')

  useEffect(() => {
    fetch('/api/admin/coupons')
      .then(r => r.json())
      .then(d => setCoupons(d.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  function startEdit(c: Coupon) {
    setEditingId(c.id)
    setForm({
      code: c.code, type: c.type, value: String(c.value),
      min_order_amount: c.min_order_amount ? String(c.min_order_amount / 100) : '',
      max_uses: c.max_uses ? String(c.max_uses) : '',
      expires_at: c.expires_at ? c.expires_at.split('T')[0] : '',
      is_active: c.is_active,
    })
    setError(''); setNotice('')
  }

  function resetForm() {
    setEditingId(null); setForm(EMPTY); setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.code.trim()) { setError('Code is required.'); return }
    if (!form.value)        { setError('Value is required.'); return }
    setSaving(true); setError(''); setNotice('')

    const payload = {
      code:             form.code.trim().toUpperCase(),
      type:             form.type,
      value:            form.type === 'fixed'
        ? Math.round(parseFloat(form.value) * 100)  // KES → cents
        : parseInt(form.value, 10),                  // percentage as-is
      min_order_amount: form.min_order_amount
        ? Math.round(parseFloat(form.min_order_amount) * 100)
        : null,
      max_uses:    form.max_uses   ? parseInt(form.max_uses, 10)   : null,
      expires_at:  form.expires_at || null,
      is_active:   form.is_active,
    }

    try {
      const url    = editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons'
      const method = editingId ? 'PATCH' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(Object.values(d.errors ?? {}).flat().join(' ') || d.message || 'Save failed.')
      }
      const data = await res.json()
      if (editingId) {
        setCoupons(prev => prev.map(c => c.id === editingId ? data.coupon : c))
        setNotice('Coupon updated.')
      } else {
        setCoupons(prev => [...prev, data.coupon])
        setNotice('Coupon created.')
      }
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    } finally { setSaving(false) }
  }

  async function remove(id: number, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
      setCoupons(prev => prev.filter(c => c.id !== id))
      if (editingId === id) resetForm()
      setNotice(`Coupon "${code}" deleted.`)
    } finally { setDeleting(null) }
  }

  function fmt(c: Coupon) {
    return c.type === 'percentage'
      ? `${c.value}% off`
      : `KSh ${(c.value / 100).toLocaleString()} off`
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-white/8 px-6 py-3 sticky top-0 bg-[#0f1a0f] z-10">
        <h1 className="text-sm font-semibold text-ivory/70">Coupons</h1>
      </header>

      {notice && (
        <div className="bg-green-900/25 border-b border-green-500/20 px-6 py-2 text-green-300 text-xs flex justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice('')}>×</button>
        </div>
      )}

      <div className="flex gap-8 px-6 py-5 items-start">

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-72 shrink-0 space-y-4">
          <h2 className="text-sm font-semibold text-ivory/70">
            {editingId ? 'Edit Coupon' : 'New Coupon'}
          </h2>

          <div>
            <label className={LBL}>Code <span className="text-red-400">*</span></label>
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="SAVE20" className={`${INP} uppercase`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LBL}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as CouponType }))}
                className={INP}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed (KES)</option>
              </select>
            </div>
            <div>
              <label className={LBL}>Value <span className="text-red-400">*</span></label>
              <input type="number" min="1" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                placeholder={form.type === 'percentage' ? '20' : '500'} className={INP} />
            </div>
          </div>

          <div>
            <label className={LBL}>Min order amount (KES)</label>
            <input type="number" min="0" value={form.min_order_amount}
              onChange={e => setForm(f => ({ ...f, min_order_amount: e.target.value }))}
              placeholder="Leave blank for no minimum" className={INP} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LBL}>Max uses</label>
              <input type="number" min="1" value={form.max_uses}
                onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                placeholder="Unlimited" className={INP} />
            </div>
            <div>
              <label className={LBL}>Expires</label>
              <input type="date" value={form.expires_at}
                onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                className={INP} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
              className="accent-sienna w-3.5 h-3.5" />
            <span className="text-xs text-ivory/60">Active</span>
          </label>

          {error && <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/15 rounded px-3 py-2">{error}</p>}

          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-sienna text-ivory py-2.5 rounded-lg text-xs font-semibold hover:bg-sienna/90 disabled:opacity-50">
              {saving ? 'Saving…' : editingId ? 'Update' : 'Create Coupon'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}
                className="px-3 border border-white/15 text-ivory/40 hover:text-ivory/70 text-xs rounded-lg">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <p className="text-ivory/30 text-sm">Loading…</p>
          ) : coupons.length === 0 ? (
            <div className="bg-[#1a2a1a] border border-white/8 rounded-xl px-8 py-16 text-center">
              <p className="text-ivory/30 text-sm">No coupons yet.</p>
            </div>
          ) : (
            <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/8 bg-white/2">
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium">Code</th>
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium">Discount</th>
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium hidden sm:table-cell">Uses</th>
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium hidden md:table-cell">Expires</th>
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.id}
                      className={`border-b border-white/5 last:border-0 group transition-colors ${
                        editingId === c.id ? 'bg-sienna/8' : 'hover:bg-white/3'
                      }`}>
                      <td className="px-4 py-3.5">
                        <div>
                          <span className="font-mono font-semibold text-ivory/80 tracking-widest">{c.code}</span>
                          <div className="flex gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(c)}
                              className="text-[10px] text-blue-400 hover:text-blue-300">Edit</button>
                            <span className="text-ivory/15">|</span>
                            <button onClick={() => remove(c.id, c.code)} disabled={!!deleting}
                              className="text-[10px] text-red-400/60 hover:text-red-400 disabled:opacity-40">
                              {deleting === c.id ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sienna font-medium">{fmt(c)}</td>
                      <td className="px-4 py-3.5 text-ivory/40 hidden sm:table-cell">
                        {c.uses_count}{c.max_uses ? ` / ${c.max_uses}` : ''}
                      </td>
                      <td className="px-4 py-3.5 text-ivory/40 hidden md:table-cell">
                        {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.is_active
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-white/5 text-ivory/30'
                        }`}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
