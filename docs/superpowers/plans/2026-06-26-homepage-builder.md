# Homepage Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phase 5 so homepage sections are managed from the backend and rendered by the storefront without hardcoded business content.

**Architecture:** Use a single `homepage_sections` backend table with typed section kinds and JSON payloads. Admin APIs manage draft/published sections; the public endpoint returns only visible, published, currently scheduled sections. Next.js proxies admin writes, revalidates the `homepage`/`content` tags, fetches public homepage sections, and renders existing home components from backend payloads.

**Tech Stack:** Laravel 13, PHPUnit, Sanctum admin APIs, Next.js App Router, React 19, TypeScript.

---

### Task 1: Backend Homepage Section API

**Files:**
- Create: `C:\Users\Convenience\narya-backend\tests\Feature\Api\V1\Admin\HomepageBuilderTest.php`
- Create: `C:\Users\Convenience\narya-backend\app\Models\HomepageSection.php`
- Create: `C:\Users\Convenience\narya-backend\database\migrations\2026_06_26_140000_create_homepage_sections_table.php`
- Create: `C:\Users\Convenience\narya-backend\app\Http\Controllers\Api\V1\HomepageController.php`
- Create: `C:\Users\Convenience\narya-backend\app\Http\Controllers\Api\V1\Admin\HomepageSectionController.php`
- Modify: `C:\Users\Convenience\narya-backend\routes\api.php`
- Modify: `C:\Users\Convenience\narya-backend\app\Services\AdminPermissionService.php`

- [ ] Write failing PHPUnit tests for public filtering, admin CRUD, validation, authorization, and audit logs.
- [ ] Run `php artisan test --compact tests/Feature/Api/V1/Admin/HomepageBuilderTest.php` and confirm it fails because the model/routes do not exist.
- [ ] Add model, migration, controllers, route entries, permission navigation, validation, audit writes, and public section filtering.
- [ ] Run the homepage builder test until it passes.

### Task 2: Frontend Homepage Data Flow

**Files:**
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\lib\content.ts`
- Create: `C:\Users\Convenience\NARYA KITCHEN WARE\app\api\admin\homepage-sections\route.ts`
- Create: `C:\Users\Convenience\NARYA KITCHEN WARE\app\api\admin\homepage-sections\[id]\route.ts`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\app\(store)\page.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\home\HeroCarousel.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\home\CategoryTiles.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\home\FlashSale.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\home\Newsletter.tsx`

- [ ] Add typed `getPublicHomepageSections()` with `homepage` cache tags.
- [ ] Add admin proxy routes that revalidate `homepage` and `content` after successful writes.
- [ ] Convert home components to receive section payload props.
- [ ] Render homepage sections by backend type in sort order with safe empty states.
- [ ] Run `npm.cmd run type-check`.

### Task 3: Admin Homepage UI and Phase Gate

**Files:**
- Create: `C:\Users\Convenience\NARYA KITCHEN WARE\app\admin\homepage\page.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\admin\AdminSidebar.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\BACKEND_DFD_PHASE_TRACKER.md`

- [ ] Add admin homepage editor with create/edit/delete controls for section type, status, order, visibility, schedule, and JSON payload.
- [ ] Add sidebar link guarded by `admin.content.manage`.
- [ ] Verify backend tests, Pint, frontend type-check, and route registration.
- [ ] Mark Phase 5 checklist and sign-off log complete only after verification passes.
