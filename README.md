# RepForge

A free-first bodybuilding and fitness web app for adults 18+.

Discover exercises, build workouts, run a session timer with spoken alerts, and explore a demo dashboard — with a cinematic dark UI (charcoal + electric lime).

## Quick start (beginner-friendly)

1. Open a terminal in this folder (`repforge`).
2. Install dependencies (already done if you followed setup):

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. **Keep that terminal open.** When you see `✓ Ready`, open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

If the terminal returns to a new prompt right away, the server stopped. Run `npm run dev` again and wait until it says Ready (first start can take 1–2 minutes on slower disks).

## Add the hero video (optional)

1. Get a fitness video you are allowed to use (your own filming or a licensed clip).
2. Name it `hero-fitness.mp4`.
3. Put it here: `public/videos/hero-fitness.mp4`
4. Refresh the homepage — the hero will autoplay muted and loop.

Until you add a file, RepForge shows a polished illustrated hero instead. Details: `public/videos/README.md`.

## Supabase (later)

Copy `.env.example` to `.env.local` and add your **public** Supabase URL + anon key when you are ready for real accounts.

Without those values, the app runs in **Demo mode** (clearly labeled). No secrets belong in frontend code.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start local development |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Lucide icons
- Recharts (progress / dashboard charts)
- Supabase-ready data layer (credentials optional)
