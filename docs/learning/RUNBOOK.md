# AssessMate — Learning Runbook

> **Purpose:** Your personal engineering & product journey log — processes you’ve done, what you learned, mistakes, and **follow-up courses/resources**. Use it as a runbook when repeating a task or onboarding your future self.  
> **Update:** After every non-trivial setup or debugging session (Documentation Gate).  
> **Last updated:** 14 July 2026 (Phase 1D export)

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

- [x] Accessibility basics (WCAG 2.2 AA mindset) — forms, focus, contrast — **in progress**; standards in `design/UX_AND_ACCESSIBILITY.md` after parent smoke + 1C review  
- [x] GOV.UK Design System patterns (conditional reveals, focus on step change) — applied on wizard + review heading focus  
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

### R3 — GitHub: branch first, then PR (mandatory)

**Never push feature work straight to `main`.** Phase 0 did that for speed; empty PRs followed. From Phase 1 onward:

```bash
cd ~/Projects/assessmate
git checkout main
git pull origin main
git checkout -b cursor/<short-topic>    # e.g. cursor/phase-1b-generation
# … commit on this branch only …
git push -u origin HEAD
gh pr create --draft --base main --title "…" --body "…"
# after review: merge PR → Vercel deploys main → then clean up branch (below)
```

Repo: `https://github.com/inmypurposetech-prog/assessment-builder`  
Branch prefixes: `cursor/` (agent sessions) or `feature/` (manual). One concern per branch.

**After every merge — delete the feature branch (local + remote):**

```bash
git checkout main
git pull origin main
git branch -d cursor/<short-topic>    # -D if squash merge warns “not fully merged”
git push origin --delete cursor/<short-topic>
git fetch --prune
```

Confirm with `git branch -a` that only `main` (plus any *active* unfinished branches) remains. Merged work lives on `main`; deleting the branch name does not drop the files (even after a squash merge).

**Anti-pattern:** finish work on `main`, then create `cursor/…` at the same tip → GitHub “No commits between main and …”.  
**Anti-pattern:** leave merged `cursor/…` remotes around — next chat should start from clean `main`.

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
2. Run in Supabase SQL Editor **or** `SUPABASE_DB_URL='…' npm run db:migrate:002` (for `002_…`).  
3. Update `architecture/OVERVIEW.md` data model section.  
4. Never “click-only” prod schema without a migration file.

**Learned (11–13 Jul 2026):** Anon key alone cannot run DDL. Prefer **SQL Editor** (paste migration → Run) — no connection string needed. If using the CLI: Dashboard → green **Connect** button (top of project) → Session pooler URI as `SUPABASE_DB_URL`. Old “Settings → Database → Connection string” path is easy to miss / relocated.

### R6 — After any debugging session

1. Log entry in this file.  
2. If decision changed stack/process → ADR in `architecture/DECISIONS.md`.  
3. If user-facing → UX or SUPPORT note.

### R7 — Phase 1A content ingest (repeatable)

1. Keep binaries under `docs/parent-samples/` (gitignored).  
2. Distil **definitions / targets / layout** into `src/lib/constants/` or `src/lib/content/` — never paste copyrighted question text into git.  
3. Add/adjust seed items in `src/lib/content/question-bank/` with subject-aware metadata (Maths `cognitiveLevel` vs LS `bloomLevel` + `aim`).  
4. If schema changes → numbered migration under `supabase/migrations/` + OVERVIEW data model.  
5. Tick ROADMAP 1A; ADR if approach changes; log in this RUNBOOK.

### R8 — Structured generate (Phase 1B)

1. Ensure wizard draft is saved (has `assessments.id`) with subject + grade + exam body.  
2. Run migration `supabase/migrations/003_generation_phase1b.sql` in Supabase **SQL Editor** (adds `generated_content` / `generated_at` + `generation_usage`).  
3. Call while logged in:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H 'Content-Type: application/json' \
  -H "Cookie: <session cookies from browser>" \
  -d '{"assessmentId":"<uuid>","dryRun":true}'
