# Kitchenware E-Commerce Platform
## Functional & Technical Specification Document

| | |
|---|---|
| **Document version** | 4.0 |
| **Date** | June 24, 2026 |
| **Prepared for** | Engineering team |
| **Business model** | B2C (Business to Consumer) |
| **Architecture** | Decoupled — Next.js frontend (Vercel) + Laravel REST API backend (Railway / Forge), fronted by Cloudflare for security/edge, GitHub-based deployment |
| **Companion documents** | `README.md` (AI development guide), `CACHING.md` (cache framework specification), `DFD.md` (data flow diagrams), and `HOMEPAGE.md` (homepage layout) live alongside this file in the repo |
| **Status** | Draft — pending stakeholder sign-off on open questions (Section 19) |

> **Three things govern this build: Speed, Security, and Caching.** Sections 3 and 4 define the mandatory requirements for the first two. The full caching strategy — referenced throughout this document — is specified separately in `CACHING.md`, since it's substantial enough to need its own document.

---

## 1. Project Overview

### 1.1 Summary
A direct-to-consumer e-commerce website selling kitchenware (cookware, bakeware, utensils, small appliances, storage, cutlery, etc.). Customers browse a product catalog, add items to a cart, check out, create accounts, track orders, and engage with brand content (recipes, care guides, buying guides).

### 1.2 Goals
- Launch a **fast** and **secure** e-commerce platform — these are the top priorities the engineering approach is built around, not retrofitted later.
- Provide a smooth, low-friction checkout to maximize conversion.
- Give the store owner an easy-to-use custom admin panel to manage products, orders, and content.
- Build on a fully custom decoupled stack: Next.js owns the UI, Laravel owns business logic and data — with Cloudflare handling the edge security layer and a purpose-built caching framework handling performance at scale.

### 1.3 Target Audience
Home cooks and consumers purchasing kitchenware online, primarily via desktop and mobile web. (Confirm target geography/market — see Section 19.)

### 1.4 Business Model
**B2C only for v1.** No wholesale, bulk-quote, or trade-account functionality is in scope for this release. (See Section 18 for future B2B considerations.)

---

## 2. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | **Next.js 14+ (App Router) + React + TypeScript + Tailwind CSS** | TypeScript strict mode required |
| Frontend hosting | **Vercel** | Pushes to `main` auto-deploy; PRs get preview URLs |
| Backend / API | **Laravel 11 (PHP 8.2+)** — standalone REST API | Separate repo (`narya-backend`); deployed separately from the frontend |
| Backend hosting | **Railway / Render / Laravel Forge + DigitalOcean** | TBD — confirm infrastructure budget (Section 19) |
| Database | **MySQL 8.0** (or PostgreSQL 16 — confirm preference) | Relational integrity for orders, inventory, and payment records |
| ORM | **Eloquent** (Laravel built-in) | Type-safe query builder, migrations, protects against SQL injection |
| Application cache | **Redis** | Laravel Cache (catalog, search), cart state, sessions — full strategy in `CACHING.md` |
| Auth | **Laravel Sanctum** | Issues API tokens for the Next.js SPA; tokens stored in httpOnly cookies on the frontend |
| Edge security & CDN | **Cloudflare** (proxied in front of both Vercel and the Laravel host) | WAF, DDoS protection, Bot Management, rate limiting, DNS, edge caching |
| Payments | **Stripe** (Laravel Cashier or custom webhook handler) | Hosted Elements/Checkout keep card data off our servers |
| File/image storage | S3-compatible object storage (AWS S3 or Cloudflare R2) | Managed via Laravel's Filesystem; Cloudflare R2 avoids egress fees |
| Product search | **Laravel Scout + Meilisearch** (or Algolia) | Fast, typo-tolerant search via a Scout driver |
| Background jobs | **Laravel Queues** (Redis driver) + **Laravel Horizon** for monitoring | Emails, inventory sync, cache invalidation triggers (see `CACHING.md`) |
| Content/blog | Headless CMS (e.g., Sanity, Contentful) — recommended | Kept separate from the commerce backend; consumed by Next.js at build time / ISR |
| Email | **Laravel Mail** with SendGrid or Postmark driver | Dispatched via queued Mailable jobs |
| Monitoring | Sentry (errors, both Next.js and Laravel) + Vercel Analytics + Cloudflare Analytics (edge/security) | Required, not optional |

### 2.1 Request Flow / Architecture Overview

