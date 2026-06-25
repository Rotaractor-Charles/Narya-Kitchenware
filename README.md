# AI Development Guide — Narya Kitchenware

**Read this file at the start of every development task.** It defines how this project should be approached — not what to build (that's in `SPEC.md`) or how caching works specifically (that's in `CACHING.md`) — but how to build it day to day. If a prompt or task is ambiguous, follow the rules in this file by default.

---

## 1. Project Context

**Narya Kitchenware** — a fully custom B2C kitchenware e-commerce site built on a decoupled architecture:

- **Frontend:** Next.js (App Router) + React + TypeScript → deployed on **Vercel**
- **Backend:** Laravel (PHP 8.2+) REST API → deployed separately (Railway / Render / Laravel Forge + DigitalOcean)
- **Edge security & CDN:** Cloudflare sits in front of both Vercel and the Laravel host
- **Version control:** GitHub, deployed via CI/CD

- **Frontend repo / working directory:** `Narya-Kitchenware` (this project)
- **Backend repo:** `narya-backend` (separate Laravel project)
- **Default branch:** `main` on both repos

Companion documents in this repo:

- `SPEC.md` — full functional and technical specification (source of truth for *what* to build)
- `CACHING.md` — the caching framework (source of truth for *how caching works*, end to end)
- `DFD.md` — data flow diagrams showing how data moves through the system
- `README.md` — this file (source of truth for *how* to build, day to day)

If any instruction in a prompt conflicts with these documents, **flag the conflict and ask before proceeding** — don't silently pick one over the other.

---

## 2. The Three Things Every Task Is Checked Against

### Speed
- Default to Server Components and Static Generation/ISR on the Next.js side — client-side rendering only for genuinely interactive pages (cart, checkout, account).
- Stay within budget: LCP < 2.5s, INP < 200ms, CLS < 0.1, initial JS < 150KB gzipped per page.
- Use `next/image` for all images, no exceptions. Lazy-load anything below the fold.
- Don't add a third-party script without lazy-loading it and noting its bundle cost.
- Check for N+1 queries on any listing or product endpoint in Laravel before considering a database task done. Use Eloquent eager loading (`with()`).

