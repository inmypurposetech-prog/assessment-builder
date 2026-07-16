# Parent sample documents

Curriculum-aligned papers, memos, templates, and analysis grids from Tanielle’s parents.  
Used for product reference and (later) question-bank ingest — **not** for republishing.

## Folder pattern (scalable)

```text
{subject}/{exam-body}/{grade}/{assessment-type}/{year}/{paper-N}/
```

| Segment | Examples |
|---------|----------|
| `subject` | `life-sciences`, `mathematics` |
| `exam-body` | `ieb`, `dbe` |
| `grade` | `grade-10`, `grade-11`, `grade-12` |
| `assessment-type` | `final-exam`, `june-exam`, `cycle-test`, `practical-pat`, `bloom-examples`, `templates` |
| `year` | `2023`, `2024` |
| `paper-N` | `paper-1`, `paper-2` |

### File naming

```text
{year}-paper-{n}-{doc-type}.pdf
```

Doc types: `question-paper` · `memorandum` · `sources` · `analysis-grid` · `template`

### Temporary holding

Unsure where something goes? Put it in `_unsorted/` and sort later.

## Current inventory

### Life Sciences · IEB · Grade 12 · Final exam · 2023

See [life-sciences/ieb/grade-12/final-exam/2023/MANIFEST.md](./life-sciences/ieb/grade-12/final-exam/2023/MANIFEST.md).

| Paper | Files |
|-------|--------|
| Paper 1 | question paper, memorandum, analysis grid |
| Paper 2 | question paper, memorandum, analysis grid, **sources** booklet |

### Mathematics · DBE/CAPS (GDE style) · Grade 12 · June exam · 2026

See [mathematics/dbe/grade-12/june-exam/2026/MANIFEST.md](./mathematics/dbe/grade-12/june-exam/2026/MANIFEST.md).

| Item | Files |
|------|--------|
| Paper 2 pack | question paper, memorandum, **answer book** (Word) |
| Cognitive guide | `cognitive-guides/caps-maths-cognitive-levels-explained.pdf` |
| Template exemplars | paper + memo copies under `templates/` |

Empty folders ready for more years, cycle tests, final exams, and grades 10–11.

## Wanted before / during parent pilot

Priority samples so generation + export feel closer to what they actually set. Binaries stay **local** (gitignored); update `MANIFEST.md` + `NORTH_STAR.md` Artifacts when added.

### Dad — Mathematics (CAPS / GDE-style)

| Priority | What | Why |
|----------|------|-----|
| High | Grade 12 **cycle test** question paper + memo (any recent term) | Pilot path is often a cycle test, not June P2 length |
| High | Grade 10 and/or 11 pack (paper + memo) if he still sets them | Broader bank + grade smoke |
| Medium | Another Paper 1 **or** November/finals-style pack | Marks allocation / cover variants |
| Medium | School cover / letterhead if separate from June pack | Template upload (1E) + branding fidelity |
| Medium | Short list: topics he teaches **this term** | Better scope matching in wizard |
| Low | Second answer-book variant if layout differs by assessment type | Answer-book export fidelity |

### Mom — Life Sciences (IEB)

| Priority | What | Why |
|----------|------|-----|
| High | **Cycle test** papers + memos (not only 2023 finals) | Matches daily workflow; shorter papers |
| High | One paper where **diagrams** were the pain (blurry/scale) | Inform diagram backlog; don’t expect export to solve yet |
| Medium | Grade 10 and/or 11 samples if she teaches them | Bank + Bloom coverage |
| Medium | Any written **moderator format** checklist (Arial/PDF/lined) beyond interview notes | Harden PDF export rules |
| Low | Extra Bloom/layout example if different from analysis grids | Taxonomy UX |

### Either / process

| Item | Notes |
|------|--------|
| Confirm grades taught most this year | Still pending in NORTH_STAR Artifacts |
| Prefer Word/PDF they would actually take to moderation | Not only archival past papers |
| Put unknowns in `_unsorted/` | Sort later using the folder pattern above |

## Git note

PDF binaries are **gitignored** (copyright + repo size). Folder structure and `MANIFEST.md` files are committed so the layout stays in GitHub. Keep originals on your machine (and optionally cloud backup).

## After adding new files

1. Drop into the matching folder with the naming pattern above  
2. Update that year’s `MANIFEST.md`  
3. Tell Cursor so we can update `docs/NORTH_STAR.md`