```

Or from browser DevTools (same origin, session cookie present):

```js
await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ assessmentId: '…', dryRun: true }),
});
```

4. Expect JSON: `paper.questions`, `memo.items` (derived from bank), `taxonomy` (CAPS drift or Bloom per question), `cost`, `warnings`.  
5. Non-`dryRun` writes `status=generated`, increments monthly usage; `429` if `GENERATION_MONTHLY_CAP` hit.  
6. Cost env: `GENERATION_MODEL`, `GENERATION_MAX_TOKENS`, `GENERATION_MONTHLY_CAP`; AI keys optional until gap-fill is wired.

**Learned:** Keep memo derived from locked bank ids — never a second independent LLM invent. Bank-first + structured schema beats free-form prose for parent trust (ADR-012).

### R9 — Review generated paper (Phase 1C)

1. Migration `003` applied (same as R8) so `generated_content` exists.  
2. From wizard step 5: **Build my paper** (or dashboard **Build my paper** on a draft).  
3. Busy state shows until `/assessments/<id>/review` loads.  
4. Edit / Replace / Delete questions; watch live totals + proud-to-present bar.  
5. **Save review** → `saveGeneratedAssessment` writes `generated_content`.  
6. Rebuild from review confirms overwrite (counts as another generate toward monthly cap).

**Learned:** Teachers stay in control — review mutates the same `GeneratedAssessment` JSON export will use (ADR-013). Colour alone is not enough for blockers; pair with “Fix:” / “Note:” text.

### R10 — Export DOCX/PDF (Phase 1D)

1. Have a saved paper on review (`generated_content` from R8/R9).  
2. On `/assessments/<id>/review`, scroll to **Download for moderation**.  
3. Click the subject-aware button — it **saves first**, then `POST /api/export`.  
4. Maths → ZIP with `01-question-paper.docx`, `02-memorandum.docx`, `03-answer-book.docx`, `04-cognitive-summary.docx`.  
5. Life Sciences → single PDF (Helvetica as Arial-compatible MVP font; 12pt; 1.5 spacing; lined blanks + Bloom sheet).  
6. Busy status stays until the browser download starts; empty paper disables the button.

**Learned:** Export maps the **saved** JSON (ADR-014) — never invent a second paper at download time. PDF core fonts lack Arial; document the Helvetica substitute until a licensed face is embedded. Keep binary builders in `serverExternalPackages` (`pdfkit`, `docx`, `jszip`).

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
  4. Link Vercel to repo; set `NEXT_PUBLIC_SUPABASE_*`; deploy → https://assessment-builder-sooty.vercel.app/  
  5. Add production URL to Supabase Auth redirect allowlist (`https://…/auth/callback`).  
- **Pitfalls:**  
  - Parent PDFs/DOCX must stay gitignored (ADR-007) — only manifests/structure commit.  
  - Production login fails until Auth redirect URLs include the Vercel domain.  
  - `vercel` CLI may require interactive login; dashboard Import is fine.  
  - “Email signups are disabled” → Supabase Providers → Email → enable signups.  
- **Commands / links:**  
  - `npm run lint && npm run build`  
  - Prod: https://assessment-builder-sooty.vercel.app/  
  - Repo: https://github.com/inmypurposetech-prog/assessment-builder  
- **Follow-up learning:** Vercel env + Supabase Auth URL config; optional GitHub Actions CI in Phase 2.  
- **Discipline lens:** DevOps, Backend, Support, Tech Architect.

### 2026-07-11 — Dad confirmed CAPS; Phase 0 exit UAT written

- **Context:** Close Phase 0 product assumption + give solo founder a smoke script.  
- **Steps that worked:** NORTH_STAR artifact row updated; Phase 0 exit checklist in quality doc.  
- **Follow-up:** Run smoke on prod; then tick Phase 0 complete.  
- **Discipline lens:** PO, QA, Change.

### 2026-07-11 — Parent smoke UX findings → a11y standards