```
Browser
  → Cloudflare (DNS, proxied)
      WAF, DDoS protection, Bot Management, rate limiting, edge cache
    → Vercel (Next.js frontend)
        Server Components, ISR/SSG, Next.js fetch cache
      → Laravel REST API (/api/v1/...)
          Business logic, auth, Eloquent ORM, queue dispatch
        → Redis  — application cache (catalog, search, sessions, cart)
        → MySQL  — source of truth
        → External services — Stripe, Meilisearch, email, CMS, shipping carrier
```

**Key principle:** Next.js handles rendering and the UI. Laravel owns all business logic, data writes, authentication, and third-party integrations. Next.js never writes directly to the database — every mutation goes through the Laravel API. Cloudflare sits in front of both Vercel and the Laravel host — it is the security perimeter for the entire platform.

> ⚠️ **Scope flag:** Going fully custom means the admin panel (product/order/inventory management) and the content/blog system both need to be **built**, not configured out of the box. Budget real engineering time for this (Section 17). Admin panel can be built as Laravel Blade + Livewire (admin-only UI served by Laravel) or as a protected section of the Next.js frontend — decide before building.

---

## 3. Performance & Speed Architecture — Mandatory Design Pillar #1

This site must be fast by construction, not optimized after the fact.

### 3.1 Rendering Strategy (Next.js)
- Use **Static Generation (SSG) with Incremental Static Regeneration (ISR)** for product and category pages — generated at build time, revalidated on-demand when the admin saves a product update via the Laravel API.
- Use **React Server Components** wherever possible to minimize JavaScript shipped to the browser.
- Reserve client-side rendering for genuinely interactive, session-specific pages: cart, checkout, account dashboard.

### 3.2 Performance Budgets (Hard Targets)
| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP) | < 2.5s (target < 1.8s) |
| Interaction to Next Paint (INP) | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to First Byte (TTFB) | < 600ms |
| Initial JS bundle per page | < 150KB gzipped |

Enforced in CI (Section 3.8), not just checked before launch.

### 3.3 Image Strategy
- Mandatory use of `next/image` for all product imagery.
- Modern formats (AVIF/WebP) with automatic fallback; responsive `srcset`; lazy-load below the fold.
- Images stored in S3/R2; served through Cloudflare's CDN.

### 3.4 Edge, CDN & Caching
- **The full caching strategy — what's cached where, for how long, and how it's invalidated — is defined in `CACHING.md`.** This section summarizes the architecture; that document is the authoritative reference for implementation.
- In short: Cloudflare caches static assets and safe public pages at the edge; Vercel/Next.js ISR caches rendered product and category pages; Redis (via Laravel Cache) caches expensive queries and computed data; nothing personalized, authenticated, or payment-related is cached anywhere.

### 3.5 Database Performance (Laravel / MySQL)
- Proper indexing on every column used for filtering, sorting, or searching. Add indexes in Laravel migrations — don't rely on Eloquent defaults.
- Use Eloquent eager loading (`with()`) to prevent N+1 queries on listing and product detail endpoints.
- Connection pooling is handled by the Laravel host environment. Plan for read replicas if traffic grows.
- API responses for catalog pages should be cached in Redis (via Laravel Cache) so repeated Next.js ISR revalidations don't hit the database unnecessarily.

### 3.6 Third-Party Script Discipline
- Every third-party script (analytics, pixels, chat widgets) is lazy-loaded/deferred and reviewed for performance cost before being added.
- Limit to essential tools only at launch (Section 11).

### 3.7 Code-Level Practices (Next.js)
- Route-based code splitting.
- Minimize client-side hydration — only hydrate components that need interactivity.
- Prefer lighter-weight libraries over heavy ones when functionally equivalent.

### 3.8 Performance Enforcement in the Build Pipeline
- **Lighthouse CI runs on every pull request** (frontend repo). A PR that regresses the budgets in Section 3.2 fails CI or requires explicit sign-off.
- Real User Monitoring (Web Vitals) tracked in production via Vercel Analytics.
- Load/stress testing on the Laravel API before launch and before major promotions.

---

## 4. Security Architecture — Mandatory Design Pillar #2

Because this is a fully custom build, there is no plugin ecosystem patching vulnerabilities for you — every layer below is the engineering team's direct, ongoing responsibility.

### 4.1 Edge Security Layer — Cloudflare
Cloudflare sits in front of both Vercel and the Laravel host and is the first line of defense for every request:

