# Architecture Decision Records (ADRs)

> **Disciplines:** Technical Architect · Business Architect · Product Owner  
> **How to add:** Copy the template at the bottom; never delete old ADRs — mark `Superseded` if replaced.  
> **Last updated:** 16 July 2026 (ADR-016)

---

## ADR index

| ID | Title | Status | Date |
|----|-------|--------|------|
| ADR-001 | Supabase + Next.js Track A (not local Postgres / not Azure-first) | Accepted | 2026-06 |
| ADR-002 | Subject-aware cognitive models (Maths CAPS ≠ Bloom) | Accepted | 2026-06 |
| ADR-003 | Question bank first; AI second | Accepted | 2026-06 |
| ADR-004 | Charge for capability (templates/generation), not storage guilt | Accepted | 2026-07 |
| ADR-005 | Template visibility: Private → School before Public | Accepted | 2026-07 |
| ADR-006 | Next.js 16 `proxy.ts` instead of `middleware.ts` | Accepted | 2026-06 |
| ADR-007 | Parent samples gitignored; manifests committed | Accepted | 2026-07 |
| ADR-008 | Documentation Gate mandatory in SDLC | Accepted | 2026-07 |
| ADR-009 | Host on Vercel linked to GitHub `main` | Accepted | 2026-07 |
| ADR-010 | Branch-first + draft PR before merge to `main` | Accepted | 2026-07 |
| ADR-011 | Phase 1A content as typed seed + template packs (binaries stay local) | Accepted | 2026-07 |
| ADR-012 | Structured generation API: bank-first assemble + memo derive + cost caps | Accepted | 2026-07 |
| ADR-013 | Review edits mutate generated_content (Edit/Replace/Delete + proud bar) | Accepted | 2026-07 |
| ADR-014 | Subject-aware DOCX/PDF export from generated_content | Accepted | 2026-07 |
| ADR-015 | Phase 2 testing: CI + Playwright/Vitest before hosted AI agents (KaneAI deferred) | Accepted | 2026-07 |
| ADR-016 | Phase 1E private template upload (Supabase Storage + select on create) | Accepted | 2026-07 |

---

## ADR-001 — Supabase + Next.js Track A

- **Context:** Solo builder, JS background, &lt;R500/mo, Azure certs later.  
- **Decision:** Next.js full-stack + Supabase (Auth, Postgres, Storage). Azure Track B after MVP.  
- **Consequences:** Fast start; EU region for DB; migrate later for certs/B2G.  
- **Rejected:** Local Postgres required; Cosmos DB; FastAPI split for MVP.

## ADR-002 — Subject-aware cognitive models

- **Context:** Dad (Maths) rejects Bloom; Mom (LS) uses Bloom + SAGS.  
- **Decision:** Maths validators use Knowledge/Routine/Complex/Problem solving (20/35/30/15). LS uses Bloom focus.  
- **Consequences:** Wizard step 5 branches on subject; export reports differ.

## ADR-003 — Question bank first; AI second

- **Context:** Generic GPT papers hallucinate curriculum.  
- **Decision:** Structured question bank + RAG assembly; AI fills gaps and writes memos from locked questions.  
- **Consequences:** More upfront content work; higher trust.

## ADR-004 — Capability pricing, not storage guilt

- **Context:** Temptation to charge for storing templates/archives.  
- **Decision:** Monetise generation limits + template *slots/library* + school seats. No archive revival fees.  
- **Consequences:** Clearer value prop; AI costs mapped to usage.

## ADR-005 — Template sharing order

- **Context:** Dad’s department already shares GDE-style templates.  
- **Decision:** Private default → School/subject shared → Public gallery last.  
- **Consequences:** Lower legal risk; School tier is collaboration monetisation.

## ADR-006 — `proxy.ts`

- **Context:** Next.js 16 deprecates middleware file convention.  
- **Decision:** `src/proxy.ts` exporting `proxy`.  
- **Consequences:** No deprecation warning; same session refresh behaviour.

## ADR-007 — Parent samples not in git binaries

