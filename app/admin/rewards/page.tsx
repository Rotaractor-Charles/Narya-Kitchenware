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

export default function AdminRewardsPage() {
  const [enabled,       setEnabled]       = useState(false)
  const [pointsPer100,  setPointsPer100]  = useState('1')
  const [redemptionRate, setRedemptionRate] = useState('100')
  const [minRedemption, setMinRedemption] = useState('500')
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [notice,        setNotice]        = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings?group=rewards')
      .then(r => r.json())
      .then((d: { data: SettingRecord[] }) => {
        const byKey: Record<string, SettingRecord> = {}
        for (const s of d.data ?? []) byKey[s.key] = s

        if (byKey['rewards.enabled'])           setEnabled(Boolean(byKey['rewards.enabled'].value))
        if (byKey['rewards.points_per_100_kes']) setPointsPer100(byKey['rewards.points_per_100_kes'].raw ?? '1')
        if (byKey['rewards.redemption_rate'])   setRedemptionRate(byKey['rewards.redemption_rate'].raw ?? '100')
        if (byKey['rewards.min_redemption'])    setMinRedemption(byKey['rewards.min_redemption'].raw ?? '500')
      })
      .finally(() => setLoading(false))
  }, [])

  // Example calculation: KSh 10,000 order
  const exampleOrder = 10000
  const pts100 = parseInt(pointsPer100 || '1', 10) || 1
  const redemRate = parseInt(redemptionRate || '100', 10) || 100
  const examplePoints = Math.floor((exampleOrder / 100) * pts100)
  const exampleDiscount = Math.floor(examplePoints / redemRate)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setNotice(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            'rewards.enabled':           enabled ? '1' : '0',
            'rewards.points_per_100_kes': pointsPer100,
            'rewards.redemption_rate':   redemptionRate,
            'rewards.min_redemption':    minRedemption,
          },
        }),
      })

      if (res.ok) {
        setNotice({ type: 'ok', msg: 'Rewards settings saved.' })
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
        <h1 className="text-ivory text-xl font-medium">Points &amp; Rewards</h1>
        <p className="text-ivory/30 text-xs mt-0.5">Loyalty programme configuration</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-ivory/5 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Enable toggle */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ivory/80 text-sm font-medium">Enable rewards programme</p>
                <p className="text-ivory/30 text-[11px] mt-0.5">Customers earn points on every purchase</p>
              </div>
              <button
                type="button"
                onClick={() => setEnabled(v => !v)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  enabled ? 'bg-terra' : 'bg-ivory/15'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  enabled ? 'translate-x-4' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl p-6 space-y-5">
            {notice && <Notice type={notice.type} msg={notice.msg} />}

            {/* Points per KSh 100 */}
            <div>
              <label className={LBL}>Points earned per KSh 100 spent</label>
              <input
                type="number"
                min="0"
                step="1"
                value={pointsPer100}
                onChange={e => setPointsPer100(e.target.value)}
                className={INP}
                placeholder="1"
              />
              <p className="text-ivory/20 text-[11px] mt-1">e.g. 1 pt per KSh 100 = 100 pts on a KSh 10,000 order</p>
            </div>

            {/* Redemption rate */}
            <div>
              <label className={LBL}>Points needed per KSh 1 discount</label>
              <input
                type="number"
                min="1"
                step="1"
                value={redemptionRate}
                onChange={e => setRedemptionRate(e.target.value)}
                className={INP}
                placeholder="100"
              />
              <p className="text-ivory/20 text-[11px] mt-1">e.g. 100 pts redeemable as KSh 1 off</p>
            </div>

            {/* Minimum to redeem */}
            <div>
              <label className={LBL}>Minimum points to redeem</label>
              <input
                type="number"
                min="0"
                step="1"
                value={minRedemption}
                onChange={e => setMinRedemption(e.target.value)}
                className={INP}
                placeholder="500"
              />
              <p className="text-ivory/20 text-[11px] mt-1">Customer must have at least this many points before redeeming</p>
            </div>

            {/* Example */}
            <div className="bg-ivory/3 border border-white/6 rounded-lg p-4 space-y-1 text-[11px] text-ivory/40">
              <p className="text-ivory/60 font-medium text-xs mb-2">Example calculation</p>
              <p>A KSh {exampleOrder.toLocaleString('en-KE')} order earns <span className="text-ivory/70 font-medium">{examplePoints} point{examplePoints !== 1 ? 's' : ''}</span></p>
              <p>Worth <span className="text-ivory/70 font-medium">KSh {exampleDiscount.toLocaleString('en-KE')} discount</span> when redeemed</p>
              {examplePoints < parseInt(minRedemption || '0', 10) && (
                <p className="text-amber-400/70">Below minimum redemption threshold of {minRedemption} pts</p>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-terra text-ivory text-xs font-semibold rounded-lg hover:bg-terra/80 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save rewards settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