- **DNS proxied through Cloudflare** ("orange-clouded") for both the frontend domain and the API domain.
- **SSL/TLS mode: Full (Strict)** for both origins.
- **WAF (managed rulesets) enabled** to block common attack patterns (SQLi, XSS, known exploit signatures) before they ever reach the app.
- **Bot Management / Super Bot Fight Mode enabled**, with extra scrutiny on login, checkout, account creation, and search endpoints.
- **Rate limiting rules** on auth endpoints (login, password reset), checkout, and any public API route.
- **DDoS protection** is automatic at this layer.
- **Cloudflare Access (Zero Trust)** recommended as an additional gate in front of the admin panel.
- Cloudflare's caching configuration must be coordinated with Laravel's cache headers and Next.js ISR — see `CACHING.md` Section 4.

### 4.2 Payment & PCI Scope
- Use Stripe **hosted fields/Elements or Checkout** so raw card data never touches our servers at any point.
- This keeps PCI compliance scope at the lowest tier (SAQ-A) — do not build any custom card-handling logic.
- Use Laravel Cashier or a custom Stripe webhook handler for payment event processing.

### 4.3 Authentication & Session Security (Laravel Sanctum)
- **Laravel Sanctum** issues API tokens for the Next.js frontend (SPA mode).
- Passwords hashed with **bcrypt** via Laravel's `Hash::make()` — never stored in plain text.
- The Sanctum token is stored in an **httpOnly, Secure, SameSite=Lax cookie** set by the Next.js BFF layer — never in `localStorage`.
- Rate limiting and progressive lockout on login and password-reset endpoints (`RateLimiter` in Laravel + Cloudflare-level rate limiting — defense in depth).
- **Mandatory 2FA for all admin/staff accounts.**

### 4.4 Input Validation & Injection Prevention
- **Laravel Form Requests** for schema validation on every API endpoint — requests never reach controllers without passing validation.
- All database queries go through **Eloquent** with parameterized bindings — no raw, string-concatenated SQL.
- Output encoding on user-generated content (product reviews) to prevent stored XSS.

### 4.5 Transport & Browser-Level Security
- HTTPS enforced everywhere with HSTS enabled; TLS 1.2+ only.
- **Content-Security-Policy** header restricting script/style/image sources.
- `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` headers on every response.
- **CSRF protection:** Sanctum's CSRF cookie mechanism — the Next.js app fetches `/sanctum/csrf-cookie` before mutating requests.

### 4.6 Access Control (Laravel Policies & Gates)
- **Laravel Policies** for resource-level authorization (e.g., only the order owner can view that order).
- **Laravel Gates** for admin/role checks: Admin, Shop Manager, Editor roles with the principle of least privilege.
- Full audit log of admin actions via model observers or `spatie/laravel-activitylog`.
- Admin panel additionally gated by Cloudflare Access.

### 4.7 Infrastructure & Secrets
- All secrets/credentials stored in the Vercel dashboard (frontend) and Railway/Forge environment panel (backend) — never committed to git.
- Separate credentials per environment (dev / staging / production).
- The database is not publicly reachable — only the Laravel application server connects to it.
- Automated, encrypted database backups with a tested restore process.

### 4.8 Dependency & Supply Chain Security
- **npm:** Dependabot / `npm audit` in CI on the frontend repo.
- **Composer:** `composer audit` in CI on the backend repo.
- Pin dependency versions; review changelogs before upgrading anything touching auth or payments.

### 4.9 Monitoring & Incident Response
- **Sentry** on both the Next.js frontend and Laravel backend for error tracking.
- Cloudflare's security event logs (WAF blocks, bot challenges, rate-limit triggers).
- Alerts on suspicious activity: repeated failed logins, unusual admin actions, abnormal traffic spikes.
- A documented incident response plan written before launch, not after an incident.

### 4.10 Independent Verification
- A third-party security review or penetration test before launch, and at minimum annually after.

---

## 5. Assumptions

1. Single currency, single language at launch.
2. Domestic shipping only at launch.
3. Stripe is the payment processor (confirm if a second processor is also required).
4. No live chat / helpdesk integration at launch.
5. Product catalog size is small-to-medium (under ~2,000 SKUs).
6. No marketplace/multi-vendor functionality.
7. A headless CMS (e.g., Sanity) is used for blog/content — consumed by the Next.js frontend.
8. Domain DNS is (or will be) managed through Cloudflare, proxied in front of both Vercel and the Laravel host.
9. Next.js and Laravel are separate repos with separate CI/CD pipelines.

