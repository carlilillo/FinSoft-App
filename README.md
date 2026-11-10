# FinSift — client

Vite + React 19 + TypeScript (strict) single-page app for FinSift: sign in with Google, Apple or GitHub,
connect Gmail, let the background agent extract your invoices, and explore spend, invoices, products
and price history.

## Getting started

```bash
pnpm install
cp .env.example .env    # VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY
pnpm dev
```

**Design review without any credentials:** `VITE_PREVIEW_MODE=true pnpm dev` (or just leave the Clerk key
empty in development). Every API call is answered by `src/app/preview/fixture-server.ts` with realistic
English/Spanish data, including a simulated background analysis.

| Script       |                                                                                     |
| ------------ | ----------------------------------------------------------------------------------- |
| `pnpm check` | typecheck + ESLint + Prettier + Vitest                                              |
| `pnpm build` | production build (route-level code splitting; Recharts only loads with chart pages) |

### Clerk setup

Custom UI only (no Clerk components). In the Clerk dashboard enable **Google, Apple and GitHub** as the only
sign-in options (no email), and add `http://localhost:5173` to the allowed origins. Flows use the
`@clerk/react` v6 hooks: `signIn.sso()` → `/sso-callback` (`HandleSSOCallback`) → `/sign-up/continue` when
a provider doesn't share the required fields.

## Design lab (temporary)

Seven directions are live on the real screens. Use the floating switcher (bottom-right, dev only or `?designlab`)
or **Alt + ← / →**:

1. **Ledger** · 2. **Signal** · 3. **Paper Trail** · 4. **Apricot** · 5. **Grid** — professional and restrained
2. **Flow** — morphing pill nav, horizontal page slides and shared-element morphs (View Transitions), pointer glow
3. **Tangerine** — magnifying dock, magnetic buttons, odometer numbers, liquid backdrop, drag-to-dismiss dialogs, ⌘K palette

Once one is chosen: move its block from `features/design-lab/designs.css` into `app/global.css`, replace
`useDesign()` with the chosen config, and delete `features/design-lab` and the unused fonts in `index.html`.

## Structure

```
src/
├── app/           entry, router (lazy routes), providers, error boundary, preview fixture server
├── features/
│   ├── auth/      Clerk facade (useAccount) + preview provider, SSO pages, RequireAuth
│   ├── shell/     layout with 4 nav variants, route transitions, dock, command palette
│   ├── dashboard/ spend headline + Recharts area chart (7 / 14 / 30 days), latest invoices
│   ├── invoices/  list, detail (vendor, lines, totals), presigned document download/upload
│   ├── products/  catalog, stepped price-history chart, purchases table
│   ├── analysis/  connect Gmail, background run status (polling), session review + re-run on the same thread
│   ├── settings/  photo & name (Clerk), Gmail connection, devices, account deletion
│   └── design-lab/ TEMPORARY
└── shared/        ui kit (plain CSS Modules), http client, money (integer cents) and date helpers
```

Money arrives from the API as integer cents (`*Cents`) and is only converted for display in `shared/lib/money.ts`.
