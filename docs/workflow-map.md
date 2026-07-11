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
Save draft → Dashboard
  │
  ▼  [Phase 1+]
Generate (from question bank + AI)
  │
  ▼
Review & Edit (replace / edit / delete per question)
  │
  ▼
Supporting documents (memo, marking guideline, cognitive/Bloom report, answer book)
  │
  ▼
Final review → Export / Email moderator
```

## System flow (behind the scenes)

```
Teacher completes wizard
  → Validate inputs
  → Save wizard_data to Postgres

[Phase 1+]
Teacher clicks Generate
  → Retrieve CAPS/SAGS topics
  → Filter question bank
  → Assemble paper (RAG + structured JSON)
  → Validate marks + Maths cognitive OR Bloom balance
  → Generate memo (+ answer book) from locked questions
  → Apply selected template pack
  → Return to teacher review
```

## Status

- [x] Landing page
- [x] Login / signup (Supabase Auth)
- [x] Dashboard
- [x] Assessment wizard (5 steps, local + cloud save, subject-aware cognitive UI)
- [ ] Question extraction / seeded question bank
- [ ] AI generation
- [ ] Review editor + template-faithful export
- [ ] Parent pilot complete
