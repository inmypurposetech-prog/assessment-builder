# AssessMate — Learning Runbook

> **Purpose:** Your personal engineering & product journey log — processes you’ve done, what you learned, mistakes, and **follow-up courses/resources**. Use it as a runbook when repeating a task or onboarding your future self.  
> **Update:** After every non-trivial setup or debugging session (Documentation Gate).  
> **Last updated:** 11 July 2026

---

## How to use this runbook

1. When you finish a process (Supabase, Vercel, AI API, etc.), add a **Learning log** entry (template below).  
2. Add any **courses / docs / certifications** to the curriculum backlog.  
3. When you repeat a task, follow the **Runbook procedures** section — improve the steps if reality differs.  
4. In Cursor: *“Update `@docs/learning/RUNBOOK.md` with today’s learnings.”*

### Log entry template (copy)

```markdown
### YYYY-MM-DD — Short title
- **Context:** What were we trying to do?
- **Steps that worked:** …
- **Pitfalls:** …
- **Commands / links:** …
- **Follow-up learning:** course/doc to study
- **Discipline lens:** e.g. DBA, Backend, Support
```

---

## Curriculum backlog (courses & study)

Track intentional upskilling. Tick when done; add notes in the log.

### Cloud & Azure (your cert path)

- [ ] **AZ-104** Microsoft Azure Administrator — map labs to AssessMate Track B later
- [ ] **AI-102** (or AI-900 → AI-102) Azure AI Engineer — embeddings, Azure OpenAI, AI Search
- [ ] Microsoft Learn: Azure Blob, Entra External ID, App Service, Key Vault, Monitor

### Web engineering

