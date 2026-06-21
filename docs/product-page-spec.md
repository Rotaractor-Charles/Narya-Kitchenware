# Narya Admin — Product Page Specification

Based on WooCommerce product editor conventions, adapted for Narya Kitchenware (Next.js 15 / Firestore).

---

## 1. Product List Page (`/admin/products`)

### 1.1 Sub-nav filter pills
Above the table, a row of clickable count pills:

| Pill | Filter |
|------|--------|
| All (N) | No filter |
| Published (N) | `status === 'publish'` |
| Draft (N) | `status === 'draft'` |
| Trash (N) | `isActive === false` (soft-deleted) |

### 1.2 Action bar (above table)
Left side:
- **Bulk actions** dropdown: `— Bulk actions — / Edit / Move to Trash`
- **Apply** button

Right side (filter row):
- **Category** dropdown (from CATEGORIES constant)
- **Product type** dropdown: All / Simple / Variable / Grouped / External
- **Stock status** dropdown: All / In Stock / Out of Stock / On Backorder
- **Filter** button
- **Search products** input + **Search** button

### 1.3 Table columns
| Column | Notes |
|--------|-------|
| ☐ | Checkbox for bulk selection |
| (thumbnail) | 40×40 image, placeholder icon if none |
| Name | Bold. Hover reveals: **Edit · Quick Edit · Trash · Duplicate · View** |
| SKU | `—` if empty |
| Stock | Green "In stock (N)" / Red "Out of stock" / Amber "On backorder" |
| Price | Regular price; sale price in red strikethrough beside it |
| Categories | Comma-separated links |
| Tags | Comma-separated |
| Type | Badge: Simple / Variable / Grouped / External |
| Date | Published / Last modified |
| ★ | Featured star toggle |

### 1.4 Pagination
`N items  «  ‹  [page] of N  ›  »`  — inline with the action bar.

### 1.5 Quick Edit
Inline expansion (no page navigation) showing:
- Name, Slug, Date, Status, Password, Featured
- Price, Sale price, Tax status, Tax class
- Stock status, Stock qty, Backorders, Sold individually
- Weight, Dimensions

---

## 2. Product Edit / New Page (`/admin/products/[id]` · `/admin/products/new`)

Two-column layout: **main column (2/3)** + **sidebar (1/3)**.

---

### 2.1 Main column — top

#### Product name
Full-width text input. Auto-generates the slug on first save.

#### Permalink
Displays below the name after initial save:
`https://narya.store/products/` **`[slug]`** `[Edit]`

---

### 2.2 Description (long)
Rich text area — supports headings, lists, bold/italic, links, embedded images/video, tables.

Tabs: **Visual** | **Text (HTML)**

---

### 2.3 Product data metabox

#### Product type row (top of metabox)
- **Product type** dropdown: `Simple product · Grouped · External/Affiliate · Variable`
- Checkboxes (for Simple + Variable types): `☐ Virtual` `☐ Downloadable`

#### Left tab sidebar (vertical)
Tabs change which panel appears on the right.

| Tab | Visible for |
|-----|-------------|
| General | Simple, External, Variable |
| Inventory | All types (limited for Grouped/External) |
| Shipping | Simple, Variable (hidden when Virtual is checked) |
| Linked Products | All types |
| Attributes | All types |
| Variations | Variable only |
| Advanced | Simple, Variable |

---

#### Tab: General

**Simple / External / Affiliate**

| Field | Type | Notes |
|-------|------|-------|
| Regular price (KES) | Number | Required |
| Sale price (KES) | Number | Optional. "Schedule" link → date pickers (From / To) |
| Tax status | Select | Taxable · Shipping only · None |
| Tax class | Select | Standard · Reduced rate · Zero rate |

**External/Affiliate only (additional)**

| Field | Type |
|-------|------|
| Product URL | URL input |
| Button text | Text input (default "Buy product") |

**Variable**
No price here — each variation sets its own price.

**Downloadable** (when Downloadable ☑)

