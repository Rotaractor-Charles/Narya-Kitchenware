# Narya Kitchenware — Developer & Maintainer Onboarding Guide

This document is the single source of truth for anyone new to this project — developer, designer, freelancer, or agency. Read it fully before touching any code or configuration.

---

## 1. What Is This Project?

**Narya Kitchenware** is a B2C e-commerce site selling premium kitchenware to customers across Kenya (narya.co.ke). It is a **fully custom-built** platform — not Shopify, not WooCommerce. Everything from the storefront to the admin panel is built in-house.

**Business context:**
- Customers browse products, add to cart, check out, and track orders
- Admin staff manage products, orders, inventory, and promotions via a built-in admin panel
- The site targets Kenyan home cooks — all prices in KES, delivery to all 47 counties
- Brand colors: `terra` (green), `earth` (dark green), `sienna` (warm accent), `ivory` (off-white)

---

## 2. Architecture at a Glance

```
User's browser
  └── Cloudflare (DNS, WAF, DDoS, rate limiting, edge cache)
        ├── Vercel  ← Next.js 14 frontend (THIS REPO)
        │     └── calls →
        └── Railway / Render / Forge  ← Laravel 11 REST API (narya-backend repo)
              ├── MySQL  (source of truth)
              ├── Redis  (cache + queues)
              └── Meilisearch  (product search)
```

**Key principle:** Next.js renders the UI. Laravel owns all business logic, data writes, auth, payments, and third-party integrations. Next.js **never** writes directly to the database — it always goes through the Laravel API.

**Two separate repos:**
| Repo | Language | Deployed on |
|------|----------|-------------|
| `Narya-Kitchenware` ← you are here | Next.js / TypeScript | Vercel |
| `narya-backend` | Laravel 11 / PHP 8.2 | Railway / Render / Forge |

---

## 3. Tech Stack

### Frontend (this repo)
| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 14 (App Router) | React framework, SSR/SSG/ISR |
| TypeScript | 5.x strict | Type safety — never disable strict mode |
| Tailwind CSS | 3.x | Styling — utility classes only, no custom CSS files |
| `lib/api.ts` | — | Central HTTP client for all Laravel API calls |
| `lib/cart-context.tsx` | — | Cart state (client-side, persisted in cookie) |
| `lib/auth-context.tsx` | — | Auth state (Sanctum token in httpOnly cookie) |

### Backend (narya-backend repo — Laravel)
| Tool | Purpose |
|------|---------|
| Laravel 11 | REST API, business logic, Eloquent ORM |
| Laravel Sanctum | API token auth — tokens stored in MySQL, sent via httpOnly cookie |
| Laravel Scout + Meilisearch | Product search |
| Laravel Horizon | Queue monitoring dashboard |
| Redis | Application cache + queue driver |
| MySQL | Primary database |
| Stripe | Payments (hosted Elements — card data never touches our servers) |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting + preview deployments |
| Cloudflare | DNS, WAF, DDoS, Bot Management, edge cache, Cloudflare Access (admin gate) |
| Railway / Render / Forge | Laravel API hosting |
| GitHub | Version control + CI/CD trigger |

---

## 4. Repository Structure (This Repo)

