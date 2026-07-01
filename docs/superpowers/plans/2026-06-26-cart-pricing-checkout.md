# Cart Pricing and Checkout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Phase 7 by making cart pricing, checkout quote totals, payment availability, shipping rules, coupons, rewards, and order totals backend-controlled.

**Architecture:** Add a `CheckoutPricingService` that resolves the active cart, validates purchasable items, computes subtotal/discount/shipping/tax/tip/total from database prices and settings, and returns a quote. `POST /api/v1/checkout/quote` and order creation both consume that same service so final order totals match the quoted totals.

**Tech Stack:** Laravel 13, PHPUnit, Sanctum APIs, Next.js App Router, TypeScript.

---

### Task 1: Backend Quote and Pricing Service

**Files:**
- Create: `C:\Users\Convenience\narya-backend\tests\Feature\Api\V1\CheckoutPricingTest.php`
- Create: `C:\Users\Convenience\narya-backend\app\Services\CheckoutPricingService.php`
- Create: `C:\Users\Convenience\narya-backend\app\Http\Controllers\Api\V1\CheckoutQuoteController.php`
- Modify: `C:\Users\Convenience\narya-backend\app\Http\Controllers\Api\V1\OrderController.php`
- Modify: `C:\Users\Convenience\narya-backend\routes\api.php`
- Modify: `C:\Users\Convenience\narya-backend\app\Http\Requests\Api\V1\StoreOrderRequest.php`

- [ ] Write failing tests for quote totals, free shipping threshold, disabled payment rejection, order/quote parity, inactive product rejection, and guest quote support.
- [ ] Run `php artisan test --compact tests/Feature/Api/V1/CheckoutPricingTest.php` and confirm it fails because quote route/service do not exist.
- [ ] Implement service, controller, route, payment validation, order reuse, and availability validation.
- [ ] Run the Phase 7 backend tests until green.

### Task 2: Frontend Quote Consumption

**Files:**
- Create: `C:\Users\Convenience\NARYA KITCHEN WARE\app\api\checkout\quote\route.ts`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\checkout\CheckoutClient.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\cart\CartClient.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\cart\CartDrawer.tsx`

- [ ] Add Next.js quote proxy that forwards auth token and guest cart session.
- [ ] Replace local checkout shipping/discount/total calculations with quote response values.
- [ ] Keep frontend display states but treat backend quote as authoritative.
- [ ] Run `npm.cmd run type-check`.

### Task 3: Phase Gate

**Files:**
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\BACKEND_DFD_PHASE_TRACKER.md`

- [ ] Run focused Phase 1-7 backend tests.
- [ ] Run `vendor/bin/pint --dirty --format agent`.
- [ ] Run route checks for `/api/v1/checkout/quote`, `/api/v1/cart`, and `/api/v1/orders`.
- [ ] Mark Phase 7 complete only after verification passes.
