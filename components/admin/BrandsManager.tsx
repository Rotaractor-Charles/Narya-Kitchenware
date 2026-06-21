'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import type { Brand, BrandInput } from '@/lib/brands-admin'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function autoSlug(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ─── Style constants ─────────────────────────────────────────────────────────

const INP = 'w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-white/35 transition-colors'
const LBL = 'block text-[11px] text-ivory/45 mb-1.5 font-medium'

// ─── Component ───────────────────────────────────────────────────────────────

type Mode = 'add' | 'edit'

export default function BrandsManager({ initialBrands }: { initialBrands: Brand[] }) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [mode, setMode]           = useState<Mode>('add')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form fields
  const [name,        setName]        = useState('')
  const [slug,        setSlug]        = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail,   setThumbnail]   = useState('')
  const [website,     setWebsite]     = useState('')

  // UI
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [notice,   setNotice]   = useState('')
  const [error,    setError]    = useState('')

  // Drag-to-reorder
  const dragIdx  = useRef<number | null>(null)
  const overIdx  = useRef<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)

  // ─── Form helpers ───────────────────────────────────────────────────────────

  function handleNameChange(v: string) {
    setName(v)
    if (mode === 'add') setSlug(autoSlug(v))
  }

  function resetForm() {
    setMode('add'); setEditingId(null)
    setName(''); setSlug(''); setDescription(''); setThumbnail(''); setWebsite('')
    setError('')
  }

  function startEdit(b: Brand) {
    setMode('edit'); setEditingId(b.id)
    setName(b.name); setSlug(b.slug)
    setDescription(b.description ?? '')
    setThumbnail(b.thumbnail ?? '')
    setWebsite(b.website ?? '')
    setError(''); setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─── Persist ────────────────────────────────────────────────────────────────

  async function submit() {
    if (!name.trim()) { setError('Name is required.'); return }
    setSaving(true); setError(''); setNotice('')

    const payload: BrandInput = {
      name:        name.trim(),
      slug:        slug.trim() || autoSlug(name),
      description: description.trim(),
      thumbnail:   thumbnail.trim(),
      website:     website.trim(),
      order:       mode === 'add'
        ? brands.length
        : (brands.find(b => b.id === editingId)?.order ?? 0),
    }

    try {
      if (mode === 'add') {
        const res = await fetch('/api/admin/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create brand')
        const { brand } = await res.json()
        setBrands(prev => [...prev, brand])
        setNotice(`Brand "${brand.name}" added.`)
        resetForm()
      } else {
        const res = await fetch(`/api/admin/brands/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to update brand')
        setBrands(prev => prev.map(b => b.id === editingId ? { ...b, ...payload } : b))
        setNotice(`Brand "${payload.name}" updated.`)
        resetForm()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  async function remove(id: string, brandName: string) {
    if (!confirm(`Delete brand "${brandName}"? Products linked to it will be unbranded.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' })
      setBrands(prev => prev.filter(b => b.id !== id))
      if (editingId === id) resetForm()
      setNotice(`Brand "${brandName}" deleted.`)
    } finally { setDeleting(null) }
  }

  // ─── Drag-to-reorder ────────────────────────────────────────────────────────

  function onDragStart(i: number) { dragIdx.current = i; setDragging(i) }
  function onDragEnter(i: number) { overIdx.current = i }

  async function onDrop() {
    const from = dragIdx.current; const to = overIdx.current
    setDragging(null); dragIdx.current = null; overIdx.current = null
    if (from === null || to === null || from === to) return

    const reordered = [...brands]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const updated = reordered.map((b, i) => ({ ...b, order: i }))
    setBrands(updated)

    await Promise.all(
      updated.map((b, i) =>
        fetch(`/api/admin/brands/${b.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: i }),
        }),
      ),
    )
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}
      <header className="border-b border-white/8 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0f1a0f] z-10">
        <div className="flex items-center gap-2 text-xs">
          <Link href="/admin/products" className="text-ivory/30 hover:text-ivory/60 transition-colors">Products</Link>
          <span className="text-white/15">/</span>
          <span className="text-ivory/70">Brands</span>
        </div>
      </header>

      {/* Notice */}
      {notice && (
        <div className="bg-green-900/25 border-b border-green-500/20 px-6 py-2 text-green-300 text-xs flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-green-400/50 hover:text-green-400 ml-4">×</button>
        </div>
      )}

      <div className="flex gap-8 px-6 py-5 items-start">

        {/* ── Left pane: form ── */}
        <div className="w-68 shrink-0" style={{ width: '17rem' }}>
          <h2 className="text-sm font-semibold text-ivory/70 mb-4">
            {mode === 'add' ? 'Add New Brand' : 'Edit Brand'}
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className={LBL}>Name <span className="text-red-400">*</span></label>
              <input type="text" value={name} onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Le Creuset" className={INP} />
            </div>

            {/* Slug */}
            <div>
              <label className={LBL}>Slug</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                placeholder="e.g. le-creuset" className={INP} />
              <p className="text-[10px] text-ivory/20 mt-1.5">URL: /brands/<span className="text-ivory/40">{slug || 'slug'}</span></p>
            </div>

            {/* Website */}
            <div>
              <label className={LBL}>Website</label>
              <input type="url" value={website} onChange={e => setWebsite(e.target.value)}
                placeholder="https://…" className={INP} />
            </div>

            {/* Description */}
            <div>
              <label className={LBL}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                rows={4} placeholder="Brand description shown on the brand page…"
                className={`${INP} resize-y`} />
            </div>

            {/* Thumbnail / Logo */}
            <div>
              <label className={LBL}>Logo / Thumbnail</label>
              {thumbnail && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 border border-white/10 mb-2 flex items-center justify-center">
                  <img src={thumbnail} alt="" className="max-w-full max-h-full object-contain opacity-80 p-1" />
                </div>
              )}
              <input type="text" value={thumbnail} onChange={e => setThumbnail(e.target.value)}
                placeholder="Paste image or logo URL…" className={INP} />
            </div>

            {error && <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/15 rounded px-3 py-2">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button onClick={submit} disabled={saving}
                className="flex-1 bg-sienna text-ivory py-2.5 rounded-lg text-xs font-semibold hover:bg-sienna/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : mode === 'add' ? 'Add New Brand' : 'Update'}
              </button>
              {mode === 'edit' && (
                <button onClick={resetForm}
                  className="px-3 border border-white/15 text-ivory/40 hover:text-ivory/70 text-xs rounded-lg transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right pane: list ── */}
        <div className="flex-1 min-w-0">

          {brands.length === 0 ? (
            <div className="bg-[#1a2a1a] border border-white/8 rounded-xl px-8 py-16 text-center">
              <p className="text-ivory/30 text-sm mb-2">No brands yet</p>
              <p className="text-ivory/18 text-xs">Add your first brand using the form on the left.</p>
            </div>
          ) : (
            <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/8 bg-white/2">
                    <th className="w-8 px-3 py-3"></th>
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium hidden md:table-cell">Description</th>
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium">Slug</th>
                    <th className="text-right px-4 py-3 text-ivory/25 font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand, i) => (
                    <tr
                      key={brand.id}
                      draggable
                      onDragStart={() => onDragStart(i)}
                      onDragEnter={() => onDragEnter(i)}
                      onDragEnd={onDrop}
                      onDragOver={e => e.preventDefault()}
                      className={`border-b border-white/5 last:border-0 group transition-colors ${
                        dragging === i        ? 'opacity-40'
                        : editingId === brand.id ? 'bg-sienna/8'
                        : 'hover:bg-white/3'
                      }`}
                    >
                      {/* Drag handle */}
                      <td className="px-3 py-3.5 text-center cursor-grab active:cursor-grabbing">
                        <span className="text-ivory/15 group-hover:text-ivory/45 transition-colors text-sm select-none leading-none">⠿</span>
                      </td>

                      {/* Name + logo + actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {brand.thumbnail ? (
                            <div className="w-8 h-8 rounded bg-white/8 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                              <img src={brand.thumbnail} alt="" className="max-w-full max-h-full object-contain p-0.5 opacity-80" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded bg-white/5 border border-white/8 flex items-center justify-center shrink-0 text-ivory/20 text-[10px] font-bold">
                              {brand.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-ivory/80">{brand.name}</span>
                              {editingId === brand.id && (
                                <span className="text-[9px] bg-sienna/20 text-sienna px-1.5 py-0.5 rounded font-medium">editing</span>
                              )}
                            </div>
                            {brand.website && (
                              <a href={brand.website} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] text-blue-400/50 hover:text-blue-400 transition-colors">
                                {brand.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                              </a>
                            )}
                            {/* Hover actions */}
                            <div className="flex items-center gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEdit(brand)}
                                className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                              <span className="text-ivory/15">|</span>
                              <button
                                onClick={() => remove(brand.id, brand.name)}
                                disabled={!!deleting}
                                className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-40">
                                {deleting === brand.id ? 'Deleting…' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3.5 text-ivory/35 max-w-xs hidden md:table-cell">
                        <span className="line-clamp-2 leading-relaxed">
                          {brand.description || <span className="text-ivory/18">—</span>}
                        </span>
                      </td>

                      {/* Slug */}
                      <td className="px-4 py-3.5 font-mono text-[11px] text-ivory/30">{brand.slug}</td>

                      {/* Count */}
                      <td className="px-4 py-3.5 text-right text-ivory/30">{brand.count ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {brands.length > 0 && (
            <p className="text-[10px] text-ivory/20 mt-3 flex items-center gap-1">
              <span>⠿</span>&nbsp;Drag to reorder.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
