# Narya Kitchenware — Security Guidelines

This document is the authoritative security reference for the Narya Kitchenware project. Read it before writing any feature that touches authentication, user data, payments, file uploads, or admin functionality. Work through the pre-deployment checklist before every production release.

---

## 1. Standards We Target

| Standard | Scope |
|----------|-------|
| OWASP Top 10 (2021) | High-level risk categories — must have zero unmitigated findings |
| OWASP ASVS Level 2 | Detailed verification requirements for auth, sessions, access control, input validation |
| OWASP Proactive Controls (C1–C10) | Developer-facing controls — follow these when building new features |

---

## 2. What Is Already Implemented

These controls are live in production code. Do not remove or weaken them without a team review.

### Authentication & Sessions
- **Token storage:** Laravel Sanctum token delivered in an httpOnly, Secure, SameSite cookie from the Next.js BFF — never localStorage
- **Token expiry:** 7 days (`SANCTUM_TOKEN_EXPIRY=10080` in `.env`). Override to shorter for higher-sensitivity environments
- **Token prefix:** `narya_` — enables GitHub secret scanning to catch accidental commits
- **Logout:** deletes the server-side token, clears the cookie, clears localStorage and sessionStorage (all five steps)
- **Password hashing:** bcrypt via Laravel's `'hashed'` cast (12 rounds)
- **Password policy:** minimum 8 characters, mixed case, numbers, `max:512` on every password field (login, register, password change)
- **Password change:** revokes all other active tokens so hijacked sessions cannot persist
- **Rate limiting:** login `throttle:10,1` (10 req/min), register `throttle:5,1` (5 req/min)

### Access Control
- All order, wishlist, and profile resources are scoped to `auth()->user()` — no IDOR possible
- Cart mutations: `guardItem()` verifies the item belongs to the resolved cart (user or guest session) before every update/delete
- Admin routes: dual-gated by `auth:sanctum` middleware **and** `permission:*` middleware
- `EnsureUserHasPermission` middleware includes a null guard — returns 401 before attempting any permission check

### Mass Assignment Protection
- `role` and `points_balance` are **not** in `$fillable` on the `User` model — cannot be set via user-controlled input
- All models use explicit `#[Fillable]` lists

### Input Validation
- Every write endpoint uses a FormRequest or inline `$request->validate()`
- File uploads require both `mimes` (extension) and `mimetypes` (actual file bytes via finfo) — prevents MIME bypass
- SVG uploads are blocked (XSS risk); allowed types: jpg, jpeg, png, webp, gif, max 5 MB
- Max file size validated before any processing

### Injection Prevention
- Eloquent ORM everywhere — no raw SQL in any controller
- No `DB::raw()` with user input

### Security Headers (Next.js)
Applied globally via `next.config.ts`:

```
Content-Security-Policy    default-src 'self'; script-src 'self' 'unsafe-inline'; …
X-Content-Type-Options     nosniff
X-Frame-Options            DENY
Referrer-Policy            strict-origin-when-cross-origin
Permissions-Policy         camera=(), microphone=(), geolocation=(), payment=()
X-Permitted-Cross-Domain-Policies  none
Strict-Transport-Security  max-age=31536000; includeSubDomains  (production only)
```

Private and API routes carry `Cache-Control: private, no-store`.

### CORS
- Backend `config/cors.php` restricts `allowed_origins` to `FRONTEND_URL` only
- `HandleCors` is prepended in `bootstrap/app.php` so it runs before all other middleware

### Email Enumeration Prevention
- Registration: generic error message when email already exists (`'email.unique'` message overridden in `RegisterRequest::messages()`)
- Do not add specific "email already taken" messages anywhere

### Security Logging
All auth events are recorded in `AuditLog` via `AuditLogService`:

| Event | Action string |
|-------|--------------|
| Successful login | `auth.login.success` |
| Failed login | `auth.login.failed` (includes email + IP, no actor) |
| Logout | `auth.logout` |
| Registration | `auth.registered` |
| Admin actions | `media_asset.created`, etc. |

