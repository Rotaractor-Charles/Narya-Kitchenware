'use client'

import { useState, KeyboardEvent, type ChangeEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import type { Product, ProductInput } from '@/lib/products'

// ─── Local types ─────────────────────────────────────────────────────────────

type ProductType   = 'simple' | 'variable' | 'grouped' | 'external'
type StockStatus   = 'instock' | 'outofstock' | 'onbackorder'
type BackordersOpt = 'no' | 'notify' | 'yes'
type TaxStatus     = 'taxable' | 'shipping' | 'none'
type TaxClass      = 'standard' | 'reduced' | 'zero'
type PublishStatus = 'publish' | 'draft' | 'pending' | 'private'
type CatalogVis    = 'visible' | 'catalog' | 'search' | 'hidden'
type Tab           = 'general' | 'inventory' | 'shipping' | 'linked' | 'attributes' | 'variations' | 'advanced'
type VisType       = 'public' | 'password' | 'private'

type AttrRow = { id: string; name: string; values: string; visible: boolean; forVariations: boolean }
type VarRow  = {
  id: string; attributes: Record<string, string>
  sku: string; price: string; salePrice: string
  stockStatus: StockStatus; stockQty: string
  virtual: boolean; downloadable: boolean
  weight: string; description: string; image: string; expanded: boolean
}
type DlFile = { name: string; url: string }

// ─── Style constants ─────────────────────────────────────────────────────────

const ROW = 'flex items-start gap-4 py-3 border-b border-white/6 last:border-0'
const LBL = 'text-[11px] text-ivory/40 w-36 shrink-0 pt-2 leading-relaxed'
const INP = 'bg-white/5 border border-white/15 rounded px-3 py-1.5 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-white/35 transition-colors'

// ─── Select wrapper — dark bg + custom chevron ───────────────────────────────

type SelProps = {
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  className?: string
  small?: boolean
  disabled?: boolean
  children: ReactNode
}

function Sel({ value, onChange, className = '', small = false, disabled = false, children }: SelProps) {
  const base = small
    ? 'w-full appearance-none bg-[#0e1a0e] border border-white/15 rounded px-2 py-0.5 pr-6 text-[11px] text-ivory/70 focus:outline-none focus:border-sienna/50 cursor-pointer transition-colors disabled:opacity-40 [&>option]:bg-[#0e1a0e] [&>option]:text-ivory'
    : 'w-full appearance-none bg-[#0e1a0e] border border-white/18 rounded px-3 py-1.5 pr-8 text-xs text-ivory/80 focus:outline-none focus:border-sienna/50 cursor-pointer transition-colors disabled:opacity-40 [&>option]:bg-[#0e1a0e] [&>option]:text-ivory'
  return (
    <div className={`relative inline-flex ${className}`}>
      <select value={value} onChange={onChange} disabled={disabled} className={base}>
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 text-[10px] select-none">▾</span>
    </div>
  )
}

function uid() { return Math.random().toString(36).slice(2) }

function p<T>(product: Product | undefined, key: string, fallback: T): T {
  return ((product as unknown as Record<string, unknown>)?.[key] ?? fallback) as T
}

function initAttrs(product?: Product): AttrRow[] {
  const attrs = p<{ name: string; values: string[]; visible: boolean; forVariations: boolean }[]>(product, 'attributes', [])
  return attrs.map(a => ({
    id: uid(), name: a.name,
    values: Array.isArray(a.values) ? a.values.join(' | ') : '',
    visible: a.visible ?? true, forVariations: a.forVariations ?? false,
  }))
}

function initVariations(product?: Product): VarRow[] {
  const vars = p<{ id?: string; attributes?: Record<string,string>; sku?: string; price?: number; salePrice?: number; stockStatus?: string; stockQty?: number; virtual?: boolean; downloadable?: boolean; weight?: number; description?: string; image?: string }[]>(product, 'variations', [])
  return vars.map(v => ({
    id: v.id ?? uid(), attributes: v.attributes ?? {},
    sku: v.sku ?? '', price: String(v.price ?? ''), salePrice: String(v.salePrice ?? ''),
    stockStatus: (v.stockStatus ?? 'instock') as StockStatus, stockQty: String(v.stockQty ?? ''),
    virtual: v.virtual ?? false, downloadable: v.downloadable ?? false,
    weight: String(v.weight ?? ''), description: v.description ?? '', image: v.image ?? '', expanded: false,
  }))
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductForm({ product, mode }: { product?: Product; mode: 'new' | 'edit' }) {
  const router = useRouter()

  // Core
  const [name,        setName]        = useState(product?.name ?? '')
  const [slug,        setSlug]        = useState(product?.slug ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [shortDesc,   setShortDesc]   = useState(p(product, 'shortDescription', ''))

  // Type flags
  const [productType,  setProductType]  = useState<ProductType>(p(product, 'type', 'simple'))
  const [virtual,      setVirtual]      = useState(p(product, 'virtual', false))
  const [downloadable, setDownloadable] = useState(p(product, 'downloadable', false))

  // Pricing
  const [price,         setPrice]         = useState(String(product?.price ?? ''))
  const [salePrice,     setSalePrice]     = useState(String(p(product, 'salePrice', product?.originalPrice ?? '')))
  const [scheduleSale,  setScheduleSale]  = useState(false)
  const [salePriceFrom, setSalePriceFrom] = useState(p(product, 'salePriceFrom', ''))
  const [salePriceTo,   setSalePriceTo]   = useState(p(product, 'salePriceTo', ''))
  const [taxStatus,     setTaxStatus]     = useState<TaxStatus>(p(product, 'taxStatus', 'taxable'))
  const [taxClass,      setTaxClass]      = useState<TaxClass>(p(product, 'taxClass', 'standard'))

  // External
  const [externalUrl, setExternalUrl] = useState(p(product, 'externalUrl', ''))
  const [buttonText,  setButtonText]  = useState(p(product, 'buttonText', 'Buy product'))

  // Downloadable
  const [dlFiles,  setDlFiles]  = useState<DlFile[]>(p(product, 'downloadFiles', []))
  const [dlLimit,  setDlLimit]  = useState(String(p(product, 'downloadLimit', '')))
  const [dlExpiry, setDlExpiry] = useState(String(p(product, 'downloadExpiry', '')))

  // Inventory
  const [sku,               setSku]               = useState(p(product, 'sku', ''))
  const [manageStock,       setManageStock]       = useState(p(product, 'manageStock', false))
  const [stockStatus,       setStockStatus]       = useState<StockStatus>(p(product, 'stockStatus', product?.stock === 0 ? 'outofstock' : 'instock'))
  const [stockQty,          setStockQty]          = useState(String(p(product, 'stockQty', product?.stock ?? '')))
  const [backorders,        setBackorders]        = useState<BackordersOpt>(p(product, 'backorders', 'no'))
  const [lowStockThreshold, setLowStockThreshold] = useState(String(p(product, 'lowStockThreshold', '')))
  const [soldIndividually,  setSoldIndividually]  = useState(p(product, 'soldIndividually', false))
  const [isNew,             setIsNew]             = useState(product?.isNew ?? false)

  // Shipping
  const [weight, setWeight] = useState(String(p(product, 'weight', '')))
  const [dimL,   setDimL]   = useState(String(p(product, 'length', '')))
  const [dimW,   setDimW]   = useState(String(p(product, 'width', '')))
  const [dimH,   setDimH]   = useState(String(p(product, 'height', '')))

  // Attributes + variations
  const [attrRows, setAttrRows] = useState<AttrRow[]>(initAttrs(product))
  const [varRows,  setVarRows]  = useState<VarRow[]>(initVariations(product))

  // Advanced
  const [purchaseNote,   setPurchaseNote]   = useState(p(product, 'purchaseNote', product?.care ?? ''))
  const [menuOrder,      setMenuOrder]      = useState(String(p(product, 'menuOrder', 0)))
  const [reviewsEnabled, setReviewsEnabled] = useState(p(product, 'reviewsEnabled', true))

  // Publish
  const [pubStatus,         setPubStatus]         = useState<PublishStatus>(p(product, 'status', product?.isActive ? 'publish' : 'draft'))
  const [catalogVisibility, setCatalogVisibility] = useState<CatalogVis>(p(product, 'catalogVisibility', 'visible'))
  const [featured,          setFeatured]          = useState(p(product, 'featured', false))
  const [visType,           setVisType]           = useState<VisType>('public')
  const [visPassword,       setVisPassword]       = useState('')

  // Media
  const [images, setImages] = useState<string[]>(product?.images?.length ? product.images : [''])

  // Organisation — categories is now string[]
  const [categories, setCategories] = useState<string[]>(
    p<string[]>(product, 'categories', product?.categorySlug ? [product.categorySlug] : [])
  )
  const [tagInput, setTagInput] = useState('')
  const [tags,     setTags]     = useState<string[]>(p(product, 'tags', []))

  // UI
  const [tab,    setTab]    = useState<Tab>('general')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error,  setError]  = useState('')

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function autoSlug(v: string) { return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
  function handleNameChange(v: string) { setName(v); if (mode === 'new') setSlug(autoSlug(v)) }

  // Tags
  function addTag(v: string) {
    const t = v.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }
  function handleTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) }
    else if (e.key === 'Backspace' && tagInput === '' && tags.length) setTags(p => p.slice(0, -1))
  }

  // Attributes
  function addAttr() { setAttrRows(p => [...p, { id: uid(), name: '', values: '', visible: true, forVariations: false }]) }
  function updAttr<K extends keyof AttrRow>(i: number, k: K, v: AttrRow[K]) {
    setAttrRows(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r))
  }

  // Variations
  function generateVariations() {
    const forVar = attrRows.filter(a => a.forVariations && a.name && a.values)
    if (!forVar.length) return
    const groups = forVar.map(a => ({ name: a.name, vals: a.values.split('|').map(v => v.trim()).filter(Boolean) }))
    function cart(gs: typeof groups): Record<string, string>[] {
      if (!gs.length) return [{}]
      const [first, ...rest] = gs
      return first.vals.flatMap(v => cart(rest).map(c => ({ [first.name]: v, ...c })))
    }
    setVarRows(cart(groups).map(attrs => ({
      id: uid(), attributes: attrs, sku: '', price: '', salePrice: '',
      stockStatus: 'instock', stockQty: '', virtual: false, downloadable: false,
      weight: '', description: '', image: '', expanded: false,
    })))
  }
  function updVar<K extends keyof VarRow>(i: number, k: K, v: VarRow[K]) {
    setVarRows(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r))
  }

  // Images
  function updImg(i: number, v: string) { setImages(imgs => imgs.map((x, idx) => idx === i ? v : x)) }
  function addImg() { setImages(imgs => [...imgs, '']) }
  function rmImg(i: number) { setImages(imgs => imgs.filter((_, idx) => idx !== i)) }

  // Download files
  function addDl() { setDlFiles(p => [...p, { name: '', url: '' }]) }
  function updDl(i: number, k: 'name' | 'url', v: string) {
    setDlFiles(p => p.map((f, idx) => idx === i ? { ...f, [k]: v } : f))
  }

  // Tabs visibility
  const TABS: { id: Tab; label: string; show: boolean }[] = [
    { id: 'general',    label: 'General',        show: true },
    { id: 'inventory',  label: 'Inventory',      show: true },
    { id: 'shipping',   label: 'Shipping',       show: productType !== 'external' && !virtual },
    { id: 'linked',     label: 'Linked Products', show: true },
    { id: 'attributes', label: 'Attributes',     show: true },
    { id: 'variations', label: 'Variations',     show: productType === 'variable' },
    { id: 'advanced',   label: 'Advanced',       show: true },
  ]
  const visibleTabs = TABS.filter(t => t.show)

  // ─── Save ───────────────────────────────────────────────────────────────────

  async function save(asDraft = false) {
    setSaving(true); setNotice(''); setError('')
    const catLabel = CATEGORIES.find(c => c.slug === categories[0])?.label ?? categories[0] ?? ''

    const raw: Record<string, unknown> = {
      name, slug, description,
      shortDescription: shortDesc,
      type: productType, virtual, downloadable,
      price: Number(price) || 0,
      salePrice: salePrice ? Number(salePrice) : undefined,
      salePriceFrom: scheduleSale ? salePriceFrom : undefined,
      salePriceTo:   scheduleSale ? salePriceTo   : undefined,
      taxStatus, taxClass,
      externalUrl: externalUrl || undefined,
      buttonText:  buttonText  || undefined,
      downloadFiles: downloadable ? dlFiles : undefined,
      downloadLimit:  downloadable && dlLimit  ? Number(dlLimit)  : undefined,
      downloadExpiry: downloadable && dlExpiry ? Number(dlExpiry) : undefined,
      sku: sku || undefined,
      manageStock, stockStatus,
      stockQty: manageStock && stockQty ? Number(stockQty) : undefined,
      backorders,
      lowStockThreshold: manageStock && lowStockThreshold ? Number(lowStockThreshold) : undefined,
      soldIndividually,
      weight: weight ? Number(weight) : undefined,
      length: dimL   ? Number(dimL)   : undefined,
      width:  dimW   ? Number(dimW)   : undefined,
      height: dimH   ? Number(dimH)   : undefined,
      categories, tags,
      // legacy single-cat compat
      category: catLabel, categorySlug: categories[0] ?? '',
      attributes: attrRows.filter(a => a.name).map(a => ({
        name: a.name,
        values: a.values.split('|').map(v => v.trim()).filter(Boolean),
        visible: a.visible, forVariations: a.forVariations,
      })),
      variations: productType === 'variable' ? varRows.map(v => ({
        id: v.id, attributes: v.attributes,
        sku: v.sku || undefined, price: Number(v.price) || 0,
        salePrice: v.salePrice ? Number(v.salePrice) : undefined,
        stockStatus: v.stockStatus, stockQty: v.stockQty ? Number(v.stockQty) : undefined,
        virtual: v.virtual, downloadable: v.downloadable,
        weight: v.weight ? Number(v.weight) : undefined,
        description: v.description || undefined, image: v.image || undefined,
      })) : undefined,
      purchaseNote: purchaseNote || undefined,
      menuOrder: Number(menuOrder) || 0, reviewsEnabled,
      status: asDraft ? 'draft' : pubStatus,
      catalogVisibility, featured,
      isActive: !asDraft && pubStatus !== 'draft',
      images: images.filter(Boolean),
      isNew,
      // legacy fields
      originalPrice: salePrice ? Number(salePrice) : undefined,
      stock: manageStock ? (Number(stockQty) || 0) : (stockStatus === 'instock' ? 99 : 0),
      specs: {}, care: purchaseNote || undefined,
    }

    // strip undefined
    const payload: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(raw)) if (v !== undefined) payload[k] = v

    try {
      const url    = mode === 'new' ? '/api/admin/products' : `/api/admin/products/${product!.id}`
      const method = mode === 'new' ? 'POST' : 'PATCH'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? 'Save failed') }
      if (mode === 'new') {
        const { product: created } = await res.json()
        router.push(`/admin/products/${created.id}`)
      } else {
        setNotice('Product updated.')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  async function trash() {
    if (!product || !confirm('Move this product to trash?')) return
    await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
    router.push('/admin/products')
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}
      <header className="border-b border-white/8 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0f1a0f] z-10">
        <div className="flex items-center gap-2 text-xs">
          <Link href="/admin/products" className="text-ivory/30 hover:text-ivory/60 transition-colors">Products</Link>
          <span className="text-white/15">/</span>
          <span className="text-ivory/70">{mode === 'new' ? 'Add new product' : (name || 'Edit product')}</span>
        </div>
        {product && (
          <Link href={`/products/${product.slug}`} target="_blank"
            className="text-xs text-ivory/30 hover:text-ivory/60 border border-white/10 rounded-lg px-3 py-1.5 transition-colors">
            Preview ↗
          </Link>
        )}
      </header>

      {notice && <div className="bg-green-900/25 border-b border-green-500/20 px-6 py-2 text-green-300 text-xs">{notice}</div>}
      {error  && <div className="bg-red-900/25 border-b border-red-500/20 px-6 py-2 text-red-300 text-xs">{error}</div>}

      <div className="flex gap-5 px-6 py-5 items-start">

        {/* ── Main column ─────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Name + permalink */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl p-4">
            <input value={name} onChange={e => handleNameChange(e.target.value)} placeholder="Product name"
              className="w-full bg-transparent text-ivory text-xl placeholder:text-ivory/20 focus:outline-none border-b border-white/10 pb-3 mb-3 font-medium" />
            <div className="flex items-center gap-2 text-xs text-ivory/30">
              <span>Permalink:</span>
              <span className="text-ivory/20">/products/</span>
              <input value={slug} onChange={e => setSlug(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-ivory/50 focus:outline-none focus:border-white/25 text-xs flex-1" />
            </div>
          </div>

          {/* Long description */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-ivory/50">Product description</span>
              <div className="flex text-[11px] border border-white/12 rounded overflow-hidden">
                <span className="px-2.5 py-1 bg-white/8 text-ivory/60">Visual</span>
                <span className="px-2.5 py-1 text-ivory/30 border-l border-white/8">HTML</span>
              </div>
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={7}
              placeholder="Describe the product…"
              className="w-full bg-transparent text-ivory/80 text-sm placeholder:text-ivory/20 focus:outline-none resize-y p-4 leading-relaxed" />
            <div className="border-t border-white/6 px-4 py-2 text-ivory/20 text-[11px]">
              {description.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* ── Product data metabox ── */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">

            {/* Type row */}
            <div className="border-b border-white/8 px-4 py-3 flex items-center gap-4 flex-wrap">
              <span className="text-xs font-medium text-ivory/50">Product data —</span>
              <Sel value={productType} onChange={e => { setProductType(e.target.value as ProductType); setTab('general') }} className="min-w-[165px]">
                <option value="simple">Simple product</option>
                <option value="grouped">Grouped product</option>
                <option value="external">External / Affiliate</option>
                <option value="variable">Variable product</option>
              </Sel>
              {(productType === 'simple' || productType === 'variable') && <>
                <span className="text-white/15 select-none">|</span>
                <label className="flex items-center gap-1.5 text-xs text-ivory/50 cursor-pointer select-none">
                  <input type="checkbox" checked={virtual} onChange={e => setVirtual(e.target.checked)} className="accent-sienna" /> Virtual
                </label>
                <label className="flex items-center gap-1.5 text-xs text-ivory/50 cursor-pointer select-none">
                  <input type="checkbox" checked={downloadable} onChange={e => setDownloadable(e.target.checked)} className="accent-sienna" /> Downloadable
                </label>
              </>}
            </div>

            {/* Two-column body */}
            <div className="flex min-h-[320px]">

              {/* Vertical tabs */}
              <div className="w-44 shrink-0 border-r border-white/8 bg-white/2 py-1">
                {visibleTabs.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`w-full flex items-center px-4 py-2.5 text-xs text-left transition-colors border-l-2 ${
                      tab === t.id
                        ? 'border-sienna bg-[#1e301e] text-ivory'
                        : 'border-transparent text-ivory/45 hover:text-ivory/70 hover:bg-white/3'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Panels */}
              <div className="flex-1 p-5 overflow-x-hidden">

                {/* ── GENERAL ── */}
                {tab === 'general' && (
                  <div className="divide-y divide-white/6">
                    {(productType === 'simple' || productType === 'variable') && <>
                      <div className={ROW}>
                        <span className={LBL}>Regular price (KSh)</span>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={`${INP} w-40`} />
                      </div>
                      <div className={ROW}>
                        <span className={LBL}>Sale price (KSh)</span>
                        <div className="space-y-1.5">
                          <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} className={`${INP} w-40`} />
                          {!scheduleSale
                            ? <button onClick={() => setScheduleSale(true)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Schedule ↓</button>
                            : <div className="flex items-end gap-2 flex-wrap">
                                <div><label className="text-[10px] text-ivory/30 block mb-0.5">From</label>
                                  <input type="date" value={salePriceFrom} onChange={e => setSalePriceFrom(e.target.value)} className={`${INP} w-36`} /></div>
                                <div><label className="text-[10px] text-ivory/30 block mb-0.5">To</label>
                                  <input type="date" value={salePriceTo} onChange={e => setSalePriceTo(e.target.value)} className={`${INP} w-36`} /></div>
                                <button onClick={() => { setScheduleSale(false); setSalePriceFrom(''); setSalePriceTo('') }}
                                  className="text-xs text-ivory/30 hover:text-ivory/60 pb-1">Cancel</button>
                              </div>
                          }
                        </div>
                      </div>
                    </>}

                    {productType === 'external' && <>
                      <div className={ROW}>
                        <span className={LBL}>Product URL</span>
                        <input type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)}
                          placeholder="https://" className={`${INP} flex-1 max-w-sm`} />
                      </div>
                      <div className={ROW}>
                        <span className={LBL}>Button text</span>
                        <input type="text" value={buttonText} onChange={e => setButtonText(e.target.value)} className={`${INP} w-48`} />
                      </div>
                    </>}

                    <div className={ROW}>
                      <span className={LBL}>Tax status</span>
                      <Sel value={taxStatus} onChange={e => setTaxStatus(e.target.value as TaxStatus)} className="w-40">
                        <option value="taxable">Taxable</option>
                        <option value="shipping">Shipping only</option>
                        <option value="none">None</option>
                      </Sel>
                    </div>
                    <div className={ROW}>
                      <span className={LBL}>Tax class</span>
                      <Sel value={taxClass} onChange={e => setTaxClass(e.target.value as TaxClass)} className="w-40">
                        <option value="standard">Standard</option>
                        <option value="reduced">Reduced rate</option>
                        <option value="zero">Zero rate</option>
                      </Sel>
                    </div>

                    {downloadable && <>
                      <div className={ROW}>
                        <span className={LBL}>Downloadable files</span>
                        <div className="flex-1 space-y-2">
                          {dlFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input type="text" value={f.name} onChange={e => updDl(i, 'name', e.target.value)} placeholder="File name" className={`${INP} w-28`} />
                              <input type="url"  value={f.url}  onChange={e => updDl(i, 'url',  e.target.value)} placeholder="URL"       className={`${INP} flex-1`} />
                              <button onClick={() => setDlFiles(p => p.filter((_, idx) => idx !== i))} className="text-ivory/20 hover:text-red-400 text-lg leading-none">×</button>
                            </div>
                          ))}
                          <button onClick={addDl} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">+ Add file</button>
                        </div>
                      </div>
                      <div className={ROW}>
                        <span className={LBL}>Download limit</span>
                        <input type="number" min="0" value={dlLimit} onChange={e => setDlLimit(e.target.value)} placeholder="Unlimited" className={`${INP} w-32`} />
                      </div>
                      <div className={ROW}>
                        <span className={LBL}>Expiry (days)</span>
                        <input type="number" min="0" value={dlExpiry} onChange={e => setDlExpiry(e.target.value)} placeholder="Never" className={`${INP} w-32`} />
                      </div>
                    </>}
                  </div>
                )}

                {/* ── INVENTORY ── */}
                {tab === 'inventory' && (
                  <div className="divide-y divide-white/6">
                    <div className={ROW}>
                      <span className={LBL}>SKU</span>
                      <input type="text" value={sku} onChange={e => setSku(e.target.value)} className={`${INP} w-48`} />
                    </div>
                    <div className={ROW}>
                      <span className={LBL}>Manage stock</span>
                      <label className="flex items-center gap-2 text-xs text-ivory/60 cursor-pointer pt-1">
                        <input type="checkbox" checked={manageStock} onChange={e => setManageStock(e.target.checked)} className="accent-sienna" />
                        Track stock quantity for this product
                      </label>
                    </div>
                    {manageStock ? <>
                      <div className={ROW}>
                        <span className={LBL}>Stock quantity</span>
                        <input type="number" min="0" value={stockQty} onChange={e => setStockQty(e.target.value)} className={`${INP} w-28`} />
                      </div>
                      <div className={ROW}>
                        <span className={LBL}>Allow backorders</span>
                        <Sel value={backorders} onChange={e => setBackorders(e.target.value as BackordersOpt)} className="w-56">
                          <option value="no">Do not allow</option>
                          <option value="notify">Allow, but notify customer</option>
                          <option value="yes">Allow</option>
                        </Sel>
                      </div>
                      <div className={ROW}>
                        <span className={LBL}>Low stock threshold</span>
                        <input type="number" min="0" value={lowStockThreshold} onChange={e => setLowStockThreshold(e.target.value)} placeholder="Use store default" className={`${INP} w-40`} />
                      </div>
                    </> : (
                      <div className={ROW}>
                        <span className={LBL}>Stock status</span>
                        <div className="space-y-2 pt-1">
                          {([['instock','In stock'],['outofstock','Out of stock'],['onbackorder','On backorder']] as const).map(([val, lbl]) => (
                            <label key={val} className="flex items-center gap-2 text-xs text-ivory/60 cursor-pointer">
                              <input type="radio" name="stockStatus" value={val} checked={stockStatus === val}
                                onChange={() => setStockStatus(val)} className="accent-sienna" />
                              {lbl}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className={ROW}>
                      <span className={LBL}>Sold individually</span>
                      <label className="flex items-center gap-2 text-xs text-ivory/60 cursor-pointer pt-1">
                        <input type="checkbox" checked={soldIndividually} onChange={e => setSoldIndividually(e.target.checked)} className="accent-sienna" />
                        Limit to 1 item per order
                      </label>
                    </div>
                    <div className={ROW}>
                      <span className={LBL}>New arrival</span>
                      <label className="flex items-center gap-2 text-xs text-ivory/60 cursor-pointer pt-1">
                        <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="accent-sienna" />
                        Mark as new arrival
                      </label>
                    </div>
                  </div>
                )}

                {/* ── SHIPPING ── */}
                {tab === 'shipping' && (
                  <div className="divide-y divide-white/6">
                    <div className={ROW}>
                      <span className={LBL}>Weight (kg)</span>
                      <input type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0.00" className={`${INP} w-32`} />
                    </div>
                    <div className={ROW}>
                      <span className={LBL}>Dimensions (cm)</span>
                      <div className="flex items-center gap-2">
                        {[{v:dimL,s:setDimL,p:'Length'},{v:dimW,s:setDimW,p:'Width'},{v:dimH,s:setDimH,p:'Height'}].map(d => (
                          <input key={d.p} type="number" step="0.1" value={d.v} onChange={e => d.s(e.target.value)}
                            placeholder={d.p} className={`${INP} w-24 placeholder:text-ivory/20`} />
                        ))}
                      </div>
                    </div>
                    <div className={ROW}>
                      <span className={LBL}>Shipping class</span>
                      <Sel value="" onChange={() => {}} className="w-48"><option>No shipping class</option></Sel>
                    </div>
                  </div>
                )}

                {/* ── LINKED PRODUCTS ── */}
                {tab === 'linked' && (
                  <div className="divide-y divide-white/6">
                    <div className={ROW}>
                      <span className={LBL}>Upsells</span>
                      <div className="flex-1 max-w-sm">
                        <input type="text" placeholder="Search for a product…" className={`${INP} w-full`} />
                        <p className="text-[10px] text-ivory/20 mt-1">Shown on the product page to encourage upgrade</p>
                      </div>
                    </div>
                    <div className={ROW}>
                      <span className={LBL}>Cross-sells</span>
                      <div className="flex-1 max-w-sm">
                        <input type="text" placeholder="Search for a product…" className={`${INP} w-full`} />
                        <p className="text-[10px] text-ivory/20 mt-1">Shown on the cart page to complement this product</p>
                      </div>
                    </div>
                    {productType === 'grouped' && (
                      <div className={ROW}>
                        <span className={LBL}>Grouped products</span>
                        <input type="text" placeholder="Search for products to group…" className={`${INP} flex-1 max-w-sm`} />
                      </div>
                    )}
                  </div>
                )}

                {/* ── ATTRIBUTES ── */}
                {tab === 'attributes' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <button onClick={addAttr}
                        className="px-3 py-1.5 border border-sienna/40 text-sienna/80 hover:text-sienna text-xs rounded transition-colors font-medium">
                        + Add new
                      </button>
                    </div>
                    {attrRows.length === 0 && (
                      <p className="text-xs text-ivory/20 py-2">No attributes yet. Add details like Material or Colour.</p>
                    )}
                    {attrRows.map((a, i) => (
                      <div key={a.id} className="border border-white/10 rounded-lg mb-3 overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-white/4 border-b border-white/8">
                          <span className="text-xs text-ivory/50">{a.name || 'New attribute'}</span>
                          <button onClick={() => setAttrRows(p => p.filter((_, idx) => idx !== i))}
                            className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>
                        </div>
                        <div className="p-3 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-ivory/30 mb-1">Name</label>
                            <input type="text" value={a.name} onChange={e => updAttr(i, 'name', e.target.value)}
                              placeholder="e.g. Material" className={`${INP} w-full`} />
                          </div>
                          <div>
                            <label className="block text-[10px] text-ivory/30 mb-1">Value(s)</label>
                            <textarea value={a.values} onChange={e => updAttr(i, 'values', e.target.value)}
                              placeholder="Red | Blue | Green" rows={2} className={`${INP} w-full resize-none`} />
                            <p className="text-[10px] text-ivory/20 mt-0.5">Separate with |</p>
                          </div>
                        </div>
                        <div className="flex gap-5 px-3 pb-3">
                          <label className="flex items-center gap-2 text-xs text-ivory/50 cursor-pointer">
                            <input type="checkbox" checked={a.visible} onChange={e => updAttr(i, 'visible', e.target.checked)} className="accent-sienna" />
                            Visible on product page
                          </label>
                          {productType === 'variable' && (
                            <label className="flex items-center gap-2 text-xs text-ivory/50 cursor-pointer">
                              <input type="checkbox" checked={a.forVariations} onChange={e => updAttr(i, 'forVariations', e.target.checked)} className="accent-sienna" />
                              Used for variations
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                    {attrRows.length > 0 && (
                      <button className="px-3 py-1.5 bg-white/6 border border-white/12 text-ivory/50 hover:text-ivory/80 text-xs rounded transition-colors">
                        Save attributes
                      </button>
                    )}
                  </div>
                )}

                {/* ── VARIATIONS ── */}
                {tab === 'variations' && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <button onClick={generateVariations}
                        className="px-3 py-1.5 bg-sienna/20 border border-sienna/30 text-sienna/90 hover:text-sienna text-xs rounded transition-colors font-medium">
                        Generate all variations
                      </button>
                      <span className="text-[10px] text-ivory/25">
                        {attrRows.filter(a => a.forVariations).length === 0
                          ? 'Mark attributes as "Used for variations" first'
                          : attrRows.filter(a => a.forVariations).map(a => a.name).join(' × ')}
                      </span>
                    </div>

                    {varRows.length === 0
                      ? <p className="text-xs text-ivory/20 py-2">No variations yet.</p>
                      : <div className="space-y-2">
                          {varRows.map((v, i) => (
                            <div key={v.id} className="border border-white/10 rounded-lg overflow-hidden">
                              <div className="flex items-center justify-between px-3 py-2 bg-white/4 border-b border-white/8">
                                <button onClick={() => updVar(i, 'expanded', !v.expanded)}
                                  className="flex items-center gap-2 text-xs text-ivory/70 hover:text-ivory">
                                  <span>{v.expanded ? '▾' : '▸'}</span>
                                  <span>{Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(' / ')}</span>
                                </button>
                                <div className="flex items-center gap-3">
                                  {v.price && <span className="text-xs text-ivory/30">KSh {Number(v.price).toLocaleString()}</span>}
                                  <button onClick={() => setVarRows(p => p.filter((_, idx) => idx !== i))}
                                    className="text-xs text-red-400/50 hover:text-red-400 transition-colors">Remove</button>
                                </div>
                              </div>
                              {v.expanded && (
                                <div className="p-4 grid grid-cols-2 gap-3">
                                  {[
                                    { lbl: 'SKU',             val: v.sku,         set: (x: string) => updVar(i, 'sku',         x), type: 'text'   },
                                    { lbl: 'Price (KSh)',     val: v.price,       set: (x: string) => updVar(i, 'price',       x), type: 'number' },
                                    { lbl: 'Sale price (KSh)',val: v.salePrice,   set: (x: string) => updVar(i, 'salePrice',   x), type: 'number' },
                                    { lbl: 'Stock qty',       val: v.stockQty,    set: (x: string) => updVar(i, 'stockQty',    x), type: 'number' },
                                    { lbl: 'Weight (kg)',     val: v.weight,      set: (x: string) => updVar(i, 'weight',      x), type: 'number' },
                                  ].map(f => (
                                    <div key={f.lbl}>
                                      <label className="block text-[10px] text-ivory/30 mb-1">{f.lbl}</label>
                                      <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} className={`${INP} w-full`} />
                                    </div>
                                  ))}
                                  <div>
                                    <label className="block text-[10px] text-ivory/30 mb-1">Stock status</label>
                                    <Sel value={v.stockStatus} onChange={e => updVar(i, 'stockStatus', e.target.value as StockStatus)} className="w-full">
                                      <option value="instock">In stock</option>
                                      <option value="outofstock">Out of stock</option>
                                      <option value="onbackorder">On backorder</option>
                                    </Sel>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="block text-[10px] text-ivory/30 mb-1">Variation image URL</label>
                                    <input type="text" value={v.image} onChange={e => updVar(i, 'image', e.target.value)} className={`${INP} w-full`} />
                                  </div>
                                  <div className="col-span-2">
                                    <label className="block text-[10px] text-ivory/30 mb-1">Description</label>
                                    <textarea value={v.description} onChange={e => updVar(i, 'description', e.target.value)} rows={2} className={`${INP} w-full resize-none`} />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                    }
                  </div>
                )}

                {/* ── ADVANCED ── */}
                {tab === 'advanced' && (
                  <div className="divide-y divide-white/6">
                    <div className={ROW}>
                      <span className={LBL}>Purchase note</span>
                      <textarea value={purchaseNote} onChange={e => setPurchaseNote(e.target.value)}
                        rows={3} placeholder="Optional note in order confirmation email…"
                        className={`${INP} flex-1 max-w-sm resize-y`} />
                    </div>
                    <div className={ROW}>
                      <span className={LBL}>Menu order</span>
                      <input type="number" value={menuOrder} onChange={e => setMenuOrder(e.target.value)} className={`${INP} w-24`} />
                    </div>
                    <div className={ROW}>
                      <span className={LBL}>Enable reviews</span>
                      <label className="flex items-center gap-2 text-xs text-ivory/60 cursor-pointer pt-1">
                        <input type="checkbox" checked={reviewsEnabled} onChange={e => setReviewsEnabled(e.target.checked)} className="accent-sienna" />
                        Allow customer reviews
                      </label>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Short description */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-ivory/50">Product short description</span>
              <div className="flex text-[11px] border border-white/12 rounded overflow-hidden">
                <span className="px-2.5 py-1 bg-white/8 text-ivory/60">Visual</span>
                <span className="px-2.5 py-1 text-ivory/30 border-l border-white/8">HTML</span>
              </div>
            </div>
            <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={4}
              placeholder="Brief summary shown next to the product image on listing pages…"
              className="w-full bg-transparent text-ivory/70 text-sm placeholder:text-ivory/20 focus:outline-none resize-y p-4 leading-relaxed" />
          </div>

        </div>

        {/* ── Sidebar ──────────────────────────────── */}
        <div className="w-56 shrink-0 space-y-3">

          {/* Publish */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-4 py-2.5">
              <span className="text-xs font-semibold text-ivory/50">Publish</span>
            </div>

            <div className="flex gap-2 px-4 pt-3">
              <button onClick={() => save(true)} disabled={saving}
                className="flex-1 border border-white/15 text-ivory/50 hover:text-ivory/80 hover:border-white/30 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-40">
                Save Draft
              </button>
              {product
                ? <Link href={`/products/${product.slug}`} target="_blank"
                    className="flex-1 border border-white/10 text-ivory/35 hover:text-ivory/60 py-1.5 rounded-lg text-xs transition-colors text-center">
                    Preview
                  </Link>
                : <button disabled className="flex-1 border border-white/10 text-ivory/20 py-1.5 rounded-lg text-xs opacity-30 cursor-default">Preview</button>
              }
            </div>

            <div className="px-4 py-3 space-y-2.5 text-xs border-b border-white/8 mt-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-ivory/35 shrink-0">Status:</span>
                <Sel small value={pubStatus} onChange={e => setPubStatus(e.target.value as PublishStatus)}>
                  <option value="publish">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending review</option>
                  <option value="private">Private</option>
                </Sel>
              </div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-ivory/35 shrink-0">Visibility:</span>
                <Sel small value={visType} onChange={e => setVisType(e.target.value as VisType)}>
                  <option value="public">Public</option>
                  <option value="password">Password protected</option>
                  <option value="private">Private</option>
                </Sel>
              </div>
              {visType === 'password' && (
                <input type="text" value={visPassword} onChange={e => setVisPassword(e.target.value)}
                  placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-ivory/60 text-[11px] focus:outline-none" />
              )}
              <div className="flex items-center justify-between gap-1">
                <span className="text-ivory/35 shrink-0">Catalog:</span>
                <Sel small value={catalogVisibility} onChange={e => setCatalogVisibility(e.target.value as CatalogVis)}>
                  <option value="visible">Shop &amp; search</option>
                  <option value="catalog">Shop only</option>
                  <option value="search">Search only</option>
                  <option value="hidden">Hidden</option>
                </Sel>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-sienna" />
                <span className="text-ivory/50">Featured product</span>
              </label>
            </div>

            {mode === 'edit' && (
              <div className="px-4 pt-2 pb-1">
                <button onClick={trash} className="text-[11px] text-red-400/50 hover:text-red-400 transition-colors">Move to Trash</button>
              </div>
            )}
            <div className="px-4 pb-4 pt-2">
              <button onClick={() => save(false)} disabled={saving}
                className="w-full bg-sienna text-ivory py-2 rounded-lg text-xs font-semibold hover:bg-sienna/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : mode === 'new' ? 'Publish' : 'Update'}
              </button>
            </div>
          </div>

          {/* Product image */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-4 py-2.5">
              <span className="text-xs font-semibold text-ivory/50">Product image</span>
            </div>
            <div className="p-4">
              {images[0]
                ? <div className="w-full aspect-square rounded-lg overflow-hidden bg-white/5 mb-3 border border-white/8">
                    <img src={images[0]} alt="" className="w-full h-full object-contain opacity-80" />
                  </div>
                : <div className="w-full aspect-square rounded-lg bg-white/4 border border-dashed border-white/15 mb-3 flex items-center justify-center">
                    <span className="text-ivory/15 text-xs">No image</span>
                  </div>
              }
              <input type="text" value={images[0] ?? ''} onChange={e => updImg(0, e.target.value)}
                placeholder="Paste image URL…"
                className="w-full bg-white/5 border border-white/12 rounded-lg px-2.5 py-1.5 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-white/30" />
              {images[0] && (
                <button onClick={() => updImg(0, '')} className="mt-1.5 text-xs text-red-400/50 hover:text-red-400 transition-colors">Remove image</button>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-4 py-2.5">
              <span className="text-xs font-semibold text-ivory/50">Product gallery</span>
            </div>
            <div className="p-4 space-y-2">
              {images.slice(1).length > 0 && (
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {images.slice(1).map((img, i) => (
                    <div key={i} className="relative group aspect-square bg-white/5 rounded border border-white/8 overflow-hidden">
                      {img
                        ? <img src={img} alt="" className="w-full h-full object-cover opacity-70" />
                        : <div className="w-full h-full flex items-center justify-center text-ivory/15 text-[10px]">URL</div>
                      }
                      <button onClick={() => rmImg(i + 1)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center leading-none">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.slice(1).map((img, i) => (
                <input key={i} type="text" value={img} onChange={e => updImg(i + 1, e.target.value)}
                  placeholder={`Gallery image ${i + 1} URL`}
                  className="w-full bg-white/5 border border-white/12 rounded px-2.5 py-1.5 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-white/30" />
              ))}
              <button onClick={addImg} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">+ Add gallery image</button>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-4 py-2.5">
              <span className="text-xs font-semibold text-ivory/50">Product categories</span>
            </div>
            <div className="px-4 pt-3">
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {CATEGORIES.map(cat => (
                  <label key={cat.slug} className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox"
                      checked={categories.includes(cat.slug)}
                      onChange={e => {
                        if (e.target.checked) setCategories(prev => [...prev, cat.slug])
                        else setCategories(prev => prev.filter(c => c !== cat.slug))
                      }}
                      className="accent-sienna" />
                    <span className="text-xs text-ivory/60">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-4 py-3 border-t border-white/6 mt-2">
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">+ Add new category</button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-4 py-2.5">
              <span className="text-xs font-semibold text-ivory/50">Product tags</span>
            </div>
            <div className="p-4">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-white/8 border border-white/12 rounded px-2 py-0.5 text-[11px] text-ivory/60">
                      {tag}
                      <button onClick={() => setTags(p => p.filter(t => t !== tag))}
                        className="text-ivory/30 hover:text-red-400 transition-colors leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKey}
                  placeholder="Add tag…"
                  className="flex-1 bg-white/5 border border-white/12 rounded-lg px-2.5 py-1.5 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-white/30" />
                <button onClick={() => addTag(tagInput)}
                  className="px-2.5 py-1.5 border border-white/15 text-ivory/50 hover:text-ivory/80 text-xs rounded-lg transition-colors">
                  Add
                </button>
              </div>
              <p className="text-ivory/20 text-[10px] mt-1.5">Enter or comma to add</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
