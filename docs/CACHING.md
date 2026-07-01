# Caching Framework — Kitchenware E-Commerce Platform

| | |
|---|---|
| **Document version** | 2.0 |
| **Date** | June 24, 2026 |
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
| 3. Rendering | Vercel / Next.js ISR | Rendered HTML for product & category pages | Time-based revalidation + on-demand revalidation API triggered by Laravel |
| 4. Application | Redis (via **Laravel Cache**) | Catalog queries, search results, computed data, cart/session state | Explicit invalidation on write (cache tags or key deletion), with TTL as a safety net |
| 5. Database | **MySQL** (via Eloquent) | Source of truth — not a cache layer | n/a |

Request flow: **Browser → Cloudflare → Vercel (ISR) → Laravel API → Redis → MySQL**, each layer only being consulted if the one before it doesn't have a fresh answer.

---

## 3. What Gets Cached, Where, and For How Long

| Data type | Layer(s) | TTL | Invalidation trigger |
|---|---|---|---|
| Static assets (JS/CSS/fonts) | Browser + Cloudflare | 1 year (immutable) | New deployment changes the filename hash |
| Product images | Browser + Cloudflare | 30 days | Re-upload changes the filename |
| Category/listing pages (anonymous) | Cloudflare + ISR | ISR revalidate: 120s · Cloudflare edge TTL: 60s | On-demand revalidation + Cloudflare purge on product/inventory update |
| Product detail pages (anonymous) | Cloudflare + ISR | ISR revalidate: 60s · Cloudflare edge TTL: 60s | Same as above |
| Laravel API responses (catalog/search) | Redis (Laravel Cache) | 5–60 minutes depending on data type | Write-through invalidation on admin save; TTL as safety net |
| Search results | Redis (Laravel Cache) | 5 minutes | TTL expiry; purge on relevant product update where feasible |
| Cart contents | Redis only (Laravel Session / Cache) | Session length (keyed to Sanctum user ID for logged-in users, session ID for guests) | On every cart mutation — never cached at Cloudflare or browser level |
| Checkout / payment pages | **No caching, any layer** | n/a | n/a |
| Account / order history pages | **No caching, any layer** (authenticated, personalized) | n/a | n/a |
| Admin panel | **No caching, any layer** | n/a | n/a |
| Blog/content pages (CMS) | Cloudflare + ISR | 10 minutes | CMS webhook triggers Laravel endpoint → ISR revalidation + Cloudflare purge |

---

## 4. Cloudflare Cache Configuration

- **Cache Level: "Standard."** Respect the origin's `Cache-Control` headers rather than using "Cache Everything" — "Cache Everything" applied globally is the most common way a project accidentally caches and serves authenticated or dynamic responses to the wrong user.
- **Explicit Cache Rules**, scoped by path:
  - `/_next/static/*`, product images → Cache Everything, long TTL.
  - Storefront pages (`/`, `/shop/*`, `/product/*`, `/blog/*`) → respect origin headers (set by Next.js per Section 5 below).
  - `/api/*`, `/account/*`, `/checkout/*`, `/admin/*` → **Bypass cache entirely.**
- **Purge strategy:** use Cloudflare's API to purge by URL (or cache tag, if on a plan that supports it) whenever a product, category, or content page changes. This is triggered from the Laravel admin save action via a queued job (Laravel Queues), not done manually.

---

## 5. Application Layer — Cache-Control Headers (Next.js)

Every route should set its `Cache-Control` header explicitly rather than relying on framework defaults — this is what Cloudflare's "Standard" cache level (Section 4) reads to decide what's safe to cache:

- Public, anonymous pages (catalog, PDP, blog): `s-maxage` matching the ISR revalidation window, `stale-while-revalidate` to avoid a cold cache penalty.
- `/api/*`, `/account/*`, `/checkout/*`, `/admin/*`: `Cache-Control: private, no-store` — explicit, not assumed.

---

## 6. Redis Application Cache (Laravel Cache)

- **Cache driver:** Redis, configured via `CACHE_STORE=redis` in Laravel's `.env`.
- **Cache key naming convention:** `{resource}:{identifier}` — e.g. `product:1234`, `category:cookware:page:2`, `search:{queryHash}`, `cart:{sessionId}`.
- **Write-through invalidation:** when a product, category, or coupon is updated in the admin panel, the corresponding Redis key(s) are deleted or updated in the same action via `Cache::forget()` or `Cache::tags()->flush()` — invalidation is not left to TTL alone for anything changed via an admin action.
- **Cache tags** (Redis driver supports tags): use `Cache::tags(['products'])->put(...)` so you can flush all product-related entries with a single `Cache::tags(['products'])->flush()` call when a product is saved.
- **TTL as a safety net:** even explicitly-invalidated cache entries carry a TTL (e.g., 1 hour) in case an invalidation step is ever missed in code.
- Never store unencrypted sensitive data in Redis — there should be no payment data in the cache at all (per `SPEC.md` Section 4.2).

---

## 7. ISR / On-Demand Revalidation (Next.js ↔ Laravel)

- Time-based revalidation is the default safety net (60–300s depending on page type, per Section 3).
- **On-demand revalidation:** when a product or category is saved in the Laravel admin, Laravel dispatches a queued job that calls Next.js's on-demand revalidation endpoint (`/api/revalidate?path=/product/[slug]`) — this gives near-real-time updates on the storefront without giving up the performance benefit of static pages.
- The revalidation endpoint on Next.js must be authenticated (e.g., with a shared secret token via environment variables) so it can't be triggered by arbitrary external parties.

---

## 8. What Must Never Be Cached (Recap)

- Cart contents, beyond the session-scoped Redis entry.
- Checkout and payment pages.
- Any authenticated or account-specific page or API response.
- Admin panel pages and API responses.
- Any Laravel API response that includes personal data (emails, addresses, order history, names).

---

## 9. Monitoring

- Track cache hit rate at the Cloudflare layer (built into Cloudflare Analytics) and at the Redis layer (Laravel Horizon dashboard, or a custom hit/miss counter via `Cache::missing()`).
- Alert if the hit rate on the catalog/search layer drops sharply — this usually signals a cache invalidation bug or a misconfigured Cache Rule, not normal variance.
- Revisit Cloudflare Cache Rules and Redis TTLs periodically as the catalog grows.

---

## 10. Implementation Checklist

- [ ] Cloudflare Cache Rules configured per Section 4 (not left on default "Cache Everything" anywhere)
- [ ] `Cache-Control` headers explicitly set on every Next.js route per Section 5
- [ ] Laravel Cache configured with Redis driver; key naming convention per Section 6 applied from the first cached endpoint
- [ ] Cache tags used for product/category entries so admin saves can flush related entries atomically
- [ ] On-demand ISR revalidation endpoint on Next.js implemented and authenticated; wired into Laravel admin save via queued job (Section 7)
- [ ] Cloudflare purge wired into Laravel admin save actions via API call in the same queued job (Section 4)
- [ ] Cart, checkout, account, and admin routes verified to be genuinely uncached at every layer (Section 8) — test by inspecting response headers, not just assuming
- [ ] Cache hit-rate monitoring in place before launch (Section 9)

---

*This document should be treated as binding implementation guidance, not a suggestion — refer back to it any time a caching decision comes up during development, rather than improvising a one-off solution per page.*
