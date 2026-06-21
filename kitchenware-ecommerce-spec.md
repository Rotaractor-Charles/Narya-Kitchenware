# Kitchenware E-Commerce Platform
## Functional & Technical Specification Document

| | |
|---|---|
| **Document version** | 3.0 |
| **Date** | June 21, 2026 |
| **Prepared for** | Engineering team |
| **Business model** | B2C (Business to Consumer) |
| **Architecture** | Fully custom build — Next.js frontend/backend, hosted on Vercel, fronted by Cloudflare for security/edge, GitHub-based deployment |
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
- Build on a fully custom stack the team owns end-to-end, with Cloudflare handling the edge security layer and a purpose-built caching framework handling performance at scale.

### 1.3 Target Audience
Home cooks and consumers purchasing kitchenware online, primarily via desktop and mobile web. (Confirm target geography/market — see Section 19.)

### 1.4 Business Model
**B2C only for v1.** No wholesale, bulk-quote, or trade-account functionality is in scope for this release. (See Section 18 for future B2B considerations.)

---

## 2. Technology Stack (Fully Custom Build)

| Layer | Technology | Notes |
|---|---|---|
| Frontend | **Next.js (App Router) + React + TypeScript** | TypeScript is required, not optional |
| Backend / API | **Next.js API Routes / Route Handlers / Server Actions**, within the same project | Keeps the whole app as one deployable unit on Vercel (see `README.md` Section 3) |
| Database | **PostgreSQL** | Relational integrity for orders, inventory, and payment records |
| ORM | **Prisma** | Type-safe queries, migrations, protects against SQL injection by design |
| Application cache | **Redis** | Sessions, cart state, hot catalog/search data — full strategy in `CACHING.md` |
| Edge security & CDN | **Cloudflare** (proxied in front of Vercel) | WAF, DDoS protection, Bot Management, rate limiting, DNS, edge caching — see Section 4.1 |
| Hosting | **Vercel** | Frontend + backend (API routes) deploy together; Vercel's own edge network handles rendering/ISR |
| Authentication | Custom auth service or Auth.js, with secure session handling | See Section 4.3 |
| Payments | **Stripe** (recommended) | Hosted Elements/Checkout keep card data off our servers |
| File/image storage | S3-compatible object storage (AWS S3 or Cloudflare R2) | Cloudflare R2 is a natural fit given Cloudflare is already in the stack — no egress fees |
| Product search | Meilisearch or Algolia | Fast, typo-tolerant search |
| Background jobs | BullMQ (Redis-based queue) | Emails, inventory sync, cache invalidation triggers (see `CACHING.md`) |
| Content/blog | Headless CMS (e.g., Sanity, Contentful) — recommended | Kept separate from the commerce backend |
| Monitoring | Sentry (errors) + Web Vitals/Vercel Analytics (performance) + Cloudflare Analytics (edge/security) | Required, not optional |

### 2.1 Request Flow / Architecture Overview

```
Browser
  → Cloudflare (DNS, proxied) — WAF, DDoS protection, Bot Management, rate limiting, edge cache
    → Vercel Edge Network — Next.js rendering (SSG/ISR/SSR), API routes
      → Redis — application cache (catalog, search, sessions, cart)
      → PostgreSQL (via Prisma) — source of truth
      → External services — Stripe, TaxJar/Avalara, email, search index, headless CMS
```

Every request hits Cloudflare first. Cloudflare is the security perimeter; Vercel is where the app actually runs; Redis sits between the app and the database to absorb repeated reads. The full breakdown of what's cached at each layer is in `CACHING.md`.

> ⚠️ **Scope flag:** Going fully custom means the admin panel (product/order/inventory management) and the content/blog system both need to be **built**, not configured out of the box. Budget real engineering time for this (Section 17).

---

## 3. Performance & Speed Architecture — Mandatory Design Pillar #1

This site must be fast by construction, not optimized after the fact.

### 3.1 Rendering Strategy
- Use **Static Generation (SSG) with Incremental Static Regeneration (ISR)** for product and category pages.
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

Enforced in CI (Section 3.9), not just checked before launch.

### 3.3 Image Strategy
- Mandatory use of `next/image` for all product imagery.
- Modern formats (AVIF/WebP) with automatic fallback; responsive `srcset`; lazy-load below the fold.
- Images served through Cloudflare's CDN (or R2 + Cloudflare), not directly from the origin.