- **Context:** Wizard completed on prod; four UX questions (back link, post-login loading, scroll-on-step, dependent syllabus options).  
- **Verdict:** All four are **valid** and align with WCAG AA / GOV.UK-style form practice; current app is **partially** below that bar.  
- **Steps that worked:** Codified targets + known gaps in `design/UX_AND_ACCESSIBILITY.md`; Cursor always-on rule now requires those patterns on UI work.  
- **Follow-up learning:** GOV.UK Design System (error summary, conditional reveals, focus management); WCAG 2.2 “Status Messages” / “Focus Not Obscured”.  
- **Discipline lens:** UX, FE, QA, Change.

### 2026-07-11 — Implemented parent smoke UX polish

- **Context:** Ship the four fixes after docs standards.  
- **Steps that worked:** Always-underline back link; auth busy + status until navigation; wizard scroll/focus; `curriculum-matrix.ts` cascade with clear-on-change notes.  
- **Commands:** `npm run lint && npm run build`  
- **Discipline lens:** UX, FE.

### 2026-07-11 — Phase 0 exited; branch-first standard

- **Context:** Close chat; adopt PR workflow so next phase is reviewable.  
- **Steps that worked:** Marked Phase 0 complete in ROADMAP; documented mandatory branch-first + draft PR in ROADMAP SDLC + RUNBOOK R3; created `cursor/phase-1a-content-templates` for next chat.  
- **Pitfalls:** Pushing to `main` then branching at same tip → empty PR.  
- **Follow-up:** Phase 1A on that branch; open draft PR early.  
- **Discipline lens:** Change, DevOps, PO.

---

### 2026-07-11 — Phase 1A content & templates

- **Context:** Ingest Dad’s cognitive guide + June pack structure + Mom’s analysis-grid Bloom/AIM pattern; seed an original question bank without committing past-paper text.  
- **Steps that worked:**  
  1. Extract PDF text locally (temp venv + `pypdf`) from cognitive guide and IEB analysis grids; DOCX via unzip/`document.xml` for layout notes only.  
  2. Distil into typed modules under `src/lib/constants/` + `src/lib/content/` (ADR-011).  
  3. Enrich wizard Advanced step copy; add `isValidMathsCognitiveDistribution` + `role="alert"` on invalid totals.  
  4. Migration `002_question_bank_phase1a.sql` for `cognitive_level` / `aim` / `strand` / `visibility`.  
- **Pitfalls:**  
  - Do not commit parent binaries or verbatim past-paper questions (ADR-007 / copyright).  
  - Dad’s June memo tags K/R/C heavily; still reserve P for problem solving in exports.  
  - Full Mom paper OCR completed 13 Jul 2026 (local `_extracts/`); taxonomy from grids remains the app source of truth.  
- **Commands / links:** Branch `cursor/phase-1a-content-templates`; `npm run db:migrate:002` when `SUPABASE_DB_URL` is set.  
- **Follow-up learning:** Structured JSON generation; DOCX templating for GDE memo.  
- **Discipline lens:** BA, Tech Architect, DBA, UX, Quant.

---

### 2026-07-11 — Mom 2023 PDF extract + migration runner

- **Context:** Complete deferred Phase 1A items (PDF extract/OCR + run `002` on Supabase).  
- **Steps that worked:**  
  1. `pypdf` extracted all papers/memos/grids/sources into gitignored `_extracts/`.  
  2. Apple Vision (`ocrmac`) on low-text pages → they are **lined blank answer sheets**, not missing questions.  
  3. Added `scripts/apply-migration-002.mjs` + `npm run db:migrate:002` (needs `SUPABASE_DB_URL`).  
- **Pitfalls:**  
  - Vision OCR fails in sandbox — needs full macOS permissions.  
  - Anon key cannot ALTER TABLE; Dashboard sign-in or DB URI required.  
- **Follow-up:** Paste `SUPABASE_DB_URL` (or sign into Supabase Dashboard) so migration can be applied.  
- **Discipline lens:** DBA, BA, Support.

---

### 2026-07-13 — Deferred 1A: PDF extracts + migration attempt

