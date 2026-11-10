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

## Design

One direction, **Flow**: white and orange, General Sans, soft 10px buttons. The navigation is a floating
pill that shrinks to icons while you scroll, and its orange highlight glides between tabs. Pages slide
forward into detail pages and back out of them, and list rows morph into their detail pages (View
Transitions). Tokens live in `src/app/global.css`; everything respects `prefers-reduced-motion`.

## Routes

- `/` — public home page (`features/landing`). Every call to action opens the overview; signed-out visitors
  go through sign-in first and come back to the page they asked for.
- `/overview` — the dashboard. Every other app page (`/invoices`, `/products`, `/analyze`, `/analyses/:id`,
  `/settings`) sits behind sign-in.

## Structure

```
src/
├── app/           entry, router (lazy routes), providers, error boundary, preview fixture server
├── features/
│   ├── landing/   public home page (inbox animation, price chart)
│   ├── auth/      Clerk facade (useAccount) + preview provider, SSO pages, RequireAuth
│   ├── shell/     floating pill navigation, page-slide direction tracking, user menu
│   ├── dashboard/ spend headline + Recharts area chart (7 / 14 / 30 days), latest invoices
│   ├── invoices/  list, detail (vendor, lines, totals), presigned document download/upload
│   ├── products/  catalog, stepped price-history chart, purchases table
│   ├── analysis/  connect Gmail, background run status (polling), session review + re-run on the same thread
│   └── settings/  photo & name (Clerk), Gmail connection, devices, account deletion
└── shared/        ui kit (plain CSS Modules), http client, money (integer cents) and date helpers
```

Money arrives from the API as integer cents (`*Cents`) and is only converted for display in `shared/lib/money.ts`.
