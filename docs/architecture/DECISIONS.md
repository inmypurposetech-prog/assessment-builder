# Architecture Decision Records (ADRs)

> **Disciplines:** Technical Architect · Business Architect · Product Owner  
> **How to add:** Copy the template at the bottom; never delete old ADRs — mark `Superseded` if replaced.  
> **Last updated:** 11 July 2026

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
- **Date:** 2026-07-11  
- **Context:** Phase 0 pushed straight to `main` for speed; later `cursor/…` branch at the same tip could not open a PR (“No commits between main and …”).  
- **Decision:** For every feature/phase slice: create `cursor/<topic>` or `feature/<topic>` **before** coding; push; open a **draft PR** into `main`; merge only after gate checks. Keep `main` deployable.  
- **Consequences:** Slightly more ceremony; reviewable diffs; Vercel preview option; Cursor sessions start on a named branch.  
- **Rejected alternatives:** Continue committing on `main` for solo speed.  
- **Disciplines consulted:** Tech Architect, Change, Support.

---

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
