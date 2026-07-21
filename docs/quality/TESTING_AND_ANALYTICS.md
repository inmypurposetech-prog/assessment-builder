# AssessMate — Testing, Quality & Analytics

> **Disciplines:** Quality/Testing Engineer · Data & Insights · Quant · Support · (pair with InfoSec)  
> **Status:** Seeded (manual testing today; automation Phase 2+)  
> **Last updated:** 16 July 2026 (KaneAI eval + InfoSec pairing)

---

## Quality goals

| Stage | Bar |
|-------|-----|
| Now | Manual happy-path; build+lint green |
| Parent MVP | Written UAT script; no P0 on generate/export |
| Public | CI lint/build; unit tests for validators; basic e2e smoke |
| School | Coverage on billing/sharing; analytics dashboards |

---

## Test strategy

```text
                    ▲  Few
           E2E / UAT│  Parent pilot scripts; later Playwright
                    │
        Integration │  Server actions + Supabase (optional early)
                    │
              Unit  │  Cognitive totals, titles, auth messages, mark validators
                    ▼  Many
```

**Vibe coding risk:** AI-assisted speed can hide functional *and* security bugs. Pair this pyramid with [`SECURITY_AND_THREAT_MODEL.md`](./SECURITY_AND_THREAT_MODEL.md). Do not treat UI-only agents as a substitute for RLS/authz checks.

### Automated tooling stance (ADR-015)

| Tool | Phase 2 | Notes |
|------|---------|-------|
| CI `lint` + `build` | Yes | Highest ROI after parent UAT |
| Vitest | Yes (validators / auth messages) | Free, in-repo |
| Playwright | Yes when E2E automated | Prefer over hosted AI agents for MVP |
| KaneAI / similar | **No for now** | Paid; revisit if Playwright maintenance hurts |
| External pen-test | Later | Closed beta / paid tier |

### Unit (start Phase 1–2)

- [ ] `mathsCognitiveTotal` / `isValidMathsCognitiveDistribution`  
- [ ] `mathsCognitiveDrift`  
- [ ] `buildAssessmentTitle`  
- [ ] `getAuthErrorMessage` / signup outcomes  
- [ ] `getSeedQuestionBankStats` counts (25 Maths + 24 LS)  
- [ ] `assembleAssessment` mark sum + Maths withinTolerance / LS Bloom attachment  
- [ ] `evaluateProudToPresent` blockers (memo empty, marks mismatch)  
- [ ] `recomputeGeneratedAssessment` after delete renumbers + mark totals  
- [ ] Future: memo marks === paper marks always  

### Integration

- [ ] Save assessment as logged-in user (RLS allows)  
- [ ] Unauthenticated cannot read others’ assessments  

### E2E / UAT

- [ ] Manual: signup → wizard → save (today)  
- [x] Manual Phase 1: generate → review → export (Maths local UI 16 Jul 2026; LS via offline PDF smoke)  
- [ ] Playwright smoke (Phase 2+): login + dashboard  
- [ ] **Parent pilot:** brief export fidelity (structure ≠ Dad DOCX clone) before they judge formatting; chase sample wishlist in `parent-samples/README.md`  

### Non-functional

- [ ] Generation latency acceptable (&lt; ~60s with progress UI)  
- [ ] Cost cap cannot be exceeded silently  

---

## Coverage reporting (when tests exist)

Planned:

```bash
# TBD when test runner added (Vitest recommended)
npm run test
npm run test:coverage
```

- [ ] Add Vitest (or Jest) + coverage script  
- [ ] Publish coverage summary in CI artifact or PR comment  
- [ ] Track coverage % here monthly once enabled:

| Month | Unit coverage | Notes |
|-------|---------------|-------|
| — | — | Not started |

**Target (post Phase 2):** critical domain libs ≥ 70% line coverage; UI optional.

---

## Manual test log

