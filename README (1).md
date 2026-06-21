# AI Development Guide — Narya Kitchenware

**Read this file at the start of every development task.** It defines how this project should be approached — not what to build (that's in `SPEC.md`) or how caching works specifically (that's in `CACHING.md`) — but how to build it day to day. If a prompt or task is ambiguous, follow the rules in this file by default.

---

## 1. Project Context

**Narya Kitchenware** — a fully custom B2C kitchenware e-commerce site. Next.js/React/TypeScript frontend and backend (one project), hosted on **Vercel**, fronted by **Cloudflare** for security and edge caching, deployed via **GitHub**.

- **Repository:** [github.com/Rotaractor-Charles/Narya-Kitchenware](https://github.com/Rotaractor-Charles/Narya-Kitchenware)
- **Default branch:** `main`

Companion documents in this repo:

- `SPEC.md` — full functional and technical specification (source of truth for *what* to build)
- `CACHING.md` — the caching framework (source of truth for *how caching works*, end to end)
- `DFD.md` — data flow diagrams showing how data actually moves through the system
- `HOMEPAGE.md` — section-by-section homepage layout
- `README.md` — this file (source of truth for *how* to build, day to day)

If any instruction in a prompt conflicts with these documents, **flag the conflict and ask before proceeding** — don't silently pick one over the other.

---

## 2. The Three Things Every Task Is Checked Against

### Speed
- Default to Server Components and Static Generation/ISR — client-side rendering only for genuinely interactive pages (cart, checkout, account).
- Stay within budget: LCP < 2.5s, INP < 200ms, CLS < 0.1, initial JS < 150KB gzipped per page.
- Use `next/image` for all images, no exceptions. Lazy-load anything below the fold.
- Don't add a third-party script without lazy-loading it and noting its bundle cost.
- Check for N+1 queries on any listing or product page before considering a database task done.

### Security
- No raw card data ever touches our servers — payments go through Stripe's hosted fields/Elements only.
- Passwords: bcrypt or argon2, never anything reversible.
- Sessions/tokens: httpOnly, Secure, SameSite cookies — never `localStorage`.
- Every API input gets schema-validated (Zod or equivalent) before it touches business logic.
- All database queries go through the ORM with parameterized queries — never raw, string-concatenated SQL.
- Admin panel actions require server-side role checks (never trust a client-side check alone) and the account has 2FA.
- Cloudflare sits in front of everything — don't bypass it, don't weaken its WAF/Bot Management settings to "make something work" without understanding why it was blocking it.
- Any new npm dependency: check it's maintained, run an audit, and have a reason for adding it.
- Secrets only ever go in environment variables — never in code, never committed.

### Caching
- **Follow `CACHING.md` exactly — don't improvise a one-off caching solution for a single page.**
- Never cache cart, checkout, account, or admin routes at any layer (browser, Cloudflare, Redis) — verify this by checking response headers, not by assuming.
- Any change to a product, category, or content page that should be reflected immediately needs its cache invalidation wired up (on-demand ISR revalidation + Cloudflare purge), not left to TTL alone.

Full detail on all three is in `SPEC.md` (Sections 3 & 4) and `CACHING.md`. This section is the quick-reference version to keep in mind on every task.

---

## 3. Hosting & Deployment Workflow (Vercel + Cloudflare + GitHub)

### Repository Setup (reference — already done for this project)
The local project folder is connected to GitHub like this:

```bash
git remote add origin https://github.com/Rotaractor-Charles/Narya-Kitchenware.git
git branch -M main
git push -u origin main
```

If a fresh clone or a new machine ever needs to be reconnected, this is the reference. Don't re-run `git remote add origin` if a remote is already configured — use `git remote set-url origin <url>` instead, or it will error.

Next step after this: import the repository into Vercel (New Project → Import Git Repository → select `Narya-Kitchenware`) so pushes to `main` start deploying automatically, and connect the domain in Cloudflare per the DNS section below.

- **Repo:** This local folder is connected to a GitHub repository (private). All work happens through git.
- **`main` branch = production.** Vercel is connected directly to this GitHub repo. A push/merge to `main` automatically triggers a production deployment.
- **Never commit or push directly to `main`.** Always work on a feature branch and open a pull request, even solo — this gets a Vercel Preview Deployment URL per branch for testing, and a clean rollback point.
- **Branch naming:** `feature/short-description`, `fix/short-description`, `chore/short-description`.
- **Before merging a PR:** check the preview deployment manually, and confirm CI passes (lint, type-check, tests, performance check, dependency audit — Section 5).

### DNS & Cloudflare
- Domain DNS is managed in **Cloudflare**, proxied ("orange-clouded") in front of Vercel — this is what puts Cloudflare's WAF, Bot Management, and rate limiting in the request path.
- **SSL/TLS mode: Full (Strict).** Vercel already terminates TLS with a valid certificate — do not use "Flexible" mode, it leaves the Cloudflare-to-Vercel hop unencrypted.
- WAF managed rulesets and Bot Management/Super Bot Fight Mode are enabled by default — don't disable them to debug something faster; figure out why a request is being blocked instead.
- Rate limiting rules exist on login, password reset, checkout, and public API routes — don't remove these without understanding the tradeoff.
- Cloudflare Cache Rules follow `CACHING.md` Section 4 exactly — the default posture is "respect origin headers," not "cache everything."
- Admin panel is additionally gated by Cloudflare Access — don't bypass this for convenience during development; use a proper dev/staging path instead.

### Environment Variables
- Live in the Vercel dashboard (Project Settings → Environment Variables), scoped per environment (Production / Preview / Development). Never hardcoded, never committed.
- Local development uses `.env.local` — confirm it's in `.gitignore` before the first commit.

### Architecture Note
- Keep the backend inside the same Next.js project (API Routes/Route Handlers/Server Actions) rather than a separate service — the whole app deploys as one unit through Vercel + GitHub. Only introduce a separate service for a concrete technical reason (e.g., a long-running background job that doesn't fit a serverless function), and treat that as a deliberate, documented exception.

---

## 4. Before Writing Any Code — Checklist

Run through this on every task, every prompt:

1. Does this touch the database? → Check indexing, avoid N+1 queries.
2. Does this touch user input? → Validate with a schema; never trust client input.
3. Does this touch auth, sessions, or the admin panel? → httpOnly cookies, server-side role checks, 2FA for admin.
4. Does this touch caching at any layer? → Follow `CACHING.md`; never cache personalized, cart, checkout, or admin data.
5. Does this add a new dependency? → Confirm it's maintained, run an audit, have a reason for it.
6. Does this add a third-party script to the frontend? → Lazy-load it, note the bundle size impact.
7. Does this add or change an image? → Use `next/image`, correct format, lazy-load if below the fold.
8. Does this touch a customer-facing page? → Confirm it still meets the Core Web Vitals budgets in Section 2.
9. Does this touch a secret or API key? → Belongs in environment variables, never in code.
10. Does this touch Cloudflare settings (WAF, cache rules, Access)? → Treat as configuration that should be documented/version-controlled, not a one-off dashboard click that nobody remembers later.
11. Is this going to `main`? → It shouldn't be — open a PR and let Vercel generate a preview first.

---

## 5. Code Quality & CI Standards

- TypeScript strict mode is on — don't weaken it to silence an error.
- ESLint + Prettier are enforced — fix lint errors, don't disable rules to get around them.
- Avoid `any`; if unavoidable, leave a comment explaining why.
- Keep components small and single-purpose.
- Commit messages follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- CI on every PR runs: lint, type-check, automated tests, a performance check (Lighthouse CI against the budgets in Section 2), and a dependency vulnerability scan. A PR failing any of these shouldn't merge without explicit sign-off.

---

## 6. Suggested Folder Structure

```
/app                  → Next.js App Router pages & layouts
/components           → Reusable UI components
/lib                  → Shared utilities, API clients, validation schemas, Redis client
/server               → API route handlers / server actions, business logic
/prisma               → Database schema & migrations
/public               → Static assets
SPEC.md                → Full functional & technical specification
CACHING.md             → Cache framework specification
DFD.md                  → Data flow diagrams
HOMEPAGE.md             → Homepage layout spec
README.md             → This file
.env.local             → Local secrets (gitignored, never committed)
```

---

## 7. When Uncertain

If a task is ambiguous, touches a security-, performance-, or caching-sensitive area, or seems to conflict with `SPEC.md` or `CACHING.md`, **pause and ask** rather than guessing. Reference the relevant section when asking, so the answer can be folded back into the documentation for next time.

---

## 8. Do Not

- Don't push or commit directly to `main`.
- Don't store secrets, API keys, or credentials in code or commit them to the repo.
- Don't store auth tokens in `localStorage`.
- Don't write raw, string-concatenated SQL.
- Don't add a third-party script without checking its performance cost.
- Don't skip 2FA or server-side role checks on admin functionality.
- Don't merge a PR with failing CI checks.
- Don't introduce a second backend service "just because" — the default is one unified Next.js app on Vercel.
- Don't set Cloudflare to "Cache Everything" globally, or disable WAF/Bot Management to make development more convenient.
- Don't cache cart, checkout, account, or admin responses at any layer — ever.
- Don't rely on TTL alone to invalidate a cache entry for data changed via an admin action — wire up explicit invalidation per `CACHING.md`.

---

*This file should evolve as the project does. If a recurring mistake or question comes up across multiple tasks, add a rule here so it doesn't have to be re-explained every time.*