- **Context:** Copyright + repo size.  
- **Decision:** Ignore `docs/parent-samples/**/*.{pdf,docx,doc}`; commit README/MANIFEST/structure.  
- **Consequences:** Clones lack binaries; local machine holds gold exemplars.

## ADR-008 — Documentation Gate

- **Context:** Solo founder; workplace-shaped disciplines; docs must stay publishable.  
- **Decision:** Every feature/phase requires Documentation Gate (see DOCUMENTATION_INDEX). Learning runbook updated when processes are learned.  
- **Consequences:** Slightly slower shipping; much higher continuity across chats and future readers.

## ADR-009 — Vercel + GitHub production host

- **Status:** Accepted  
- **Date:** 2026-07-11  
- **Context:** Phase 0 needs a trustworthy deploy path before parent-facing generation work; budget prefers free tier.  
- **Decision:** Host Next.js on **Vercel**, auto-deploy from GitHub `main` (`inmypurposetech-prog/assessment-builder`). Production env: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. After first deploy, add the production origin to Supabase Auth Site URL / redirect allowlist (`…/auth/callback`).  
- **Consequences:** Preview deploys available on PRs later; no separate app server to manage; must keep Auth redirect URLs in sync when the domain changes.  
- **Rejected alternatives:** Self-host Node on a VPS (ops overhead); Azure App Service now (Track B later).  
- **Disciplines consulted:** Tech Architect, Backend, Support.

## ADR-010 — Branch-first + draft PR

- **Status:** Accepted  
- **Date:** 2026-07-11 (cleanup step clarified 2026-07-14)  
- **Context:** Phase 0 pushed straight to `main` for speed; later `cursor/…` branch at the same tip could not open a PR (“No commits between main and …”). After Phase 1A merge, stale `cursor/…` remotes also cluttered the next session.  
- **Decision:** For every feature/phase slice: create `cursor/<topic>` or `feature/<topic>` **before** coding; push; open a **draft PR** into `main`; merge only after gate checks. Keep `main` deployable. **After merge, delete the feature branch locally and on `origin`** (and prune). Squash merges keep the tree on `main`; branch delete only removes the tip name.  
- **Consequences:** Slightly more ceremony; reviewable diffs; Vercel preview option; Cursor sessions start on a named branch from a clean `main`; no pile of merged `cursor/…` remotes.  
- **Rejected alternatives:** Continue committing on `main` for solo speed; leave merged feature branches forever “for history.”  
- **Disciplines consulted:** Tech Architect, Change, Support.

---

## ADR-011 — Typed content seed + template packs (Phase 1A)

- **Status:** Accepted  
- **Date:** 2026-07-11  
- **Context:** Phase 1A needs cognitive guide copy, Dad template layout notes, Mom Bloom/AIM patterns, and a starter question bank before generation (1B). Parent PDF/DOCX stay gitignored (ADR-007); past-paper text must not be republished in the repo.  
- **Decision:**  
  1. Distil cognitive / Bloom **definitions and targets** into `src/lib/constants/` (+ `src/lib/content/taxonomy/`).  
  2. Represent Dad’s June pack as **structured template pack v1** in `src/lib/content/template-packs/` (paths + layout conventions, not binary embeds).  
  3. Ship an **original pedagogical seed bank** (25 Maths + 24 LS) in `src/lib/content/question-bank/` as the app-readable source of truth for early generation.  
  4. Extend Supabase `questions` via `002_question_bank_phase1a.sql` (`cognitive_level`, `aim`, `strand`, `visibility`) for later DB load — no past-paper verbatim inserts.  
- **Consequences:** Generation (1B) can filter the in-repo bank immediately; DB seed can follow; template DOCX fidelity still iterates in 1D using local exemplars.  
- **Rejected alternatives:** Commit parent binaries; scrape past-paper wording into git; wait for full OCR pipeline before any bank.  
- **Disciplines consulted:** Tech Architect, BA, DBA, PO.

## ADR-012 — Structured generation API (Phase 1B)