| Date | What | Result | Tester |
|------|------|--------|--------|
| 2026-06/07 | Signup/login/wizard/save | Works when email confirm handled | Tanielle |
| 2026-07-11 | `npm run lint` + `npm run build` | Pass (wizard localStorage hydrate fixed for React hooks lint) | Cursor + Tanielle |
| 2026-07-11 | Auth message helpers + Maths cognitive wizard fields | Code review; unit tests deferred to Phase 2 | Cursor |
| 2026-07-11 | Production smoke (signup → wizard → save) | Signup 400 on prod; likely existing email — clearer signup errors shipping | Tanielle |
| 2026-07-11 | Signup error copy (`getSignupErrorMessage`) | Maps already-registered / weak password / invalid email | Cursor |
| 2026-07-11 | Prod wizard “This page couldn't load” | Root cause: unstable localStorage snapshot in useSyncExternalStore → tab crash when draft exists; fix shipping | Tanielle + Cursor |
| 2026-07-11 | Phase 0 smoke (wizard complete) | Pass for create flow; UX gaps logged (back link, login busy gap, step scroll, dependent options) → standards in UX doc | Tanielle |
| 2026-07-11 | UX polish: back link, auth busy, step focus, curriculum matrix | Implemented + lint/build green | Cursor |
| 2026-07-11 | Phase 0 exit | Marked complete; branch-first standard (ADR-010); next = Phase 1A on `cursor/phase-1a-content-templates` | Tanielle + Cursor |
| 2026-07-11 | Phase 1A content: cognitive validators, template pack v1, Bloom grid pattern, seed bank (25+24) | `npm run lint` + `npm run build`; seed stats via `getSeedQuestionBankStats` | Cursor |
| 2026-07-11 | Mom 2023 PDF extract + OCR check of low-text pages | Local `_extracts/` (gitignored); lined blanks confirmed; EXTRACT_INDEX committed | Cursor |
| 2026-07-13 | Re-extract Mom 2023 PDFs via `scripts/extract-ieb-ls-2023.py` | 7 files; weak pages = blanks/cover; migration 002 still needs `SUPABASE_DB_URL` | Cursor |
| 2026-07-13 | Migration `002_question_bank_phase1a.sql` on cloud Supabase | Applied via SQL Editor; DB password reset (new password for Connect URI / CLI) | Tanielle |
| 2026-07-14 | Post-merge branch cleanup standard | Documented in ROADMAP / R3 / ADR-010; phase-0 + phase-1a branches deleted after merge | Tanielle + Cursor |
| 2026-07-14 | Phase 1B structured generation API | `npm run lint` + `npm run build`; assembler bank-first + memo derive + cost config; migration 003 authored (apply on Supabase before prod save) | Cursor |
| 2026-07-14 | Phase 1C review UX | `npm run lint` + `npm run build`; review route + Edit/Replace/Delete + live totals + proud bar; generate wired from wizard/dashboard | Cursor |
| 2026-07-14 | Migration `003_generation_phase1b.sql` on cloud Supabase | Applied via SQL Editor — `generated_content` / `generation_usage` ready for prod generate + review save | Tanielle |
| 2026-07-14 | Phase 1D export (Maths DOCX ZIP / LS PDF) | `npm run lint` + `npm run build`; `POST /api/export` + review download CTA; fidelity iterate vs exemplars | Cursor |
| 2026-07-16 | Post-merge export smoke (offline + local UI) | Offline: Maths ZIP 4 DOCX + LS PDF 7p (`scripts/smoke-export-phase1d.ts`); unauth export → 401; local `next start` (not `next dev` — EMFILE). UI: login → wizard Maths G12 cycle → Build → review (13 qs) → **Download Maths pack** → “Download started…” | Cursor |
| 2026-07-16 | InfoSec discipline + KaneAI eval (docs) | SECURITY_AND_THREAT_MODEL + ADR-015: prefer CI/Vitest/Playwright; KaneAI deferred | Cursor |
| 2026-07-16 | Phase 1E private template upload | `npm run lint` + `npm run build`; migration 004 authored (apply on Supabase); `/templates` + wizard select; ADR-016 | Cursor |
| 2026-07-16 | Migration `004_templates_phase1e.sql` on cloud Supabase | Applied via SQL Editor — private `templates` bucket + table ready for upload | Tanielle |

---

## Phase 0 exit — production smoke

**Prod URL:** https://assessment-builder-sooty.vercel.app/  
**Goal:** Prove parents can reach the app and save a draft without you beside them.  
**Pass rule:** Every step gets ✅. If anything fails, note the exact screen + error text before changing settings.

### A. Supabase setup (once)

