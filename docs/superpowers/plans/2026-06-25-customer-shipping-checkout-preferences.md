# Customer Shipping And Checkout Preferences Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save customer shipping/payment defaults in profile, prefill checkout, allow one-time checkout edits or explicit profile overwrite, and add delivery options, tips, and crypto payment.

**Architecture:** Laravel remains source of truth for saved profile defaults and order totals. The Next.js account page edits profile defaults through BFF routes; checkout hydrates defaults, lets customers edit per order, and optionally saves profile changes before placing an order.

**Tech Stack:** Laravel 13, Sanctum API, PHPUnit, Next.js App Router, React 19, TypeScript.

---

### Task 1: Backend Profile Defaults

**Files:**
- Modify: `app/Http/Controllers/Api/V1/ProfileController.php`
- Modify: `app/Http/Resources/Api/V1/UserResource.php`
- Modify: `app/Models/User.php`
- Create: migration for `users.default_payment_method`
- Test: `tests/Feature/Api/V1/ProfileTest.php`

- [ ] Add failing tests for saving default shipping address and payment method through `/api/v1/profile`.
- [ ] Implement default address upsert using existing `addresses` table.
- [ ] Include `default_address` and `default_payment_method` in `UserResource`.
- [ ] Run focused profile tests.

### Task 2: Backend Checkout Totals

**Files:**
- Modify: `app/Http/Requests/Api/V1/StoreOrderRequest.php`
- Modify: `app/Http/Controllers/Api/V1/OrderController.php`
- Modify: `app/Http/Resources/Api/V1/OrderResource.php`
- Create: migration for `orders.tip_total`
- Test: `tests/Feature/Api/V1/OrderTest.php`

- [ ] Add failing tests for express/pickup shipping, tip totals, and crypto payment method.
- [ ] Validate `delivery_option`, `tip_total`, and `payment_method=crypto`.
- [ ] Calculate shipping from delivery option and include tip in total.
- [ ] Save delivery option to `shipping_method`, save tip to `tip_total`, and expose both in order API.
- [ ] Run focused order tests.

### Task 3: Next API And Types

**Files:**
- Modify: `lib/types.ts`
- Modify: `app/api/auth/profile/route.ts`
- Modify: `app/api/orders/route.ts`

- [ ] Extend frontend user/order/address types.
- [ ] Add `GET /api/auth/profile` BFF route.
- [ ] Ensure checkout order BFF forwards `delivery_option` and `tip_total` to Laravel.
- [ ] Run frontend type-check.

### Task 4: Account Profile UI

**Files:**
- Modify: `components/account/AccountClient.tsx`

- [ ] Replace passive settings inputs with saved Shipping Details and Payment Details forms.
- [ ] Save defaults through `/api/auth/profile`.
- [ ] Show success/error feedback.
- [ ] Run frontend type-check.

### Task 5: Checkout UI

**Files:**
- Modify: `components/checkout/CheckoutClient.tsx`

- [ ] Hydrate shipping/payment defaults from authenticated user/profile.
- [ ] Add Delivery Options section with standard, express, pickup.
- [ ] Add Tip section with preset and custom amounts.
- [ ] Add Crypto to payment methods.
- [ ] Detect edited profile defaults and show `Save these changes to my profile` checkbox.
- [ ] Send selected delivery option, tip total, payment method, and optional profile save.
- [ ] Run frontend type-check.

### Task 6: Verification

**Files:**
- Backend and frontend touched files.

- [ ] Run Laravel focused tests: profile and order.
- [ ] Run Laravel Pint on touched PHP files.
- [ ] Run Next type-check.
- [ ] Note existing unrelated frontend lint failures if still present.
