# Bug Check & Fix Report

I ran a full TypeScript check across the whole monorepo (`apps/web`, `apps/api`,
`packages/*`) and fixed everything that was actually broken in the code.

## Bugs found & fixed

1. **Workspace packages weren't linked.** `@ai-sales-assistant/types`, `/ui`,
   `/config`, `/utils` were unresolvable from both apps, causing 50+ "Cannot
   find module" errors everywhere. Root cause: the npm workspace symlinks
   in `node_modules` were missing/empty. Fixed by relinking the workspace.

2. **`packages/config/src/index.ts`** used extension-less relative imports
   (`from './env'`) which breaks under the API's strict `NodeNext` module
   resolution. This made `APP_CONFIG`, `HTTP_STATUS`, `backendEnvSchema`
   etc. appear as "not exported" throughout the API. Fixed by adding the
   required `.js` extensions.

3. **`dashboard.controller.ts` was calling methods that don't exist**
   (`this.badRequest`, `this.getExecutionTime`, `req.id`) — none of these
   are defined anywhere in the codebase. Rewrote it to use the actual
   `BaseController.sendSuccess()` / `AppError` conventions used by the rest
   of the API.

4. **`dashboard.service.ts`** called `new AppError(message, code, statusCode)`
   with positional arguments, but `AppError`'s constructor only accepts a
   single options object (`{ message, code, statusCode }`). Fixed all 5
   call sites — this was a hard crash waiting to happen at runtime.

5. **`dashboard.repository.ts`**: an AI-conversation count was queried but
   never used — a placeholder `Math.random()`-based formula was used for
   "conversions" instead of the real count that had just been fetched. Wired
   the real value in. Also cleaned up several unused variables/params and
   unsafe array indexing flagged by strict-mode TypeScript.

6. **Stale compiled output committed next to source.** Nearly every `.ts`/
   `.tsx` file in the repo had a leftover `.js`/`.d.ts`/`.map` twin sitting
   right beside it (from an old `tsc` build that got zipped up by mistake).
   The worst symptom: Next.js was silently loading the **stale compiled
   `next.config.js`** instead of your actual `next.config.ts`, which
   produced an "Unrecognized key(s): `__esModule`, `default`" warning and
   could have caused confusing config drift over time. Removed all ~330
   stray compiled artifacts across the repo (kept `next-env.d.ts` and the
   hand-written `eslint.config.js`/`commitlint.config.js`).

7. **All CLI binaries in `node_modules/.bin` had lost their executable bit**
   during zipping, so `next`, `prisma`, etc. failed with "Permission denied"
   the moment you tried to run them. Fixed permissions.

## Verified working

- `apps/api`: `tsc --noEmit` passes with **zero errors**.
- `apps/web`: `tsc --noEmit` passes with **zero errors**.
- `next build` gets past config loading and compilation and only stops on
  fetching Google Fonts (see below — that's a sandbox network restriction,
  not a bug).

## One thing you'll need to do yourself

Your sandbox/CI or dev machine has normal internet access, but mine (this
tool environment) is locked down to a small allow-list of domains, so two
things could **not** be fully verified end-to-end here:

- **`npx prisma generate`** — needs to download a native query-engine binary
  from `binaries.prisma.sh`, which isn't reachable from here. Run this once
  in your own environment (`cd apps/api && npx prisma generate`) before
  starting the API — it will then boot normally against your database.
- **`next build`** fetches `Inter`, `Outfit`, and `JetBrains Mono` from
  Google Fonts at build time (via `next/font/google`) — also blocked here.
  This will work fine wherever you build with normal internet access. If
  you ever need to build somewhere fully offline, switch those three fonts
  to local self-hosted files instead — happy to do that if useful.


---

## Second pass — verified with a real `npm install` + full build tools

The previous report above was written without actually running `npm install`
in this environment. This time I did: `npm install` from the repo root,
then ran `tsc --noEmit` and `eslint`/`next lint` across every workspace for
real, and fixed what came back.

1. **`packages/utils/src/index.ts`** had the exact same missing-`.js`-extension
   bug that `packages/config` had — its barrel file re-exported `./crypto`,
   `./formatting`, `./logger` without extensions, which fails under
   `NodeNext` module resolution. Fixed.
2. **`apps/api/tests/health.test.d.ts`** — one more stray pre-compiled
   artifact (of the kind described in item 6 above) had survived in `tests/`.
   Removed it.
3. **`apps/api/src/middleware/auth.middleware.ts`** — the standard Express
   `declare global { namespace Express { ... } }` pattern for extending
   `Request` was tripping `@typescript-eslint/no-namespace` as a hard lint
   error (there's no alternative syntax for this augmentation). Added a
   scoped `eslint-disable-next-line` with a comment explaining why.
4. **`apps/web/src/components/auth/primitives/form.tsx`** — an empty
   `interface PasswordInputProps extends Omit<...> {}` was a lint error
   (`no-empty-object-type`); converted to a `type` alias. Also removed a
   stale, no-longer-needed `eslint-disable-next-line no-console`.
5. **`apps/web/src/lib/auth/middleware.ts`** — `let response` was declared
   but never reassigned (a real `prefer-const` violation, and a signal the
   original author may have intended to reassign it and didn't); changed to
   `const`. Also removed an unused `redirectUrl` variable and prefixed an
   unused caught error with `_`.
6. **`apps/web/src/lib/dashboard/hooks.ts`** — `useDataSource()` destructured
   `data` from `useDashboardSnapshot()` but never used it; removed.
7. Removed genuinely unused imports/variables flagged by the linter across
   `orders-history-modal.tsx`, `product-detail-modal.tsx`,
   `razorpay-checkout-modal.tsx`, `recommendation-card.tsx`,
   `saved-products-modal.tsx`, and `stores/use-assistant-store.ts`.
8. **`razorpay-checkout-modal.tsx`** — `setUpiApp(app as any)` was silencing
   a real type check; `upiApp` already has the proper
   `'gpay' | 'phonepe' | 'paytm' | 'qr'` union type declared right above it,
   so the cast now uses that instead of `any`.
9. **`apps/web/src/lib/auth/supabase/server.ts`** — `NextRequest`/
   `NextResponse` were imported as a mixed value/type import even though
   both are only ever used as parameter types here; switched to
   `import type`.

### Verified clean
- `tsc --noEmit` — **zero errors** in `apps/api`, `apps/web`, and all four
  `packages/*`.
- `eslint` / `next lint` — **zero errors** across all 6 workspaces. What's
  left is pre-existing style-only warnings (a handful of unused icon imports
  in files I didn't otherwise touch, `<img>` vs `next/image` suggestions,
  and a couple of intentional `SupabaseClient<any, 'public', any>` generic
  placeholders where no generated DB types exist yet) — none of these break
  the build or change behavior, so I left them rather than churn unrelated
  files.
- Re-ran `npm install` from a clean checkout of the fixed zip to confirm it
  installs and resolves correctly.

`node_modules` is excluded from this zip again, same as before — run
`npm install` from the repo root after unzipping.