| # | Action | Pass when |
|---|--------|-----------|
| A1 | **Authentication → Providers → Email** — Email provider **on**; **Enable sign ups** **on** | Signup no longer says “Email signups are disabled” |
| A2 | Same page: **Confirm email** = **off** for parent pilot (turn **on** before public launch) | New signup can log in immediately without inbox |
| A3 | **Authentication → URL configuration** | |
| | Site URL = `https://assessment-builder-sooty.vercel.app` | Saved |
| | Redirect URLs include both: `https://assessment-builder-sooty.vercel.app/auth/callback` **and** `http://localhost:3000/auth/callback` | Saved |

### B. Landing & auth (Chrome or Edge on laptop)

| # | Action | Pass when |
|---|--------|-----------|
| B1 | Open prod URL | Landing loads (no blank/error page) |
| B2 | Open **Sign up** | Form shows large text; name, school, email, password |
| B3 | Sign up with a **new** test email (not one already in Auth → Users) | Either dashboard **or** clear “confirm email” message — not a vague red error |
| B4 | If already registered: use **Log in** instead | Dashboard loads |
| B5 | Wrong password once | Message says incorrect email/password (not a blank fail) |
| B6 | Log out if UI allows, or clear site data, then log in again | Dashboard again |

### C. Maths happy path (Dad / CAPS)

| # | Action | Pass when |
|---|--------|-----------|
| C1 | Dashboard → create / new assessment | Wizard step 1 |
| C2 | Type → Curriculum: prefer **DBE**, subject **Mathematics**, grade 12, a term | Continue enabled |
| C3 | Scope: pick topics or whole term | Continue |
| C4 | Settings: marks + duration | Continue |
| C5 | Advanced: see **CAPS cognitive %** (Knowledge / Routine / Complex / Problem solving), **not** Bloom | Totals make sense; Continue / Save works when % = 100 |
| C6 | **Save and finish for now** | Returns to dashboard; assessment listed |
| C7 | Supabase → **Table Editor → `assessments`** | New row for your user; `wizard_data` JSON present |

### D. Life Sciences spot-check (Mom / Bloom)

| # | Action | Pass when |
|---|--------|-----------|
| D1 | New assessment → subject **Life Sciences** | Wizard accepts IEB or DBE as you choose |
| D2 | Advanced step shows **Bloom** focus (not Maths %) | Correct taxonomy |
| D3 | Save | Listed on dashboard + row in `assessments` |

### E. Done — report back

Reply in Cursor with: **“Phase 0 smoke passed”** (or list which step failed).  
Then we tick: Auth URL ✅, smoke ✅, Documentation Gate Phase 0 exit ✅, master **Phase 0 complete**.

---

## Analytics & insights (Data & Insights / Quant)

### Product metrics (implement Phase 3+)

| Metric | Why | Source (planned) |
|--------|-----|------------------|
| Signups | Growth | Supabase Auth |
| Assessments created | Activation | `assessments` insert |
| Generations / user / month | Cost + engagement | `generation_usage` (Phase 1B) |
| Exports | Value moment | export events |
| Template uploads | Differentiator usage | templates table |
| “Would use again” | Qualitative | Pilot form |

### Cost metrics (Quant)

| Metric | Why |
|--------|-----|
| AI $ (or R) per generation | Pricing floor |
| AI $ per active user / month | Tier sustainability |
| Error rate on generate | Reliability |
| Monthly generate count vs `GENERATION_MONTHLY_CAP` | Soft kill / 429 before runaway bill |

**Phase 1B note:** Default model is `bank-only` (no token cost). When `GENERATION_MODEL` is mini/flash + API key, tokens are capped by `GENERATION_MAX_TOKENS` and counted on `generation_usage.tokens_used`.

**Phase 1D note:** Export is on-demand binary generation from saved JSON — **no AI tokens**. Product analytics for “Exports” events still future (table above).

### Privacy

- Prefer aggregated analytics  
- No learner PII  
- Document any third-party analytics (e.g. Vercel Analytics, Plausible) in NORTH_STAR/privacy before enabling  

### Tooling backlog

- [ ] Vercel Analytics or privacy-friendly alternative  
- [x] Simple `generation_usage` table for generations (Phase 1B)  
- [ ] Monthly cost spreadsheet (acceptable until warehouse needed)

---

## Accessibility testing

See [design/UX_AND_ACCESSIBILITY.md](../design/UX_AND_ACCESSIBILITY.md).  
QA owns: keyboard pass + contrast spot-check on each UI release.

---

## Related

- ROADMAP Phase 2 hardening  
- architecture/OVERVIEW pipelines  