| Field | Type | Notes |
|-------|------|-------|
| Downloadable files | Repeater | Name + URL/file upload |
| Download limit | Number | Blank = unlimited |
| Download expiry | Number (days) | Blank = never |

---

#### Tab: Inventory

| Field | Visible for | Notes |
|-------|-------------|-------|
| SKU | All | Unique. Alphanumeric + dash |
| Manage stock | Simple, Variable | Toggle. Reveals Quantity, Backorders, Low stock threshold |
| Stock status | Simple (when not managing stock) | In Stock · Out of Stock · On Backorder |
| Quantity | When Manage stock ☑ | Integer |
| Allow backorders | When Manage stock ☑ | Do not allow · Allow (notify) · Allow |
| Low stock threshold | When Manage stock ☑ | Default from store settings |
| Sold individually | Simple, Variable | ☐ Limit to one per order |

---

#### Tab: Shipping
Hidden entirely when Virtual ☑.

| Field | Notes |
|-------|-------|
| Weight (kg) | |
| Dimensions (cm) | L × W × H |
| Shipping class | Dropdown from shipping class list |

---

#### Tab: Linked Products

| Field | Notes |
|-------|-------|
| Upsells | Typeahead search → multiple products |
| Cross-sells | Typeahead search → multiple products |
| Grouped products | Only for Grouped type — products that form the group |

---

#### Tab: Attributes

Two modes:
- **Global attribute** — select from store-wide attribute list (e.g., Material, Colour)
- **Custom attribute** — ad-hoc, product-only

Each attribute row has:
- Name
- Value(s) — pipe-separated or tag pills
- ☐ Visible on product page
- ☐ Used for variations (Variable type only)

Action buttons: **Add** | **Save attributes**

---

#### Tab: Variations
*Variable product only.*

Two steps:
1. **Generate from attributes** — creates all permutations from checked attributes
2. **Edit each variation** — per-variation fields:
   - SKU, Regular price, Sale price
   - ☐ Virtual, ☐ Downloadable
   - Stock status / Quantity
   - Weight, Dimensions
   - Shipping class
   - Description
   - Variation image

---

#### Tab: Advanced

| Field | Notes |
|-------|-------|
| Purchase note | Appears in order confirmation email |
| Menu order | Integer for manual front-end sort |
| ☐ Enable reviews | Per-product toggle |

---

### 2.4 Product short description
Smaller rich text area below the Product data metabox. Displays next to the product image on the product listing page.

---

### 2.5 Sidebar

#### Publish panel
```
[ Save Draft ]  [ Preview ]

Status:    Published ▾   [Edit]
Visibility: Public ▾    [Edit]
Published:  21 Jun 2026 [Edit]

Catalog visibility: Shop and search ▾
☐ This is a featured product

[ Publish / Update ]

[ Copy to new draft ]   [ Move to Trash ]
```

Status options: `Published · Pending review · Draft`
Visibility options: `Public · Password protected · Private`
Catalog visibility: `Shop and search · Shop only · Search only · Hidden`

---

#### Product image panel
- Click to upload or choose from Media Library
- Shows thumbnail once set
- "Remove product image" link

---

#### Product gallery panel
- Add multiple images (drag to reorder)
- Click thumbnail to remove

---

#### Product categories panel
- Checkbox list of all categories
- **Most used** tab
- **+ Add new category** link → name field + parent dropdown

---

#### Product tags panel
- Type-and-add with autocomplete
- Existing tags shown as chips with × remove
- "Choose from the most used tags" expander

---

## 3. Bulk Edit Mode

Triggered from the product list by selecting ≥ 2 products → Bulk actions → Edit → Apply.

An inline edit panel appears showing the selected products and these fields (all default to "— No change —"):

