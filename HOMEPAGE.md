# Homepage Layout — Narya Kitchenware

| | |
|---|---|
| **Document version** | 1.0 |
| **Date** | June 21, 2026 |
| **Companion documents** | `SPEC.md` (Section 7, Site Map), `CACHING.md`, `DFD.md` |

**Source of this layout:** based on a general marketplace homepage shown as a reference for page rhythm and section structure — not as a literal template. That reference is a multi-vendor marketplace, so anything specific to multiple sellers (other vendors' "official stores," "sell on our platform" links, other-country links) has been dropped. What's kept is the proven *shape* of the page: hero → urgency/deal rails → category grid → curated rows → content/SEO block → footer. Content, categories, and section purpose below are specific to us.

---

## 1. Header (sticky)

- **Top utility bar** (thin, optional): customer service phone/hours, "Track your order" link.
- **Main header**: Logo (left) · Search bar (center — placeholder text "Search cookware, bakeware, brands…") · Account icon · Wishlist icon · Cart icon with item-count badge.
- No "sell with us" link — this is a single-vendor store, not a marketplace.

## 2. Category navigation

Desktop: persistent sidebar or a horizontal mega-menu under the header (engineer's call — sidebar works well on wide desktop, but a horizontal mega-menu adapts to mobile more naturally; recommend horizontal for consistency across breakpoints). Mobile: collapses into a hamburger/drawer menu.

Category list (kitchenware-specific, replaces the reference's general marketplace categories):
- Cookware (pots, pans, woks)
- Bakeware
- Cutlery & knives
- Small appliances
- Kitchen storage & organization
- Utensils & gadgets
- Dinnerware & tableware
- Coffee & tea
- Outdoor cooking & BBQ
- Cleaning & care
- New arrivals
- Sale

## 3. Hero banner

- Large rotating carousel with dot indicators — seasonal promotions, new collection launches, key value props (e.g., free shipping threshold).
- Side promo boxes next to it: "Need help? Call us," "Gift guide," "Track your order."

## 4. Quick category shortcuts

Horizontal, scrollable row of icon + label shortcuts (the reference's "Up to X% off / Awoof deals" row). Ours: "Up to 30% off cookware," "Bakeware essentials," "Knife sets," "Small appliance deals," "New arrivals," "Gift sets," "Clearance," "Free shipping over $X."

## 5. "Deals of the day"

- Section header banner + "See all" link.
- Horizontal row of 6 product cards: image, title, price with strikethrough original, discount badge.
- Pulls from the same coupon/automatic-sale admin functionality in `SPEC.md` Section 8.11 — not a separate system.

## 6. "Flash sale"

- Header with a live countdown timer ("Time left: HH:MM:SS") + "See all."
- Product cards include a discount badge, current + original price, and a stock-urgency indicator ("Only 3 left").
- **Engineering note:** the countdown is client-side JS ticking down to a server-provided end timestamp. The "items left" count must reflect real inventory (`SPEC.md` Section 8.13) — never a hardcoded or fake urgency number.

## 7. Shop by category (image tile grid)

Two rows of six image tiles, each linking to a category listing page:
- Row 1: Cookware, Bakeware, Cutlery & knives, Small appliances, Dinnerware, Storage & organization
- Row 2: Coffee & tea, Outdoor & BBQ, Utensils & gadgets, New arrivals, Gift sets, Clearance

## 8. "Top sellers"

Same card-row pattern as Section 5, sorted by best-selling (ties to the sort options in `SPEC.md` Section 8.1).

## 9. "New arrivals"

Same pattern, newest products first.

## 10. "Recipes & guides" (replaces the reference's other-vendor promo sections)

Instead of promoting other sellers' stores — which doesn't apply here — this slot showcases the latest 3–4 posts from the blog (`SPEC.md` Section 8.14): image, title, short excerpt, "Read more." This is the natural place to connect products to recipes and use-cases, and it's content the store owner already plans to produce.

## 11. Curated/merchandised rows (optional, repeatable)

E.g., "Gift sets," "Bestselling bakeware," "Editor's picks" — same card-row component as the sections above. **Recommend making these admin-configurable** (a simple "featured collection" tool in the admin panel) rather than hardcoded, so the store owner can rotate merchandising without needing an engineer for every change.

## 12. Brand/SEO content block

A few paragraphs of real, written copy about the brand and what's sold — not filler text. Serves the same SEO purpose as the long text block at the bottom of the reference page. **Should be editable through the headless CMS**, not hardcoded into the page component, so the business owner can update it without a deploy.

## 13. Newsletter signup

Email input + Subscribe button, wired into the email marketing integration (Klaviyo/Mailchimp — `SPEC.md` Section 11).

## 14. Footer

- **Need help:** Contact us, FAQ, Shipping & returns
- **Shop:** category links
- **About:** About us, Terms, Privacy
- **Connect:** social icons
- Payment method icons (via Stripe)

**Dropped from the reference:** "other countries" links, "sell on our platform" link, other-vendor official-store links — all marketplace-specific and not applicable to a single-vendor store (`SPEC.md` Section 5, Assumption 6).

---

## Implementation Notes for the Engineer

- **Build one reusable component.** Sections 5, 6, 8, 9, and 11 are all the same pattern — header + "See all" link + a row of product cards. Build a single `ProductRow` component (taking a title, a link, and a list of products) and reuse it everywhere, rather than building each section bespoke.
- **Caching:** the homepage is a strong ISR candidate — short revalidation window (60–120s is reasonable) since deals and flash-sale data change. Cloudflare's edge cache TTL should match. See `CACHING.md` Section 3 for the full reference.
- **Flash sale data must be real**, not hardcoded — countdown end-time and stock counts come from the database (`SPEC.md` Section 8.13), the same source the PDP uses.
- **"See all" links** route to the relevant category or filtered listing page (`SPEC.md` Section 7).
- **Mobile:** sidebar/mega-menu collapses to a drawer; horizontal product rows become swipeable carousels rather than wrapping to multiple rows.

---

*If the homepage layout changes meaningfully during build (sections added, removed, or reordered), update this file rather than letting it drift from what's actually shipped — same approach as the other docs in this repo.*
