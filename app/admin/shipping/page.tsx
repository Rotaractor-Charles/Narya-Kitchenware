'use client'

import { useEffect, useState, type FormEvent } from 'react'

interface SettingRecord {
  key: string
  value: boolean | number | string | null
  raw: string | null
  type: string
  group: string
  label: string
}

const INP = 'w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-terra/50 transition-colors'
const LBL = 'block text-[11px] text-ivory/40 uppercase tracking-widest mb-1.5'

function Notice({ type, msg }: { type: 'ok' | 'err'; msg: string }) {
  return (
    <p className={`text-xs rounded-lg px-3 py-2 ${type === 'ok' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
      {msg}
    </p>
  )
}

export default function AdminShippingPage() {
  const [flatRate,   setFlatRate]   = useState('')       // display as KES (not cents)
  const [threshold,  setThreshold]  = useState('')       // display as KES (not cents)
  const [thresholdEnabled, setThresholdEnabled] = useState(false)
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [notice,     setNotice]     = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings?group=shipping')
      .then(r => r.json())
      .then((d: { data: SettingRecord[] }) => {
        const byKey: Record<string, SettingRecord> = {}
        for (const s of d.data ?? []) byKey[s.key] = s

        const rate = byKey['shipping.flat_rate']
        const thresh = byKey['shipping.free_threshold']
        const enabled = byKey['shipping.free_threshold_enabled']

        if (rate)    setFlatRate(String(Number(rate.raw ?? 35000) / 100))
        if (thresh)  setThreshold(String(Number(thresh.raw ?? 500000) / 100))
        if (enabled) setThresholdEnabled(Boolean(enabled.value))
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setNotice(null)

    const flatCents = Math.round(parseFloat(flatRate || '0') * 100)
    const threshCents = Math.round(parseFloat(threshold || '0') * 100)

    try {
      const res = await fetch('/api/admin/settings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            'shipping.flat_rate':              flatCents,
            'shipping.free_threshold':         threshCents,
            'shipping.free_threshold_enabled': thresholdEnabled ? '1' : '0',
          },
        }),
      })

      if (res.ok) {
        setNotice({ type: 'ok', msg: 'Shipping settings saved.' })
      } else {
        const data = await res.json()
        setNotice({ type: 'err', msg: data.message ?? 'Failed to save settings.' })
      }
    } catch {
      setNotice({ type: 'err', msg: 'Network error.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-5 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-ivory text-xl font-medium">Shipping</h1>
        <p className="text-ivory/30 text-xs mt-0.5">Configure shipping rates for all orders</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-20 bg-ivory/5 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-[#1a2a1a] border border-white/8 rounded-xl p-6 space-y-6">
          {notice && <Notice type={notice.type} msg={notice.msg} />}

          {/* Flat rate */}
          <div>
            <label className={LBL}>Flat shipping rate (KES)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30 text-xs">KSh</span>
              <input
                type="number"
                min="0"
                step="1"
                value={flatRate}
                onChange={e => setFlatRate(e.target.value)}
                className={`${INP} pl-10`}
                placeholder="350"
              />
            </div>
            <p className="text-ivory/20 text-[11px] mt-1">Charged on every order regardless of basket size.</p>
          </div>

          {/* Free shipping threshold */}
          <div className="border-t border-white/6 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ivory/70 text-xs font-medium">Free shipping threshold</p>
                <p className="text-ivory/30 text-[11px]">Waive shipping when basket exceeds this amount</p>
              </div>
              <button
                type="button"
                onClick={() => setThresholdEnabled(v => !v)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  thresholdEnabled ? 'bg-terra' : 'bg-ivory/15'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  thresholdEnabled ? 'translate-x-4' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {thresholdEnabled && (
              <div>
                <label className={LBL}>Threshold amount (KES)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30 text-xs">KSh</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={threshold}
                    onChange={e => setThreshold(e.target.value)}
                    className={`${INP} pl-10`}
                    placeholder="5000"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-ivory/3 border border-white/6 rounded-lg p-4 text-[11px] text-ivory/40 space-y-1">
            <p className="text-ivory/60 font-medium text-xs mb-2">Preview</p>
            <p>Basket under KSh {parseFloat(threshold || '0').toLocaleString('en-KE') || '—'}
              {thresholdEnabled ? '' : ' (threshold disabled)'}: KSh {parseFloat(flatRate || '0').toLocaleString('en-KE')} shipping</p>
            {thresholdEnabled && (
              <p>Basket KSh {parseFloat(threshold || '0').toLocaleString('en-KE')}+: Free shipping</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-terra text-ivory text-xs font-semibold rounded-lg hover:bg-terra/80 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save shipping settings'}
          </button>
        </form>
      )}
    </div>
  )
}