```
/app
  layout.tsx              ← Root layout: fonts, providers, global metadata
  robots.ts               ← Generates /robots.txt (Next.js convention)
  sitemap.ts              ← Generates /sitemap.xml dynamically
  opengraph-image.tsx     ← Default OG image for social sharing (edge-rendered)
  /(store)                ← Public storefront pages (Navbar + Footer layout)
    page.tsx              ← Homepage
    shop/                 ← /shop and /shop/[category]
    product/[slug]/       ← Product detail page
    recipes/              ← Recipe listing and detail pages
    blog/                 ← Blog listing
    guides/               ← Buying guides
    about/, contact/, rewards/, etc.
    checkout/             ← noindex — not crawled by Google
    account/, orders/, cart/, wishlist/  ← noindex, auth-gated
  /admin                  ← Admin panel (noindex, Cloudflare Access gated)
  /affiliate              ← Affiliate program pages (noindex)
  /search                 ← Search results (noindex)
  /api                    ← Next.js route handlers (BFF — proxy to Laravel)

/components
  /layout                 ← Navbar, Footer
  /home                   ← Hero, ProductRow, CategoryGrid, etc.
  /product                ← ProductDetail, ProductReviews
  /shop                   ← ShopClient, ProductCard
  /cart                   ← CartDrawer, CartClient
  /checkout               ← CheckoutClient
  /admin                  ← Admin panel UI components
  /auth                   ← LoginForm, RegisterForm
  /account                ← AccountClient
  /notifications          ← NotificationsClient
  /rewards                ← RewardsClient

/lib
  api.ts                  ← Central Laravel API client — use this, never call Laravel URL directly
  api/
    products.ts           ← Product API helpers
    categories.ts         ← Category API helpers
    auth.ts               ← Auth API helpers
    cookie.ts             ← Cookie utilities
  types.ts                ← Shared TypeScript types
  recipes.ts              ← Static recipe data (local, not from DB)
  cart-context.tsx        ← Cart state provider
  auth-context.tsx        ← Auth state provider
  wishlist-context.tsx    ← Wishlist state provider

/public
  /products               ← SVG placeholder product images
  /recipes                ← Recipe hero images

/scripts                  ← Utility scripts (not deployed)

/docs                     ← ALL project documentation (see below)

/firebase                 ← Firebase config (Firestore rules/indexes — if used)
/server                   ← Server-only stubs (placeholder)
```

---

## 5. The `docs/` Directory

| File | What it covers |
|------|---------------|
| `docs/ONBOARDING.md` | This file — start here |
| `docs/SPEC.md` | Full functional & technical specification — what to build and why |
| `docs/CACHING.md` | Caching rules for every layer (Cloudflare, Next.js ISR, Redis, browser) |
| `docs/DFD.md` | Frontend data flow diagrams |
| `docs/BACKEND_DFD.md` | Backend data flow diagrams |
| `docs/BACKEND_DFD_PHASE_TRACKER.md` | Backend implementation phase tracker |
| `docs/SECURITY.md` | Security guidelines + pre-deployment checklist — **read before any auth/payment/admin work** |
| `docs/HOMEPAGE.md` | Homepage section-by-section layout spec |
| `docs/product-page-spec.md` | Product page detailed spec |
| `docs/brand/logo.html` | Logo HTML reference |
| `docs/brand/narya-logo-system.html` | Full logo system reference |
| `docs/prototypes/checkout-page.html` | Checkout page standalone prototype |
| `docs/prototypes/rewards-page.html` | Rewards page standalone prototype |
| `docs/superpowers/plans/` | Archived implementation plans |

---

## 6. Local Development Setup

### Prerequisites
- Node.js 20+
- npm 10+
- Git

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Rotaractor-Charles/Narya-Kitchenware.git
cd Narya-Kitchenware

# 2. Install dependencies
npm install

# 3. Copy the example env file and fill in values
cp .env.local.example .env.local
# Open .env.local and set every variable (see Section 7 below)

# 4. Run the dev server
npm run dev
# → http://localhost:3000
```

### Available scripts
```bash
npm run dev          # Development server with hot reload
npm run build        # Production build (run this before deploying to catch errors)
npm run start        # Serve the production build locally
npm run lint         # ESLint check
npm run type-check   # TypeScript strict check (tsc --noEmit)
```

Always run `npm run build` before raising a PR — it catches type errors and broken imports that the dev server ignores.

---

## 7. Environment Variables

All secrets live in `.env.local` locally and in **Vercel → Project Settings → Environment Variables** in production. Never commit `.env.local`.

Open `.env.local.example` for the full list. Key variables:

| Variable | What it is |
|----------|-----------|
| `NEXT_PUBLIC_SITE_URL` | Public site URL, e.g. `https://narya.co.ke` |
| `NEXT_PUBLIC_API_URL` | Laravel API base URL, e.g. `https://api.narya.co.ke` |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase config (if Firestore is used) |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK credentials (server-side only) |
| `REVALIDATE_SECRET` | Secret token for on-demand ISR revalidation webhook |
| `REDIS_URL` | Redis connection string (if used directly from Next.js) |

