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

## 5. Google auth checklist

### A) Google Cloud Console — [console.cloud.google.com](https://console.cloud.google.com)

1. Create/select a project  
2. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - App name: `RepForge`
   - User support email: your Gmail
   - Developer contact: your Gmail
   - Save  
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `RepForge Web`
   - **Authorized JavaScript origins:**
     - `https://oluwasegun-reforge.vercel.app`
     - `http://127.0.0.1:3000`
     - `http://localhost:3000`
   - **Authorized redirect URIs:**
     - `https://aypkrbltklzgokurasdy.supabase.co/auth/v1/callback`
   - Create → copy **Client ID** and **Client Secret**

### B) Supabase → Authentication → Providers → Google

1. Enable Google  
2. Paste Client ID + Client Secret  
3. Save  

Optional but useful: under Google provider, leave “Skip nonce check” off unless Google login fails with a nonce error.

## 6. Twitter / X auth checklist

Use **X / Twitter (OAuth 2.0)** in Supabase (recommended).

### A) X Developer Portal — [developer.x.com](https://developer.x.com)

1. Create/open a Project + App for RepForge  
2. **User authentication settings → Set up**
   - App type: **Web App**
   - **Request email from users: ON**
   - **Callback URL / Redirect URI (exact):**  
     `https://aypkrbltklzgokurasdy.supabase.co/auth/v1/callback`
   - **Website URL:**  
     `https://oluwasegun-reforge.vercel.app`
3. Save  
4. Open **Keys and tokens** → copy **OAuth 2.0 Client ID** and **Client Secret**

### B) Supabase → Authentication → Providers

1. Open **X / Twitter (OAuth 2.0)** (not the old OAuth 1.0a if both appear)  
2. Enable it  
3. Paste Client ID + Client Secret  
4. Save  

No Vercel env change needed for Twitter (same Supabase keys already live).

## 7. How to know it worked

- Live signup shows “Secure sign-in connected…”
- **Continue with Discord / Twitter / X** opens that provider
- After approve, you land on `/auth/callback` → Dashboard

## Email note

Email confirmation still needs Email provider ON in Supabase, and the same Vercel keys above.
