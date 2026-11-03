# RepForge database tables

Schema file: `supabase/migrations/001_repforge_schema.sql`

## Tables created

| Table | Purpose |
| --- | --- |
| `profiles` | User profile (linked to `auth.users`) |
| `workout_plans` | Saved workout plans |
| `workout_plan_exercises` | Exercises inside each plan |
| `workout_records` | Logged / completed sessions |
| `progress_entries` | Body weight + notes over time |
| `personal_records` | PRs per exercise |
| `notifications` | Cloud notification inbox |

Also included:

- Auto-create `profiles` row when someone signs up (`handle_new_user` trigger)
- Row Level Security so each user only sees their own data

## How to create them in Supabase

### Option A — SQL Editor (fastest)

1. Open [supabase.com](https://supabase.com) → your project  
2. Left menu → **SQL Editor** → **New query**  
3. Open `supabase/migrations/001_repforge_schema.sql` in Cursor  
4. Copy **all** of it → paste into SQL Editor → **Run**  
5. Confirm under **Table Editor** that the 7 tables appear  

### Option B — after `.env.local` is filled

Paste your Project URL + anon key into `.env.local`, restart `npm run dev`, then auth will talk to this project.

## Required before auth works

`.env.local` must have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
