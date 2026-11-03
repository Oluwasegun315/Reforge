# Connect Supabase backend to RepForge

## 1. Save your keys

Open **`.env.local`** in the project root (already created for you).

| What Supabase calls it | Paste into |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon** / **public** / **publishable** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role / secret access (optional) | `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ACCESS_TOKEN` |

Notes:

- **Anon = publishable** — one public key safe for the browser. Put it only in `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **service_role / access token** — secret. Never use `NEXT_PUBLIC_` for these. Leave blank unless you add server admin routes later.
- `.env.local` is **gitignored** so keys stay on your machine.

## 2. Supabase dashboard setup

1. [supabase.com](https://supabase.com) → your project  
2. **Authentication → URL Configuration**
   - Site URL: `http://127.0.0.1:3000`
   - Redirect URLs:  
     `http://127.0.0.1:3000/auth/callback`  
     `http://localhost:3000/auth/callback`
3. **Authentication → Providers** — enable:
   - Email (Confirm email ON)
   - Google, Discord, Twitter, GitHub (as needed)
4. Save `.env.local` → stop the terminal → run:

```bash
npm run dev
```

## 3. Check it worked

- Open http://127.0.0.1:3000/auth/signin  
- Auth panel footer should say **Supabase connected**  
- Email signup / social buttons use your real project  

If social login errors, that provider is not enabled or Client ID/Secret is missing in Supabase.