---

## 6. User Roles

| Role | Description |
|---|---|
| **Guest** | Browse, search, view products, cart, guest checkout |
| **Registered Customer** | Guest capabilities + saved addresses, order history, wishlist |
| **Admin** | Full access to the admin panel |
| **Shop Manager** | Manages products/orders/inventory, not staff accounts or system settings |
| **Editor** | Manages blog/content only |

---

## 7. Site Map / Page Inventory

| Page | Purpose |
|---|---|
| Home | Featured products, promotions, brand story, category entry points — full section-by-section layout in `HOMEPAGE.md` |
| Shop / Category listing | Grid of products with filters and sorting |
| Subcategory pages | e.g., Cookware → Pots & Pans |
| Product Detail Page (PDP) | Full product info, images, variants, reviews, add to cart |
| Search Results | On-site search results |
| Cart | Review items, adjust quantities, subtotal |
| Checkout | Shipping, payment, order review |
| Order Confirmation | Post-purchase summary |
| Account: Dashboard / Orders / Addresses / Wishlist / Settings | Customer account area |
| Login / Register / Forgot Password | Authentication flows (via Sanctum) |
| Blog / Recipes / Guides | Content marketing (headless CMS) |
| About / Contact / FAQ | Informational pages |
| Shipping & Returns / Privacy / Terms | Legal/policy pages |
| 404 / Error pages | Standard error handling |
| **Admin Panel** (staff-only, Cloudflare Access-gated) | Product, order, inventory, customer, content, discount management |

---

## 8. Functional Requirements

### 8.1 Product Catalog & Browsing
- Categories/subcategories; product variants (size, color, material).
- Pagination, sorting (price, newest, best-selling, rating), filtering (price, category, material, color, in-stock).

### 8.2 Product Detail Page (PDP)
- Image gallery with zoom; variant selector with dynamic price/image updates.
- Stock status; Add to Cart; Add to Wishlist.
- Specifications (dimensions, material, care instructions, weight, capacity).
- Reviews and rating; related/cross-sell products.

### 8.3 Search
- Site-wide search with autocomplete, powered by Laravel Scout + Meilisearch (or Algolia).
- Same filter/sort options as category pages.

### 8.4 Shopping Cart
- Persistent cart (Redis-backed for guests via Laravel session, database-backed for logged-in users).
- Mini-cart accessible from header.

### 8.5 Checkout
- **Guest checkout must be supported.**
- Shipping → Shipping method → Payment → Review → Confirm, with tax/shipping/total shown clearly before payment.

### 8.6 Payments
- Stripe via hosted Elements/Checkout.
- Optional Apple Pay/Google Pay.
- Order status updated automatically via Stripe webhook events handled by Laravel.

### 8.7 User Accounts
- Email/password registration and login (Laravel Sanctum). Optional social login.
- Account dashboard: orders, addresses, wishlist, settings.

### 8.8 Order Management & Tracking
- Status: Processing → Shipped → Delivered (plus Cancelled/Refunded).
- Tracking number display; itemized order detail view.

### 8.9 Reviews & Ratings
- Star rating + written review on purchased products; admin moderation before publishing.

### 8.10 Wishlist
- Save products; move to cart.

### 8.11 Promotions, Discounts & Coupons
- Coupon codes (percentage, fixed, free shipping) managed via the admin panel and validated by the Laravel API at checkout.
- Automatic sales on selected products/categories; free shipping threshold.

### 8.12 Shipping & Tax
- Shipping cost by destination/weight/method via the Laravel API.
- Tax calculation via TaxJar or Avalara.

### 8.13 Inventory Management
- Real-time stock tracking per variant (MySQL); low-stock alerts via queued jobs; configurable backorders.

### 8.14 Content / Blog
- Managed via headless CMS; Next.js fetches content at build time / ISR; posts link to related products.

### 8.15 Notifications
- Transactional emails via Laravel Mail (SendGrid/Postmark driver), dispatched as queued Mailable jobs via Laravel Horizon.

### 8.16 Admin Panel (Custom-Built)
- Full product/order/customer/coupon management; sales reporting; RBAC with mandatory 2FA; gated by Cloudflare Access.
- Build as Laravel Blade + Livewire (served by the Laravel host) or as a protected section of the Next.js frontend — decide before building.

