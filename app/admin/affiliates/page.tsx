'use client'

import { useEffect, useState, useCallback, type FormEvent } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tier = { tier: number; name: string; color: string }

type AffiliateRow = {
  id: number
  user: { id: number; name: string; email: string } | null
  code: string
  coupon_code: string | null
  group: 'link_only' | 'coupon_code'
  status: 'pending' | 'active' | 'suspended'
  tier: Tier
  total_earned: number
  pending_earnings: number
  notes: string | null
  created_at: string
}

type Setting = {
  key: string
  value: string | number | boolean | null
  raw: string
  type: string
  label: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(cents: number) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

const TIER_DOT: Record<string, string> = {
  gold: 'bg-yellow-400', purple: 'bg-purple-400', blue: 'bg-blue-400',
  green: 'bg-terra', gray: 'bg-ivory/20',
}

// ─── Program Settings Panel ───────────────────────────────────────────────────

function ProgramSettings({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings?group=affiliate')
      .then(r => r.json())
      .then(d => {
        const map: Record<string, string> = {}
        for (const s of (d.data ?? []) as Setting[]) {
          map[s.key] = s.raw ?? String(s.value ?? '')
        }
        setSettings(map)
      })
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, val: string) {
    setSettings(prev => ({ ...prev, [key]: val }))
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ settings }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const band1Max = parseInt(settings['affiliate.band1_max'] ?? '50')
  const band2Max = parseInt(settings['affiliate.band2_max'] ?? '100')
  const band3Max = parseInt(settings['affiliate.band3_max'] ?? '200')

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-lg bg-[#111d11] border-l border-ivory/10 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory/10">
          <div>
            <h2 className="text-ivory font-medium">Program Settings</h2>
            <p className="text-ivory/30 text-xs mt-0.5">Configure commission rates, tiers, and tracking</p>
          </div>
          <button onClick={onClose} className="text-ivory/40 hover:text-ivory text-xl leading-none">×</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-ivory/30 text-sm">Loading…</span>
          </div>
        ) : (
          <form onSubmit={save} className="flex-1 flex flex-col">
            <div className="flex-1 p-6 space-y-8 overflow-y-auto">

              {/* Commission Bands */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-ivory/30 mb-1">Commission Bands</h3>
                <p className="text-ivory/25 text-xs mb-4">
                  Position = order count for this affiliate in the current calendar month. Each order falls into exactly one band — no retro-rating.
                </p>

                {/* Band thresholds visual */}
                <div className="bg-ivory/3 border border-ivory/8 rounded p-3 mb-4 text-xs text-ivory/50 font-mono">
                  1–{band1Max} → Band 1 &nbsp;|&nbsp; {band1Max+1}–{band2Max} → Band 2 &nbsp;|&nbsp; {band2Max+1}–{band3Max} → Band 3 &nbsp;|&nbsp; {band3Max+1}+ → Band 4
                </div>

                <div className="space-y-4">
                  {[1,2,3,4].map(b => {
                    const maxKey  = b < 4 ? `affiliate.band${b}_max` : null
                    const rateKey = `affiliate.band${b}_rate`
                    return (
                      <div key={b} className="grid grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="block text-xs text-ivory/40 mb-1">
                            Band {b} — {b < 4 ? `Upper position limit` : 'No upper limit'}
                          </label>
                          {maxKey ? (
                            <input
                              type="number" min="1"
                              value={settings[maxKey] ?? ''}
                              onChange={e => set(maxKey, e.target.value)}
                              className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50"
                            />
                          ) : (
                            <div className="w-full bg-ivory/3 border border-ivory/8 text-ivory/25 text-sm px-3 py-2 rounded">∞</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-ivory/40 mb-1">Rate (%)</label>
                          <input
                            type="number" min="0" max="100"
                            value={settings[rateKey] ?? ''}
                            onChange={e => set(rateKey, e.target.value)}
                            className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Group Rules */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-ivory/30 mb-4">Group Rules</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-ivory/40 mb-1">Coupon-code group commission cap (%)</label>
                    <p className="text-ivory/25 text-xs mb-1.5">Affiliates in the coupon-code group never earn above this rate, regardless of band.</p>
                    <input
                      type="number" min="0" max="100"
                      value={settings['affiliate.coupon_cap'] ?? ''}
                      onChange={e => set('affiliate.coupon_cap', e.target.value)}
                      className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-ivory/40 mb-1">Minimum order amount to qualify (KES)</label>
                    <p className="text-ivory/25 text-xs mb-1.5">Orders below this value do not generate commission. Set to 0 to include all orders.</p>
                    <input
                      type="number" min="0"
                      value={settings['affiliate.min_order_kes'] ?? ''}
                      onChange={e => set('affiliate.min_order_kes', e.target.value)}
                      className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50"
                    />
                  </div>
                </div>
              </section>

              {/* Cookie Tracking */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-ivory/30 mb-4">Cookie Tracking</h3>
                <div>
                  <label className="block text-xs text-ivory/40 mb-1">Tracking cookie lifetime (days)</label>
                  <p className="text-ivory/25 text-xs mb-1.5">
                    A visitor arriving via an affiliate link is cookied for this many days. Last-click attribution applies.
                    Changing this takes effect for new clicks immediately.
                  </p>
                  <input
                    type="number" min="1" max="365"
                    value={settings['affiliate.cookie_days'] ?? ''}
                    onChange={e => set('affiliate.cookie_days', e.target.value)}
                    className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50"
                  />
                </div>
              </section>

              {/* Tier Labels */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-ivory/30 mb-1">Tier Labels</h3>
                <p className="text-ivory/25 text-xs mb-4">
                  Cosmetic only — based on last completed month&apos;s referral count. Does not affect commission math.
                </p>
                <div className="space-y-4">
                  {[1,2,3,4].map(t => {
                    const nameKey      = `affiliate.tier${t}_name`
                    const thresholdKey = `affiliate.tier${t}_threshold`
                    return (
                      <div key={t} className="grid grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="block text-xs text-ivory/40 mb-1">Tier {t} name</label>
                          <input
                            type="text"
                            value={settings[nameKey] ?? ''}
                            onChange={e => set(nameKey, e.target.value)}
                            className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-ivory/40 mb-1">Min monthly orders</label>
                          <input
                            type="number" min="0"
                            value={settings[thresholdKey] ?? ''}
                            onChange={e => set(thresholdKey, e.target.value)}
                            className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t border-ivory/10 px-6 py-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-terra text-ivory text-sm font-semibold py-2 rounded hover:bg-terra/80 transition-colors disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Save Program Settings'}
              </button>
              {saved && <span className="text-terra text-xs">Saved ✓</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminAffiliatesPage() {
  const [affiliates,    setAffiliates]   = useState<AffiliateRow[]>([])
  const [loading,       setLoading]      = useState(true)
  const [status,        setStatus]       = useState<string>('all')
  const [search,        setSearch]       = useState('')
  const [page,          setPage]         = useState(1)
  const [lastPage,      setLastPage]     = useState(1)
  const [total,         setTotal]        = useState(0)
  const [editing,       setEditing]      = useState<AffiliateRow | null>(null)
  const [saving,        setSaving]       = useState(false)
  const [editForm,      setEditForm]     = useState({ status: '', group: '', coupon_code: '', notes: '' })
  const [showSettings,  setShowSettings] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    const qs = new URLSearchParams({ page: String(page) })
    if (status !== 'all') qs.set('status', status)
    if (search) qs.set('search', search)
    fetch(`/api/admin/affiliates?${qs}`)
      .then(r => r.json())
      .then(d => {
        setAffiliates(d.data ?? [])
        setLastPage(d.meta?.last_page ?? 1)
        setTotal(d.meta?.total ?? 0)
      })
      .finally(() => setLoading(false))
  }, [status, search, page])

  useEffect(() => { load() }, [load])

  function openEdit(a: AffiliateRow) {
    setEditing(a)
    setEditForm({ status: a.status, group: a.group, coupon_code: a.coupon_code ?? '', notes: a.notes ?? '' })
  }

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    const body: Record<string, string> = { status: editForm.status, group: editForm.group }
    if (editForm.coupon_code) body.coupon_code = editForm.coupon_code.toUpperCase()
    if (editForm.notes)       body.notes       = editForm.notes

    const res  = await fetch(`/api/admin/affiliates/${editing.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (res.ok) {
      setAffiliates(prev => prev.map(a => a.id === editing.id ? data.data : a))
      setEditing(null)
    }
    setSaving(false)
  }

  return (
    <div className="p-5 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-ivory text-xl font-medium">Affiliates</h1>
          <p className="text-ivory/30 text-xs mt-0.5">{total} total</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          title="Program Settings"
          className="flex items-center gap-1.5 text-xs border border-ivory/15 text-ivory/50 px-3 py-1.5 rounded hover:bg-ivory/5 hover:text-ivory transition-colors"
        >
          <span className="text-sm">⚙</span> Program Settings
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex border border-ivory/10 rounded overflow-hidden">
          {['all', 'pending', 'active', 'suspended'].map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 text-xs capitalize transition-colors ${status === s ? 'bg-terra text-ivory' : 'text-ivory/40 hover:text-ivory'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by name or email…"
          className="bg-ivory/5 border border-ivory/10 text-ivory text-xs px-3 py-1.5 rounded focus:outline-none focus:border-terra/50 w-52 placeholder:text-ivory/20"
        />
      </div>

      {/* Affiliate list */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-14 bg-ivory/5 rounded animate-pulse" />)}
        </div>
      ) : affiliates.length === 0 ? (
        <p className="text-ivory/30 text-sm">No affiliates found.</p>
      ) : (
        <div className="space-y-1">
          {affiliates.map(a => (
            <div key={a.id} className="bg-ivory/5 rounded p-4 group flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full shrink-0 ${TIER_DOT[a.tier.color] ?? 'bg-ivory/20'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-ivory truncate">{a.user?.name ?? '—'}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    a.status === 'active'    ? 'bg-terra/20 text-terra' :
                    a.status === 'pending'   ? 'bg-amber-500/20 text-amber-400' :
                                               'bg-red-500/10 text-red-400'
                  }`}>
                    {a.status}
                  </span>
                  <span className="text-xs text-ivory/25 border border-ivory/10 px-1.5 py-0.5 rounded">
                    Tier {a.tier.tier} · {a.tier.name}
                  </span>
                  <span className="text-xs text-ivory/25">
                    {a.group === 'coupon_code' ? 'Coupon-code (capped)' : 'Link-only'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-ivory/30">
                  <span>{a.user?.email}</span>
                  <span>Code: <code className="text-ivory/50">{a.code}</code></span>
                  {a.coupon_code && <span>Coupon: <code className="text-ivory/50">{a.coupon_code}</code></span>}
                  <span>Earned: {fmt(a.total_earned)}</span>
                  <span>Pending: {fmt(a.pending_earnings)}</span>
                </div>
              </div>
              <button
                onClick={() => openEdit(a)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs border border-ivory/15 text-ivory/50 px-3 py-1.5 rounded hover:bg-ivory/10 shrink-0"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-3 py-1.5 text-xs border border-ivory/10 text-ivory/50 disabled:opacity-30 hover:bg-ivory/5 rounded">Previous</button>
          <span className="text-xs text-ivory/30">{page} / {lastPage}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === lastPage} className="px-3 py-1.5 text-xs border border-ivory/10 text-ivory/50 disabled:opacity-30 hover:bg-ivory/5 rounded">Next</button>
        </div>
      )}

      {/* Edit individual affiliate modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1a1a1a] border border-ivory/10 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-ivory font-medium mb-0.5">{editing.user?.name}</h2>
            <p className="text-ivory/30 text-xs mb-5">{editing.user?.email}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-ivory/40 mb-1">Status</label>
                <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50">
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-ivory/40 mb-1">Commission group</label>
                <select value={editForm.group} onChange={e => setEditForm(f => ({ ...f, group: e.target.value }))}
                  className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50">
                  <option value="link_only">Link-only — full progressive rate schedule</option>
                  <option value="coupon_code">Coupon-code — capped at program cap</option>
                </select>
                <p className="text-ivory/25 text-xs mt-1">
                  {editForm.group === 'coupon_code'
                    ? 'Commission is capped at the coupon-code cap set in Program Settings.'
                    : 'Full Band 1 → 2 → 3 → 4 schedule applies.'}
                </p>
              </div>

              <div>
                <label className="block text-xs text-ivory/40 mb-1">Personal coupon code (optional)</label>
                <input
                  value={editForm.coupon_code}
                  onChange={e => setEditForm(f => ({ ...f, coupon_code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. JANE10"
                  className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50 uppercase placeholder:normal-case placeholder:text-ivory/20"
                />
              </div>

              <div>
                <label className="block text-xs text-ivory/40 mb-1">Internal notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-ivory/5 border border-ivory/15 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-terra/50 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={saveEdit} disabled={saving}
                className="flex-1 bg-terra text-ivory text-sm font-semibold py-2 rounded hover:bg-terra/80 transition-colors disabled:opacity-40">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm border border-ivory/15 text-ivory/50 rounded hover:bg-ivory/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Settings drawer */}
      {showSettings && <ProgramSettings onClose={() => setShowSettings(false)} />}
    </div>
  )
}
