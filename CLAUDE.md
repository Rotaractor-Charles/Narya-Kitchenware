# CLAUDE.md — Narya Kitchenware

This file provides guidance to Claude Code when working with code in this repository. It overrides any global CLAUDE.md for this project.

---

## Project Overview

**Narya Kitchenware** — a fully custom B2C kitchenware e-commerce site.

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS → deployed on **Vercel**
- **Backend:** Laravel 11 (PHP 8.2+) REST API → deployed separately (Railway / Render / Forge)
- **Database:** MySQL (Eloquent ORM)
- **Cache:** Redis (Laravel Cache facade)
- **Auth:** Laravel Sanctum (tokens in httpOnly cookies)
- **Queue:** Laravel Queues (Redis driver) + Laravel Horizon
- **Edge security:** Cloudflare in front of both Vercel and the Laravel host
- **Search:** Laravel Scout + Meilisearch

Full architecture, spec, and decisions are in the companion docs:
- `README.md` — how to build day to day (development rules, CI, deployment)
- `docs/SPEC.md` — full functional and technical specification
- `docs/CACHING.md` — authoritative caching framework
- `docs/DFD.md` — data flow diagrams
- `docs/SECURITY.md` — security guidelines, coding rules, and pre-deployment checklist
- `docs/ONBOARDING.md` — new developer / maintainer setup guide

**Read `README.md` at the start of every development task.**
**Read `docs/SECURITY.md` before any task touching auth, user data, payments, file uploads, or admin.**

---

## Repo Structure (Frontend — this repo)

```
/app                  → Next.js App Router pages & layouts
/components           → Reusable UI components
  /layout             → Navbar, Footer
  /cart               → CartDrawer
  /home               → HeroCarousel, ProductRow, QuickShortcuts
/lib                  → API client (calls Laravel REST API), utilities, cart context
/public               → Static assets
```

The backend lives in a **separate repo** (`narya-backend` — Laravel). This repo is frontend only.

---

## Brand & Design

- **Colors (Tailwind custom):** `terra` (green primary), `earth` (dark green), `sienna` (warm accent), `ivory` (off-white bg), `forest` (dark text/icons)
- **Logo:** SVG plant/herb mark (`LogoMark`) used in Navbar and Footer — size `width="17" height="23"`, stroke `#1C2E1C` (dark bg: `#F5F0E8`)
- **Typography:** `font-serif` for NARYA wordmark and headings, sans for body
- **Spacing/layout:** Tailwind utility classes only — no custom CSS files

---

## Key Conventions

- All API calls to Laravel go through `lib/api.ts` — never call the backend URL directly from components
- Authentication state via Sanctum token stored in httpOnly cookie (never localStorage)
- Use `next/image` for all product images — no raw `<img>` tags
- Server Components by default; `'use client'` only where interactivity requires it
- TypeScript strict mode is on — never use `any` without a comment explaining why
- No raw SQL anywhere — all data access goes through the Laravel API

---

## Do Not

- Don't push directly to `main` — always open a PR
- Don't store auth tokens in localStorage
- Don't add third-party scripts without checking bundle cost and lazy-loading them
- Don't cache cart, checkout, account, or admin data at any layer
- Don't write business logic in Next.js — it belongs in Laravel
- Don't call MySQL or Redis directly from Next.js — always go through the Laravel API
