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

## 3. Payments (Stripe + Paysera)

Checkout requires payment. Both providers are configured purely through
environment variables (set them in the Render dashboard → your service →
Environment); no code changes are needed to go from test to live.

### Stripe (card payments)

1. Create an account at <https://dashboard.stripe.com> (test mode works
   without any business verification).
2. Copy the **secret key** from *Developers → API keys* — `sk_test_...` for
   test mode, `sk_live_...` for live.
3. Set `STRIPE_SECRET_KEY` to that value.
4. *(Optional but recommended for production)* Add a webhook endpoint at
   *Developers → Webhooks* pointing to
   `https://YOUR-DOMAIN/api/payments/stripe/webhook` with the
   `checkout.session.completed` event, and set `STRIPE_WEBHOOK_SECRET` to the
   endpoint's signing secret (`whsec_...`). Without it, payment is still
   confirmed when the customer returns to the site (the storefront verifies
   the Checkout session server-side), but the webhook also covers customers
   who close the tab right after paying.

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### Paysera (bank links / wallet)

1. Register a project at <https://bank.paysera.com> (*Projects and
   Activities → Add new project*).
2. Set `PAYSERA_PROJECT_ID` to the project number and
   `PAYSERA_SIGN_PASSWORD` to the project's sign password.
3. Keep `PAYSERA_TEST=1` while testing (Paysera lets you simulate payments);
   set it to `0` once the project is approved for live payments.
4. In the Paysera project settings, allow your site's address; the callback
   URL used is `https://YOUR-DOMAIN/api/payments/paysera/callback`.

> Paysera confirms payments via a server-to-server callback, so it only works
> on a publicly reachable URL (it cannot be tested on localhost without a
> tunnel).

If a provider's variables are not set, choosing it at checkout shows a clear
"not configured" error — the other provider keeps working.

## 4. Order emails

When a payment is confirmed, the customer automatically receives a bilingual
(LV/EN) confirmation email with the items, total, chosen parcel locker, and
phone number.

> **Important:** Render's **free tier blocks all outbound SMTP ports**
> (25/465/587), so Gmail/Inbox SMTP cannot work there — connections time
> out. Use Brevo's HTTPS API instead (free, 300 emails/day), or upgrade to
> a paid Render instance if you prefer classic SMTP.

### Brevo setup (recommended, ~10 minutes)

1. Sign up free at <https://www.brevo.com>.
2. Verify your sender: **Settings → Senders & Domains → Senders → Add a
   sender** — enter the address you want emails to come from (a Gmail
   address works); Brevo emails a confirmation code to it.
3. Create an API key: **Settings → SMTP & API → API Keys → Generate a new
   API key** — it looks like `xkeysib-...`.
4. In Render → Environment set:

| Variable | Value |
| --- | --- |
| `BREVO_API_KEY` | the `xkeysib-...` key |
| `EMAIL_FROM` | the verified sender address from step 2 |
| `EMAIL_FROM_NAME` | optional display name (default "Perfume Baltic") |
| `ORDER_NOTIFY_EMAIL` | optional — your address; receives a hidden copy of every confirmation, so you know about new orders instantly |

### Classic SMTP (paid instances / other hosts only)

Set `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASS`, and optional
`SMTP_FROM`. For Gmail, `SMTP_PASS` must be an App Password
(<https://myaccount.google.com/apppasswords>). Brevo takes precedence when
both are configured.

On startup the server logs `ORDER EMAILS ENABLED / BROKEN / DISABLED` with
the reason — check Render → Logs after changing these variables. If email
is not configured, orders still work; the email is simply skipped.

## 5. Managing the store

Products and orders are managed directly in the Neon console
(<https://console.neon.tech>): the **Tables** view edits rows visually and
the **SQL Editor** runs queries. Order statuses the storefront understands:
`pending` (awaiting payment), `paid`, `shipped`, `delivered`, `cancelled`.
Prices are stored in cents (2999 = €29.99).

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