### 3.4 Edge, CDN & Caching
- **The full caching strategy — what's cached where, for how long, and how it's invalidated — is defined in `CACHING.md`.** This section summarizes the architecture; that document is the authoritative reference for implementation.
- In short: Cloudflare caches static assets and safe public pages at the edge; Vercel/Next.js ISR caches rendered product and category pages; Redis caches expensive queries and computed data; nothing personalized, authenticated, or payment-related is cached anywhere.

### 3.5 Database Performance
- Proper indexing on every column used for filtering/sorting/search.
- Connection pooling on the backend.
- Avoid N+1 query patterns on listing and PDP queries.
- Plan for read replicas if traffic grows beyond a single instance.

### 3.6 Third-Party Script Discipline
- Every third-party script (analytics, pixels, chat widgets) is lazy-loaded/deferred and reviewed for performance cost before being added.
- Limit to essential tools only at launch (Section 11).

### 3.7 Code-Level Practices
- Route-based code splitting.
- Minimize client-side hydration — only hydrate components that need interactivity.
- Prefer lighter-weight libraries over heavy ones when functionally equivalent.

### 3.8 Performance Enforcement in the Build Pipeline
- **Lighthouse CI runs on every pull request.** A PR that regresses the budgets in Section 3.2 fails CI or requires explicit sign-off.
- Real User Monitoring (Web Vitals) tracked in production.
- Load/stress testing before launch and before major promotions.

---

## 4. Security Architecture — Mandatory Design Pillar #2

Because this is a fully custom build, there is no plugin ecosystem patching vulnerabilities for you — every layer below is the engineering team's direct, ongoing responsibility.

### 4.1 Edge Security Layer — Cloudflare
Cloudflare sits in front of Vercel and is the first line of defense for every request:

- **DNS proxied through Cloudflare** ("orange-clouded") rather than pointed directly at Vercel — this is what puts Cloudflare's protections in the request path at all.
- **SSL/TLS mode set to "Full (Strict)"** — Vercel already terminates TLS with a valid certificate, so "Flexible" mode must not be used (it would leave the Cloudflare-to-Vercel hop unencrypted).
- **WAF (managed rulesets) enabled** to block common attack patterns (SQLi, XSS, known exploit signatures) before they ever reach the app.
- **Bot Management / Super Bot Fight Mode enabled**, with extra scrutiny on login, checkout, account creation, and search endpoints — these are the highest-value targets for automated abuse.
- **Rate limiting rules** on auth endpoints (login, password reset), checkout, and any public API route, to blunt brute-force and scraping attempts.
- **DDoS protection** is automatic at this layer; "Under Attack Mode" is available as a manual escalation if needed.
- **Cloudflare Access (Zero Trust)** recommended as an additional gate in front of the admin panel — requiring a verified login at the Cloudflare layer before a request even reaches the app is a strong extra barrier on top of the app's own auth (Section 4.3) and 2FA (Section 4.5).
- Cloudflare's caching configuration must be coordinated with the app's own cache headers — see `CACHING.md` Section 4. Do not enable "Cache Everything" globally; it will cache authenticated or dynamic responses if not scoped carefully.

### 4.2 Payment & PCI Scope
- Use Stripe (or chosen processor) **hosted fields/Elements or Checkout** so raw card data never touches our servers at any point.
- This keeps PCI compliance scope at the lowest tier (SAQ-A) — do not build any custom card-handling logic.

### 4.3 Authentication & Session Security
- Passwords hashed with **bcrypt or argon2** — never stored in plain text or with reversible encryption.
- Sessions/tokens stored in **httpOnly, Secure, SameSite cookies** — not in `localStorage`.
- If JWTs are used: short-lived access tokens with refresh-token rotation.
- Rate limiting and progressive backoff/lockout on login and password-reset endpoints (in addition to the Cloudflare-level rate limiting in Section 4.1 — defense in depth).
- **Mandatory 2FA for all admin/staff accounts.**

### 4.4 Input Validation & Injection Prevention
- Schema validation (e.g., Zod) on every API input.
- All database queries go through the ORM (Prisma) with parameterized queries — no raw, string-concatenated SQL anywhere.
- Output encoding on user-generated content (e.g., product reviews) to prevent stored XSS.

