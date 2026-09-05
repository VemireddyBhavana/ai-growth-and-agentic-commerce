# Sidebar Navigation, Real Data, Session FK & Performance — Implementation Plan

## Repository Research (Findings Summary)

### ❌ Issue #1: BROKEN SIDEBAR NAVIGATION (4/9 items go to WRONG pages)

**File:** [shell.tsx](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/web/src/components/dashboard/layout/shell.tsx#L36-L63>) `handleNavSelect` function

Current broken routing:

| Nav Key        | Current Destination         | Correct Destination             |
| -------------- | --------------------------- | ------------------------------- |
| `dashboard`    | `/dashboard` ✅             | `/dashboard`                    |
| `ai-assistant` | `/assistant` ✅             | `/assistant`                    |
| `products`     | `/assistant` ❌             | **`/products` (MISSING PAGE)**  |
| `orders`       | `/orders` ✅                | `/orders`                       |
| `customers`    | `/orders` ❌                | **`/customers` (MISSING PAGE)** |
| `analytics`    | `/analytics` ✅             | `/analytics`                    |
| `audit-trail`  | `/audit` ✅                 | `/audit`                        |
| `payments`     | `/checkout` ❌              | **`/payments` (MISSING PAGE)**  |
| `settings`     | (nothing, falls through) ❌ | **`/settings` (MISSING PAGE)**  |

Also: `useEffect` active-highlight doesn't recognize `/products`, `/customers`, `/payments`, `/settings` → no sidebar highlight for those.

**Existing pages (confirmed):** `/dashboard`, `/assistant`, `/orders`, `/analytics`, `/audit`, `/checkout`  
**Missing pages:** `/products`, `/customers`, `/payments`, `/settings`

---

### ❌ Issue #2: SESSION.CUSTOMER_ID FK FIX — **YOUR MIGRATION IS CORRECT, keep it**

- **Prisma schema Session model** ([schema.prisma](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/api/prisma/schema.prisma#L629-L657>)): ✅ Correct — `customer → Customer? @relation(fields: [customerId], references: [id])` with NO relation to `User`.
- **Migration SQL** ([20260905120000_fix_session_customer_fk/migration.sql](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/api/prisma/migrations/20260905120000_fix_session_customer_fk/migration.sql>)): ✅ Correct — `ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "session_user_fkey"` removes only the bad users FK, keeps the correct customers FK.
- **Verdict:** Your fix is RIGHT. Friend's original had a stray `Session.user User?` relation causing `customer_id` to point to both `users` and `customers` — impossible. **Leave the migration as-is. Do not revert.**

---

### ❌ Issue #3: MOCK-DATA DOMINATION — Pages show fake data

Audited data sources:

| Page / Component                                                                                                                                                                      | Data Source                                                                                                                                                    | Issue                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard** KPIs, Revenue, Orders                                                                                                                                                   | [hooks.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/web/src/lib/dashboard/hooks.ts#L33-L87>) `fetchWithFallback` | Default mode is `'hybrid'` ([config.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/web/src/lib/dashboard/config.ts#L66>)), which silently falls back to mock if API is down → user sees fake data. |
| **Dashboard Service** ([dashboard.service.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/api/src/services/dashboard.service.ts#L27-L76>)) | All sub-routes (`/kpi`, `/revenue`, `/orders`, `/ai-metrics`) call `getDashboardSnapshot()` **entire snapshot** N times each                                   | **Performance bug:** 5x duplicate DB queries per dashboard load = slowdown.                                                                                                                                                                    |
| **Orders Store** ([ordersStore.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/web/src/stores/ordersStore.ts#L5-L113>))                    | Default `orders: mockOrders` (2 hardcoded USD orders), `fetchOrders` tries API but fails silently → shows forever mock                                         | No API `x-store-id` header attached, no error handling                                                                                                                                                                                         |
| **Analytics Store** ([analyticsStore.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/web/src/stores/analyticsStore.ts#L25-L80>))           | **100% hardcoded mock data, no API call at all**                                                                                                               | Random `Math.random()` generation every load                                                                                                                                                                                                   |
| **Orders Page** ([page.tsx](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/web/src/app/orders/page.tsx#L19-L48>))                             | ❌ **NOT wrapped in DashboardShell**, uses standalone `bg-[#0a0a0a]`                                                                                           | No sidebar, no nav, no DashboardShell layout. User gets lost. Same check needed for Analytics.                                                                                                                                                 |

Backend endpoints **DO exist** and are wired correctly:

- [products.routes.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/api/src/routes/products.routes.ts#L18-L27>) — CRUD + variants + inventory (auth protected, needs `x-store-id` via `resolveMerchant`)
- [customers.routes.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/api/src/routes/customers.routes.ts#L4>) — list, get by id, update (MERCHANT/ADMIN only)
- Dashboard controller has `/dashboard`, `/dashboard/kpi`, `/dashboard/revenue`, `/dashboard/orders`, `/dashboard/ai-metrics`

---

### ⚠️ Issue #4: PERFORMANCE SLOWDOWN CAUSES

1. **Dashboard.service N+1 snapshot calls (see #3 above)** — biggest backend bottleneck
2. **OrdersPage NOT wrapped in DashboardShell** → loads without shell cache, may cause redundant auth + hydration cycles
3. **Frontend hybrid mode retry with mock fallback**: each widget makes a separate fetch attempt with 500ms retry, API 401/404 → falls back to mock 100ms delay → compounded sluggish feel
4. **Rate limiting**: Global limiter + AI limiter (10/min) are fine — not the cause

---

## Files and Modules (Scoped Changes)

### Frontend (apps/web)

1. `apps/web/src/components/dashboard/layout/shell.tsx`  
   → Fix `handleNavSelect` to route all 9 keys correctly; add active-highlight cases for products/customers/payments/settings
2. **Create 4 new pages:**
   - `apps/web/src/app/products/page.tsx` — Products catalog management (list, search, filter, CRUD actions)
   - `apps/web/src/app/customers/page.tsx` — Customer CRM (list, search, segments, detail)
   - `apps/web/src/app/payments/page.tsx` — Payments dashboard (transactions list, settlements, refunds, filters)
   - `apps/web/src/app/settings/page.tsx` — Store + account settings
3. `apps/web/src/app/orders/page.tsx`  
   → Wrap content in `<DashboardShell>` + `<ProtectedRoute>` (match dashboard page pattern)
4. `apps/web/src/app/analytics/page.tsx`  
   → Same DashboardShell wrap if missing
5. `apps/web/src/stores/analyticsStore.ts`  
   → Replace 100% mock with real API fetch to `/analytics` endpoint, fallback only on explicit error
6. `apps/web/src/stores/ordersStore.ts`  
   → Add `x-store-id` header to axios call, show real API data first, initialize orders as `[]` (not mock)
7. `apps/web/src/lib/dashboard/config.ts`  
   → Change default `dataSourceMode` from `'hybrid'` to `'api'` so real data is primary, mock fallback is silent-deprecated

### Backend (apps/api)

8. `apps/api/src/services/dashboard.service.ts`  
   → **Deduplicate snapshot queries:** cache the snapshot within one request scope, so `/kpi`, `/revenue`, etc. slice a single fetched snapshot instead of 5 DB hits
9. `apps/api/src/routes/payments.routes.ts`  
   → Verify and add (if missing) a list-transactions endpoint suitable for the `/payments` page
10. `apps/api/src/routes/dashboard.routes.ts`  
    → Confirm all 5 subpaths are registered (check if `/ai-metrics` route line exists)

---

## Implementation Steps (Dependency Order)

### Phase A — Nav Plumbing (Unblocks Clicks Immediately)

1. Fix [shell.tsx](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/web/src/components/dashboard/layout/shell.tsx>) `handleNavSelect` switch:
   - `products` → `/products`
   - `customers` → `/customers`
   - `payments` → `/payments`
   - `settings` → `/settings`
   - Update the `useEffect` pathname matcher with the same 4 keys
2. Create skeleton pages for `/products`, `/customers`, `/payments`, `/settings` inside DashboardShell so nav clicks produce real output (no 404 fallthrough). Add index exports if needed.
3. Wrap `orders/page.tsx` and `analytics/page.tsx` in `<ProtectedRoute><DashboardShell>...</DashboardShell></ProtectedRoute>` pattern to match dashboard.

### Phase B — Real Data (Dashboard + Stores)

4. Refactor [dashboard.service.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/api/src/services/dashboard.service.ts>): private `getCachedSnapshot(storeId)` map keyed by storeId → `getKpiMetrics`, `getRevenueData`, `getRecentOrders`, `getAiMetrics` all use it. Eliminates N+1.
5. Change `defaultDashboardConfig.dataSourceMode` in [config.ts](<file:///d:/Vemireddybhavana/Downloads/ai-growth-and-agentic-commerce-fixed%20(1)/apps/web/src/lib/dashboard/config.ts#L66>) from `'hybrid'` → `'api'`.
6. Rewrite `analyticsStore`: replace `generateRevenue()` and hardcoded snapshot with a `fetchAnalytics()` action using `apiClient.get('/analytics', { headers: {'x-store-id': ...} })`. Only show mock if API fails + flag.
7. Rewrite `ordersStore` initial state to `orders: []`, ensure `apiClient.get('/orders')` sends `x-store-id` header (via interceptor or per-call), API success replaces state, error → empty state + toast.

### Phase C — Page Feature Parity (4 Management Pages)

8. `/products/page.tsx`: Use `useQuery` → `/products`, add table, search bar, status tabs (Active/Draft/Archived), add product modal entrypoint. Reuse GlassCard + SectionHeader components.
9. `/customers/page.tsx`: Use `useQuery` → `/customers`, segments tabs, customer search, detail panel.
10. `/payments/page.tsx`: Query list endpoint → payments list, filter by date/risk/status, refund CTA, settlement summary cards.
11. `/settings/page.tsx`: Tab layout: Store Profile / Billing / AI Settings / Team. Prefill current store data, submit handlers PATCH to relevant endpoints.

### Phase D — Verify & Confirm Session FK

12. Re-run `npx prisma validate` (already passed), re-read migration SQL — **no changes needed, leave in place**.
13. (Optional) Add 1-line comment in `schema.prisma` near Session noting the FK was corrected in migration `20260905120000_fix_session_customer_fk` for future devs.

---

## Dependencies and Considerations

- **No new npm packages required.** Uses existing Next.js App Router, TanStack Query, Zustand, Axios, Prisma.
- **`x-store-id` header:** Existing pattern in dashboard hooks; propagate to orders + analytics stores. Use `NEXT_PUBLIC_STORE_ID` env var.
- **Authentication:** All 4 new pages go behind `<ProtectedRoute>` matching dashboard. Backend endpoints already require `authenticate + resolveMerchant`.
- **Session FK migration:** **Do NOT touch.** It is confirmed correct. We only optionally annotate for documentation.
- **Environment vars needed at runtime:** `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STORE_ID`.

---

## Validation (After Implementation)

1. **Navigation:** Click each of the 9 sidebar nav items → routes change correctly AND sidebar `activeNav` highlight syncs. No more Products→Assistant redirect.
2. **Pages exist:** Verify `/products`, `/customers`, `/payments`, `/settings` all render inside `DashboardShell` with sidebar visible, no 404.
3. **Orders + Analytics Shell:** Navigate to `/orders` and `/analytics` → sidebar is rendered, active-nav highlights correctly.
4. **Real data flow:** With API running + DB seeded, dashboard cards, orders table, and analytics panels should all show real DB rows (no ₹/USD mixing, use INR). In browser DevTools Network tab, confirm `/api/v1/dashboard`, `/api/v1/orders`, `/api/v1/analytics` return 200 with actual data.
5. **Performance:** With backend snapshot caching, dashboard load should trigger 1 snapshot SQL query (not 5).
6. **Tests:** Re-run `cd apps/api && npx vitest run` → 218+ tests still green.
7. **Prisma validate:** `npx prisma validate` passes (Session → Customer FK only, no stray Session.user).

---

## Risks and Handling

- **Risk A — No DB running during dev:** Backend API returns 500/connection errors. → Mitigation: `dataSourceMode: 'api'` is strict by default, but components should render empty states + toast "Waiting for database…" instead of broken UI. User can set `NEXT_PUBLIC_DATA_SOURCE_MODE=hybrid` temporarily.
- **Risk B — API shape mismatch between frontend types and backend response:** e.g. frontend `Order.status` is lowercase `'delivered'`, backend may use uppercase enum. → Mitigation: Orders store already has `(o.status || 'processing').toLowerCase()` mapping; extend for customers/payments similarly.
- **Risk C — Forgetting DashboardShell on a page causes layout mismatch:** → Mitigation: All 9 nav routes (including existing orders/analytics) follow the same ProtectedRoute→Shell→Content pattern. We normalize them in Phase A steps 2+3.
- **Risk D — Session FK accidentally reverted:** → Mitigation: We explicitly annotate the schema and do not modify the migration SQL. Document in code comment near Session model.