AuditLog records: actor ID, action, IP address, user-agent, timestamps.

---

## 3. Coding Guidelines — New Features

Follow these rules whenever you add a feature. They map directly to the OWASP Proactive Controls.

### C1 — Define Security Requirements First
Before writing any feature that handles user data, auth, payments, or admin functions — write down what the security requirement is. Even a one-line comment like `// only the owning user can see this` counts.

### C2 — Use the Framework's Security Features
- Auth: Sanctum only — do not roll your own tokens
- Data access: Eloquent ORM only — never `DB::statement()` with user input
- Validation: `FormRequest` or `$request->validate()` — never trust raw `$request->input()` in business logic

### C3 — Secure All Data Access
- Every query that returns user-specific data must be scoped: `->where('user_id', auth()->id())`
- Admin-only data must be behind `permission:` middleware
- Never return a full model without a Resource class — Resources define what is safe to expose

### C4 — Encode and Escape Output
- React/Next.js handles XSS escaping in JSX by default — do not use `dangerouslySetInnerHTML` without sanitisation
- If rendering user-generated HTML (e.g., blog content), sanitise with a whitelist library before rendering
- Do not remove `dangerouslyAllowSVG: true` prohibition in `next.config.ts` — SVG from remote domains is an XSS vector

### C5 — Validate ALL Inputs
Rules that are mandatory on every endpoint:

```php
// Strings
'name'  => ['required', 'string', 'max:255']
'email' => ['required', 'email', 'max:255']

// Passwords — always both min and max
'password' => ['required', 'string', 'min:8', 'max:512']

// File uploads — always both rules
'file' => ['required', 'file', 'max:5120', 'mimes:jpg,jpeg,png,webp,gif', 'mimetypes:image/jpeg,image/png,image/webp,image/gif']

// Enums
'status' => ['required', 'in:active,inactive,draft']
```

Never skip `max:512` on password fields — unbounded bcrypt is a DoS vector.

### C6 — Digital Identity (Auth)
- Tokens: Sanctum only, httpOnly cookie only
- Never issue tokens without expiry
- After a password change: revoke all other tokens (`$user->tokens()->where('id', '!=', $currentId)->delete()`)
- After a sensitive operation (email change, role change): consider revoking and re-issuing the token

### C7 — Access Controls
Checklist when building any new resource endpoint:

- [ ] Is the route behind `auth:sanctum`?
- [ ] Is the query scoped to `auth()->user()` or does it require an explicit permission check?
- [ ] If admin-only: is it behind `permission:admin.*`?
- [ ] Could a numeric ID in the URL be guessed to access another user's data (IDOR)?

### C8 — Protect Data in Transit and at Rest
- HTTPS is enforced via HSTS — never serve sensitive data over HTTP in production
- PII (name, email, address, phone) must not appear in server-side logs
- Do not log password fields, tokens, or payment data

### C9 — Security Logging
Log every security-relevant event using `AuditLogService::record()`. Required events:

| When | Log it |
|------|--------|
| Successful login | ✅ already done |
| Failed login | ✅ already done |
| Logout | ✅ already done |
| New user registration | ✅ already done |
| Password change | Add if not present |
| Email change | Add if not present |
| Role or permission change | Add if not present |
| Admin creates/updates/deletes anything | ✅ pattern already in MediaAssetController |
| Suspicious / rejected requests | Log in middleware if you detect anomalies |

### C10 — Handle Errors Without Leaking Information
- `APP_DEBUG=false` in production (Laravel will suppress stack traces)
- API error responses must never include file paths, class names, or SQL
- Use `abort(403)` / `abort(404)` not raw exceptions with user-facing messages that reveal internals
- Validation errors are safe to return — they do not leak internals

---

## 4. Things We Have Deliberately Not Done (and Why)

Understand these before raising them as bugs — they are intentional trade-offs.