- **Status:** Accepted  
- **Date:** 2026-07-14  
- **Context:** Phase 1B needs assemble → validate → memo → cost controls before review UX (1C) and export (1D). Parents must not get free-form prose papers; Maths ≠ Bloom; AI cost must stay cap-able on free tiers.  
- **Decision:**  
  1. Authenticated `POST /api/generate` with Zod body `{ assessmentId, dryRun? }` returns **structured JSON** (`schemaVersion: 1`: paper + memo + taxonomy + warnings + cost).  
  2. **Bank-first assembly** from `src/lib/content/question-bank/` (ADR-003 / ADR-011); Maths fills CAPS cognitive buckets toward wizard %; Life Sciences prefers Bloom bands from `bloomFocus` and **attaches Bloom (+ AIM) on every item**.  
  3. **Memo is derived** from the locked bank selection (`memoAnswer` + `markingPoints` + K/R/C/P or Bloom short codes) — never generated as a separate paper invent.  
  4. **Cost controls:** `GENERATION_MODEL` (`bank-only` | `gpt-4o-mini` | `gemini-2.0-flash`), `GENERATION_MAX_TOKENS`, `GENERATION_MONTHLY_CAP`; usage rows in `generation_usage`; persist payload on `assessments.generated_content` / `generated_at` (migration `003_generation_phase1b.sql`).  
  5. Light **AI gap-fill** is a typed hook (`fillGapsWithAi`) that no-ops until a provider key + non-`bank-only` model are configured — keeps structured schema ready without paying for tokens yet.  
- **Consequences:** Review UI (1C) can consume `generated_content`; export (1D) maps the same JSON; monthly cap returns HTTP 429. Migration `003` applied on cloud Supabase 14 Jul 2026.  
- **Rejected alternatives:** Free-form LLM paper+memo in one shot; regenerating memo independently of the paper; skipping usage logging until “later”.  
- **Disciplines consulted:** Tech Architect, Backend, Quant, DBA, PO.

## ADR-013 — Review edits mutate generated_content (Phase 1C)

- **Status:** Accepted  
- **Date:** 2026-07-14  
- **Context:** Phase 1C needs Edit / Replace / Delete with live marks + taxonomy and a proud-to-present bar, without inventing a second paper schema or regenerating the memo as a separate invent.  
- **Decision:**  
  1. Route `/assessments/[id]/review` loads `assessments.generated_content` as `GeneratedAssessment` (schemaVersion 1).  
  2. Teacher edits run client-side through `recomputeGeneratedAssessment` (renumber, mark totals, rebuild CAPS/Bloom report, keep memo aligned). Replace pulls from the in-repo seed bank and re-derives memo answers.  
  3. Persist via `saveGeneratedAssessment` server action (same jsonb column; no new tables).  
  4. Proud-to-present uses `evaluateProudToPresent` (blockers vs cautions) — text + colour.  
- **Consequences:** Export (1D) maps the same JSON teachers already approved; rebuild overwrites with confirm. Migration 003 applied on cloud Supabase (14 Jul 2026).  
- **Rejected alternatives:** Per-question Postgres rows for MVP; regenerating the whole paper on every edit; separate memo invent API.  
- **Disciplines consulted:** Tech Architect, UX, Frontend, Backend, PO.

## ADR-014 — Subject-aware DOCX/PDF export (Phase 1D)

- **Status:** Accepted  
- **Date:** 2026-07-14  
- **Context:** Phase 1D must turn approved `generated_content` into files Dad/Mom can take to moderation: Maths GDE-style DOCX pack vs Life Sciences moderator PDF (Arial 12, 1.5 spacing). Pixel fidelity will iterate; structure and subject rules must ship first.  
- **Decision:**  
  1. Authenticated `POST /api/export` with Zod `{ assessmentId }` loads **saved** `generated_content` (same schemaVersion 1 JSON as generate/review).  
  2. **Mathematics** → ZIP of four DOCX files (question paper, memorandum with K/R/C/P, answer book, CAPS cognitive summary) built with `docx`, ordered per `MATHS_GDE_JUNE_P2_TEMPLATE_PACK.exportOrder` (+ cognitive sheet).  
  3. **Life Sciences** → single PDF via `pdfkit`: paper (lined handwriting space), memo, Bloom summary; **12pt + 1.5 line spacing**; Helvetica as Arial-compatible core-font substitute until a licensed Arial face is embedded.  
  4. Review UI **saves draft then downloads** (`ExportDownloadButton`) so the file matches the screen; busy until download starts; proud blockers warn but do not hard-block download.  
  5. No new tables / Storage for MVP export bytes (generate on demand).  