- [ ] [Next.js Learn](https://nextjs.org/learn) — App Router (in progress via this project)
- [ ] TypeScript handbook — basics → intermediate
- [ ] [Supabase Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) + Auth SSR docs
- [ ] Next.js 16 docs: `proxy` vs deprecated `middleware`

### Data & AI

- [ ] RAG fundamentals (embeddings, chunking, retrieval)
- [ ] Structured outputs / JSON schema with LLMs
- [ ] Postgres + RLS deep dive
- [ ] Optional: `pgvector` tutorial

### Product, UX, quality

- [ ] Accessibility basics (WCAG 2.2 AA mindset) — forms, focus, contrast
- [ ] Product discovery / continuous interview habits
- [ ] Testing: Jest/Vitest + Playwright intro (add when Phase 2)

### Business / SA context

- [ ] POPIA basics for SaaS (educator data, no learner PII in MVP)
- [ ] PayFast (or chosen) payment integration docs — before Phase 4
- [ ] NSC vs assessment bodies (DBE/IEB/SACAI) — **done** (see log)

---

## Runbook procedures

### R1 — Create / connect Supabase project

1. Create project at [supabase.com](https://supabase.com) — region **Europe** (Frankfurt/Ireland); no SA region yet.  
2. Copy **Project URL** (`https://xxxx.supabase.co`) + **anon public** key → `.env.local`.  
3. Run `supabase/migrations/001_initial_schema.sql` in **SQL Editor**.  
4. Auth → URL config: Site URL `http://localhost:3000`; Redirect `http://localhost:3000/auth/callback`.  
5. For local testing: Providers → Email → disable **Confirm email** (re-enable before public launch).  
6. Verify: Table Editor shows `profiles`, `assessments`, `questions`.  
7. **You do not need local PostgreSQL** for AssessMate MVP — Supabase *is* Postgres.

**Learned:** Signup can succeed while login fails if email is unconfirmed — show clear errors; confirm user in Auth → Users or disable confirm for testing.

### R2 — Local app run

```bash
cd ~/Projects/assessmate
cp .env.example .env.local   # if needed
npm install
npm run dev
```

Open http://localhost:3000 — signup → dashboard → wizard → save.

### R3 — GitHub push

```bash
git status
git add …
git commit -m "…"
git push origin main
```

Repo: `https://github.com/inmypurposetech-prog/assessment-builder`

### R4 — Vercel deploy (Phase 0)

1. Ensure `main` is pushed to GitHub.  
2. Import GitHub repo on [vercel.com](https://vercel.com) **or** run `npx vercel` then `npx vercel --prod`.  
3. Set env vars (Production + Preview): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same values as `.env.local`).  
4. Deploy; copy production URL.  
5. Supabase → Authentication → URL configuration:  
   - Site URL = production origin (or keep localhost if still primarily local — then set Site URL to prod when parents use the live link).  
   - Redirect URLs: add `https://<prod>/auth/callback` **and** keep `http://localhost:3000/auth/callback`.  
6. Smoke-test signup/login/wizard/save on production; log result in `quality/TESTING_AND_ANALYTICS.md`.  
7. Update ROADMAP Phase 0 ticks + ADR-009 if anything changed.

**Learned:** Auth will look “broken” on Vercel until redirect URLs include the Vercel domain.

### R5 — Database change

1. Add `supabase/migrations/00N_description.sql`.  
2. Run in Supabase SQL Editor.  
3. Update `architecture/OVERVIEW.md` data model section.  
4. Never “click-only” prod schema without a migration file.

### R6 — After any debugging session

1. Log entry in this file.  
2. If decision changed stack/process → ADR in `architecture/DECISIONS.md`.  
3. If user-facing → UX or SUPPORT note.

---

## Learning log

### 2026-06 / 2026-07 — Project bootstrap & discovery

- **Context:** Plan and bootstrap AssessMate for SA FET Maths + Life Sciences educators (parents as POs).  
- **Steps that worked:** North star + interviews; Next.js 16 + Supabase; wizard with subject-aware cognitive UI; structured `docs/parent-samples/`.  
- **Pitfalls:**  
  - Next.js 16 deprecates `middleware.ts` → use `src/proxy.ts` + `export function proxy`.  
  - Turbopack warned about multiple lockfiles → set `turbopack.root` in `next.config.ts`.  
  - Login failed after signup → email confirmation.  
  - Local Postgres install not required; confused with Supabase cloud Postgres.  
- **NSC clarification:** NSC = NQF Level 4 school-leaving **qualification** (Umalusi). DBE/IEB/SACAI = **assessment bodies**.  
- **Follow-up learning:** Supabase Auth SSR; Next.js 16 proxy docs; AZ-104/AI-102 path for Track B.  
- **Discipline lens:** PO, BA, Tech Architect, FE, BE, DBA, Support.

### 2026-07-11 — Documentation system

- **Context:** Solo founder wants workplace-discipline coverage + living learning runbook + no doc afterthoughts.  
- **Steps that worked:** Created DOCUMENTATION_INDEX, architecture/design/quality docs, Documentation Gate in ROADMAP.  
- **Follow-up learning:** Keep 5–10 min end-of-session doc habit.  
- **Discipline lens:** Change Manager, all.

### 2026-07-11 — Phase 0 close: commit/push + Vercel

- **Context:** Finish foundation hygiene so Phase 1 can start on a deployable `main`.  
- **Steps that worked:**  
  1. Fix ESLint `set-state-in-effect` on wizard draft hydrate → `useSyncExternalStore` + override state.  
  2. Commit docs system, auth messages, subject-aware cognitive wizard, parent-sample manifests (binaries gitignored).  
  3. Push `main` → GitHub `assessment-builder`.  
  4. Link Vercel to repo; set `NEXT_PUBLIC_SUPABASE_*`; deploy.  
  5. Add production URL to Supabase Auth Site URL + Redirect URLs (`https://<domain>/auth/callback`).  
- **Pitfalls:**  
  - Parent PDFs/DOCX must stay gitignored (ADR-007) — only manifests/structure commit.  
  - Production login fails until Auth redirect allowlist includes the Vercel domain.  
  - `vercel` CLI may require interactive login (`npx vercel login`) the first time.  
- **Commands / links:**  
  - `npm run lint && npm run build`  
  - `npx vercel` / `npx vercel --prod`  
  - Repo: https://github.com/inmypurposetech-prog/assessment-builder  
- **Follow-up learning:** Vercel env + Supabase Auth URL config; optional GitHub Actions CI in Phase 2.  
- **Discipline lens:** DevOps, Backend, Support, Tech Architect.

---

## Skills inventory (honest self-check)

Update quarterly.

| Area | Level (1–5) | Evidence in this project | Next practice |
|------|-------------|----------------------------|---------------|
| HTML/CSS/JS | | Landing + wizard | |
| TypeScript | | Types in `lib/types` | |
| React / Next.js | | App Router pages | |
| Supabase Auth + RLS | | Auth + migration | |
| SQL / data modelling | | `001_initial_schema` | |
| Git / GitHub | | assessment-builder | |
| Product discovery | | Parent interviews | |
| UX for non-technical users | | Large text wizard | |
| AI / RAG | 1 | Planned Phase 1 | Courses above |
| Testing / CI | 1 | Manual only so far | Phase 2 |
| Deploy / DevOps | 2 | Vercel + GitHub `main` (Phase 0) | Auth redirect smoke; optional CI |
| Analytics | 1 | Not started | Phase 3+ |

---

## Support cheat sheet (Support Analyst hat)

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Can’t log in after signup | Email not confirmed | Confirm in Supabase Users or disable confirm for test |
| Signup says “already registered” / 400 | Email used before (local or prod) | Log in instead; or delete user in Supabase Auth → Users for a clean retest |
| Vague signup failure | Old generic copy | Fixed: `getSignupErrorMessage` — deploy latest `main` |
| Redirect loop / can’t reach dashboard | Auth URLs wrong | Fix Site URL + redirect allowlist (localhost **and** Vercel domain) |
| Save assessment fails | Migration not run / RLS | Re-run SQL; check user logged in |
| Env errors | Missing `.env.local` | Copy from `.env.example` |
| “Middleware deprecated” | Old file name | Use `src/proxy.ts` |
| Prod login works locally but not on Vercel | Missing prod redirect URL or env vars | Add `NEXT_PUBLIC_SUPABASE_*` on Vercel; allowlist `/auth/callback` |

---

## Related

- [DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)  
- [architecture/OVERVIEW.md](../architecture/OVERVIEW.md)  
- [ROADMAP_AND_CHECKLIST.md](../ROADMAP_AND_CHECKLIST.md)  
