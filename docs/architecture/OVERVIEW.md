# AssessMate — Architecture Overview

> **Disciplines:** Technical/Systems Architect · Frontend · Backend · Database Architect  
> **Status:** Active (MVP Track A)  
> **Last updated:** 16 July 2026 (InfoSec section)

---

## System context

```text
┌─────────────┐     HTTPS      ┌──────────────────┐
│  Educator   │ ─────────────► │  Next.js on      │
│  (browser)  │ ◄───────────── │  Vercel          │
└─────────────┘                └────────┬─────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
            ┌──────────────┐   ┌──────────────┐   ┌─────────────────┐
            │ Supabase     │   │ Supabase     │   │ AI provider     │
            │ Auth         │   │ Postgres +   │   │ (Phase 1+)      │
            │              │   │ Storage      │   │ OpenAI/Gemini   │
            └──────────────┘   └──────────────┘   └─────────────────┘
```

**Track B (later):** Azure OpenAI, Blob, Entra External ID, App Service, Monitor — see NORTH_STAR.

---

## Technical frameworks & tools

| Layer | Choice | Notes |
|-------|--------|-------|
| UI framework | React 19 + Next.js 16 App Router | TypeScript |
| Styling | Tailwind CSS 4 | CSS variables in `globals.css` |
| Auth/DB/Storage | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) | Cloud Postgres — not local PG for MVP |
| Validation | Zod | Forms / API (`generate`, `export`) |
| Document export | `docx` + `pdfkit` + `jszip` | Maths ZIP of DOCX; LS single PDF (ADR-014) |
| Session boundary | `src/proxy.ts` | Next.js 16 `proxy` (not deprecated middleware) |
| Hosting | Vercel | Hobby → Pro later |
| Repo | GitHub `assessment-builder` | |
| Docs | Markdown in `/docs` | See DOCUMENTATION_INDEX |

---

## Application structure

```text
src/app/                 # Routes (RSC + client where needed)
src/app/api/generate/    # Phase 1B structured generation API
src/app/api/export/      # Phase 1D DOCX/PDF download
src/app/assessments/[id]/review/  # Phase 1C review UX
src/components/review/   # ReviewShell, GenerateAssessmentButton, ExportDownloadButton
src/components/ui/       # Design-system primitives
src/components/wizard/   # Assessment wizard
src/lib/supabase/        # Browser + server + session helpers
src/lib/actions/         # Server actions
src/lib/constants/       # Subjects, cognitive levels, Bloom, export defaults
src/lib/content/         # Template packs, taxonomy patterns, seed question bank
src/lib/generation/      # Assemble / memo / cost / AI gap-fill hook
src/lib/export/          # Maths DOCX pack + Life Sciences PDF builders
src/lib/types/           # Domain types
src/proxy.ts             # Auth refresh + route protection
supabase/migrations/     # Source of truth for schema
```

### Content layer (Phase 1A)

| Module | Role |
|--------|------|
| `constants/cognitive-levels.ts` | CAPS Maths levels, 20/35/30/15, validators, memo codes K/R/C/P |
| `constants/bloom-levels.ts` | LS Bloom + IEB AIM targets from analysis grids |
| `content/template-packs/maths-gde-june-p2.ts` | Dad June P2 pack layout notes (paper / memo / answer book) |
| `content/taxonomy/ieb-ls-analysis-grid.ts` | Mom IEB grid column model + target % |
| `content/question-bank/` | Original seed items (25 Maths + 24 LS) for assembly |

### Generation layer (Phase 1B)

| Module | Role |
|--------|------|
| `generation/assemble.ts` | Bank-first paper assembly + taxonomy report |
| `generation/memo.ts` | Derive memo from locked questions |
| `generation/recompute.ts` | Rebuild totals + taxonomy after teacher edits |
| `generation/proud-to-present.ts` | Blocker/caution flags for review bar |
| `generation/config.ts` | Model / max tokens / monthly cap |
| `generation/usage.ts` | Count + record `generation_usage` |
| `generation/ai-gaps.ts` | Optional AI gap-fill hook (no-op until keys) |
| `app/api/generate/route.ts` | Session-checked POST → JSON (+ persist) |

### Review layer (Phase 1C)