| Field | Options |
|-------|---------|
| Categories | Checkbox list |
| Status | Published · Private · Pending Review · Draft |
| Tags | Tag input |
| Comments | Allow · Do not allow |
| Price | Change to · Increase by ($ or %) · Decrease by ($ or %) |
| Sale price | Change to · Increase by · Decrease by · Set to regular − X |
| Tax status | Taxable · Shipping only · None |
| Tax class | Standard · Reduced · Zero |
| Weight | Change to |
| L / W / H | Change to |
| Shipping class | Dropdown |
| Visibility | Catalog & search · Catalog · Search · Hidden |
| Featured | Yes · No |
| In stock | In Stock · Out of Stock · On Backorder |
| Manage stock | Yes · No |
| Stock qty | Change to · Increase by · Decrease by |
| Backorders | Do not allow · Allow (notify) · Allow |
| Sold individually | Yes · No |

**[ Update ]** button applies changes to all selected products.

---

## 4. Data Model (Firestore `products/{id}`)

```ts
{
  // Identity
  name:             string           // required
  slug:             string           // auto-generated, unique
  type:             'simple' | 'variable' | 'grouped' | 'external'

  // Content
  description:      string           // HTML / markdown
  shortDescription: string           // HTML / markdown
  images:           string[]         // URLs — first is the main image
  galleryImages:    string[]         // Additional gallery URLs

  // Pricing (Simple / External)
  price:            number
  salePrice:        number | null
  salePriceFrom:    string | null    // ISO date
  salePriceTo:      string | null    // ISO date
  taxStatus:        'taxable' | 'shipping' | 'none'
  taxClass:         'standard' | 'reduced' | 'zero'

  // External/Affiliate
  externalUrl:      string | null
  buttonText:       string | null    // default "Buy product"

  // Inventory
  sku:              string | null
  manageStock:      boolean
  stockStatus:      'instock' | 'outofstock' | 'onbackorder'
  stockQty:         number | null
  backorders:       'no' | 'notify' | 'yes'
  lowStockThreshold: number | null
  soldIndividually: boolean

  // Flags
  virtual:          boolean
  downloadable:     boolean

  // Downloadable files
  downloadFiles:    { name: string; url: string }[]
  downloadLimit:    number | null
  downloadExpiry:   number | null    // days

  // Shipping
  weight:           number | null    // kg
  length:           number | null    // cm
  width:            number | null    // cm
  height:           number | null    // cm
  shippingClass:    string | null

  // Organisation
  categories:       string[]         // category slugs
  tags:             string[]

  // Linked
  upsells:          string[]         // product IDs
  crossSells:       string[]         // product IDs
  groupedProducts:  string[]         // product IDs (Grouped type)

  // Attributes
  attributes: {
    name:         string
    values:       string[]
    visible:      boolean
    forVariations: boolean
    isGlobal:     boolean
  }[]

  // Variations (Variable type)
  variations: {
    id:           string
    attributes:   Record<string, string>
    sku:          string | null
    price:        number
    salePrice:    number | null
    stockStatus:  'instock' | 'outofstock' | 'onbackorder'
    stockQty:     number | null
    virtual:      boolean
    downloadable: boolean
    image:        string | null
    weight:       number | null
    length:       number | null
    width:        number | null
    height:       number | null
    description:  string | null
  }[]

  // Advanced
  purchaseNote:       string | null
  menuOrder:          number
  reviewsEnabled:     boolean

  // Publish
  status:             'publish' | 'draft' | 'pending' | 'private'
  catalogVisibility:  'visible' | 'catalog' | 'search' | 'hidden'
  featured:           boolean
  password:           string | null

  // Meta
  isActive:     boolean
  createdAt:    string    // ISO
  updatedAt:    string    // ISO
}
```

---

## 5. Implementation Phases

| Phase | Scope |
|-------|-------|
| **Phase A** | Simple product — all tabs (General, Inventory, Shipping, Linked Products, Attributes, Advanced), Publish panel, Image, Gallery, Categories, Tags |
| **Phase B** | Variable product — Attributes tab + Variations tab, per-variation fields |
| **Phase C** | Grouped product — Linked Products tab with grouped products search |
| **Phase D** | External/Affiliate product type |
| **Phase E** | Downloadable product support |
| **Phase F** | Bulk edit inline panel, Quick edit inline row |
| **Phase G** | Featured star toggle in list, drag-to-sort, column sorting |