Anything prefixed `NEXT_PUBLIC_` is exposed to the browser — never put secrets there.

---

## 8. Deployment

### Frontend (Next.js → Vercel)

Deployment is automatic:
- **Push to `main`** → production deployment on Vercel
- **Open a PR** → preview deployment URL generated automatically

**Never push directly to `main`.** Always open a PR. The preview URL lets you test before anything goes live.

**To deploy a fix:**
```bash
git checkout -b fix/your-fix-description
# make changes
git add <files>
git commit -m "fix: describe the fix"
git push origin fix/your-fix-description
# Open a PR on GitHub → Vercel generates a preview URL
# After review and CI passes → merge to main → auto-deploys
```

### Backend (Laravel → Railway / Render / Forge)

The backend is a separate repo (`narya-backend`). Deployment also triggers on push to `main` in that repo. Migrations run automatically as part of the deploy pipeline.

### DNS & Cloudflare

- DNS is managed in Cloudflare, proxied in front of Vercel
- SSL/TLS mode: **Full (Strict)** — do not change this
- WAF and Bot Management are enabled — don't disable them to debug
- Cloudflare Access gates the `/admin` path — requires separate Cloudflare Access credentials

---

## 9. Admin Panel

URL: `https://narya.co.ke/admin` (gated by Cloudflare Access — you need an approved email to get past it)

The admin panel is built in-house at `/app/admin/`. It covers:
- Products: create, edit, delete, manage images
- Categories & brands
- Orders: view, update status
- Customers: view, manage
- Discounts & coupons
- Affiliate program
- Reviews moderation
- Rewards / loyalty program
- Shipping rules
- Site settings

Admin login is at `/admin/login`. All admin API calls go through `/app/api/admin/` route handlers which proxy to the Laravel API.

---

## 10. SEO & Crawlability

The site is fully SEO-instrumented. Key points for anyone editing pages:

- **Public pages** must have `title`, `description`, and `openGraph` in their metadata
- **Private pages** (cart, checkout, account, orders, notifications) must have `robots: { index: false }`
- The `robots.ts` file at root generates `/robots.txt` — disallows all private paths
- The `sitemap.ts` file generates `/sitemap.xml` dynamically from the Laravel API
- Product pages have `Product` + `BreadcrumbList` JSON-LD structured data
- Recipe pages have `Recipe` JSON-LD structured data
- Homepage has `Organization` + `WebSite` (with `SearchAction`) JSON-LD
- OG images are generated programmatically at `app/opengraph-image.tsx` (root), `app/(store)/product/[slug]/opengraph-image.tsx`, and `app/(store)/shop/[category]/opengraph-image.tsx`

**Rule:** if you add a new public page, it needs metadata + sitemap entry. If you add a private page, it needs `robots: { index: false }` and a disallow rule in `robots.ts`.

---

## 11. Security Rules (Summary)

Read `docs/SECURITY.md` for the full checklist. The non-negotiables:

- Auth tokens live in **httpOnly cookies** — never `localStorage`
- Passwords use **bcrypt** — never reversible hashing
- All input is validated in Laravel Form Requests before touching business logic
- Payment card data never touches our servers — Stripe hosted Elements only
- Admin routes are protected server-side via role checks AND Cloudflare Access
- Never commit `.env.local` or any secret
- `SANCTUM_TOKEN_EXPIRY` is set to 10080 minutes (7 days) — tokens auto-expire
- Password changes revoke all other active tokens immediately

---

## 12. Caching Rules (Summary)

Read `docs/CACHING.md` for the full framework. The rules that matter most:

| Route type | Can be cached? |
|-----------|---------------|
| Product/category pages | Yes — ISR with revalidation on content change |
| Homepage | Yes — ISR |
| Cart, checkout, account | **Never** — at any layer |
| Admin panel | **Never** — at any layer |
| Search results | No — dynamic, personalised |

On-demand revalidation: when a product is updated in the admin, Laravel fires a webhook to `/api/revalidate` which purges the Next.js ISR cache for that product's page.

---

## 13. Common Tasks

