'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { CATEGORIES as DEFAULT_CATEGORIES } from '@/lib/categories'
import type { Category, CategoryInput } from '@/lib/categories-admin'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function autoSlug(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const DISPLAY_LABELS: Record<string, string> = {
  products:       'Products',
  subcategories:  'Subcategories',
  both:           'Products & Subcategories',
}

// ─── Style constants ─────────────────────────────────────────────────────────

const INP = 'w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-white/35 transition-colors'
const SEL = 'w-full appearance-none bg-[#0e1a0e] border border-white/15 rounded-lg px-3 py-2 pr-8 text-xs text-ivory/80 focus:outline-none focus:border-sienna/50 cursor-pointer [&>option]:bg-[#0e1a0e] [&>option]:text-ivory'
const LBL = 'block text-[11px] text-ivory/45 mb-1.5 font-medium'

// ─── Component ───────────────────────────────────────────────────────────────

type Mode = 'add' | 'edit'

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [cats, setCats] = useState<Category[]>(initialCategories)
  const [mode, setMode]         = useState<Mode>('add')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form fields
  const [name,        setName]        = useState('')
  const [slug,        setSlug]        = useState('')
  const [parentId,    setParentId]    = useState('')
  const [description, setDescription] = useState('')
  const [displayType, setDisplayType] = useState<'products' | 'subcategories' | 'both'>('products')
  const [thumbnail,   setThumbnail]   = useState('')

  // UI
  const [saving,   setSaving]   = useState(false)
  const [seeding,  setSeeding]  = useState(false)
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
    setName(''); setSlug(''); setParentId('')
    setDescription(''); setDisplayType('products'); setThumbnail('')
    setError('')
  }

  function startEdit(cat: Category) {
    setMode('edit'); setEditingId(cat.id)
    setName(cat.name); setSlug(cat.slug)
    setParentId(cat.parentId ?? '')
    setDescription(cat.description ?? '')
    setDisplayType((cat.displayType ?? 'products') as 'products' | 'subcategories' | 'both')
    setThumbnail(cat.thumbnail ?? '')
    setError(''); setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─── Persist ────────────────────────────────────────────────────────────────

  async function submit() {
    if (!name.trim()) { setError('Name is required.'); return }
    setSaving(true); setError(''); setNotice('')

    const payload: CategoryInput = {
      name:        name.trim(),
      slug:        slug.trim() || autoSlug(name),
      parentId:    parentId || null,
      description: description.trim(),
      displayType,
      thumbnail:   thumbnail.trim(),
      order:       mode === 'add'
        ? cats.length
        : (cats.find(c => c.id === editingId)?.order ?? 0),
    }

    try {
      if (mode === 'add') {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create category')
        const { category } = await res.json()
        setCats(prev => [...prev, category])
        setNotice(`Category "${category.name}" added.`)
        resetForm()
      } else {
        const res = await fetch(`/api/admin/categories/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to update category')
        setCats(prev => prev.map(c => c.id === editingId ? { ...c, ...payload } : c))
        setNotice(`Category "${payload.name}" updated.`)
        resetForm()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  async function remove(id: string, catName: string) {
    if (!confirm(`Delete "${catName}"? Products in this category will be uncategorized.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      setCats(prev => prev.filter(c => c.id !== id))
      if (editingId === id) resetForm()
      setNotice(`Category "${catName}" deleted.`)
    } finally { setDeleting(null) }
  }

  async function seedDefaults() {
    setSeeding(true); setNotice('')
    try {
      const existing = new Set(cats.map(c => c.slug))
      const toAdd = DEFAULT_CATEGORIES.filter(c => !existing.has(c.slug))
      const results: Category[] = []
      for (let i = 0; i < toAdd.length; i++) {
        const c = toAdd[i]
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: c.label, slug: c.slug, parentId: null,
            description: '', displayType: 'products', thumbnail: '',
            order: cats.length + i,
          }),
        })
        if (res.ok) { const { category } = await res.json(); results.push(category) }
      }
      setCats(prev => [...prev, ...results])
      setNotice(`${results.length} default categories seeded.`)
    } finally { setSeeding(false) }
  }

  // ─── Drag-to-reorder ────────────────────────────────────────────────────────

  function onDragStart(i: number) { dragIdx.current = i; setDragging(i) }
  function onDragEnter(i: number) { overIdx.current = i }

  async function onDrop() {
    const from = dragIdx.current; const to = overIdx.current
    setDragging(null); dragIdx.current = null; overIdx.current = null
    if (from === null || to === null || from === to) return

    const reordered = [...cats]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const updated = reordered.map((c, i) => ({ ...c, order: i }))
    setCats(updated)

    await Promise.all(
      updated.map((c, i) =>
        fetch(`/api/admin/categories/${c.id}`, {
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
          <span className="text-ivory/70">Categories</span>
        </div>
        {cats.length === 0 && (
          <button onClick={seedDefaults} disabled={seeding}
            className="text-xs text-sienna/80 hover:text-sienna border border-sienna/30 hover:border-sienna/50 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50">
            {seeding ? 'Seeding…' : 'Seed default categories'}
          </button>
        )}
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
            {mode === 'add' ? 'Add New Category' : 'Edit Category'}
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className={LBL}>Name <span className="text-red-400">*</span></label>
              <input type="text" value={name} onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Cookware" className={INP} />
              <p className="text-[10px] text-ivory/20 mt-1.5">How it appears on your site.</p>
            </div>

            {/* Slug */}
            <div>
              <label className={LBL}>Slug</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                placeholder="e.g. cookware" className={INP} />
              <p className="text-[10px] text-ivory/20 mt-1.5">URL: /shop/<span className="text-ivory/40">{slug || 'slug'}</span></p>
            </div>

            {/* Parent */}
            <div>
              <label className={LBL}>Parent category</label>
              <div className="relative">
                <select value={parentId} onChange={e => setParentId(e.target.value)} className={SEL}>
                  <option value="">None</option>
                  {cats.filter(c => c.id !== editingId && !c.parentId).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 text-[10px]">▾</span>
              </div>
              <p className="text-[10px] text-ivory/20 mt-1.5">Assign a parent to make this a subcategory.</p>
            </div>

            {/* Description */}
            <div>
              <label className={LBL}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                rows={4} placeholder="Optional description shown on the category page…"
                className={`${INP} resize-y`} />
            </div>

            {/* Display type */}
            <div>
              <label className={LBL}>Display type</label>
              <div className="relative">
                <select
                  value={displayType}
                  onChange={e => setDisplayType(e.target.value as 'products' | 'subcategories' | 'both')}
                  className={SEL}
                >
                  <option value="products">Products</option>
                  <option value="subcategories">Subcategories</option>
                  <option value="both">Products &amp; Subcategories</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 text-[10px]">▾</span>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className={LBL}>Thumbnail</label>
              {thumbnail && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 border border-white/10 mb-2">
                  <img src={thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                </div>
              )}
              <input type="text" value={thumbnail} onChange={e => setThumbnail(e.target.value)}
                placeholder="Paste image URL…" className={INP} />
            </div>

            {error && <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/15 rounded px-3 py-2">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button onClick={submit} disabled={saving}
                className="flex-1 bg-sienna text-ivory py-2.5 rounded-lg text-xs font-semibold hover:bg-sienna/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : mode === 'add' ? 'Add New Category' : 'Update'}
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

          {cats.length === 0 ? (
            <div className="bg-[#1a2a1a] border border-white/8 rounded-xl px-8 py-16 text-center">
              <p className="text-ivory/30 text-sm mb-2">No categories yet</p>
              <p className="text-ivory/18 text-xs">Add your first category using the form, or seed the defaults.</p>
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
                    <th className="text-left px-4 py-3 text-ivory/25 font-medium hidden lg:table-cell">Display</th>
                    <th className="text-right px-4 py-3 text-ivory/25 font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {cats.map((cat, i) => {
                    const parentName = cat.parentId ? cats.find(c => c.id === cat.parentId)?.name : null
                    return (
                      <tr
                        key={cat.id}
                        draggable
                        onDragStart={() => onDragStart(i)}
                        onDragEnter={() => onDragEnter(i)}
                        onDragEnd={onDrop}
                        onDragOver={e => e.preventDefault()}
                        className={`border-b border-white/5 last:border-0 group transition-colors ${
                          dragging === i     ? 'opacity-40'
                          : editingId === cat.id ? 'bg-sienna/8'
                          : 'hover:bg-white/3'
                        }`}
                      >
                        {/* Drag handle */}
                        <td className="px-3 py-3.5 text-center cursor-grab active:cursor-grabbing">
                          <span className="text-ivory/15 group-hover:text-ivory/45 transition-colors text-sm select-none leading-none">⠿</span>
                        </td>

                        {/* Name + actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {cat.thumbnail && (
                              <img src={cat.thumbnail} alt="" className="w-7 h-7 rounded object-cover opacity-70 shrink-0" />
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                {parentName && <span className="text-ivory/25">—</span>}
                                <span className="font-medium text-ivory/80">{cat.name}</span>
                                {editingId === cat.id && (
                                  <span className="text-[9px] bg-sienna/20 text-sienna px-1.5 py-0.5 rounded font-medium">editing</span>
                                )}
                              </div>
                              {parentName && (
                                <p className="text-[10px] text-ivory/25 mt-0.5">in {parentName}</p>
                              )}
                              {/* Hover actions */}
                              <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(cat)}
                                  className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                                <span className="text-ivory/15">|</span>
                                <button
                                  onClick={() => remove(cat.id, cat.name)}
                                  disabled={!!deleting}
                                  className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-40">
                                  {deleting === cat.id ? 'Deleting…' : 'Delete'}
                                </button>
                                <span className="text-ivory/15">|</span>
                                <Link href={`/shop/${cat.slug}`} target="_blank"
                                  className="text-[10px] text-ivory/30 hover:text-ivory/60 transition-colors">View</Link>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-4 py-3.5 text-ivory/35 max-w-xs hidden md:table-cell">
                          <span className="line-clamp-2 leading-relaxed">{cat.description || <span className="text-ivory/18">—</span>}</span>
                        </td>

                        {/* Slug */}
                        <td className="px-4 py-3.5 font-mono text-[11px] text-ivory/30">
                          {cat.slug}
                        </td>

                        {/* Display */}
                        <td className="px-4 py-3.5 text-ivory/35 hidden lg:table-cell">
                          {DISPLAY_LABELS[cat.displayType ?? 'products']}
                        </td>

                        {/* Count */}
                        <td className="px-4 py-3.5 text-right text-ivory/30">
                          {cat.count ?? 0}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {cats.length > 0 && (
            <p className="text-[10px] text-ivory/20 mt-3 flex items-center gap-1.5">
              <span>⠿</span> Drag to reorder. Seed missing defaults:
              <button onClick={seedDefaults} disabled={seeding}
                className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-40">
                {seeding ? 'Seeding…' : 'Seed defaults'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