| Path | Role |
|------|------|
| `app/assessments/[id]/review` | Auth + load `generated_content` → `ReviewShell` |
| `components/review/` | Edit / Replace / Delete; live totals; proud bar; generate CTA; export CTA |
| `saveGeneratedAssessment` | Persist edited JSON to `assessments.generated_content` |

### Export layer (Phase 1D)

| Module | Role |
|--------|------|
| `export/maths-docx.ts` | Dad-style DOCX: paper, memo (K/R/C/P), answer book, CAPS summary |
| `export/life-sciences-pdf.ts` | Mom-style PDF: 12pt, 1.5 spacing, lined blanks, Bloom sheet |
| `export/build-pack.ts` | Subject → ZIP (Maths) or PDF (LS) |
| `app/api/export/route.ts` | Session-checked POST → binary download |
| `ExportDownloadButton` | Save draft → fetch export → browser download (busy until start) |

---

## Data model (current)

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | Educator profile (name, school) | Own row |
| `assessments` | Wizard drafts + status + `wizard_data` + `generated_content` / `generated_at` | Own rows |
| `questions` | Question bank (`cognitive_level`, `bloom_level`, `aim`, `strand`, `visibility`) | Authenticated read |
| `generation_usage` | Per-generate cost log (model, tokens, source) for monthly caps | Own insert/select |

Triggers: create profile on signup; `updated_at` on profiles/assessments.  
Migrations: `001_initial_schema.sql`, `002_question_bank_phase1a.sql`, `003_generation_phase1b.sql`.

**App seed vs DB:** Phase 1A/1B assembly reads the in-repo seed bank (ADR-011). Supabase `questions` remains for later multi-device / shared cloud load.

**Planned tables (document when added):** `templates`, `assessment_versions`, `usage_credits` (or expand `generation_usage`), `schools`, `school_memberships`, analytics events.

---

## Pipelines

| Pipeline | Today | Target |
|----------|-------|--------|
| **Dev** | Local Next + Supabase cloud | Same |
| **Build** | `npm run build` | CI on PR |
| **Deploy** | Vercel auto-deploy from GitHub `main` (ADR-009) | Preview deploys on PR (optional) |
| **Migrate** | Paste SQL in Supabase Editor | CLI optional later |
| **Generate** | `POST /api/generate` → seed bank → structured JSON → validate cognitive/Bloom → derive memo → save + usage (ADR-012) | Provider-backed gap-fill when keys set |
| **Review** | `/assessments/[id]/review` — edit/replace/delete; live totals; proud bar; save `generated_content` (ADR-013) | — |
| **Export** | `POST /api/export` → Maths DOCX ZIP / LS PDF from saved JSON (ADR-014) | Higher pixel fidelity vs parent exemplars; embed true Arial |
| **Ingest** | Guide/grid distilled into typed content; binaries stay local | Optional OCR + embeddings later |

---

## Security architecture (MVP)

See living checklist: [quality/SECURITY_AND_THREAT_MODEL.md](../quality/SECURITY_AND_THREAT_MODEL.md).

- Auth via Supabase email/password (+ reset / show-password UX)  
- RLS on user-owned tables (re-verify in Phase 2 security pass)  
- Anon key in client (expected); never commit service role key  
- No learner PII in MVP  
- Generation / export endpoints verify session (`401`) + monthly gen cap (`429`); finer rate limits Phase 2  
- Auth redirect **allowlist** only (localhost + prod callback)  
- Lightweight adversarial checks (UUID cross-tenant, unauthenticated API) before closed beta — not a full pen-test firm yet  

---

## Accessibility & UX (summary)

See [design/UX_AND_ACCESSIBILITY.md](../design/UX_AND_ACCESSIBILITY.md). Architecture implication: prefer server-rendered clarity, large hit targets, progressive enhancement; avoid gesture-only UI.

---

## Quality & observability (summary)

See [quality/TESTING_AND_ANALYTICS.md](../quality/TESTING_AND_ANALYTICS.md).

---

## Open architectural risks

| Risk | Mitigation |
|------|------------|
| Template fidelity hard | Iterate on Dad/Mom exemplars; don’t over-automate layout early |
| AI cost | Caps, mini models, bank-first assembly |
| EU data residency vs SA users | Document in privacy; Azure SA later if B2G needs |
| Solo bus factor | This docs set + ADRs |

---

## Related ADRs

See [DECISIONS.md](./DECISIONS.md).
