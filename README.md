# AssessMate

Assessment planning for South African FET educators — **Mathematics** and **Life Sciences**, **CAPS (DBE)** and **IEB**.

Built for readable, step-by-step workflows (large text, plain language).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — Auth, Postgres, storage (Phase 2+)

## Getting started

For the full build plan (parents → users → iteration, SDLC, checklists), see **[docs/ROADMAP_AND_CHECKLIST.md](docs/ROADMAP_AND_CHECKLIST.md)**.  
For product context, see **[docs/NORTH_STAR.md](docs/NORTH_STAR.md)**.  
For architecture, disciplines, learning runbook, and the Documentation Gate, see **[docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)**.

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In **Project Settings → API**, copy the URL and `anon` key.
3. Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### 3. Run the database migrations

In the Supabase dashboard, open **SQL Editor** and run (in order):

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_question_bank_phase1a.sql`
3. `supabase/migrations/003_generation_phase1b.sql` — required before `POST /api/generate` can save

### 4. Configure authentication (important)

In Supabase **Authentication → URL configuration**:

| Setting | Value (local dev) |
|---------|-------------------|
| **Site URL** | `http://localhost:3000` |
| **Redirect URLs** | `http://localhost:3000/auth/callback` |

For easier testing with your parents, you can temporarily disable email confirmation:

**Authentication → Providers → Email** → turn off **Confirm email**

Turn it back on before a public launch.

If login fails after signup, the account may need email confirmation — check your inbox or confirm the user manually under **Authentication → Users**.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What works today (MVP bootstrap)

- Landing page
- Sign up / log in
- Dashboard with saved assessments
- 5-step assessment wizard (type → curriculum → scope → settings → advanced)
- Drafts saved to Supabase when you click **Save and finish for now**
- Structured generate API: `POST /api/generate` with `{ "assessmentId": "<uuid>", "dryRun": true }` (session required) — bank-first paper + derived memo JSON

## What comes next

See [docs/workflow-map.md](docs/workflow-map.md) and [docs/ROADMAP_AND_CHECKLIST.md](docs/ROADMAP_AND_CHECKLIST.md).

1. Review UI for generated papers (Phase 1C)
2. PDF/DOCX export matching Dad/Mom templates (Phase 1D)
3. Optional AI gap-fill when provider keys are set

## Project structure

```
src/
  app/              # Pages, routes, api/generate
  components/       # UI and wizard
  lib/              # Supabase, content, generation, types, actions
supabase/
  migrations/       # SQL schema
docs/               # North star, roadmap, architecture, learning runbook
```

## Deploy (Vercel)

1. Push to GitHub (`main` → `inmypurposetech-prog/assessment-builder`)
2. Import the repo on [vercel.com](https://vercel.com) (or `npx vercel` / `npx vercel --prod`)
3. Add environment variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. After the first deploy, copy the production URL and update **Supabase → Authentication → URL configuration**:
   - **Site URL:** `https://<your-vercel-domain>`
   - **Redirect URLs:** include `https://<your-vercel-domain>/auth/callback` (keep localhost entries for local dev)
5. Smoke-test: signup → login → wizard → save → confirm row in Supabase Table Editor

See `docs/learning/RUNBOOK.md` procedure **R4** and ADR-009.