### 4.5 Transport & Browser-Level Security
- HTTPS enforced everywhere with HSTS enabled; TLS 1.2+ only.
- **Content-Security-Policy** header restricting which sources scripts/styles/images can load from.
- `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` headers on every response.
- CSRF protection on all state-changing requests.

### 4.6 Access Control
- Role-based access control (RBAC) in the admin panel — Admin, Shop Manager, Editor roles with the principle of least privilege.
- Full audit log of admin actions: who changed what, and when.
- Admin panel additionally gated by Cloudflare Access (Section 4.1).

### 4.7 Infrastructure & Secrets
- All secrets/credentials stored in Vercel's environment variable system — never committed to the git repository.
- Separate credentials per environment (dev / staging / production).
- The database is not publicly reachable — only the backend service can connect to it.
- Automated, encrypted backups with a tested restore process.

### 4.8 Dependency & Supply Chain Security
- Automated dependency vulnerability scanning in CI (e.g., Dependabot, Snyk, or `npm audit`).
- The team owns patching every npm package directly — this needs to be a recurring task.
- Pin dependency versions; review changelogs before upgrading anything touching auth or payments.

### 4.9 Monitoring & Incident Response
- Centralized error/security logging (e.g., Sentry) plus Cloudflare's own security event logs (WAF blocks, bot challenges, rate-limit triggers).
- Alerts on suspicious activity: repeated failed logins, unusual admin actions, abnormal traffic spikes, spikes in Cloudflare-blocked requests.
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
7. A headless CMS (e.g., Sanity) is used for blog/content.
8. Domain DNS is (or will be) managed through Cloudflare, proxied in front of Vercel.

---

## 6. User Roles

| Role | Description |
|---|---|
| **Guest** | Browse, search, view products, cart, guest checkout |
| **Registered Customer** | Guest capabilities + saved addresses, order history, wishlist |
| **Admin** | Full access to the custom admin panel |
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
| Login / Register / Forgot Password | Authentication flows |
| Blog / Recipes / Guides | Content marketing |
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
- Site-wide search with autocomplete, powered by Meilisearch/Algolia.
- Same filter/sort options as category pages.

### 8.4 Shopping Cart
- Persistent cart (Redis/session-backed for guests, database-backed for logged-in users).
- Mini-cart accessible from header.

### 8.5 Checkout
- **Guest checkout must be supported.**
- Shipping → Shipping method → Payment → Review → Confirm, with tax/shipping/total shown clearly before payment.

### 8.6 Payments
- Stripe via hosted Elements/Checkout.
- Optional Apple Pay/Google Pay.
- Order status updates automatically via payment webhook events.

### 8.7 User Accounts
- Email/password registration and login; optional social login.
- Account dashboard: orders, addresses, wishlist, settings.

### 8.8 Order Management & Tracking
- Status: Processing → Shipped → Delivered (plus Cancelled/Refunded).
- Tracking number display; itemized order detail view.

### 8.9 Reviews & Ratings
- Star rating + written review on purchased products; admin moderation before publishing.

### 8.10 Wishlist
- Save products; move to cart.

### 8.11 Promotions, Discounts & Coupons
- Coupon codes (percentage, fixed, free shipping) via the admin panel.
- Automatic sales on selected products/categories; free shipping threshold.

### 8.12 Shipping & Tax
- Shipping cost by destination/weight/method.
- Tax calculation via TaxJar or Avalara.

### 8.13 Inventory Management
- Real-time stock tracking per variant; low-stock alerts; configurable backorders.

### 8.14 Content / Blog
- Managed via headless CMS; posts link to related products.

### 8.15 Notifications
- Transactional emails via SendGrid/Postmark, sent through the BullMQ job queue.

### 8.16 Admin Panel (Custom-Built)
- Full product/order/customer/coupon management; sales reporting; RBAC with mandatory 2FA; gated by Cloudflare Access.

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

## 10. Backend & API Architecture

- Custom REST or GraphQL API built within the Next.js project (API Routes/Route Handlers/Server Actions) — see Section 2.1 for request flow.
- Rendering strategy tied to Section 3.1; authentication per Section 4.3, enforced server-side on every request.
- Database schema fully owned via Prisma migrations.
- Admin panel is a separate authenticated section, additionally gated by Cloudflare Access.