### 8.17 Customer Support
- Contact form; FAQ page. Live chat not in v1 scope.

---

## 9. Non-Functional Requirements

*(Performance, Security, and Caching are covered in Sections 3, 4, and `CACHING.md` — not repeated here.)*

| Category | Requirement |
|---|---|
| **Accessibility** | WCAG 2.1 AA target |
| **Responsiveness** | Mobile-first, fully functional across breakpoints |
| **Browser support** | Latest 2 versions of Chrome, Safari, Firefox, Edge; Safari iOS, Chrome Android |
| **Uptime** | Target 99.9% |

---

## 10. Backend & API Architecture (Laravel)

- **REST API** built with Laravel, versioned under `/api/v1/`.
- Controllers are thin — business logic lives in Service classes (`OrderService`, `InventoryService`, `CartService`, etc.).
- Authentication via **Laravel Sanctum**; every protected route uses `auth:sanctum` middleware.
- Authorization via **Laravel Policies** — enforced inside controllers or Service classes, never on the frontend.
- Database schema managed via **Eloquent migrations** — never alter schema by hand.
- Background work (emails, cache invalidation, search index updates) dispatched to **Laravel Queues** (Redis driver), monitored with **Laravel Horizon**.
- Admin panel (if built as Blade/Livewire) uses standard Laravel sessions rather than Sanctum API tokens.

---

## 11. Third-Party Integrations

| Integration | Purpose | Notes |
|---|---|---|
| **Cloudflare** | WAF, DDoS protection, Bot Management, rate limiting, DNS, edge cache, optional Zero Trust Access for admin | See Section 4.1 |
| Stripe | Payment processing (via Laravel Cashier or custom webhook handler) | Confirm if a second processor is required |
| Meilisearch | Full-text product search via Laravel Scout | Self-hosted or Meilisearch Cloud |
| Shipping carrier APIs | Real-time shipping rates and labels | Confirm carriers for target market |
| TaxJar or Avalara | Sales tax calculation | Required |
| SendGrid or Postmark | Transactional email delivery (via Laravel Mail) | Required |
| Google Analytics 4 | Traffic and conversion tracking | Loaded deferred in Next.js per Section 3.6 |
| Meta/Facebook Pixel | Ad retargeting | Optional |
| Klaviyo or Mailchimp | Email marketing, abandoned cart flows | Optional |
| Sanity or Contentful | Headless CMS for blog/content | Consumed by Next.js |
| Google Search Console | SEO monitoring | Recommended |
| Laravel Horizon | Queue monitoring and management | Required alongside Laravel Queues |
| Sentry | Error tracking (both Next.js and Laravel) | Required |

---

## 12. Design Requirements

- Brand guidelines: logo (plant/herb SVG mark), color palette (`terra`, `earth`, `sienna`, `ivory`, `forest`), serif headings.
- Component-based design system in Next.js with Tailwind CSS utility classes.
- Mobile-first breakpoints; high-quality product photography; zoom on PDP.

---

## 13. Compliance & Legal

- Cookie consent banner if serving regions requiring it (GDPR/CCPA) — confirm target markets (Section 19).
- Privacy Policy and Terms of Service reviewed by the business owner.
- Data minimization — only collect and store what's actually needed.

---

## 14. Analytics & Reporting

- GA4 e-commerce tracking (via Next.js, deferred).
- Custom admin panel sales reporting (Section 8.16) driven by Laravel API queries.
- Cloudflare Analytics for edge traffic/security events.

---

## 15. Testing & QA

### Frontend (Next.js)
- Unit and integration tests with Jest / React Testing Library.
- E2E tests with Playwright for core customer flows (browse → cart → checkout → confirmation).
- Lighthouse CI on every PR (Section 3.8).

### Backend (Laravel)
- **Feature tests** for every API endpoint using Laravel's HTTP testing helpers and `RefreshDatabase`.
- **Unit tests** for all business logic: pricing, discounts, inventory, coupon validation.
- `composer audit` in CI for dependency vulnerabilities.
- PHPStan static analysis (level 8 target) in CI.

### Shared
- Cross-browser/device QA; load testing on the Laravel API before launch and major sales.
- Security testing per Section 4.10.
- UAT with the business owner before go-live.

---

## 16. Deployment & DevOps

