'use client'

import { useEffect, useState, useRef } from 'react'

interface Tag {
  id: number
  name: string
  slug: string
  products_count: number
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminTagsPage() {
  const [tags,    setTags]    = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [editTag, setEditTag] = useState<Tag | null>(null)
  const [editName, setEditName] = useState('')
  const [busy,    setBusy]    = useState<number | null>(null)
  const [error,   setError]   = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function load() {
    setLoading(true)
    fetch('/api/admin/tags')
      .then(r => r.json())
      .then(d => setTags(d.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true); setError('')
    const res  = await fetch('/api/admin/tags', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: newName.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setTags(prev => [...prev, data.data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      inputRef.current?.focus()
    } else {
      setError(data.errors?.name?.[0] ?? data.message ?? 'Failed to create tag.')
    }
    setSaving(false)
  }

  function openEdit(tag: Tag) {
    setEditTag(tag)
    setEditName(tag.name)
    setError('')
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editTag || !editName.trim()) return
    setBusy(editTag.id); setError('')
    const res  = await fetch(`/api/admin/tags/${editTag.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: editName.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setTags(prev =>
        prev.map(t => t.id === editTag.id ? data.data : t)
            .sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditTag(null)
    } else {
      setError(data.errors?.name?.[0] ?? data.message ?? 'Failed to update tag.')
    }
    setBusy(null)
  }

  async function handleDelete(tag: Tag) {
    if (!confirm(`Delete tag "${tag.name}"? It will be removed from ${tag.products_count} product(s).`)) return
    setBusy(tag.id)
    const res = await fetch(`/api/admin/tags/${tag.id}`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      setTags(prev => prev.filter(t => t.id !== tag.id))
    }
    setBusy(null)
  }

  return (
    <div className="p-5 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-ivory text-xl font-medium">Tags</h1>
        <p className="text-ivory/30 text-xs mt-0.5">{tags.length} tag{tags.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Add form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2 items-start">
        <div className="flex-1">
          <input
            ref={inputRef}
            value={newName}
            onChange={e => { setNewName(e.target.value); setError('') }}
            placeholder="New tag name…"
            className="w-full bg-ivory/5 border border-ivory/10 text-ivory text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-terra/50 placeholder:text-ivory/20"
          />
          {newName && (
            <p className="text-ivory/25 text-[11px] mt-1 ml-1">
              slug: <span className="font-mono text-ivory/40">{slugify(newName)}</span>
            </p>
          )}
          {error && !editTag && <p className="text-red-400 text-[11px] mt-1 ml-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={saving || !newName.trim()}
          className="px-4 py-2 bg-terra text-ivory text-xs font-semibold rounded-lg hover:bg-terra/80 disabled:opacity-40 transition-colors shrink-0"
        >
          {saving ? 'Saving…' : 'Add Tag'}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-ivory/5 rounded-lg animate-pulse" />)}
        </div>
      ) : tags.length === 0 ? (
        <p className="text-ivory/25 text-sm">No tags yet. Add one above.</p>
      ) : (
        <div className="space-y-1">
          {tags.map(tag => (
            <div key={tag.id} className="bg-ivory/5 rounded-lg px-4 py-3 flex items-center gap-3 group hover:bg-ivory/8 transition-colors">
              <div className="flex-1 min-w-0">
                <span className="text-ivory text-sm">{tag.name}</span>
                <span className="text-ivory/25 text-[11px] ml-2 font-mono">{tag.slug}</span>
              </div>
              <span className="text-ivory/30 text-xs shrink-0">
                {tag.products_count} product{tag.products_count !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEdit(tag)}
                  disabled={busy === tag.id}
                  className="text-xs px-2.5 py-1 bg-ivory/10 text-ivory/60 rounded hover:bg-ivory/15 disabled:opacity-40 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tag)}
                  disabled={busy === tag.id}
                  className="text-xs px-2.5 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 disabled:opacity-40 transition-colors"
                >
                  {busy === tag.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleEdit}
            className="bg-[#1a2a1a] border border-white/10 rounded-xl p-6 w-full max-w-sm space-y-4 shadow-2xl"
          >
            <h2 className="text-ivory font-medium text-sm">Edit tag</h2>
            <div>
              <input
                value={editName}
                onChange={e => { setEditName(e.target.value); setError('') }}
                autoFocus
                className="w-full bg-ivory/5 border border-ivory/10 text-ivory text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-terra/50"
              />
              {editName && (
                <p className="text-ivory/25 text-[11px] mt-1 ml-1">
                  slug: <span className="font-mono text-ivory/40">{slugify(editName)}</span>
                </p>
              )}
              {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setEditTag(null); setError('') }}
                className="px-4 py-2 text-xs text-ivory/50 hover:text-ivory border border-ivory/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy === editTag.id || !editName.trim()}
                className="px-4 py-2 bg-terra text-ivory text-xs font-semibold rounded-lg hover:bg-terra/80 disabled:opacity-40 transition-colors"
              >
                {busy === editTag.id ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