- **Context:** Finish OCR of Mom’s 2023 pack and apply `002_question_bank_phase1a.sql` on cloud Supabase.  
- **Steps that worked:** Re-ran `scripts/extract-ieb-ls-2023.py` (pypdf); weak pages are lined blanks / cover; EXTRACT_INDEX + gitignore `_extracts/`; migration runner `npm run db:migrate:002` + `.env.example` note for `SUPABASE_DB_URL`.  
- **Pitfalls:** Anon key cannot DDL; Dashboard sign-in required or Postgres URI from Settings → Database. No DB password in local keychain / `.env.local`.  
- **Follow-up:** ~~Paste `SUPABASE_DB_URL`~~ → **Done 13 Jul 2026:** SQL Editor applied `002`; DB password reset (keep in password manager; use Connect → Session pooler if CLI needed later).  
- **Discipline lens:** DBA, Support.

### 2026-07-13 — Migration 002 applied (SQL Editor)

- **Context:** User could not find connection string at old Settings path; used SQL Editor instead; reset DB password.  
- **Steps that worked:** Paste `supabase/migrations/002_question_bank_phase1a.sql` → Run. Connection string is under project **Connect** (top bar), not the old Settings route.  
- **Pitfalls:** Forgotten DB password → reset in Project Settings → Database; update any saved URIs.  
- **Discipline lens:** DBA, Support.

### 2026-07-14 — Post-merge branch cleanup

- **Context:** After Phase 1A squash-merge, `cursor/phase-1a-…` and `cursor/phase-0-…` still sat on local + remote.  
- **Steps that worked:** Confirm tree on `main` matches merged work → `git checkout main && git pull` → `git branch -d …` → `git push origin --delete …` → `git fetch --prune`.  
- **Learned:** Deleting a squash-merged branch loses tip SHAs only, not files. Codified cleanup in ROADMAP Branching, RUNBOOK R3, ADR-010, Cursor always-on rule.  
- **Discipline lens:** Change, DevOps.

### 2026-07-14 — Phase 1B structured generation API

- **Context:** Assemble paper JSON from wizard + seed bank; validate Maths CAPS %; attach LS Bloom; derive memo from locked items; cost caps.  
- **Steps that worked:**  
  1. Branch `cursor/phase-1b-structured-generation` from clean `main`.  
  2. `src/lib/generation/*` + `POST /api/generate` (session, Zod body, dryRun).  
  3. Migration `003_generation_phase1b.sql` (`generated_content`, `generation_usage`).  
  4. ADR-012 + OVERVIEW generation layer + R8 runbook.  
- **Pitfalls:**  
  - Saving generate fails until migration 003 is applied on Supabase.  
  - `/api/*` is not cookie-redirect protected like `/dashboard` — route returns **401 JSON** (correct for APIs).  
  - Small seed pools → mark shortfall warnings; AI gap-fill hook is intentional no-op without keys.  
- **Commands:** `npm run lint && npm run build`; run 003 in SQL Editor before prod generate.  
- **Follow-up learning:** Structured outputs with LLMs; Phase 1C review UX consuming `generated_content`.  
- **Discipline lens:** Backend, Tech Architect, Quant, DBA, Support.

### 2026-07-14 — Phase 1C review UX

- **Context:** Teachers need Edit / Replace / Delete, live marks + taxonomy, and Dad’s proud-to-present check before export.  
- **Steps that worked:**  
  1. Branch `cursor/phase-1c-review-ux` from clean `main`.  
  2. `/assessments/[id]/review` + `ReviewShell`; `recomputeGeneratedAssessment` + `evaluateProudToPresent`.  
  3. Wire **Build my paper** from wizard + dashboard; `saveGeneratedAssessment`.  
  4. ADR-013 + UX doc standards + R9.  
- **Pitfalls:**  
  - Rebuild overwrites — confirm dialog required.  
  - Replace empty when all matching bank items already on the paper.  
- **Commands:** `npm run lint && npm run build`.  
- **Follow-up learning:** Accessible confirm dialogs (replace `window.confirm`); Phase 1D export.  
- **Discipline lens:** UX, Frontend, Tech Architect, Support.

### 2026-07-14 — Phase 1D DOCX/PDF export

