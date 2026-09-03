# Goddess Pixie

Link-in-bio style site with a public gallery, PPV catalog, and a contact form. Built with
Next.js (App Router) + Tailwind, meant to deploy on Vercel.

## How the PPV flow works

Cash App has no public API for verifying payments to a personal account, so this is a manual
approval flow, not real-time checkout:

1. A visitor picks an item, enters their email, and is shown your Cash App `$cashtag`.
2. You get an email notification. Check Cash App for a matching payment.
3. Go to `/admin`, log in, and click **Approve & send link** on that order.
4. The buyer gets an emailed link to `/download/<token>` — a single-use, 3-day-expiring link
   that streams the file straight from Google Drive server-side. The buyer never sees the Drive
   URL or folder, and can't browse anything else in it.

## One-time setup before this works

You'll need to create a few accounts/keys — I can't provision third-party accounts for you.

1. **Vercel Redis (Upstash)** — In your Vercel project: Storage → Marketplace → Redis → connect
   to project. This auto-injects `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
2. **Resend** (resend.com) — for the contact form and order/delivery emails. Get an API key,
   verify a sending domain, set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
3. **Google Drive service account** — so the server can stream files without exposing them:
   - Create a Google Cloud project → enable the **Drive API**.
   - Create a Service Account → generate a JSON key.
   - Share each Drive file (or the folder) you want to sell with the service account's email
     as **Viewer**.
   - Set `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (paste the
     `private_key` from the JSON, keep the `\n` escapes as-is).
4. **Admin password** — set `ADMIN_PASSWORD` and a random `ADMIN_SESSION_SECRET` (any long
   random string) for the `/admin` dashboard.
5. Copy `.env.example` to `.env.local` for local dev, and add the same variables in Vercel
   project settings for production.

## Things you still need to fill in

- **`src/lib/links.ts`** — the OnlyFans, Twitter, All Things Worn, WishTender, and Throne URLs
  are placeholders (`TODO-handle`). Swap in the real profile links.
- **`src/lib/catalog.ts`** — add real PPV items: title, price, description, a teaser thumbnail,
  and the `driveFileId` (the id from the file's Drive URL: `drive.google.com/file/d/<this>/view`).
  Remember to share that file with the service account email first.
- **`public/images/gallery/`** — replace the placeholder SVGs with real approved images
  (hero avatar + gallery grid). Keep file sizes reasonable (compress large photos before adding).
- **Cash App handle** — currently `$pixieinthehoops7`, set via `NEXT_PUBLIC_CASHAPP_HANDLE`.

## Note on Cash App / Square

Cash App's parent company (Square) restricts adult-content commerce in its merchant terms. This
build treats Cash App as an informal, buyer-initiated payment (like a tip jar) that you confirm
manually — there's no real checkout integration, and there shouldn't be, to avoid violating those
terms. If you want a fully automated storefront later, that requires an adult-friendly payment
processor (e.g. CCBill, Segpay, Verotel).

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values above
npm run dev
```

## Deploying to Vercel

```bash
vercel
```

Or connect the GitHub repo in the Vercel dashboard. Add all the env vars from `.env.example` in
Project Settings → Environment Variables before the PPV/contact/admin features will work — the
public pages (hero, links, gallery placeholders) work without any of them.
