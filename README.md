# AssessMate

Assessment planning for South African FET educators — **Mathematics** and **Life Sciences**, **CAPS (DBE)** and **IEB**.

Built for readable, step-by-step workflows (large text, plain language).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — Auth, Postgres, storage (Phase 2+)

## Getting started

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

### 3. Run the database migration

In the Supabase dashboard, open **SQL Editor** and run the contents of:

`supabase/migrations/001_initial_schema.sql`

### 4. Start the dev server

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

## What comes next

See [docs/workflow-map.md](docs/workflow-map.md) and [docs/parent-interview-guide.md](docs/parent-interview-guide.md).

1. Parent interviews (Phase 0)
2. PDF ingest + question bank
3. AI-assisted paper assembly
4. Review editor + PDF/DOCX export

## Project structure

```
src/
  app/              # Pages and routes
  components/       # UI and wizard
  lib/              # Supabase, types, server actions
supabase/
  migrations/       # SQL schema
docs/               # Workflow map and interview guide
```

## Deploy (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables
