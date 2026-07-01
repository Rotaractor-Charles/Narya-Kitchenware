# Catalog and Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Phase 6 by making catalog publishing, media, variants, taxonomy, reviews, and inventory changes backend-controlled and auditable.

**Architecture:** Keep the existing product/category/brand/tag/attribute/review controllers and add the missing catalog guarantees incrementally. Products gain a `status` workflow while retaining `is_active` compatibility, stock changes are represented by `inventory_movements`, admin catalog writes record audit logs, and Next.js admin proxies revalidate product/catalog cache tags after mutations.

**Tech Stack:** Laravel 13, PHPUnit, Sanctum admin APIs, Next.js App Router, TypeScript.

---

### Task 1: Backend Catalog Guarantees

**Files:**
- Create: `C:\Users\Convenience\narya-backend\tests\Feature\Api\V1\Admin\CatalogInventoryTest.php`
- Create: `C:\Users\Convenience\narya-backend\app\Models\InventoryMovement.php`
- Create: `C:\Users\Convenience\narya-backend\database\migrations\2026_06_26_142000_add_status_to_products_table.php`
- Create: `C:\Users\Convenience\narya-backend\database\migrations\2026_06_26_142100_create_inventory_movements_table.php`
- Modify: `C:\Users\Convenience\narya-backend\app\Models\Product.php`
- Modify: `C:\Users\Convenience\narya-backend\app\Http\Resources\Api\V1\ProductResource.php`
- Modify: `C:\Users\Convenience\narya-backend\app\Http\Controllers\Api\V1\ProductController.php`
- Modify: `C:\Users\Convenience\narya-backend\app\Http\Controllers\Api\V1\Admin\ProductController.php`
- Modify: `C:\Users\Convenience\narya-backend\routes\api.php`

- [ ] Write failing tests for public status filtering, full admin product creation, inventory adjustment, audit logs, threshold low-stock filtering, and customer authorization.
- [ ] Run the test and confirm it fails for missing `status`, missing inventory movement API, and missing audit behavior.
- [ ] Add migrations/model/controller changes and run the test until green.

### Task 2: Frontend Admin Wiring

**Files:**
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\lib\types.ts`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\lib\products.ts`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\admin\ProductForm.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\components\admin\ProductsTable.tsx`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\app\api\admin\products\route.ts`
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\app\api\admin\products\[id]\route.ts`

- [ ] Add `status`, `low_stock_threshold`, and inventory fields to frontend types/mapping.
- [ ] Wire product form status and low-stock threshold to backend payloads.
- [ ] Revalidate `products`, `homepage`, and `content` tags after admin product mutations.
- [ ] Run `npm.cmd run type-check`.

### Task 3: Phase Gate

**Files:**
- Modify: `C:\Users\Convenience\NARYA KITCHEN WARE\BACKEND_DFD_PHASE_TRACKER.md`

- [ ] Run focused Phase 1-6 backend tests.
- [ ] Run `vendor/bin/pint --dirty --format agent`.
- [ ] Run route checks for public/admin products and inventory adjustment.
- [ ] Mark Phase 6 checklist complete only after verification passes.