| Item | Decision |
|------|----------|
| Password minimum 12 chars (ASVS V2.1.1) | Currently 8. Increasing to 12 mid-flight forces password resets for all users. Raise this when a password policy migration is planned before launch. |
| Multi-Factor Authentication | `TwoFactorAuthenticatable` trait and `pragmarx/google2fa` are wired in. MFA UI has not been built. Prioritise for admin accounts before launch. |
| Account lockout after N failures | Per-IP rate limiting (`throttle:10,1`) stops scripted attacks. A true per-account lockout (e.g., lock after 10 failures) prevents distributed credential stuffing but requires an unlock/support flow. Implement before launch if threat model demands it. |
| `'unsafe-inline'` removed from CSP `script-src` | Next.js 14 hydration requires inline scripts. Removing it requires per-request nonce infrastructure. Acceptable now; revisit if a nonce solution is available. |
| Guest cart without auth | Cart GET/POST/PATCH/DELETE are unauthenticated to support guest checkout. IDOR is mitigated by `guardItem()` verifying cart ownership. This is by design. |

---

## 5. Pre-Deployment Checklist

Run through every item before every production release. Do not deploy until all boxes are checked.

### Environment
- [ ] `APP_DEBUG=false` in production `.env`
- [ ] `APP_ENV=production` in production `.env`
- [ ] `SANCTUM_STATEFUL_DOMAINS` set to the live frontend domain only
- [ ] `FRONTEND_URL` in backend `.env` set to the live Vercel URL (no trailing slash)
- [ ] `NEXT_PUBLIC_API_URL` in frontend `.env` set to the live Laravel URL
- [ ] `SANCTUM_TOKEN_EXPIRY` set (default 10080 = 7 days — adjust if needed)
- [ ] All secret keys (`APP_KEY`, `SANCTUM_SECRET`, payment keys) are unique, not copied from dev

### Dependencies
- [ ] Run `composer audit` in `narya-backend/` — fix any critical or high CVEs before deploying
- [ ] Run `npm audit` in the frontend repo — fix any critical or high CVEs before deploying
- [ ] No `^` or `*` version pins on security-sensitive packages (Sanctum, Fortify)

### Auth & Session
- [ ] Login rate limit is active (`throttle:10,1` on `/api/v1/auth/login`)
- [ ] Register rate limit is active (`throttle:5,1` on `/api/v1/auth/register`)
- [ ] Logout invalidates the server-side token
- [ ] Token cookie is httpOnly and Secure
- [ ] Sanctum `expiration` is not `null`

### Access Control
- [ ] Every admin route is behind both `auth:sanctum` and a `permission:*` middleware
- [ ] No endpoint returns another user's data without an ownership check
- [ ] `role` and `points_balance` are not in `User::$fillable`

### Security Headers
- [ ] CSP header is present on all responses (check with browser DevTools → Network → Response Headers)
- [ ] `Strict-Transport-Security` is present in production
- [ ] `X-Frame-Options: DENY` is present
- [ ] `X-Content-Type-Options: nosniff` is present

### CORS
- [ ] `config/cors.php` `allowed_origins` contains only the production frontend URL — not `*`

### File Uploads
- [ ] Both `mimes` and `mimetypes` rules are on all file upload endpoints
- [ ] SVG is not in the allowed MIME list

### Logging
- [ ] AuditLog table exists and is writable in production DB
- [ ] Test a login → check `audit_logs` table has a row
- [ ] Test a failed login → check `audit_logs` table has a row with `action = auth.login.failed`

### Data
- [ ] No real customer data in the staging or dev database
- [ ] `storage/` directory is not publicly accessible (files served through signed URLs or controlled routes only)

---

## 6. Ongoing Maintenance

| Task | Frequency |
|------|-----------|
| `composer audit` + `npm audit` | Every release, and after any `composer update` / `npm update` |
| Review `audit_logs` for unusual patterns | Weekly once traffic starts |
| Rotate `APP_KEY` and Sanctum secrets | Annually or after a suspected breach |
| Review and tighten CORS / CSP | Whenever a new third-party script or domain is added |
| Revisit password minimum length | Before launch |
| Revisit MFA for admin accounts | Before launch |

---

*Last updated: 2026-07-01. Maintained alongside `CLAUDE.md` and `README.md`.*
