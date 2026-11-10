# Connect Supabase backend to RepForge

## 1. Save your keys

Open **`.env.local`** in the project root (already created for you).

| What Supabase calls it | Paste into |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon** / **public** / **publishable** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role / secret access (optional) | `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ACCESS_TOKEN` |

Also set:

```
NEXT_PUBLIC_SITE_URL=https://oluwasegun-reforge.vercel.app
```

Notes:

- **Anon = publishable** — one public key safe for the browser. Put it only in `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **service_role / access token** — secret. Never use `NEXT_PUBLIC_` for these.
- `.env.local` is **gitignored** so keys stay on your machine.

## 2. Supabase dashboard setup (required for Gmail)

1. [supabase.com](https://supabase.com) → your project  
2. **Authentication → URL Configuration**
   - **Site URL (production):** `https://oluwasegun-reforge.vercel.app`
   - **Redirect URLs** (add all of these):
     - `https://oluwasegun-reforge.vercel.app/auth/callback`
     - `http://127.0.0.1:3000/auth/callback`
     - `http://localhost:3000/auth/callback`
3. **Authentication → Providers → Email**
   - Enable Email
   - **Confirm email: ON** (so Gmail gets the confirmation link)
4. Optional but strongly recommended for reliable Gmail delivery:
   - **Project Settings → Auth → SMTP** — connect Resend, SendGrid, or Brevo
   - Default Supabase mail often lands in **Spam / Promotions** and has hourly rate limits

## 3. Vercel environment (required for live site)

In Vercel → Project → **Settings → Environment Variables**, add for Production:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | your project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/public key |
| `NEXT_PUBLIC_SITE_URL` | `https://oluwasegun-reforge.vercel.app` |

Then **Redeploy**. If these are missing, the confirm page shows “local only” and **no email is sent to Gmail**.

## 4. Check it worked

- Open the live site → Sign up with a real Gmail address  
- Confirm page should offer **Open Gmail** + **Resend confirmation email** (not “local only”)  
- Check Inbox **and Spam** for “Confirm your signup”  
- Tap the link → you should land on `/auth/callback` then Dashboard  

Locally:

```bash
npm run dev
```

Open http://127.0.0.1:3000/auth/signin — footer should say **Supabase connected**.
