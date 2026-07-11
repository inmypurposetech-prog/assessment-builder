# AssessMate — Roadmap, SDLC & Checklists

> **Purpose:** The plan you follow from “bootstrap done” → parents using MVP → public users → iterative features.  
> **Pair with:** [`NORTH_STAR.md`](./NORTH_STAR.md) · [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md) · [`learning/RUNBOOK.md`](./learning/RUNBOOK.md)  
> **In Cursor:** `@docs/ROADMAP_AND_CHECKLIST.md` (+ index / north star) at the start of a new chat.  
> **Last updated:** 11 July 2026

---

## How to use this document

1. Work **one phase at a time**; don’t skip Definition of Done.
2. Tick checkboxes as you complete items (`[ ]` → `[x]`).
3. Start a new Cursor chat with: *“Continue AssessMate from `@docs/ROADMAP_AND_CHECKLIST.md` — next unchecked item in Phase X.”*
4. After major decisions, update **NORTH_STAR** (why), **ADRs** (`architecture/DECISIONS.md`), and **this file** (what’s done / next).
5. **Never skip the Documentation Gate** — documentation is part of delivery, not cleanup.

### Document map

| Doc | Use for |
|-----|---------|
| `NORTH_STAR.md` | Product, users, pricing philosophy, templates |
| `DOCUMENTATION_INDEX.md` | All docs + workplace disciplines + doc gate |
| `ROADMAP_AND_CHECKLIST.md` (this) | Phases, SDLC, engineering pipeline, checklists |
| `architecture/OVERVIEW.md` | System architecture, frameworks, pipelines |
| `architecture/DECISIONS.md` | ADRs (technical & business choices) |
| `design/UX_AND_ACCESSIBILITY.md` | UX, design system, a11y |
| `quality/TESTING_AND_ANALYTICS.md` | Tests, coverage, usage analytics |
| `learning/RUNBOOK.md` | Process learnings, courses, ops runbook |
| `workflow-map.md` | Teacher journey |
| `parent-interview-notes.md` | Interview evidence |
| `parent-samples/` | Curriculum exemplars |
| `README.md` | How to run the app |

---

## Documentation Gate (mandatory — every feature & phase)

A feature or phase is **not done** until applicable boxes are checked:

- [x] **PO/BA:** Acceptance criteria met; ROADMAP ticks updated
- [x] **Architect:** Stack/data/security choice → ADR in `architecture/DECISIONS.md` (+ OVERVIEW if needed) — ADR-009 Vercel
- [x] **UX/Design:** UI change → `design/UX_AND_ACCESSIBILITY.md` (or note N/A) — signup/login error copy
- [x] **QA:** Tests recorded in `quality/TESTING_AND_ANALYTICS.md` (manual log and/or automated) — lint/build + prod signup notes
- [x] **Data/Quant:** Metrics/cost behaviour → analytics/cost section updated (or N/A) — N/A for Phase 0 deploy
- [x] **Learning:** Process/tool learned → `learning/RUNBOOK.md` (+ courses if relevant) — R4 Vercel + signup support rows
- [x] **Support/Change:** User-facing or rollout change → README / pilot / support notes — README deploy steps
- [x] **NORTH_STAR:** Only if users/scope/pricing/principles changed — N/A (no product scope change)

**Phase exit also:**

- [x] `DOCUMENTATION_INDEX.md` discipline table still accurate
- [x] Open documentation debt listed (below) is honest

### Open documentation debt

- [x] Commit/push documentation system + outstanding app changes to GitHub
- [ ] Vitest + coverage reporting (Phase 2); link from quality doc
- [ ] Privacy policy page (Phase 2–4)
- [ ] ADR when enabling product analytics
- [ ] Production smoke test logged after first Vercel URL + Auth redirects

---

## Current snapshot (as of 11 July 2026)

### Done