- **Context:** Parents need downloads close to Dad GDE DOCX pack / Mom moderator PDF.  
- **Steps that worked:**  
  1. Branch `cursor/phase-1d-export-templates` from clean `main`.  
  2. `docx` + `pdfkit` + `jszip`; `buildExportPack` + `POST /api/export`.  
  3. Review **Download for moderation** (save-then-download, busy until start).  
  4. ADR-014 + OVERVIEW export layer + UX §7 + R10.  
- **Pitfalls:**  
  - PDFKit has no Arial — use Helvetica + document substitute (ADR-014).  
  - Keep builders in `serverExternalPackages` to avoid Next bundling quirks.  
  - Export reads **saved** JSON; button must save draft first.  
- **Commands:** `npm run lint && npm run build`.  
- **Follow-up learning:** Embed licensed/metric-compatible Arial; iterate DOCX toward June 2026 exemplar fidelity.  
- **Discipline lens:** Backend, Tech Architect, UX, Support.

### 2026-07-14 — Migration 003 applied (SQL Editor)

- **Context:** Prod generate + review save need `generated_content` / `generated_at` / `generation_usage`.  
- **Steps that worked:** Paste `supabase/migrations/003_generation_phase1b.sql` in Supabase **SQL Editor** → Run.  
- **Next:** Smoke Build my paper → review → Save review on prod/local against cloud.  
- **Discipline lens:** DBA, Support.

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
| AI / RAG | 2 | Bank-first `/api/generate` + AI gap-fill hook (ADR-012) | Provider structured outputs |
| Testing / CI | 1 | Manual only so far | Phase 2 |
| Deploy / DevOps | 2 | Vercel + GitHub `main` (Phase 0) | Auth redirect smoke; optional CI |
| Analytics | 1 | Not started | Phase 3+ |

---

## Support cheat sheet (Support Analyst hat)

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Can’t log in after signup | Email not confirmed | Confirm in Supabase Users or disable confirm for test |
| Signup says “already registered” / 400 | Email used before (local or prod) | Log in instead; or delete user in Supabase Auth → Users for a clean retest |
| Wizard “This page couldn't load” on prod | Unstable localStorage getSnapshot (infinite re-render) | Fixed: cache draft snapshot; hard-refresh after deploy |
| Redirect loop / can’t reach dashboard | Auth URLs wrong | Fix Site URL + redirect allowlist (localhost **and** Vercel domain) |
| Save assessment fails | Migration not run / RLS | Re-run SQL; check user logged in |
| Env errors | Missing `.env.local` | Copy from `.env.example` |
| “Middleware deprecated” | Old file name | Use `src/proxy.ts` |
| Prod login works locally but not on Vercel | Missing prod redirect URL or env vars | Add `NEXT_PUBLIC_SUPABASE_*` on Vercel; allowlist `/auth/callback` |
| Can’t find Postgres connection string | UI moved | Project home → green **Connect** (top); or skip URI and use **SQL Editor** for migrations |
| Forgot database password | Only resettable, not viewable | Project Settings → Database → reset password; update any saved `SUPABASE_DB_URL` |
| Generate returns 401 | Not signed in | Log in; call `/api/generate` with session cookie |
| Generate returns 429 | Monthly cap hit | Wait for next month or raise `GENERATION_MONTHLY_CAP` |
| Generate save fails / missing column | Migration 003 not applied | Paste `003_generation_phase1b.sql` in SQL Editor → Run |
| Paper marks short of target | Small seed bank for that topic | Expand seed bank; warnings list shortfall; AI gap-fill later |
| Review says “No paper yet” | Never generated / dryRun only | Click **Build my paper** (not dryRun) |
| Replace list empty | All matching bank items already on paper | Delete a question first, or rebuild |
| Proud bar stuck on Fix | Empty memo or marks mismatch | Edit memo points; check paper vs memo marks |

---

## Related

- [DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)  
- [architecture/OVERVIEW.md](../architecture/OVERVIEW.md)  
- [ROADMAP_AND_CHECKLIST.md](../ROADMAP_AND_CHECKLIST.md)  