- **Frontend:** GitHub → Vercel (auto-deploy on push to `main`; preview deployments on PRs).
- **Backend:** GitHub (`narya-backend`) → Railway / Render / Forge (auto-deploy on push to `main`; run `php artisan migrate --force` as part of deploy pipeline).
- CI on both repos runs lint, type-check/static analysis, tests, and security scans on every PR.
- Separate staging and production environments and credentials for both repos.
- Cloudflare configuration (WAF rules, cache rules, Access policies) version-controlled via Terraform or Cloudflare's API where possible.

---

## 17. Suggested Timeline & Milestones

| Phase | Description |
|---|---|
| 1. Discovery & setup | Confirm open questions (Section 19), finalize design assets, set up infrastructure (MySQL, Redis, Laravel host, Vercel, Cloudflare, CI/CD on both repos) |
| 2. Laravel backend build | Data models & migrations, Sanctum auth, core API endpoints (products, categories, cart, checkout, orders), Stripe integration, queue setup |
| 3. Admin panel build | Product/order/inventory/customer management, RBAC, 2FA, Cloudflare Access gating |
| 4. Next.js frontend build | Storefront pages per Section 7, consuming the Laravel API and headless CMS |
| 5. Caching & edge configuration | Implement `CACHING.md` end to end — Laravel Cache (Redis), ISR revalidation wired to Laravel admin saves, Cloudflare cache rules and purge wiring |
| 6. Integration & content | Load product catalog, connect CMS content, connect analytics, Meilisearch indexing |
| 7. QA & security review | Full testing pass, penetration test, business owner UAT |
| 8. Launch | Go live, monitor closely for first 1–2 weeks |

---

## 18. Future Phase Considerations (Out of Scope for v1)

- Wholesale/trade accounts with separate pricing tiers
- Quote requests / request-for-pricing flow
- Net payment terms
- Bulk order / CSV upload ordering
- Multiple buyers under one company account
- Minimum order quantities for wholesale

---

## 19. Open Questions for Stakeholder

1. **Target market/geography** — Kenya only, or international shipping too?
2. **Payment processor** — Stripe only, or also M-Pesa / PayPal?
3. **Shipping approach** — flat-rate, free-shipping threshold, or live carrier rates? Which carriers?
4. **Approximate catalog size** — how many products/SKUs at launch?
5. **Brand assets** — do logo, color palette, and product photography already exist? (Note: SVG logomark and Tailwind brand colors are already in the frontend.)
6. **Domain name** — is one already registered, and is it ready to point at Cloudflare?
7. **Budget/timeline constraints** — any hard deadline?
8. **Marketing tools** — email marketing or live chat needed at launch?
9. **Multi-currency/multi-language** — needed now or later?
10. **Existing systems** — any current store whose data/products need to be migrated in?
11. **CMS for blog/content** — confirm a headless CMS is acceptable; which one (Sanity, Contentful, other)?
12. **Cloudflare plan tier** — Free, Pro, or Business — affects which WAF/Bot Management/Access features are available; confirm budget.
13. **Backend infrastructure** — Railway, Render, or Laravel Forge + DigitalOcean? Confirm budget and ops preference.
14. **Admin panel approach** — Laravel Blade/Livewire served by the Laravel host, or a protected section of the Next.js frontend?
15. **Search infrastructure** — self-hosted Meilisearch, Meilisearch Cloud, or Algolia?

---

## 20. Glossary

- **B2C** — Business to Consumer
- **PDP** — Product Detail Page
- **SSR/SSG/ISR** — Server-Side Rendering / Static Site Generation / Incremental Static Regeneration
- **RBAC** — Role-Based Access Control
- **WAF** — Web Application Firewall
- **CSP** — Content Security Policy
- **XSS / CSRF** — Cross-Site Scripting / Cross-Site Request Forgery
- **SKU** — Stock Keeping Unit
- **CDN** — Content Delivery Network
- **TTL** — Time To Live (how long a cached item is kept before expiring)
- **LCP / INP / CLS** — Core Web Vitals metrics
- **Sanctum** — Laravel's lightweight API authentication package
- **Eloquent** — Laravel's built-in ORM
- **Horizon** — Laravel's Redis queue dashboard and management tool
- **Scout** — Laravel's driver-based full-text search package

---

*End of document. Sections 3 and 4 are the two mandatory design pillars for this build. `CACHING.md` is the authoritative reference for the caching framework referenced throughout. Section 19 should be resolved before development starts.*