---

## 11. Third-Party Integrations

| Integration | Purpose | Notes |
|---|---|---|
| **Cloudflare** | WAF, DDoS protection, Bot Management, rate limiting, DNS, edge cache, optional Zero Trust Access for admin | See Section 4.1 |
| Stripe | Payment processing | Confirm if a second processor is also required |
| Shipping carrier APIs (USPS/UPS/FedEx) | Real-time shipping rates and labels | Optional for v1 |
| TaxJar or Avalara | Sales tax calculation | Required |
| SendGrid or Postmark | Transactional email delivery | Required |
| Google Analytics 4 | Traffic and conversion tracking | Load deferred per Section 3.6 |
| Meta/Facebook Pixel | Ad retargeting | Optional |
| Klaviyo or Mailchimp | Email marketing, abandoned cart flows | Optional |
| Sanity or Contentful | Headless CMS for blog/content | Recommended |
| Google Search Console | SEO monitoring | Recommended |

---

## 12. Design Requirements

- Brand guidelines (logo, color palette, typography) supplied separately.
- Component-based design system; mobile-first breakpoints.
- High-quality, consistent product photography; zoom on PDP.

---

## 13. Compliance & Legal

- Cookie consent banner if serving regions requiring it (GDPR/CCPA) — confirm target markets (Section 19).
- Privacy Policy and Terms of Service reviewed by the business owner (and legal counsel if available).
- Data minimization — only collect and store what's actually needed.

---

## 14. Analytics & Reporting

- GA4 e-commerce tracking.
- Custom admin panel sales reporting (Section 8.16).
- Cloudflare Analytics for edge traffic/security events.

---

## 15. Testing & QA

- Unit tests for cart/checkout/pricing logic.
- E2E tests (Playwright/Cypress) for core flows.
- Cross-browser/device QA; load testing before launch and major sales.
- Security testing per Section 4.10.
- UAT with the business owner before go-live.

---

## 16. Deployment & DevOps

- Git-based version control (GitHub).
- CI/CD via Vercel: PR previews, production deploy on merge to `main`.
- CI runs performance checks (Section 3.8) and dependency scans (Section 4.8) on every PR.
- Separate staging and production environments and credentials.
- Cloudflare configuration (WAF rules, cache rules, Access policies) treated as part of the deployable configuration, documented and version-controlled where possible (e.g., via Terraform or Cloudflare's API) rather than only changed by hand in the dashboard.

---

## 17. Suggested Timeline & Milestones

| Phase | Description |
|---|---|
| 1. Discovery & setup | Confirm open questions (Section 19), finalize design assets, set up infrastructure (database, Vercel, Cloudflare, CI/CD) |
| 2. Backend build | Data models, API, auth, payments, tax/shipping integrations |
| 3. Admin panel build | Product/order/inventory/customer management, RBAC, 2FA, Cloudflare Access gating |
| 4. Frontend build | Storefront pages per Section 7 |
| 5. Caching & edge configuration | Implement `CACHING.md` end to end — Redis, ISR revalidation, Cloudflare cache rules and purge wiring |
| 6. Integration & content | Load product catalog, connect CMS content, connect analytics |
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

1. **Target market/geography** — domestic only, or international shipping too?
2. **Payment processor** — Stripe only, or also PayPal/another processor?
3. **Shipping approach** — flat-rate, free-shipping threshold, or live carrier rates?
4. **Approximate catalog size** — how many products/SKUs at launch?
5. **Brand assets** — do logo, color palette, and product photography already exist?
6. **Domain name** — is one already registered, and is it ready to point at Cloudflare?
7. **Budget/timeline constraints** — any hard deadline?
8. **Marketing tools** — email marketing or live chat needed at launch?
9. **Multi-currency/multi-language** — needed now or later?
10. **Existing systems** — any current store whose data/products need to be migrated in?
11. **CMS for blog/content** — confirm a headless CMS is acceptable.
12. **Cloudflare plan tier** — Free, Pro, or Business — affects which WAF/Bot Management/Access features are available; confirm budget for this.

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

---

*End of document. Sections 3 and 4 are the two mandatory design pillars for this build. `CACHING.md` is the authoritative reference for the caching framework referenced throughout. Section 19 should be resolved before development starts.*
