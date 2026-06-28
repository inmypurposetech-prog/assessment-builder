# AssessMate — Teacher workflow map

North star for MVP development. Update after parent interviews.

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
  │  Step 5: Advanced (Bloom focus, optional extras)
  ▼
Save draft → Dashboard
  │
  ▼  [Phase 2+]
Generate (from question bank + AI)
  │
  ▼
Review & Edit (replace / edit / delete per question)
  │
  ▼
Supporting documents (memo, marking guideline, Bloom report)
  │
  ▼
Final review → Export / Email moderator
```

## System flow (behind the scenes)

```
Teacher completes wizard
  → Validate inputs
  → Save wizard_data to Postgres

[Phase 2+]
Teacher clicks Generate
  → Retrieve CAPS topics
  → Filter question bank
  → Assemble paper (RAG + structured JSON)
  → Validate marks and Bloom balance
  → Generate memo from locked questions
  → Return for teacher review
```

## MVP status (bootstrap complete)

- [x] Landing page
- [x] Login / signup (Supabase Auth)
- [x] Dashboard
- [x] Assessment wizard (5 steps, local + cloud save)
- [ ] Question extraction pipeline
- [ ] AI generation
- [ ] Review editor + export
