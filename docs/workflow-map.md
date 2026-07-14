# AssessMate — Teacher workflow map

Detailed phases and checklists: **[`ROADMAP_AND_CHECKLIST.md`](./ROADMAP_AND_CHECKLIST.md)**.  
Product truth: **[`NORTH_STAR.md`](./NORTH_STAR.md)**.

## User-facing flow

```
Login
  │
  ▼
Dashboard (recent assessments + Create)
  │
  ▼
Assessment Wizard
  │  Step 1: Assessment type
  │  Step 2: Curriculum (DBE/IEB, subject, grade, term)
  │  Step 3: Scope (topics / term / previous paper / custom)
  │  Step 4: Settings (marks, time, difficulty)
  │  Step 5: Advanced (Maths cognitive % OR Life Sciences Bloom)
  ▼
Build my paper  (or Save draft → Dashboard → Build later)
  │
  ▼
Review & Edit (/assessments/[id]/review)
  │  Edit / Replace / Delete per question
  │  Live marks + CAPS / Bloom totals
  │  Proud-to-present bar → Save review
  │
  ▼
Download for moderation (POST /api/export)
  │  Maths: DOCX ZIP (paper + memo + answer book + cognitive)
  │  Life Sciences: PDF (12pt / 1.5 + lined + Bloom)
  │
  ▼  [Phase 1E+]
Template upload / Email moderator
```

## System flow (behind the scenes)

```
Teacher completes wizard
  → Validate inputs
  → Save wizard_data to Postgres

Teacher clicks Build my paper
  → POST /api/generate
  → Filter question bank
  → Assemble paper (structured JSON)
  → Validate marks + Maths cognitive OR Bloom balance
  → Derive memo from locked questions
  → Persist generated_content → open review

Teacher edits on review
  → recomputeGeneratedAssessment (client)
  → saveGeneratedAssessment → generated_content

Teacher downloads
  → save draft → POST /api/export
  → buildExportPack (Maths ZIP / LS PDF)
  → Content-Disposition attachment
```

## Status

- [x] Landing page
- [x] Login / signup (Supabase Auth)
- [x] Dashboard
- [x] Assessment wizard (5 steps, local + cloud save, subject-aware cognitive UI)
- [x] Seeded question bank + structured generate API (Phase 1B)
- [x] Review / edit generated paper (Phase 1C)
- [x] Export DOCX/PDF into parent templates (Phase 1D)
- [ ] Parent pilot complete
