# AssessMate — Roadmap, SDLC & Checklists

> **Purpose:** The plan you follow from “bootstrap done” → parents using MVP → public users → iterative features.  
> **Pair with:** [`NORTH_STAR.md`](./NORTH_STAR.md) · [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md) · [`learning/RUNBOOK.md`](./learning/RUNBOOK.md)  
> **In Cursor:** `@docs/ROADMAP_AND_CHECKLIST.md` (+ index / north star) at the start of a new chat.  
> **Last updated:** 16 July 2026

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
| `quality/SECURITY_AND_THREAT_MODEL.md` | InfoSec threat model + Phase 2 security checklist |
| `legal/COMPLIANCE.md` | POPIA, copyright, privacy/terms stub |
| `learning/RUNBOOK.md` | Process learnings, courses, ops runbook |
| `workflow-map.md` | Teacher journey |
| `parent-interview-notes.md` | Interview evidence |
| `parent-samples/` | Curriculum exemplars |
| `README.md` | How to run the app |

---

## Documentation Gate (mandatory — every feature & phase)

A feature or phase is **not done** until applicable boxes are checked:

- [x] **PO/BA:** Acceptance criteria met; ROADMAP ticks updated — Phase 1E template upload
- [x] **Architect:** Stack/data/security choice → ADR in `architecture/DECISIONS.md` (+ OVERVIEW if needed) — ADR-016 + OVERVIEW templates layer
- [x] **UX/Design:** UI change → `design/UX_AND_ACCESSIBILITY.md` (or note N/A) — `/templates` + wizard select + busy upload
- [x] **QA:** Tests recorded in `quality/TESTING_AND_ANALYTICS.md` (manual log and/or automated) — lint/build + migration 004 notes
- [x] **Data/Quant:** Metrics/cost behaviour → analytics/cost section updated (or N/A) — N/A (storage only; Free soft-cap 1 pack)
- [x] **Learning:** Process/tool learned → `learning/RUNBOOK.md` (+ courses if relevant) — R12 templates
- [x] **Support/Change:** User-facing or rollout change → README / pilot / support notes — README migration 004 + templates path
- [x] **NORTH_STAR:** Only if users/scope/pricing/principles changed — MVP flow includes private template upload

**Phase exit also:**

- [x] `DOCUMENTATION_INDEX.md` discipline table still accurate
- [x] Open documentation debt listed (below) is honest

### Open documentation debt

- [x] Commit/push documentation system + outstanding app changes to GitHub
- [ ] Vitest + coverage reporting (Phase 2); link from quality doc
- [ ] Privacy policy page (Phase 2–4)
- [ ] ADR when enabling product analytics
- [x] Production smoke / Auth path documented (optional: re-confirm Table Editor row + LS save)
- [x] Branch-first + draft PR standard (ADR-010)
- [x] Run `002_question_bank_phase1a.sql` in Supabase — applied via SQL Editor (13 Jul 2026); DB password reset same day (store in password manager; Connect button for CLI URI if needed)
- [x] Optional OCR of Mom’s 2023 question papers — local `_extracts/` (gitignored); lined blanks confirmed; see EXTRACT_INDEX.md + `scripts/extract-ieb-ls-2023.py`
- [x] Run `003_generation_phase1b.sql` in Supabase before prod generate saves (SQL Editor) — applied 14 Jul 2026
- [ ] Run `004_templates_phase1e.sql` in Supabase before prod template upload (SQL Editor or `npm run db:migrate:004`)

---

## Current snapshot (as of 16 July 2026)

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
- [x] Phase 1A content / seed bank / migration 002
- [x] Phase 1B structured generation API (`POST /api/generate`, migration 003)
- [x] Phase 1C review UX (`/assessments/[id]/review`)
- [x] Phase 1D export (`POST /api/export` — Maths DOCX ZIP / LS PDF)
- [x] Phase 1E template upload thin slice (Storage + select; Private only) — apply migration 004 on cloud

### Not done yet (blocks “in parents’ hands” for generation)

