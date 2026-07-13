# Deploying Perfume Baltic

The store deploys as **one Node.js web service**: the Express API serves the
JSON API, the product images, and the built React storefront from the same
origin. The only external dependency is a PostgreSQL database.

Recommended (free) setup: **Neon** for Postgres + **Render** for hosting.

## 1. Create the database (Neon)

1. Go to <https://neon.tech> and sign up (free tier is enough).
2. Create a project (pick a region close to your Render region).
3. Copy the **connection string** — it looks like
   `postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`.

## 2. Deploy the app (Render)

1. Push this repository to GitHub (already done if you're reading this on GitHub).
2. Go to <https://render.com> and sign up.
3. Click **New → Blueprint** and connect this repository — Render reads
   [render.yaml](render.yaml) automatically.
4. When prompted, set the `DATABASE_URL` environment variable to the Neon
   connection string from step 1.
5. Click **Apply**. The first build takes a few minutes; it also creates the
   database tables (`db:push`) and seeds the sample products (`db:seed`,
   skipped automatically if products already exist).
6. Your store is live at `https://scent-outlet-XXXX.onrender.com`.

> **Note:** on Render's free plan the service spins down after ~15 minutes of
> inactivity, so the first visit after a quiet period takes ~30–60 seconds.
> Upgrade the plan if you need it always-on.

## Deploying elsewhere (VPS or any Node host)

Any host that runs Node.js ≥ 22 works:

```sh
corepack enable                # makes pnpm available
pnpm install --frozen-lockfile
pnpm run build:deploy          # typecheck + build API and storefront

export DATABASE_URL="postgresql://..."  # your Postgres connection string
pnpm run db:push               # create tables (first deploy only)
pnpm run db:seed               # seed sample products (skips if data exists)

export PORT=5000               # optional, defaults to 5000
pnpm run start
```

Then point your reverse proxy (nginx/Caddy) or domain at that port.

## What was changed to make this deployable

- The Express server now serves the built storefront (with an SPA fallback)
  when `dist/public/app` exists, so a single service hosts everything.
- `PORT` defaults to 5000 (Render sets its own automatically) and the Vite
  config no longer requires Replit-specific `PORT`/`BASE_PATH` variables.
- `pnpm run build:deploy` builds everything and copies the storefront build
  into the server's `dist/` folder.