- [x] Product discovery (parent interviews)
- [x] North star + Cursor always-on rule
- [x] Next.js 16 + Supabase auth + dashboard + 5-step wizard
- [x] Maths cognitive levels vs Life Sciences Bloom in wizard
- [x] DB schema migration (`001_initial_schema.sql`)
- [x] GitHub repo: `inmypurposetech-prog/assessment-builder`
- [x] Parent samples: Mom IEB LS 2023 finals; Dad Maths June 2026 P2 + cognitive guide + template exemplars
- [x] Documentation system (index, architecture, ADRs, UX/a11y, quality/analytics, learning runbook)
- [x] Workplace disciplines mapped (PO → Support) in DOCUMENTATION_INDEX
- [x] Vercel production deploy: https://assessment-builder-sooty.vercel.app/

### Not done yet (blocks “in parents’ hands” for generation)

- [x] Commit/push outstanding local docs + auth/wizard improvements
- [x] Vercel deploy + production Supabase env
- [ ] Question bank / extraction
- [ ] AI generate + review + export into Dad/Mom templates
- [ ] Parent pilot protocol + feedback loop

### Definition of “MVP in parents’ hands”

Dad or Mom can, **without you sitting next to them**:

1. Log in on a laptop  
2. Create a Grade 12 assessment (Maths **or** Life Sciences) in under ~20 minutes  
3. Get a draft paper + memo they can edit  
4. Download something **close enough to their template** to take to moderation / use next term  
5. Answer **yes** to: *“Would you use this again next term?”*

### Definition of “MVP in users’ hands”

Same as above, plus:

- Public signup (or invite-only beta) on a stable URL  
- Privacy basics + email confirm / auth that works  
- Soft generation limits (no runaway AI bill)  
- You can support 5–15 educators without breaking the app daily  

---

## Phase overview

```text
Phase 0  Foundation & hygiene          ← deploy live; finish auth smoke then exit
Phase 1  Parent MVP (generate+export)  ← next major build
Phase 2  Parent pilot & harden
Phase 3  Closed beta (other educators)
Phase 4  Public launch (Teacher tier)
Phase 5  School templates & sharing
Phase 6  Iterative features (ongoing)
```

Rough calendar if part-time (~5–10 hrs/week): Phase 1 ≈ 4–8 weeks · Phase 2 ≈ 2–4 weeks · Phase 3–4 ≈ 4–8 weeks. Adjust freely.

---

## Phase 0 — Foundation & hygiene

**Goal:** Repo, env, docs, and deploy path are trustworthy before more features.

### Product / docs

- [x] North star written
- [x] Interviews captured
- [x] Parent samples filed (structured folders)
- [x] Documentation index + discipline map + learning runbook
- [x] Push all outstanding work to `main` (docs, cognitive wizard, auth messages, `.cursor/rules`)
- [x] Confirm Dad = DBE/CAPS/GDE (**confirmed** 11 July 2026 — CAPS Maths)
- [ ] **Documentation Gate** completed for Phase 0 exit (gate boxes done; tick after smoke below)

### Engineering

- [x] Local `npm run dev` works with `.env.local`
- [x] Supabase project + SQL migration run
- [ ] Auth URL config: Site URL + redirect `…/auth/callback` (local done; **you must verify prod** — see Phase 0 exit test below)
- [x] Email confirm strategy for testing: **off for parents/pilot**, **on for public launch** (documented; flip in Supabase Providers → Email)
- [x] Vercel project linked to GitHub
- [x] Production env vars on Vercel (`NEXT_PUBLIC_SUPABASE_*`)
- [ ] Smoke test: signup → wizard → save → row in Supabase Table Editor

### Phase 0 exit — manual checklist (do this now)