- [x] Commit/push outstanding local docs + auth/wizard improvements
- [x] Vercel deploy + production Supabase env
- [x] Question bank / extraction (seed + API assembly)
- [x] Review UI (Phase 1C)
- [x] Export into Dad/Mom templates (Phase 1D)
- [ ] Parent pilot protocol + feedback loop
- [x] Apply migration `003_generation_phase1b.sql` on cloud Supabase — applied 14 Jul 2026
- [ ] Apply migration `004_templates_phase1e.sql` on cloud Supabase

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
Phase 0  Foundation & hygiene          ← EXITED 11 July 2026
Phase 1  Parent MVP (generate+export)  ← IN PROGRESS — next: Phase 1 DoD / parent pilot prep
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
**Status:** **Complete** (11 July 2026) — prod live; wizard smoke + UX polish shipped; branch-first standard adopted for Phase 1+.

### Product / docs

- [x] North star written
- [x] Interviews captured
- [x] Parent samples filed (structured folders)
- [x] Documentation index + discipline map + learning runbook
- [x] Push all outstanding work to `main` (docs, cognitive wizard, auth messages, `.cursor/rules`)
- [x] Confirm Dad = DBE/CAPS/GDE (**confirmed** 11 July 2026 — CAPS Maths)
- [x] **Documentation Gate** completed for Phase 0 exit

### Engineering

- [x] Local `npm run dev` works with `.env.local`
- [x] Supabase project + SQL migration run
- [x] Auth URL config: Site URL + redirect `…/auth/callback` (local + prod `https://assessment-builder-sooty.vercel.app`) — re-check if login redirects break
- [x] Email confirm strategy for testing: **off for parents/pilot**, **on for public launch**
- [x] Vercel project linked to GitHub
- [x] Production env vars on Vercel (`NEXT_PUBLIC_SUPABASE_*`)
- [x] Smoke test: signup → wizard → save (prod wizard completed 11 Jul; confirm `assessments` row in Table Editor if not already)

### Phase 0 exit — manual checklist

