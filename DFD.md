# Data Flow Diagrams — Narya Kitchenware

| | |
|---|---|
| **Document version** | 1.0 |
| **Date** | June 21, 2026 |
| **Companion documents** | `SPEC.md`, `CACHING.md`, `README.md` |

These diagrams render automatically when this file is viewed on GitHub (Mermaid is supported natively in `.md` files). They show the same data flow covered conceptually in `SPEC.md` Sections 8 and 10, in standard DFD form.

**Notation:**
- Rounded/stadium shape — external entity (a person or system outside the platform)
- Circle — process (numbered, matches the function numbers in `SPEC.md` Section 8 where applicable)
- Cylinder — data store (matches the database tables described in `SPEC.md` Section 2)
- Solid arrow — primary data flow
- Dashed arrow — secondary or triggered flow

---

## Level 0 — Context Diagram

The whole platform as a single process, showing everything that crosses the system boundary.

```mermaid
flowchart TB
  Customer([Customer])
  Admin([Admin / staff])
  Payment([Payment gateway - Stripe])
  Support([Support services - tax, shipping, email])
  System((Narya Kitchenware platform))

  Customer <-->|Browsing & orders| System
  Admin <-->|Store management| System
  System <-->|Payments| Payment
  System <-->|Tax, shipping, email| Support
```

---

## Level 1 — Customer Ordering Flow

Decomposes the customer-facing side of the platform: browsing, cart, and checkout.

```mermaid
flowchart LR
  Customer([Customer])
  Payment([Payment gateway])
  P1((1.0 Browse))
  P2((2.0 Cart))
  P3((3.0 Checkout))
  D1[(D1 Products)]
  D2[(D2 Cart store - Redis)]
  D3[(D3 Orders)]

  Customer --> P1
  P1 <--> D1
  P1 --> P2
  P2 <--> D2
  P2 --> P3
  P3 <--> D3
  P3 <--> Payment
  P3 -.Order confirmation.-> Customer
```

**Reading this diagram:** a customer's search hits the product catalog (D1) directly. Adding to cart reads and writes the Redis-backed cart store (D2) — this is the same store defined in `CACHING.md` Section 6. Checkout creates a row in Orders (D3) and talks to Stripe for payment, then sends a confirmation back to the customer.

---

## Level 1 — Catalog Management & Order Fulfillment

Decomposes the admin-facing side: keeping the catalog current and getting orders out the door.

```mermaid
flowchart LR
  Admin([Admin / staff])
  Shipping([Shipping carrier])
  Customer([Customer])
  P4((4.0 Catalog))
  P5((5.0 Fulfill))
  P6((6.0 Notify))
  D1[(D1 Products)]
  D3[(D3 Orders)]

  Admin --> P4
  Admin --> P5
  P4 <--> D1
  P5 <--> D3
  P5 <--> Shipping
  P5 -.Status update.-> P6
  P6 --> Customer
```

**Reading this diagram:** admin actions update the same Products store (D1) the customer flow reads from — this is exactly why `CACHING.md` requires cache invalidation to be wired into every admin save action, not left to a TTL. Order fulfillment (5.0) reads/writes Orders (D3), calls the shipping carrier for rates and labels, and triggers a notification (6.0) that goes out to the customer by email.

---

## How These Connect to the Rest of the Documentation

- **D1 (Products), D2 (Cart store), D3 (Orders)** map directly to the Firebase Firestore/Redis architecture in `SPEC.md` Section 2 and the caching layers in `CACHING.md` Section 2. D1 and D3 live in Firestore collections; D2 is Redis-only (never persisted to Firestore).
- Any arrow touching **D1 or D3 from an admin action** is exactly the trigger point described in `CACHING.md` Section 7 (on-demand ISR revalidation + Cloudflare purge) — if a new admin feature writes to either store, its cache invalidation needs to be wired up the same way.
- The **Payment gateway** and **Shipping carrier** external entities correspond to the Stripe and carrier integrations listed in `SPEC.md` Section 11.

---

*These are living diagrams — if a future feature changes how data moves through the system (e.g., adding a wholesale/B2B flow per `SPEC.md` Section 18), update the relevant diagram here rather than letting the documentation drift from the actual implementation.*
