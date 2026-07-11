# AssessMate — Architecture Overview

> **Disciplines:** Technical/Systems Architect · Frontend · Backend · Database Architect  
> **Status:** Active (MVP Track A)  
> **Last updated:** 11 July 2026

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
| Validation | Zod (dependency present; expand usage) | Forms / API |
| Session boundary | `src/proxy.ts` | Next.js 16 `proxy` (not deprecated middleware) |
| Hosting | Vercel | Hobby → Pro later |
| Repo | GitHub `assessment-builder` | |
| Docs | Markdown in `/docs` | See DOCUMENTATION_INDEX |

---

## Application structure

```text
src/app/                 # Routes (RSC + client where needed)
src/components/ui/       # Design-system primitives
src/components/wizard/   # Assessment wizard
src/lib/supabase/        # Browser + server + session helpers
src/lib/actions/         # Server actions
src/lib/constants/       # Subjects, cognitive levels, export defaults
src/lib/types/           # Domain types
src/proxy.ts             # Auth refresh + route protection
supabase/migrations/     # Source of truth for schema
```

---

## Data model (current)

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | Educator profile (name, school) | Own row |
| `assessments` | Wizard drafts + status + `wizard_data` JSON | Own rows |
| `questions` | Question bank (Phase 1 populate) | Authenticated read |

Triggers: create profile on signup; `updated_at` on profiles/assessments.

**Planned tables (document when added):** `templates`, `assessment_versions`, `usage_credits`, `schools`, `school_memberships`, analytics events.

---

## Pipelines

| Pipeline | Today | Target |
|----------|-------|--------|
| **Dev** | Local Next + Supabase cloud | Same |
| **Build** | `npm run build` | CI on PR |
| **Deploy** | Vercel auto-deploy from GitHub `main` (ADR-009) | Preview deploys on PR (optional) |
| **Migrate** | Paste SQL in Supabase Editor | CLI optional later |
| **Generate (AI)** | Not built | API route → RAG/bank → JSON → validate → save |
| **Export** | Not built | JSON → DOCX/PDF via templates |
| **Ingest** | Manual file filing in `parent-samples/` | Scripts + embeddings |

---

## Security architecture (MVP)

- Auth via Supabase email/password  
- RLS on user-owned tables  
- Anon key in client (expected); never commit service role key  
- No learner PII in MVP  
- Generation endpoints must verify session + rate limit (Phase 1)

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
