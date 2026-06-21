# Caching Framework — Kitchenware E-Commerce Platform

| | |
|---|---|
| **Document version** | 1.0 |
| **Date** | June 21, 2026 |
| **Companion documents** | `SPEC.md` (Sections 2–4), `README.md` |

This document is the authoritative reference for how caching works across the site. It exists because caching done casually — a bit of Cloudflare here, a bit of ISR there, no clear ownership — is one of the most common sources of two opposite failures: stale prices/stock showing to customers, or a slow site because nothing is actually cached effectively. Everything here should be implemented deliberately, not improvised page by page.

---

## 1. Philosophy

- **Cache aggressively where data is public and shared. Never cache anything personalized, authenticated, or payment-related, at any layer.**
- Every cached item has a clear, known way it gets invalidated — "it'll expire eventually" is a fallback, not a strategy.
- Prefer a small number of well-understood cache layers over many overlapping, poorly-coordinated ones.

---

## 2. Cache Layers Overview

| Layer | Technology | What it caches | Who invalidates it |
|---|---|---|---|
| 1. Browser | HTTP `Cache-Control` headers | Static assets: JS, CSS, fonts, hashed images | Automatic — filenames change on deploy |
| 2. Edge (CDN) | Cloudflare | Static assets; safe, anonymous public HTML | Cache Rules + explicit purge via API on content change |
| 3. Rendering | Vercel / Next.js ISR | Rendered HTML for product & category pages | Time-based revalidation + on-demand revalidation API |
| 4. Application | Redis | Catalog queries, search results, computed data, cart/session state | Explicit invalidation on write, with TTL as a safety net |
| 5. Database | Firebase Firestore | Source of truth — not a cache layer | n/a |

Request flow: **Browser → Cloudflare → Vercel (ISR) → Redis → Firebase Firestore**, each layer only being consulted if the one before it doesn't have a fresh answer.

---

## 3. What Gets Cached, Where, and For How Long

| Data type | Layer(s) | TTL | Invalidation trigger |
|---|---|---|---|
| Static assets (JS/CSS/fonts) | Browser + Cloudflare | 1 year (immutable) | New deployment changes the filename hash |
| Product images | Browser + Cloudflare | 30 days | Re-upload changes the filename |
| Category/listing pages (anonymous) | Cloudflare + ISR | ISR revalidate: 120s · Cloudflare edge TTL: 60s | On-demand revalidation + Cloudflare purge on product/inventory update |
| Product detail pages (anonymous) | Cloudflare + ISR | ISR revalidate: 60s · Cloudflare edge TTL: 60s | Same as above |
| Search results | Redis | 5 minutes | TTL expiry; purge on relevant product update where feasible |
| Cart contents | Redis only | Session length (keyed to Firebase Auth UID for logged-in users, session ID for guests) | On every cart mutation — never cached at Cloudflare or browser level |
| Checkout / payment pages | **No caching, any layer** | n/a | n/a |
| Account / order history pages | **No caching, any layer** (authenticated, personalized) | n/a | n/a |
| Admin panel | **No caching, any layer** | n/a | n/a |
| Blog/content pages (CMS) | Cloudflare + ISR | 10 minutes | CMS webhook triggers revalidation + Cloudflare purge |

---

## 4. Cloudflare Cache Configuration

- **Cache Level: "Standard."** Respect the origin's `Cache-Control` headers rather than using "Cache Everything" — "Cache Everything" applied globally is the most common way a project accidentally caches and serves authenticated or dynamic responses to the wrong user.
- **Explicit Cache Rules**, scoped by path:
  - `/_next/static/*`, product images → Cache Everything, long TTL.
  - Storefront pages (`/`, `/shop/*`, `/product/*`, `/blog/*`) → respect origin headers (set by Next.js per Section 5 below).
  - `/api/*`, `/account/*`, `/checkout/*`, `/admin/*` → **Bypass cache entirely.**
- **Purge strategy:** use Cloudflare's API to purge by URL (or cache tag, if on a plan that supports it) whenever a product, category, or content page changes. This is triggered from the admin panel's save action via a background job (BullMQ), not done manually.

---

## 5. Application Layer — Cache-Control Headers (Next.js)

Every route should set its `Cache-Control` header explicitly rather than relying on framework defaults — this is what Cloudflare's "Standard" cache level (Section 4) reads to decide what's safe to cache:

- Public, anonymous pages (catalog, PDP, blog): `s-maxage` matching the ISR revalidation window, `stale-while-revalidate` to avoid a cold cache penalty.
- `/api/*`, `/account/*`, `/checkout/*`, `/admin/*`: `Cache-Control: private, no-store` — explicit, not assumed.

---

## 6. Redis Application Cache

- **Cache key naming convention:** `{resource}:{identifier}` — e.g. `product:1234`, `category:cookware:page:2`, `search:{queryHash}`, `cart:{sessionId}`.
- **Write-through invalidation:** when a product, category, or coupon is updated in the admin panel, the corresponding Redis key(s) are deleted or updated in the same action — invalidation is not left to TTL alone for anything changed via an admin action.
- **TTL as a safety net:** even explicitly-invalidated cache entries carry a TTL (e.g., 1 hour) in case an invalidation step is ever missed in code.
- Never store unencrypted sensitive data in Redis — there shouldn't be any payment data in the cache at all (per `SPEC.md` Section 4.2).
- **Firestore read cost:** caching is especially important here — Firestore bills per document read. Serving hot catalog data from Redis instead of Firestore directly reduces both latency and cost.

---

## 7. ISR / On-Demand Revalidation (Next.js)

- Time-based revalidation is the default safety net (60–300s depending on page type, per Section 3).
- **On-demand revalidation:** when a product or category is saved in the admin panel, call Next.js's on-demand revalidation for the affected paths immediately, rather than waiting for the TTL window — this gives near-real-time updates on the storefront without giving up the performance benefit of static pages.

---

## 8. What Must Never Be Cached (Recap)

- Cart contents, beyond the session-scoped Redis entry.
- Checkout and payment pages.
- Any authenticated or account-specific page or API response.
- Admin panel pages and API responses.
- Any response containing personal data (emails, addresses, order history, names).

---

## 9. Monitoring

- Track cache hit rate at the Cloudflare layer (built into Cloudflare Analytics) and at the Redis layer (custom metric/log — even a simple hit/miss counter is enough to start).
- Alert if the hit rate on the catalog/search layer drops sharply — this usually signals a cache invalidation bug or a misconfigured Cache Rule, not normal variance.
- Revisit Cloudflare Cache Rules and Redis TTLs periodically as the catalog grows — settings tuned for 200 SKUs may need adjustment at 2,000.

---

## 10. Implementation Checklist

- [ ] Cloudflare Cache Rules configured per Section 4 (not left on default "Cache Everything" anywhere)
- [ ] `Cache-Control` headers explicitly set on every route per Section 5
- [ ] Redis client set up with the key naming convention in Section 6
- [ ] On-demand ISR revalidation wired into admin panel save actions (Section 7)
- [ ] Cloudflare purge wired into admin panel save actions via API/webhook (Section 4)
- [ ] Cart, checkout, account, and admin routes verified to be genuinely uncached at every layer (Section 8) — test by inspecting response headers, not just assuming
- [ ] Cache hit-rate monitoring in place before launch (Section 9)

---

*This document should be treated as binding implementation guidance, not a suggestion — refer back to it any time a caching decision comes up during development, rather than improvising a one-off solution per page.*
