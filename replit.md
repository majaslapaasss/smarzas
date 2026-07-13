# Perfume Baltic

An affordable perfume storefront selling men's, women's, and unisex fragrances, with browsing, cart, and guest checkout.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/scent-outlet run dev` — run the storefront frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-products` — seed sample perfume products (skips if products already exist)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Frontend: React + Vite (`artifacts/scent-outlet`)
- Build: esbuild (CJS bundle)

## Where things live

- API contract: `lib/api-spec/openapi.yaml`
- DB schema: `lib/db/src/schema/products.ts`, `carts.ts`, `orders.ts`
- API routes: `artifacts/api-server/src/routes/products.ts`, `cart.ts`, `orders.ts`
- Product images served statically from `artifacts/api-server/public/images/` at `/api/images/*`
- Storefront frontend: `artifacts/scent-outlet/src/pages/`

## Architecture decisions

- No user accounts — carts are anonymous, identified by a random UUID generated client-side and stored in `localStorage`.
- Checkout does not process real payments; placing an order just records the order and clears the cart.
- Product images are AI-generated and served directly by the API server as static files (no object storage needed for this simple catalog).

## Product

- Browse perfumes by gender (men/women/unisex) and scent category, with search
- Product detail pages with scent notes, price, and stock
- Cart with quantity updates and removal
- Guest checkout that creates an order and shows an order confirmation page

## User preferences

- Light theme with a soft, warm "skin-tone" palette (blush, cream, warm beige, soft rose) — no harsh white/gray/black.

## Gotchas

- Re-run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change before using updated types in routes or the frontend.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
