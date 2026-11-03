# Where to put credentials

**File to edit:** `.env.local` (project root)

Open it in Cursor, paste values, press **Ctrl+S**, then restart:

```bash
npm run dev
```

## What goes where

| Field in `.env.local` | From Supabase | Required? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → `anon` `public` key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` | Optional |
| `SUPABASE_ACCESS_TOKEN` | Account → Access Tokens | Optional (CLI / automation) |
| `SUPABASE_PROJECT_REF` | The `xxxxx` in `https://xxxxx.supabase.co` | Optional |

## After keys are saved

1. Create tables: SQL Editor → run `supabase/migrations/001_repforge_schema.sql`  
   (or ask the agent again once keys are saved)  
2. Auth → URL Configuration → add:
   - `http://127.0.0.1:3000/auth/callback`
   - `http://localhost:3000/auth/callback`
3. Open http://127.0.0.1:3000/auth/signin — should say **Supabase connected**