Full script: [`quality/TESTING_AND_ANALYTICS.md`](./quality/TESTING_AND_ANALYTICS.md#phase-0-exit--production-smoke).

1. Supabase Auth URLs + Email provider (signups on; confirm email off for pilot)
2. Prod landing + signup + login
3. Maths wizard (CAPS cognitive %) → save → row in Table Editor
4. Life Sciences wizard (Bloom) → save
5. Tell Cursor “Phase 0 smoke passed” → tick remaining boxes + master Phase 0

### Exit criteria

- [x] Clean `git status` on `main` (or known open issues listed below)
- [x] Staging/production URL loads landing + login — https://assessment-builder-sooty.vercel.app/

**Open issues / debt to track**

- [x] Commit uncommitted local changes before Phase 1 deep work
- [ ] Optional: GitHub Actions CI (`lint` + `build` on PR)
- [ ] Production Auth redirects + smoke test after first Vercel deploy

---

## Phase 1 — Parent MVP (build)

**Goal:** End-to-end generate → edit → export for **one happy path per parent**.

### 1A — Content & templates (platform first)

- [ ] Admin/script: ingest Dad’s cognitive guide into app copy + validators (already partially in wizard)
- [ ] Parse/structure Dad’s June pack as **template pack v1** (paper + memo + answer book layout notes)
- [ ] Ingest Mom’s **analysis grids** as Bloom/taxonomy pattern for Life Sciences
- [ ] Seed a small **question bank** (start manual: 20–50 Maths + 20–50 LS questions with metadata)
- [ ] Optional: PDF text extract for Mom’s 2023 papers (OCR if needed)

### 1B — Generation pipeline

- [ ] API route: assemble assessment JSON from wizard + question bank (+ light AI fill gaps)
- [ ] Maths: validate cognitive % (20/35/30/15)
- [ ] Life Sciences: attach Bloom levels per question
- [ ] Derive memo from locked questions (don’t regenerate paper from scratch for memo)
- [ ] Cost controls: model choice (mini/flash), max tokens, per-user monthly generation cap

### 1C — Review UX

- [ ] Review screen: list questions with Edit / Replace / Delete
- [ ] Live totals: marks + cognitive/Bloom distribution
- [ ] “Proud to present” bar: flags missing memo points, marks mismatch

### 1D — Export

- [ ] DOCX export for Maths using Dad-style structure (iterate toward pixel fidelity)
- [ ] PDF export for Life Sciences (Arial 12, 1.5 spacing — Mom rules)
- [ ] Include memo (+ answer book for Maths when applicable)
- [ ] Cognitive / Bloom summary sheet

### 1E — Template upload (thin slice)

- [ ] Upload school cover / template pack (store in Supabase Storage)
- [ ] Select template when creating assessment
- [ ] Private only (no school sharing yet)

### Phase 1 Definition of Done

- [ ] Dad completes one June-style cycle/exam draft and downloads DOCX pack  
- [ ] Mom completes one LS cycle-test-style draft and downloads PDF  
- [ ] Both say they would try it again (even if formatting isn’t perfect yet)
- [ ] **Documentation Gate** complete (ADRs for AI/export choices, RUNBOOK learnings, quality test log, architecture overview updated for generate/export pipelines)

---

## Phase 2 — Parent pilot & harden

**Goal:** Reliability and trust before inviting outsiders.

### Pilot protocol

- [ ] Written pilot script (15–20 min task per parent)
- [ ] Feedback form: time saved, quality 1–5, blockers, “use next term?”
- [ ] 2–3 real assessments each over 2 weeks
- [ ] Bug bash: login, save, generate failure modes, export on Windows if they use it

### Quality & safety

- [ ] Privacy policy draft (no learner PII in MVP)
- [ ] Account delete path
- [ ] Error monitoring (e.g. Sentry free tier)
- [ ] Logging for generation failures (no secrets in logs)
- [ ] Backup awareness: Supabase backups / export assessments JSON

### Engineering hardening

- [ ] CI: `npm run lint` + `npm run build` on PR
- [ ] Basic tests: cognitive total validator, title builder, auth error messages
- [ ] Rate limit generation API
- [ ] Loading / empty / error states reviewed for 50s+ UX

### Exit criteria

- [ ] No P0 bugs for parent happy path
- [ ] AI monthly cost understood and capped
- [ ] Go / no-go for closed beta

---

## Phase 3 — Closed beta (other educators)

**Goal:** 5–15 teachers beyond parents (school colleagues first).

### Product

- [ ] Invite-only signup or allowlist emails
- [ ] Onboarding: one-screen “how this works” + example assessment
- [ ] Free tier limits enforced
- [ ] Feedback channel (WhatsApp group / form / in-app)

### Ops

- [ ] Support playbook: reset password, confirm email, failed generate
- [ ] Weekly metrics: signups, generations, exports, errors
- [ ] Copyright reminder: users upload own materials; don’t redistribute past papers

### Exit criteria

- [ ] ≥3 non-parent educators complete a full paper  
- [ ] Clear list of top 5 feature requests  
- [ ] Decision: launch Teacher paid tier or stay free longer

---

## Phase 4 — Public launch (users’ hands)

**Goal:** Anyone can sign up; sustainable cost + clear offer.

### Go-to-market

- [ ] Landing page copy updated (value prop from interviews)
- [ ] Pricing page: Free / Teacher (School “coming soon”)
- [ ] PayFast (or chosen SA payment) for Teacher subscription
- [ ] Terms of use + privacy published
- [ ] Email confirmation **on**

### Engineering

- [ ] Production monitoring alerts
- [ ] Status/incident note template
- [ ] Database migration process documented (always via SQL files in `supabase/migrations/`)

### Exit criteria

- [ ] First paying Teacher **or** deliberate free-beta extension with date  
- [ ] Support load manageable solo

---

## Phase 5 — School templates & sharing

**Goal:** Monetise collaboration the way departments already work.

- [ ] School / org entity + invite teachers
- [ ] Template visibility: Private | School (subject-scoped)
- [ ] Shared template library UI
- [ ] School subscription billing
- [ ] Admin: remove member, archive template

See NORTH_STAR § Templates & sharing for pricing philosophy.

---

## Phase 6 — Iterative feature backlog (prioritise after pilots)

Order is suggestive — re-rank after parent/beta feedback.

| Priority | Feature | Notes |
|----------|---------|-------|
| High | Better template fidelity (Dad DOCX / Mom PDF) | Core differentiator |
| High | Diagrams for Life Sciences | Mom’s #1 pain |
| High | Assessment Builder (bank left / paper right) | Trust + control |
| Medium | Email to moderator | Workflow complete |
| Medium | Version history / moderation states | Draft → submitted → approved |
| Medium | More subjects via request queue | Growth |
| Lower | SATAP Paper 2 sources | Complex; Phase 3+ product |
| Lower | PAT / practicals | Complex |
| Lower | Public template gallery | Legal + moderation |
| Lower | Azure Track B | Certs / B2G readiness |
| Lower | Afrikaans UI | Demand-driven |
| Lower | SA-SAMS / B2G | Long sales cycle |

---

## SDLC — how we build every feature

Use this loop for **each** feature (generation, export, templates, etc.).

```text
1. Discover   → confirm in NORTH_STAR / parent need
2. Specify    → short acceptance criteria (3–7 bullets)
3. Design     → UX for 50s+ (one primary action); data model sketch
4. Implement  → small PR on a branch
5. Verify     → lint, build, manual test checklist
6. Review     → you + Cursor; parents if user-facing
7. Release    → merge → Vercel deploy → smoke test prod
8. Learn      → feedback → update NORTH_STAR / this checklist
```

### Branching

- `main` — always deployable  
- `feature/…` — one concern per branch  
- Prefer small PRs over giant “AI everything” commits  

### Environments

| Env | Purpose |
|-----|---------|
| Local | `.env.local` + `npm run dev` |
| Preview | Vercel PR previews (optional) |
| Production | Vercel production + Supabase project |

### Definition of Done (every feature)

- [ ] Matches acceptance criteria  
- [ ] Works on desktop Chrome/Edge (parents’ likely browsers)  
- [ ] Large text / plain language preserved  
- [ ] No secrets committed  
- [ ] Migration added if schema changed  
- [ ] NORTH_STAR or this checklist updated if scope changed  
- [ ] **Documentation Gate** completed (see top of this file)  

---

## Engineering pipeline checklist

### Repo & quality

- [x] ESLint passes (`npm run lint`)
- [x] Production build passes (`npm run build`)
- [ ] TypeScript strict — no ignore-spam
- [x] `.env*` gitignored; `.env.example` documented
- [x] Parent PDFs/DOCX gitignored under `docs/parent-samples/**`

### CI/CD (add in Phase 2)

- [ ] GitHub Action: install → lint → build on pull request
- [x] Vercel auto-deploy `main`
- [ ] Protect `main` (optional): require CI green

### Data & migrations

- [x] All schema changes as numbered files in `supabase/migrations/`
- [x] Run in Supabase SQL Editor (or CLI later)
- [ ] Never hand-edit prod schema without a migration file
- [x] RLS policies reviewed when new tables added

### Auth & security

- [ ] RLS on user data tables
- [ ] Generation API checks session
- [ ] Generation rate limits
- [ ] POPIA-minded: no learner marks/PII in MVP
- [ ] Redirect URLs allowlist (localhost + production domain)

### AI / cost pipeline

- [ ] Structured JSON output (schema), not free-form prose only
- [ ] RAG / question bank before “invent everything”
- [ ] Cap generations per user per month
- [ ] Log token usage monthly (spreadsheet is fine at first)
- [ ] Kill switch: disable generate if budget exceeded

### Observability

- [ ] Sentry (or similar) for client/server errors
- [ ] Simple product metrics: assessments created, generates, exports

### Testing pyramid (grow over time)

| Layer | Start with |
|-------|------------|
| Unit | Cognitive % total, title builder, auth message mapping |
| Integration | Save assessment server action (optional) |
| E2E | Manual script for parents; Playwright later |
| UAT | Parent pilot protocol |

---

## Roles (solo founder reality)

| Hat | You do | Primary docs |
|-----|--------|--------------|
| Product Owner | Prioritise phases; parent “would you use this?” | NORTH_STAR, ROADMAP |
| Business Architect | Value streams; pricing/capability | NORTH_STAR |
| Tech/Systems Architect | Stack, security, evolution | architecture/* |
| Business/Systems Analyst | Requirements; acceptance criteria | interviews, workflow, ROADMAP |
| UX/UI + Design System | Wizard UX; tokens/components | design/UX_AND_ACCESSIBILITY |
| Frontend / Backend | Next.js + server actions/API | architecture/OVERVIEW, code |
| Database Architect | Schema, RLS, migrations | migrations + OVERVIEW |
| Quant | Cognitive validators; unit economics | NORTH_STAR, quality doc |
| Quality/Testing | Strategy, coverage, UAT | quality/TESTING_AND_ANALYTICS |
| Data & Insights | Funnels, AI cost logs | quality/TESTING_AND_ANALYTICS |
| Change Manager | Pilots, school rollout comms | ROADMAP Phase 2–5 |
| Support Analyst | Auth issues, how-tos | learning/RUNBOOK, README |

Cursor is your pair programmer — still **you** own go/no-go, Documentation Gate, and parent demos.

---

## Suggested “next chat” prompts

Copy-paste to start the next session:

1. **Close Phase 0:**  
   `Commit and push outstanding AssessMate work, then set up Vercel from @docs/ROADMAP_AND_CHECKLIST.md Phase 0. Complete Documentation Gate. Load @docs/DOCUMENTATION_INDEX.md @docs/NORTH_STAR.md @docs/learning/RUNBOOK.md.`

2. **Start Phase 1 generation:**  
   `Continue AssessMate Phase 1B from @docs/ROADMAP_AND_CHECKLIST.md — structured generation API. Update ADRs + RUNBOOK + architecture overview as part of Documentation Gate. @docs/NORTH_STAR.md`

3. **Template export:**  
   `Using Dad’s files under docs/parent-samples/mathematics/dbe/grade-12/, plan DOCX export matching June 2026 pack. Update design + architecture docs.`

4. **Learning catch-up:**  
   `Review @docs/learning/RUNBOOK.md and suggest the next course module I should study this week based on Phase 1 needs.`

5. **Parent pilot:**  
   `Draft Phase 2 parent pilot script from @docs/ROADMAP_AND_CHECKLIST.md (Change Manager + QA lenses).`

---

## Master checkbox — where am I?

Tick the highest phase you’ve **exited**:

- [x] Discovery / north star  
- [x] Documentation system (disciplines + learning runbook + doc gate)  
- [ ] Phase 0 complete (hygiene + deploy + doc gate)  
- [ ] Phase 1 complete (parent MVP generate+export)  
- [ ] Phase 2 complete (pilot hardened)  
- [ ] Phase 3 complete (closed beta)  
- [ ] Phase 4 complete (public users)  
- [ ] Phase 5 complete (school templates)  
- [ ] Phase 6 ongoing (iteration)

**Next action right now:** Run **Phase 0 exit smoke** in [`quality/TESTING_AND_ANALYTICS.md`](./quality/TESTING_AND_ANALYTICS.md#phase-0-exit--production-smoke), then begin Phase 1A/1B.
