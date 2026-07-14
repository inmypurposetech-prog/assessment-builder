# AssessMate — Documentation Index

> **Purpose:** Map of all project docs, which workplace **discipline** owns each concern, and the **Documentation Gate** so docs never become an afterthought.  
> **Audience:** You (solo) now; future collaborators or readers later.  
> **Last updated:** 11 July 2026 (Phase 1A)

---

## How to use this system (solo, but “team-shaped”)

You wear every hat. Each discipline below is a **lens**, not a hiring plan. When you finish work, update the docs listed under that lens.

**Rule:** No phase or feature is done until the [Documentation Gate](#documentation-gate-mandatory) is checked.

In Cursor, start sessions with:

```text
@docs/DOCUMENTATION_INDEX.md @docs/NORTH_STAR.md @docs/ROADMAP_AND_CHECKLIST.md
```

**Git:** Create/checkout a `cursor/…` or `feature/…` branch **before** implementing; open a draft PR into `main` (ADR-010). Do not feature-commit on `main`. After merge, delete the feature branch (local + remote).

After a learning-heavy task (e.g. Supabase, Vercel, AI):

```text
Update @docs/learning/RUNBOOK.md with what we just learned and any follow-up courses.
```

---

## Document map

| Doc | Primary disciplines | Contents |
|-----|---------------------|----------|
| [NORTH_STAR.md](./NORTH_STAR.md) | Product Owner, Business Architect | Vision, users, principles, pricing, scope |
| [ROADMAP_AND_CHECKLIST.md](./ROADMAP_AND_CHECKLIST.md) | PO, Change, all engineers | Phases, SDLC, checklists |
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) (this) | All | Index, RACI, doc gate |
| [workflow-map.md](./workflow-map.md) | BA, UX, Frontend | Teacher journey |
| [parent-interview-notes.md](./parent-interview-notes.md) | PO, BA, UX | Discovery evidence |
| [parent-samples/](./parent-samples/) | BA, Design, Backend | Curriculum exemplars |
| [architecture/OVERVIEW.md](./architecture/OVERVIEW.md) | Tech/Systems Architect, FE/BE, DBA | System design, stack, data flow |
| [architecture/DECISIONS.md](./architecture/DECISIONS.md) | Tech Architect, BA, PO | Architecture Decision Records (ADRs) |
| [design/UX_AND_ACCESSIBILITY.md](./design/UX_AND_ACCESSIBILITY.md) | UX/UI, Design System, FE | UX rules, a11y, visual language |
| [quality/TESTING_AND_ANALYTICS.md](./quality/TESTING_AND_ANALYTICS.md) | QA, Data & Insights, Quant | Test strategy, coverage, usage metrics |
| [learning/RUNBOOK.md](./learning/RUNBOOK.md) | You (engineering journey) | Process learnings, courses, runbook |
| [../README.md](../README.md) | Support, FE/BE | How to run locally / deploy basics |

---

## Discipline coverage (workplace → AssessMate)

You are currently **all of these**. Docs must stay complete enough that a specialist could join later and understand their area.

