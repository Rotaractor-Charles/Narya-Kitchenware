'use client'

import { useEffect, useState, useRef, KeyboardEvent } from 'react'

interface Attribute {
  id: number
  name: string
  values: string[]
  sort_order: number
}

function Chip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-terra/20 text-terra text-[11px] px-2 py-0.5 rounded-full">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-terra/60 hover:text-terra leading-none ml-0.5"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

function ValuesInput({
  values,
  onChange,
}: {
  values: string[]
  onChange: (v: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function addValue() {
    const trimmed = draft.trim()
    if (!trimmed || values.includes(trimmed)) return
    onChange([...values, trimmed])
    setDraft('')
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); addValue() }
    if (e.key === 'Backspace' && !draft && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map(v => (
          <Chip key={v} label={v} onRemove={() => onChange(values.filter(x => x !== v))} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a value, press Enter…"
          className="flex-1 bg-ivory/5 border border-ivory/10 text-ivory text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-terra/50 placeholder:text-ivory/20"
        />
        <button
          type="button"
          onClick={addValue}
          className="text-xs px-3 py-1.5 bg-ivory/10 text-ivory/60 rounded-lg hover:bg-ivory/15 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default function AdminAttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [loading,    setLoading]    = useState(true)
  const [editAttr,   setEditAttr]   = useState<Attribute | null>(null)
  const [editName,   setEditName]   = useState('')
  const [editValues, setEditValues] = useState<string[]>([])
  const [showAdd,    setShowAdd]    = useState(false)
  const [newName,    setNewName]    = useState('')
  const [newValues,  setNewValues]  = useState<string[]>([])
  const [busy,       setBusy]       = useState<number | 'new' | null>(null)
  const [error,      setError]      = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  function load() {
    setLoading(true)
    fetch('/api/admin/attributes')
      .then(r => r.json())
      .then(d => setAttributes(d.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setShowAdd(true); setNewName(''); setNewValues([]); setError('')
    setTimeout(() => nameRef.current?.focus(), 50)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || newValues.length === 0) return
    setBusy('new'); setError('')
    const res  = await fetch('/api/admin/attributes', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: newName.trim(), values: newValues }),
    })
    const data = await res.json()
    if (res.ok) {
      setAttributes(prev => [...prev, data.data].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)))
      setShowAdd(false)
    } else {
      setError(data.errors?.name?.[0] ?? data.message ?? 'Failed to create attribute.')
    }
    setBusy(null)
  }

  function openEdit(attr: Attribute) {
    setEditAttr(attr); setEditName(attr.name); setEditValues([...attr.values]); setError('')
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editAttr || !editName.trim() || editValues.length === 0) return
    setBusy(editAttr.id); setError('')
    const res  = await fetch(`/api/admin/attributes/${editAttr.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: editName.trim(), values: editValues }),
    })
    const data = await res.json()
    if (res.ok) {
      setAttributes(prev =>
        prev.map(a => a.id === editAttr.id ? data.data : a)
      )
      setEditAttr(null)
    } else {
      setError(data.errors?.name?.[0] ?? data.message ?? 'Failed to update attribute.')
    }
    setBusy(null)
  }

  async function handleDelete(attr: Attribute) {
    if (!confirm(`Delete attribute "${attr.name}"?`)) return
    setBusy(attr.id)
    const res = await fetch(`/api/admin/attributes/${attr.id}`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      setAttributes(prev => prev.filter(a => a.id !== attr.id))
    }
    setBusy(null)
  }

  return (
    <div className="p-5 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-ivory text-xl font-medium">Attributes</h1>
          <p className="text-ivory/30 text-xs mt-0.5">Product option groups (size, colour, material…)</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-terra text-ivory text-xs font-semibold rounded-lg hover:bg-terra/80 transition-colors"
        >
          + New Attribute
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-ivory/5 rounded-xl animate-pulse" />)}
        </div>
      ) : attributes.length === 0 ? (
        <p className="text-ivory/25 text-sm">No attributes yet. Add one above.</p>
      ) : (
        <div className="space-y-2">
          {attributes.map(attr => (
            <div key={attr.id} className="bg-ivory/5 rounded-xl px-5 py-4 group hover:bg-ivory/8 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-ivory text-sm font-medium mb-2">{attr.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {attr.values.map(v => <Chip key={v} label={v} />)}
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEdit(attr)}
                    disabled={busy === attr.id}
                    className="text-xs px-2.5 py-1 bg-ivory/10 text-ivory/60 rounded hover:bg-ivory/15 disabled:opacity-40 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(attr)}
                    disabled={busy === attr.id}
                    className="text-xs px-2.5 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 disabled:opacity-40 transition-colors"
                  >
                    {busy === attr.id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleCreate}
            className="bg-[#1a2a1a] border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl"
          >
            <h2 className="text-ivory font-medium text-sm">New Attribute</h2>
            <div>
              <label className="block text-[11px] text-ivory/40 uppercase tracking-widest mb-1.5">Name</label>
              <input
                ref={nameRef}
                value={newName}
                onChange={e => { setNewName(e.target.value); setError('') }}
                placeholder="e.g. Size, Colour, Material"
                className="w-full bg-ivory/5 border border-ivory/10 text-ivory text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-terra/50 placeholder:text-ivory/20"
              />
            </div>
            <div>
              <label className="block text-[11px] text-ivory/40 uppercase tracking-widest mb-1.5">Values</label>
              <ValuesInput values={newValues} onChange={setNewValues} />
              {newValues.length === 0 && (
                <p className="text-ivory/25 text-[11px] mt-1">Add at least one value.</p>
              )}
            </div>
            {error && <p className="text-red-400 text-[11px]">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setShowAdd(false); setError('') }}
                className="px-4 py-2 text-xs text-ivory/50 hover:text-ivory border border-ivory/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy === 'new' || !newName.trim() || newValues.length === 0}
                className="px-4 py-2 bg-terra text-ivory text-xs font-semibold rounded-lg hover:bg-terra/80 disabled:opacity-40 transition-colors"
              >
                {busy === 'new' ? 'Saving…' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editAttr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleEdit}
            className="bg-[#1a2a1a] border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl"
          >
            <h2 className="text-ivory font-medium text-sm">Edit Attribute</h2>
            <div>
              <label className="block text-[11px] text-ivory/40 uppercase tracking-widest mb-1.5">Name</label>
              <input
                value={editName}
                onChange={e => { setEditName(e.target.value); setError('') }}
                autoFocus
                className="w-full bg-ivory/5 border border-ivory/10 text-ivory text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-terra/50"
              />
            </div>
            <div>
              <label className="block text-[11px] text-ivory/40 uppercase tracking-widest mb-1.5">Values</label>
              <ValuesInput values={editValues} onChange={setEditValues} />
            </div>
            {error && <p className="text-red-400 text-[11px]">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setEditAttr(null); setError('') }}
                className="px-4 py-2 text-xs text-ivory/50 hover:text-ivory border border-ivory/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy === editAttr.id || !editName.trim() || editValues.length === 0}
                className="px-4 py-2 bg-terra text-ivory text-xs font-semibold rounded-lg hover:bg-terra/80 disabled:opacity-40 transition-colors"
              >
                {busy === editAttr.id ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