### Add a new product category
1. Create the category in the Laravel admin (or via API)
2. Add a `CATEGORY_META` entry in `app/(store)/shop/[category]/page.tsx` with `desc` and `seoDesc`
3. The sitemap picks it up automatically on the next build

### Add a new public page
1. Create `app/(store)/your-page/page.tsx`
2. Export `metadata` with `title`, `description`, and `openGraph`
3. Add it to the static list in `app/sitemap.ts`
4. Check it doesn't need a `robots: { index: false }` (if it's auth-gated, it does)

### Add a new recipe
1. Add the recipe object to the `RECIPES` array in `lib/recipes.ts`
2. Add the hero image to `public/recipes/`
3. The sitemap and recipe listing page pick it up automatically

### Update a product (prices, description, images)
1. Do it in the admin panel or directly via the Laravel API
2. The admin panel triggers revalidation automatically via the `/api/revalidate` webhook
3. Cloudflare's edge cache for the product page is purged within ~60 seconds

### Deploy a hotfix
```bash
git checkout main && git pull
git checkout -b fix/describe-the-fix
# edit the file(s)
git add <specific files>
git commit -m "fix: describe the fix"
git push origin fix/describe-the-fix
# Create PR on GitHub → preview URL → review → merge
```

---

## 14. Key Contacts & Accounts

| Service | What to access | Where |
|---------|---------------|-------|
| Vercel | Frontend deployments, env vars | vercel.com → Narya-Kitchenware project |
| Cloudflare | DNS, WAF, Access, cache rules | dash.cloudflare.com |
| GitHub | Source code, PRs, CI | github.com/Rotaractor-Charles |
| Railway / Render / Forge | Laravel API hosting, env vars | (check with project owner) |
| Stripe | Payments dashboard | dashboard.stripe.com |
| Meilisearch | Search index management | (check with project owner) |

The project owner is **Charles Kamau** (machariacharleskamau@gmail.com). Contact before making infrastructure changes.

---

## 15. What Not to Do

- Do not push directly to `main` — always open a PR
- Do not store secrets in code — only in `.env.local` / Vercel env vars
- Do not store auth tokens in `localStorage` — httpOnly cookies only
- Do not write business logic in Next.js — it belongs in Laravel
- Do not call MySQL or Redis directly from Next.js — always through the Laravel API
- Do not disable Cloudflare WAF or Bot Management to unblock a bug — investigate instead
- Do not cache cart, checkout, account, or admin routes at any layer
- Do not add `dangerouslyAllowSVG: true` to `next.config.ts` — XSS vector
- Do not merge a PR with TypeScript errors or ESLint failures
- Do not add a third-party npm package without checking it's maintained and running `npm audit`

---

## 16. Emergency Runbook

### Site is down (blank page or 5xx)
1. Check Vercel dashboard → Deployments → last deployment status
2. Check Cloudflare → if "Error 1001" or "Error 523" → Laravel API is unreachable → check Railway/Render dashboard
3. Check Cloudflare → if WAF blocking → check Firewall Events log
4. Roll back: Vercel dashboard → Deployments → previous successful deployment → "Promote to Production"

### Product prices/images not updating
1. Check `/api/revalidate` webhook is configured in Laravel — it should fire on product save
2. Manually trigger revalidation: `POST /api/revalidate?secret=<REVALIDATE_SECRET>&path=/product/slug`
3. If Cloudflare is caching stale data: Cloudflare dashboard → Caching → Purge Cache → purge the product URL

### Users can't log in
1. Check Laravel API is reachable: `curl https://api.narya.co.ke/api/v1/health`
2. Check Sanctum config: `SANCTUM_TOKEN_EXPIRY` in Laravel `.env` (default 10080 minutes)
3. Check Cloudflare isn't blocking the `/api/auth/login` route — check Firewall Events

### Admin panel inaccessible
1. Check Cloudflare Access — the access policy may need your email added
2. Check `/admin/login` works after passing Cloudflare Access
3. Check your user account has the `admin` role in the Laravel database

---

*Last updated: 2026-07-01. Update this document whenever the architecture, hosting, or key processes change.*