| Discipline | Your AssessMate responsibility | Living docs | Status |
|------------|--------------------------------|-------------|--------|
| **Product Owner** | Prioritise phases; parent “would you use this?”; scope in/out | NORTH_STAR, ROADMAP | Active |
| **Business Architect** | Value streams (create → moderate → export); pricing/capability model | NORTH_STAR (templates/pricing) | Active |
| **Technical / Systems Architect** | Stack, boundaries, security, evolution Track A→B | architecture/OVERVIEW, DECISIONS | Active |
| **Business / Systems Analyst** | Requirements from interviews; acceptance criteria | parent-interview-notes, workflow-map, ROADMAP DoD | Active |
| UX / UI Designer | Wizard UX for 50s+ educators; WCAG AA patterns | design/UX_AND_ACCESSIBILITY | Active — standards raised 11 Jul 2026 |
| **Design System Team** | Tokens, components (Button/Input/Card), consistency | design/UX_AND_ACCESSIBILITY + `src/components/ui` | Seeded |
| **Frontend Engineer** | Next.js App Router, wizard, dashboard | architecture/OVERVIEW, README | Active |
| **Backend Engineer** | Server actions, API routes, auth session (`proxy.ts`) | architecture/OVERVIEW | Active |
| **Database Analyst / Architect** | Postgres schema, RLS, migrations | architecture/OVERVIEW, `supabase/migrations/` | Active — `002_question_bank_phase1a` |
| **Quant** | Cognitive % validators; generation cost unit economics | NORTH_STAR pricing; quality/TESTING (metrics); learning RUNBOOK | Seeded |
| **Quality / Testing Engineer** | Test strategy, coverage goals, UAT with parents | quality/TESTING_AND_ANALYTICS | Seeded |
| **Data & Insights Engineer** | Usage analytics, funnels, AI cost logs | quality/TESTING_AND_ANALYTICS | Planned |
| **Change Manager** | Pilot scripts, rollout to school, communication | ROADMAP Phase 2–5 | Seeded |
| **Support Analyst** | Auth issues, how-to, incident notes | README, learning/RUNBOOK (ops), ROADMAP support playbook | Seeded |

---

## Documentation Gate (mandatory)

Complete **before** marking any feature or phase done:

### Every feature / PR

- [ ] Acceptance criteria written (BA/PO lens)
- [ ] Code + migration if schema changed
- [ ] **ADR** added/updated if a technical or business choice was made → `architecture/DECISIONS.md`
- [ ] UX/a11y note if UI changed → `design/UX_AND_ACCESSIBILITY.md` (or confirm “no change”)
- [ ] Test notes (what you tested manually / automated) → `quality/TESTING_AND_ANALYTICS.md` log
- [ ] **Learning entry** if you learned a process/tool → `learning/RUNBOOK.md`
- [ ] ROADMAP checklist ticks updated
- [ ] NORTH_STAR updated only if product scope/pricing/users changed

### Every phase exit

- [ ] All discipline rows above still accurate (or updated)
- [ ] Architecture overview matches reality
- [ ] Open risks / debt listed in ROADMAP
- [ ] “What a new reader should read first” still correct (below)

---

## Read order (for a new interested reader)

1. [NORTH_STAR.md](./NORTH_STAR.md) — what & why  
2. [architecture/OVERVIEW.md](./architecture/OVERVIEW.md) — how it’s built  
3. [ROADMAP_AND_CHECKLIST.md](./ROADMAP_AND_CHECKLIST.md) — where we are  
4. [workflow-map.md](./workflow-map.md) — user journey  
5. [design/UX_AND_ACCESSIBILITY.md](./design/UX_AND_ACCESSIBILITY.md) — experience bar  
6. [quality/TESTING_AND_ANALYTICS.md](./quality/TESTING_AND_ANALYTICS.md) — quality & metrics  
7. [learning/RUNBOOK.md](./learning/RUNBOOK.md) — how the builder learned / operates  
8. [architecture/DECISIONS.md](./architecture/DECISIONS.md) — why specific choices  

---

## Cadence (keep docs alive)

| When | Action |
|------|--------|
| End of coding session | 5–10 min: RUNBOOK learning + ROADMAP ticks |
| End of feature | Full Documentation Gate |
| Weekly | Skim INDEX discipline table; fix stale “Status” |
| After parent feedback | Interview notes + NORTH_STAR + ROADMAP backlog |
| Monthly | Architecture overview + cost/analytics section |

---

## Public readiness

Docs are written so they can later be published (GitHub, portfolio, school stakeholders).

- Prefer clear language over jargon  
- No secrets, keys, or personal emails in docs  
- Parent samples stay local/gitignored; manifests describe them  
- Mark **Planned / Seeded / Active** honestly so readers trust the docs  
