# AssessMate — Project North Star

> **Purpose:** Single source of truth for product, users, stack, and priorities.  
> **Execution plan:** [`ROADMAP_AND_CHECKLIST.md`](./ROADMAP_AND_CHECKLIST.md)  
> **Full doc system (disciplines, architecture, learning):** [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md)  
> **Learning runbook:** [`learning/RUNBOOK.md`](./learning/RUNBOOK.md)  
> **Use in Cursor:** Referenced by `.cursor/rules/assessmate-context.mdc` (always applied).  
> **Update when:** Parent interviews, new templates, scope changes, or major architecture decisions — and whenever the Documentation Gate requires it.  
> **Last updated:** 11 July 2026

---

## One-line product

**AssessMate** helps South African FET educators create assessment papers, memorandums, and cognitive/taxonomy reports faster — without lowering the quality they already produce by hand.

---

## Who it is for

| Person | Role | Subject | Curriculum focus |
|--------|------|---------|------------------|
| **Dad** | Primary Maths user / Product Owner | Mathematics | CAPS cognitive levels + **GDE memo template** |
| **Mom** | Primary Life Sciences user / Product Owner | Life Sciences | **IEB** + Bloom’s + **SAGS**; heavy formatting/diagram pain |
| **Future** | Other educators, schools, departments | Expand later | Freemium → school → B2G |

**UX constraint:** Built for educators in their **50s+** — large text, one decision per screen, plain language, autosave, preview before irreversible steps. Not a dense SaaS dashboard.

---

## The real problem (from interviews)

### Dad (Mathematics)

- Pain is **time**: setting papers with correct **cognitive levels** + memos in the **GDE department template**.
- Maths does **NOT** use Bloom’s taxonomy.
- CAPS cognitive targets he needs:

| Level | Target % |
|-------|----------|
| Knowledge | 20% |
| Routine procedure | 35% |
| Complex procedure | 30% |
| Problem solving | 15% |

- Goal: give the tool the right inputs → get paper + memo he is **proud to present**.

### Mom (Life Sciences / IEB)

- Creates papers manually from past IEB papers — **10–12 hours** each.
- Pain: **diagrams** (blurry, hard to scale), **PDF→Word formatting**, moderator layout rules.
- Moderator format: **PDF**, **Arial 12**, **1.5** spacing, lined paper with extra lines.
- Already uses AI for memos and Bloom structure (gives past Bloom example as pattern).
- IEB coverage via **SAGS** (Subject Assessment Guidelines).
- Complex later: PAT/practicals, SATAP Paper 2 with accredited sources — **not MVP**.

---

## Product principles