Full script: [`quality/TESTING_AND_ANALYTICS.md`](./quality/TESTING_AND_ANALYTICS.md#phase-0-exit--production-smoke).

- [x] Supabase Email provider / signups; confirm-email strategy for pilot
- [x] Prod landing + login + wizard path
- [x] Maths CAPS cognitive UI in wizard
- [x] UX polish from smoke feedback (back link, auth busy, step focus, curriculum cascade)
- [ ] Optional double-check: Life Sciences Bloom save + Table Editor row

### Exit criteria

- [x] Clean `git status` on `main` (or known open issues listed below)
- [x] Staging/production URL loads landing + login — https://assessment-builder-sooty.vercel.app/

**Open issues / debt to track**

- [x] Commit uncommitted local changes before Phase 1 deep work
- [ ] Optional: GitHub Actions CI (`lint` + `build` on PR)
- [x] Production Auth redirects + smoke (wizard path); keep Auth URL allowlist in sync if domain changes
- [x] **Branch-first / draft PR** standard documented (do not push feature work straight to `main`)

---

## Phase 1 — Parent MVP (build)

**Goal:** End-to-end generate → edit → export for **one happy path per parent**.

### 1A — Content & templates (platform first)

- [x] Admin/script: ingest Dad’s cognitive guide into app copy + validators (already partially in wizard)
- [x] Parse/structure Dad’s June pack as **template pack v1** (paper + memo + answer book layout notes)
- [x] Ingest Mom’s **analysis grids** as Bloom/taxonomy pattern for Life Sciences
- [x] Seed a small **question bank** (start manual: 20–50 Maths + 20–50 LS questions with metadata)
- [x] Optional: PDF text extract for Mom’s 2023 papers (OCR if needed) — local `_extracts/` via `scripts/extract-ieb-ls-2023.py`; lined blanks confirmed; see EXTRACT_INDEX.md

### 1B — Generation pipeline

- [x] API route: assemble assessment JSON from wizard + question bank (+ light AI fill gaps)
- [x] Maths: validate cognitive % (20/35/30/15)
- [x] Life Sciences: attach Bloom levels per question
- [x] Derive memo from locked questions (don’t regenerate paper from scratch for memo)
- [x] Cost controls: model choice (mini/flash), max tokens, per-user monthly generation cap

### 1C — Review UX

- [x] Review screen: list questions with Edit / Replace / Delete
- [x] Live totals: marks + cognitive/Bloom distribution
- [x] “Proud to present” bar: flags missing memo points, marks mismatch

### 1D — Export

- [x] DOCX export for Maths using Dad-style structure (iterate toward pixel fidelity)
- [x] PDF export for Life Sciences (Arial 12, 1.5 spacing — Mom rules)
- [x] Include memo (+ answer book for Maths when applicable)
- [x] Cognitive / Bloom summary sheet

### 1E — Template upload (thin slice)

- [x] Upload school cover / template pack (store in Supabase Storage)
- [x] Select template when creating assessment
- [x] Private only (no school sharing yet)

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

### Pilot briefings (say out loud before they download)

**Export fidelity (Tanielle → parents):**

- [ ] Remind: download is **close in structure**, not yet a look-alike of Dad’s Word template / Mom’s exact past-paper layout  
- [ ] Maths = generated DOCX pack (sections + K/R/C/P + answer book + CAPS sheet), **not** a fill of his June 2026 `.docx` binary  
- [ ] Ask separately: “Would you use the **workflow** again?” and “Is **formatting** good enough for moderation yet?”  
- [ ] Capture formatting gaps as a fidelity backlog (do not treat as Phase 1 failure if content is usable)

**Sample uploads (expand data before / during pilot):**

- [ ] Check wishlist in [`parent-samples/README.md`](./parent-samples/README.md) → **Wanted before / during parent pilot**  
- [ ] After they drop files: update folder `MANIFEST.md` + [`NORTH_STAR.md`](./NORTH_STAR.md) Artifacts table  
- [ ] Cursor rule: `.cursor/rules/parent-pilot-reminders.mdc` (re-surfaces this in pilot chats)

### Quality & safety

- [ ] Privacy policy draft (no learner PII in MVP)
- [ ] Account delete path
- [ ] Error monitoring (e.g. Sentry free tier)
- [ ] Logging for generation failures (no secrets in logs)
- [ ] Backup awareness: Supabase backups / export assessments JSON
- [ ] **InfoSec checklist** — Phase 2 section in [`quality/SECURITY_AND_THREAT_MODEL.md`](./quality/SECURITY_AND_THREAT_MODEL.md) (RLS audit, adversarial hour, rate limits)
- [ ] CI lint + build on PR (ADR-015) — catch AI-introduced breakages early

### Engineering hardening

- [ ] CI: `npm run lint` + `npm run build` on PR
- [ ] Basic tests: cognitive total validator, title builder, auth error messages (Vitest)
- [ ] Playwright happy-path smoke when automating E2E (KaneAI deferred — ADR-015)
- [ ] Rate limit generation API
- [x] Loading / empty / error states reviewed for 50s+ UX (see `design/UX_AND_ACCESSIBILITY.md` standards from Phase 0 smoke)
- [x] Wizard polish: always-visible back link; scroll+focus on step change; login busy until dashboard
- [x] Curriculum cascade matrix (exam body → subject → grade availability)

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
7. Release    → merge → **delete feature branch** → Vercel deploy → smoke test prod
8. Learn      → feedback → update NORTH_STAR / this checklist
```

### Branching (mandatory — start here every feature)

**Do this first, before coding the next feature:**

```bash
git checkout main
git pull origin main
git checkout -b cursor/<short-topic>   # or feature/<short-topic>
```

| Rule | Why |
|------|-----|
| **Never commit feature work straight to `main`** | Empty PRs / no review surface; Phase 0 taught this the hard way |
| Branch naming | `cursor/…` (agent sessions) or `feature/…` (manual) — one concern per branch |
| Open a **draft PR early** | `gh pr create --draft --base main` after first push |
| Merge → then Vercel prod | Only merge when lint/build + smoke notes are OK |
| **After merge: clean up the branch** | Delete local + remote feature branch so only `main` (and active work) remains |
| `main` stays deployable | Hotfixes only; still prefer a tiny branch if possible |

```text
main (deployable)
  └── cursor/phase-…  → draft PR → review → merge → delete branch → Vercel
```

**After every merge (mandatory cleanup):**

```bash
git checkout main
git pull origin main
git branch -d cursor/<short-topic>          # local (use -D only if Git complains after squash merge)
git push origin --delete cursor/<short-topic>
git fetch --prune
```

Safe when the PR is merged: a squash merge keeps the **tree** on `main` even if the tip commit is not an ancestor. You only drop the branch *name* and granular tip SHAs — not the merged files. Also delete any older merged `cursor/…` / `feature/…` remotes sitting around.

**Anti-pattern:** push commits to `main` all session, then try to open a PR from a same-tip branch (GitHub: “No commits between main and …”).  
**Anti-pattern:** leave merged `cursor/…` branches on GitHub “just in case” — they clutter the next session and confuse which tip to branch from.  

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
- [ ] PR merged to `main` **and** feature branch deleted (local + remote)  

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

- [ ] RLS on user data tables (re-audit — see SECURITY_AND_THREAT_MODEL)
- [x] Generation API checks session
- [x] Export API checks session (Phase 1D)
- [x] Template upload: session + RLS + private Storage path prefix (Phase 1E / ADR-016)
- [ ] Generation rate limits
- [ ] POPIA-minded: no learner marks/PII in MVP (product rule; remind on template upload)
- [ ] Redirect URLs allowlist (localhost + production domain) — re-confirm after auth changes
- [ ] Lightweight adversarial / pen-test hour before closed beta

### AI / cost pipeline

- [x] Structured JSON output (schema), not free-form prose only
- [x] RAG / question bank before “invent everything”
- [x] Cap generations per user per month
- [ ] Log token usage monthly (spreadsheet is fine at first) — `generation_usage` table is the app log; spreadsheet optional
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
| Content / Curriculum | CAPS vs Bloom; bank + parent samples | NORTH_STAR, parent-samples, `lib/content` |
| Legal / Compliance | POPIA, copyright, privacy/terms | legal/COMPLIANCE |
| Quality/Testing | Strategy, coverage, UAT | quality/TESTING_AND_ANALYTICS |
| InfoSec / Cyber | Threat model, RLS/authz, light adversarial pass | quality/SECURITY_AND_THREAT_MODEL |
| DevOps / SRE | Deploy, CI, env, incidents | OVERVIEW, RUNBOOK, ROADMAP CI |
| Product Marketing / Comms | Landing, pilot messaging | NORTH_STAR, landing page |
| Data & Insights | Funnels, AI cost logs | quality/TESTING_AND_ANALYTICS |
| Change Manager | Pilots, school rollout comms | ROADMAP Phase 2–5 |
| Support Analyst | Auth issues, how-tos | learning/RUNBOOK, README |

Cursor is your pair programmer — still **you** own go/no-go, Documentation Gate, and parent demos.

---

## Suggested “next chat” prompts

Copy-paste to start the next session:

1. **Improve export fidelity (use uploaded packs next):**  
   `Using Dad’s files under docs/parent-samples/mathematics/dbe/grade-12/ and Phase 1E linked templates, tighten DOCX export toward June 2026 pack. New cursor/ branch. Update design + architecture docs. Note structure-first ADR-014 until pixel fidelity improves.`

2. **Parent pilot prep:**  
   `Draft Phase 2 parent pilot script from @docs/ROADMAP_AND_CHECKLIST.md (Change Manager + QA + parent-pilot-reminders). Include export-fidelity briefing + sample wishlist + private template upload reminder.`

3. **Learning catch-up:**  
   `Review @docs/learning/RUNBOOK.md and suggest the next course module I should study this week based on Phase 2 InfoSec / Storage needs.`

4. **Apply migration 004 on cloud:**  
   `Paste supabase/migrations/004_templates_phase1e.sql in Supabase SQL Editor (or npm run db:migrate:004). Smoke /templates upload + wizard select.`

---

## Master checkbox — where am I?

Tick the highest phase you’ve **exited**:

- [x] Discovery / north star  
- [x] Documentation system (disciplines + learning runbook + doc gate)  
- [x] Phase 0 complete (hygiene + deploy + doc gate) — 11 July 2026  
- [ ] Phase 1 complete (parent MVP generate+export) — 1A–1E built; DoD = parent “use again?”  
- [ ] Phase 2 complete (pilot hardened)  
- [ ] Phase 3 complete (closed beta)  
- [ ] Phase 4 complete (public users)  
- [ ] Phase 5 complete (school templates)  
- [ ] Phase 6 ongoing (iteration)

**Next action right now:** Apply **migration 004** on cloud Supabase, then **Phase 1 DoD / parent pilot prep** (or export fidelity). After each merge: clean up the feature branch (local + remote).

