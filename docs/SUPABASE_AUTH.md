# Connect Supabase + Discord to RepForge

## 1. Local keys (`.env.local`)

| What Supabase calls it | Paste into |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon** / **public** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

Also set:

```
NEXT_PUBLIC_SITE_URL=https://oluwasegun-reforge.vercel.app
```

Restart `npm run dev` after saving.

## 2. Vercel (required for live users)

This is the #1 reason Discord shows “needs Supabase” on the live site.

In **Vercel → Project → Settings → Environment Variables** (Production + Preview):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://aypkrbltklzgokurasdy.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon/public key |
| `NEXT_PUBLIC_SITE_URL` | `https://oluwasegun-reforge.vercel.app` |

Then **Deployments → … → Redeploy** (do not skip rebuild).

## 3. Supabase Auth URLs

**Authentication → URL Configuration**

- Site URL: `https://oluwasegun-reforge.vercel.app`
- Redirect URLs:
  - `https://oluwasegun-reforge.vercel.app/auth/callback`
  - `http://127.0.0.1:3000/auth/callback`
  - `http://localhost:3000/auth/callback`

## 4. Discord provider checklist

### A) Discord Developer Portal → OAuth2

1. Redirect URL (exact):
   `https://aypkrbltklzgokurasdy.supabase.co/auth/v1/callback`
2. **Public Client = OFF** (RepForge is a website; Supabase needs the Client Secret)
3. Copy **Client ID** + **Client Secret** into Supabase

If your Client Secret was shared in a screenshot, **reset/regenerate** it in Discord, then paste the new secret into Supabase.

### B) Supabase → Authentication → Providers → Discord

1. Enable Discord
2. Paste Client ID + Client Secret
3. Save

## 5. How to know it worked

- Live signup page footer should **not** say social login is offline
- **Continue with Discord** should open Discord (not a red “needs Supabase” message)
- After approve, you land on `/auth/callback` → Dashboard

## Email note

Email confirmation still needs Email provider ON in Supabase, and the same Vercel keys above.