- **Consequences:** Template fidelity improves by editing builders against parent exemplars (gitignored); library deps `docx` / `pdfkit` / `jszip`; `serverExternalPackages` in Next config.  
- **Rejected alternatives:** One format for both subjects; HTML-print-only; Puppeteer/Chrome PDF (heavier ops); regenerating paper text at export time.  
- **Disciplines consulted:** Tech Architect, Backend, UX, PO, Design.

## ADR-015 — Phase 2 testing: CI + Playwright/Vitest before hosted AI agents

- **Status:** Accepted  
- **Date:** 2026-07-16  
- **Context:** Fast AI-assisted (“vibe”) coding increases hidden-bug risk. Hosted AI test products (e.g. KaneAI / TestMu) promise plain-English cases and self-healing UI tests. AssessMate also needs InfoSec discipline (authz, RLS, secrets) which UI agents alone do not replace. Budget-conscious solo MVP.  
- **Decision:**  
  1. **Phase 2 automated bar:** GitHub Actions `lint` + `build`; add **Vitest** for domain validators and **Playwright** for happy-path smoke when we automate E2E.  
  2. **Defer KaneAI / similar hosted AI test agents** until Playwright maintenance or multi-browser needs justify paid tooling (revisit at closed beta / Teacher tier).  
  3. Keep **manual parent UAT** as the product-quality gate; keep **SECURITY_AND_THREAT_MODEL** checklist + lightweight adversarial hour for InfoSec (not replaced by UI agents).  
- **Consequences:** No new vendor cost in Phase 2; CI catches broken AI edits early; security work stays checklist-driven.  
- **Rejected alternatives:** Adopt KaneAI now as primary QA; skip CI until after pilot; treat UI agent coverage as sufficient for RLS/authz.  
- **Disciplines consulted:** InfoSec, QA, Tech Architect, PO.

## ADR-016 — Phase 1E private template upload (Supabase Storage)

- **Status:** Accepted  
- **Date:** 2026-07-16  
- **Context:** Parents already have school covers / department packs. Phase 1E is a thin slice: store educator-owned files privately and select one when creating an assessment. School sharing and “generate into uploaded binary” fidelity stay later (Phase 5 / fidelity iterate). No learner PII.  
- **Decision:**  
  1. Migration `004_templates_phase1e.sql`: `templates` table (visibility check-constrained to **`private`**), `assessments.template_id` FK (`on delete set null`), private Storage bucket `templates` with object policies on path prefix `auth.uid()`.  
  2. Upload via authenticated server action (`uploadTemplate`) using the user session — **no service role** in the browser path. Free-tier soft cap: **1** private pack (`MAX_PRIVATE_TEMPLATES`).  
  3. UI: `/templates` library + upload; wizard Advanced step selects template or AssessMate default; `saveAssessmentWizard` writes `template_id` after ownership check.  
  4. Export (ADR-014) still builds from `generated_content` with in-code layout packs — linked uploads are stored for the next fidelity step, not injected into DOCX/PDF yet.  
  5. Compliance: educator-owned materials only; copyright reminder in UI; never store learner names/marks/scripts (COMPLIANCE + threat model).  
- **Consequences:** Parents can upload Dad’s cover / Mom’s letterhead privately; apply 004 on Supabase before prod upload works; School visibility remains Phase 5.  
- **Rejected alternatives:** Public bucket; service-role uploads; School sharing in 1E; rewriting export to fill Word binaries in this slice.  
- **Disciplines consulted:** Tech Architect, DBA, InfoSec, Legal/Compliance, UX, PO.

## Template for new ADRs

```markdown
## ADR-00N — Title

- **Status:** Proposed | Accepted | Superseded by ADR-00X
- **Date:** YYYY-MM-DD
- **Context:** …
- **Decision:** …
- **Consequences:** …
- **Rejected alternatives:** …
- **Disciplines consulted:** …
```