### Security
- No raw card data ever touches our servers — payments go through Stripe's hosted fields/Elements only.
- Passwords: bcrypt (Laravel's default `Hash::make()`) — never anything reversible.
- Sessions/tokens: Laravel Sanctum issues API tokens stored in the database. The Next.js frontend stores the token in an **httpOnly, Secure, SameSite cookie** — never `localStorage`.
- Every API input gets validated via Laravel Form Requests (or `$request->validate()`) before it touches business logic.
- All database queries go through Eloquent with parameterized queries — never raw, string-concatenated SQL.
- Admin panel actions require server-side role checks (never trust a client-side check alone) and admin accounts have 2FA.
- Cloudflare sits in front of everything — don't bypass it, don't weaken WAF/Bot Management to "make something work" without understanding why it was blocking.
- Any new npm or Composer dependency: check it's maintained, run an audit, and have a reason for adding it.
- Secrets only ever go in environment variables (`.env` for Laravel, `.env.local` for Next.js) — never in code, never committed.

### Caching
- **Follow `CACHING.md` exactly — don't improvise a one-off caching solution for a single page.**
- Never cache cart, checkout, account, or admin routes at any layer (browser, Cloudflare, Redis) — verify this by checking response headers, not by assuming.
- Any change to a product, category, or content page that should be reflected immediately needs its cache invalidation wired up (on-demand ISR revalidation + Cloudflare purge), not left to TTL alone.

Full detail on all three is in `SPEC.md` (Sections 3 & 4) and `CACHING.md`. This section is the quick-reference version to keep in mind on every task.

---

## 3. Architecture Overview

```
Browser
  → Cloudflare (DNS, proxied)
      WAF, DDoS, Bot Management, rate limiting, edge cache
    → Vercel (Next.js frontend)
        Server Components, ISR/SSG, Next.js fetch cache
      → Laravel API (separate host — Railway / Forge)
          REST API, business logic, Eloquent ORM
        → Redis  — application cache (catalog, search, sessions, cart)
        → MySQL / PostgreSQL  — source of truth
        → External services (Stripe, email, search, shipping, CMS)
```

**Key principle:** Next.js handles rendering and the UI; Laravel owns all business logic, data writes, auth, and integrations. Next.js never writes directly to the database — it always goes through the Laravel API.

---

## 4. Hosting & Deployment Workflow

### Frontend (Next.js → Vercel)
- Connected to GitHub (`Narya-Kitchenware` repo). Push/merge to `main` triggers production deployment automatically.
- Every PR gets a Vercel Preview URL for testing before merge.
- Never push directly to `main` — always open a PR.

### Backend (Laravel → Railway / Forge)
- Connected to GitHub (`narya-backend` repo). Push/merge to `main` triggers deployment.
- Migrations run as part of the deploy pipeline (`php artisan migrate --force`).
- Separate staging and production environments with separate credentials.

### Branch naming
`feature/short-description`, `fix/short-description`, `chore/short-description`

### Before merging a PR
Check the preview deployment manually; confirm CI passes (lint, type-check, tests, performance check, dependency audit).

### DNS & Cloudflare
- Domain DNS managed in Cloudflare, proxied ("orange-clouded") in front of Vercel AND the Laravel host.
- **SSL/TLS mode: Full (Strict)** for both origins.
- WAF managed rulesets and Bot Management enabled — don't disable them to debug faster.
- Rate limiting rules on login, password reset, checkout, and public API routes.
- Admin panel additionally gated by Cloudflare Access.

### Environment Variables
- **Next.js:** Vercel dashboard → Environment Variables, scoped per environment. Local: `.env.local` (gitignored).
- **Laravel:** Railway/Forge dashboard, or `.env` file on the server. Local: `.env` (gitignored).
- Never hardcode secrets. Never commit `.env` or `.env.local`.

---

## 5. Before Writing Any Code — Checklist

Run through this on every task, every prompt:

1. Does this touch the database? → Check indexing, use Eloquent eager loading, avoid N+1 queries.
2. Does this touch user input? → Validate with a Laravel Form Request or `$request->validate()`; never trust client input.
3. Does this touch auth, sessions, or the admin panel? → httpOnly cookies on the frontend, Sanctum token auth on the API, server-side role checks, 2FA for admin.
4. Does this touch caching at any layer? → Follow `CACHING.md`; never cache personalized, cart, checkout, or admin data.
5. Does this add a new dependency (npm or Composer)? → Confirm it's maintained, run an audit, have a reason for it.
6. Does this add a third-party script to the frontend? → Lazy-load it, note the bundle size impact.
7. Does this add or change an image? → Use `next/image`, correct format, lazy-load if below the fold.
8. Does this touch a customer-facing page? → Confirm it still meets the Core Web Vitals budgets in Section 2.
9. Does this touch a secret or API key? → Belongs in environment variables, never in code.
10. Does this touch Cloudflare settings (WAF, cache rules, Access)? → Treat as configuration that should be documented/version-controlled, not a one-off dashboard click.
11. Is this going to `main`? → It shouldn't be — open a PR and let Vercel/CI generate a preview first.

---

## 6. Code Quality & CI Standards

### Next.js (Frontend)
- TypeScript strict mode is on — don't weaken it to silence an error.
- ESLint + Prettier enforced — fix lint errors, don't disable rules.
- Avoid `any`; if unavoidable, leave a comment explaining why.
- Keep components small and single-purpose.
- CI on every PR: lint, type-check, tests, Lighthouse CI (against budgets in Section 2), dependency scan.

### Laravel (Backend)
- PHP 8.2+, strict types enabled (`declare(strict_types=1)` at top of every file).
- PHP CS Fixer or Laravel Pint for code style — enforced in CI.
- PHPStan (level 8 target) for static analysis.
- Feature tests for every API endpoint (use `RefreshDatabase` + Laravel's HTTP test helpers).
- Unit tests for pricing, discount, and inventory logic.
- CI on every PR: Pint, PHPStan, PHPUnit, dependency audit (`composer audit`).

### Shared
- Commit messages follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- A PR failing any CI check shouldn't merge without explicit sign-off.

---

## 7. Folder Structure

### Next.js Frontend
```
/app                  → App Router pages & layouts
/components           → Reusable UI components
/lib                  → API client (calls Laravel), utilities, validation schemas
/public               → Static assets
SPEC.md               → Full functional & technical specification
CACHING.md            → Cache framework specification
DFD.md                → Data flow diagrams
README.md             → This file
.env.local            → Local secrets (gitignored)
```

### Laravel Backend (separate repo: narya-backend)
```
/app
  /Http/Controllers/Api   → API controllers
  /Http/Requests          → Form Request validation classes
  /Models                 → Eloquent models
  /Services               → Business logic (OrderService, InventoryService, etc.)
  /Jobs                   → Queued jobs (emails, cache invalidation, etc.)
  /Policies               → Authorization policies (RBAC)
/database
  /migrations             → Database schema migrations
  /seeders                → Seed data
/routes
  /api.php                → All API routes (versioned: /api/v1/...)
/config                   → Laravel config files
/tests
  /Feature                → API endpoint tests
  /Unit                   → Business logic unit tests
.env                      → Local secrets (gitignored)
```

---

## 8. API Communication (Next.js ↔ Laravel)

- All API calls from Next.js to Laravel go through a central `lib/api.ts` client — never call the Laravel base URL directly from components.
- API versioning: `/api/v1/` prefix on all Laravel routes from day one.
- Auth: Next.js sends the Sanctum token as a Bearer token in the `Authorization` header (stored in an httpOnly cookie, passed server-side).
- Laravel API responses always return JSON. Error responses follow a consistent structure: `{ message, errors? }`.
- Use Next.js `fetch` with `cache` and `next.revalidate` options on Server Component fetches for ISR behaviour — don't duplicate caching logic on the Laravel side for the same data.

---

## 9. Do Not

- Don't push or commit directly to `main` on either repo.
- Don't store secrets, API keys, or credentials in code or commit them.
- Don't store auth tokens in `localStorage` — httpOnly cookies only.
- Don't write raw, string-concatenated SQL — use Eloquent or query builder with parameterized bindings.
- Don't add a third-party script without checking its performance cost.
- Don't skip 2FA or server-side role checks on admin functionality.
- Don't merge a PR with failing CI checks.
- Don't skip Laravel Form Request validation and let raw `$request->all()` reach business logic.
- Don't set Cloudflare to "Cache Everything" globally, or disable WAF/Bot Management to make development more convenient.
- Don't cache cart, checkout, account, or admin responses at any layer — ever.
- Don't rely on TTL alone to invalidate a cache entry changed via an admin action — wire up explicit invalidation per `CACHING.md`.
- Don't use N+1 queries — always eager-load Eloquent relationships.

---

*This file should evolve as the project does. If a recurring mistake or question comes up across multiple tasks, add a rule here so it doesn't have to be re-explained every time.*