1. **Platform first, AI second** — question bank + workflow are the product; AI is a feature.
2. **Subject-aware cognitive models** — Maths = CAPS levels; Life Sciences = Bloom’s (+ SAGS for IEB).
3. **Teacher stays in control** — always editable; never lock AI output.
4. **Template fidelity** — exports must match department/moderator standards (GDE for Maths; Arial/PDF for Life Sciences). Educators can upload **their** templates and generate into that format.
5. **Budget-aware** — MVP under ~R500/month (Supabase + Vercel free tiers + cheap AI models).
6. **Parents are Product Owners** — weekly test: *“Would you use this tomorrow?”*
7. **Charge for capability, not for “storage guilt”** — see [Templates & sharing](#templates--sharing-product--pricing) and [Pricing](#pricing-direction-not-built-yet).

---

## MVP user flow

```
Login → Dashboard → Create Assessment → Wizard → Save draft
  → [Phase 2+] Generate → Review & Edit → Supporting docs → Export / Email / Save
```

### Wizard steps (current)

1. Assessment type (cycle test, exam, etc.)
2. Curriculum (DBE CAPS | IEB), subject, grade, term
3. Scope (topics / term / previous paper / custom mix)
4. Settings (marks, duration, difficulty)
5. Advanced — **subject-aware**: Maths cognitive % **or** Life Sciences Bloom focus

---

## Scope

### In scope for MVP / near-term

- FET Grades 10–12
- Subjects: **Mathematics** + **Life Sciences** (parallel)
- Bodies: DBE CAPS + IEB (wizard supports both; content ingest phased)
- Auth, dashboard, wizard, cloud draft save
- Question bank + extraction (next)
- AI-assisted assembly + memo
- Cognitive / Bloom reports
- PDF/DOCX export matching parent templates
- School cover page / GDE-style template upload (Dad’s June 2026 pack is the Maths exemplar)
- Answer book as part of export pack where the school uses one

### Explicitly out of MVP

- SATAP Paper 2 full source packs
- Full PAT multi-day workflows
- SA-SAMS integration
- Department tenders / B2G
- Afrikaans UI (later)
- Archive revival fees / “pay to unlock old papers” (anti-pattern)
- Public marketplace of paid third-party templates (later; start private → school)
- Local PostgreSQL required (use **Supabase** cloud Postgres)

---

## Templates & sharing (product + pricing)

Dad’s upload confirms a core product bet: **educators already have excellent templates**; AssessMate should generate *into* those formats, not invent a generic look.

### What a “template” means here

Not just a cover page. A template pack can include:

| Asset | Example (Dad) |
|-------|----------------|
| Question paper layout | Headers, sections, mark boxes, fonts |
| Memorandum layout | GDE-style marking format |
| Answer book | Lined / structured learner book |
| Cognitive / taxonomy rules | CAPS Maths % or Bloom grid style |
| School branding | Logo, school name, exam rules block |

### Visibility model (scalable)

| Visibility | Who can use it | Typical use |
|------------|----------------|-------------|
| **Private** | Owner only | Personal tweaks |
| **School** | Teachers in same school (optionally same subject) | Dad’s department sharing his GDE template |
| **District / org** (later) | Cluster of schools | Provincial pilots |
| **Public gallery** (later) | Opt-in community | Optional; needs moderation + copyright care |

Default for MVP+: **Private**. School sharing is the first collaboration feature (matches how Maths departments already work).

### Pricing insight — don’t sell “storage”

Earlier guidance stands: **do not** charge revival fees or “R5/month per saved paper.” That feels punitive and is hard to explain.

**Do** monetise **template capability** as part of clear tiers:

| Tier | Templates | Sharing | Generation |
|------|-----------|---------|------------|
| **Free** | 1 private template pack; AssessMate defaults | None | Limited papers/month |
| **Teacher (~R99–149)** | Several private packs (e.g. 5–10) | Optional share link to 1–2 colleagues | Higher / unlimited soft cap |
| **School (~R499–999)** | Shared school library; admin; subject folders | School-wide (subject-scoped) | Multi-teacher seats |

Optional later (not MVP):

- **Template add-on** if someone needs dozens of packs beyond Teacher — still framed as “more template slots,” not “storage.”
- **Public gallery tip jar / featured templates** — only after legal review; prefer school-shared first.

### Why this is sustainable

1. **AI cost** tracks **generation**, not file size — keep generation credits/limits on Free; templates are mostly storage + rendering (cheap).
2. **School tier** is the real revenue path — one sale covers a department that already shares Word templates via email/USB.
3. **Network effects** without a messy marketplace — school libraries grow quality; public gallery can wait.
4. **Copyright safety** — private/school templates stay under the school’s control; don’t scrape and resell past papers.
5. **Differentiation** — competitors that only “ChatGPT a paper” lose to “output that looks like *our* GDE pack.”

### Implementation order

1. **MVP:** Upload one template pack → generate/export matching layout (Dad’s June pack as test).  
2. **Next:** Private template library (save multiple packs).  
3. **Then:** School org + invite teachers + subject-scoped shared templates.  
4. **Later:** Public gallery / district (only if demand is clear).

---

## Pricing direction (not built yet)

- Free: limited papers/month + 1 private template pack  
- Teacher: ~R99–149/month — more generation + more private templates  
- School: ~R499–999/month — seats + **shared template library**  
- Delay payments until parents validate quality (“proud to present”)  
- **Avoid:** archive revival fees; per-GB storage bills; charging to keep old assessments  
- **Prefer:** generation limits + template/library features inside subscriptions

---

## Parent artifacts

Upload separately anytime; then update this table.

| Artifact | From | Status |
|----------|------|--------|
| Grade 12 IEB Life Sciences final exam 2023 (P1+P2 papers, memos, analysis grids, P2 sources) | Mom | **Received** → `docs/parent-samples/life-sciences/ieb/grade-12/final-exam/2023/` |
| Grade 12 Maths June 2026 Paper 2 (paper, memo, answer book) + cognitive levels PDF + template exemplars | Dad | **Received** → `docs/parent-samples/mathematics/dbe/grade-12/` |
| Extra Bloom layout example (if different from analysis grids) | Mom | Optional — analysis grids may cover this |
| More years / grades | Either | Ongoing |
| Confirm grades taught most | Both | Pending |
| Confirm Dad’s school is DBE/GDE vs IEB | Dad | **Confirmed:** DBE / **CAPS** (+ GDE-style memo template) — 11 July 2026 |

**Last updated:** 11 July 2026

---

## Tech stack (Track A — now)

| Layer | Choice |
|-------|--------|
| App | Next.js 16 (App Router) + TypeScript + Tailwind |
| Auth / DB / Storage | **Supabase** (Postgres in cloud — not local Postgres) |
| Edge/session | `src/proxy.ts` (Next.js 16; not deprecated `middleware.ts`) |
| Hosting | Vercel |
| AI (later) | Cheap models + RAG (GPT-4o-mini / Gemini Flash); Azure later for certs |
| Repo | https://github.com/inmypurposetech-prog/assessment-builder |
| Local path | `/Users/taniellejeane/Projects/assessmate` |

**Track B (later):** Azure OpenAI, Blob, Entra, App Service — for AZ-104 / AI-102 alignment after MVP works.

---

## Key paths in the codebase

```
src/app/                    # Routes (landing, auth, dashboard, wizard)
src/components/wizard/      # Assessment wizard UI
src/lib/types/assessment.ts # Wizard data model
src/lib/constants/          # Subjects, cognitive levels, export defaults
src/lib/supabase/           # Auth/DB clients
src/proxy.ts                # Session + route protection
supabase/migrations/        # SQL schema (run in Supabase SQL Editor)
docs/                       # North star, interviews, workflow
docs/parent-samples/        # Parent papers/templates (PDFs/DOCX gitignored)
```

---

## Related docs (read when relevant)

| File | Contents |
|------|----------|
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) | Doc map, workplace disciplines, Documentation Gate |
| [ROADMAP_AND_CHECKLIST.md](./ROADMAP_AND_CHECKLIST.md) | Phases, SDLC, engineering pipeline, checklists |
| [architecture/OVERVIEW.md](./architecture/OVERVIEW.md) | System architecture, frameworks, pipelines |
| [architecture/DECISIONS.md](./architecture/DECISIONS.md) | ADRs |
| [design/UX_AND_ACCESSIBILITY.md](./design/UX_AND_ACCESSIBILITY.md) | UX, design system, a11y |
| [quality/TESTING_AND_ANALYTICS.md](./quality/TESTING_AND_ANALYTICS.md) | Testing, coverage, analytics |
| [learning/RUNBOOK.md](./learning/RUNBOOK.md) | Learnings, courses, ops procedures |
| [parent-interview-notes.md](./parent-interview-notes.md) | Full interview capture |
| [parent-interview-guide.md](./parent-interview-guide.md) | Interview questions template |
| [workflow-map.md](./workflow-map.md) | User + system flow status |
| [parent-samples/README.md](./parent-samples/README.md) | Sample folder layout + inventory |
| [../README.md](../README.md) | Setup (Supabase, env, run) |

---

## How to keep this useful

1. After each major decision or parent upload → update this file (date + bullet).
2. Prefer editing **docs** over relying on chat memory.
3. In a new Cursor chat: `@docs/NORTH_STAR.md` `@docs/DOCUMENTATION_INDEX.md` `@docs/ROADMAP_AND_CHECKLIST.md`.
4. Complete the **Documentation Gate** on every feature (see INDEX / ROADMAP) — includes learning runbook updates.
5. Do **not** put secrets (API keys, passwords) here — those stay in `.env.local` only.
