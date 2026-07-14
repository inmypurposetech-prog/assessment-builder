# Life Sciences · IEB · Grade 12 · Final exam · 2023

Source: Mom (July 2026).

**NSC vs IEB (confirmed):** **NSC** = National Senior Certificate — the school-leaving **qualification** at **NQF Level 4**, issued by **Umalusi**. **IEB** (and DBE, SACAI) are **assessment bodies** that set/administer exams leading to that same NSC. Filenames saying “NSC …” are normal for Grade 12 finals under either body. These files are filed under **`ieb/`** because Mom’s school uses the IEB as assessment body.

| File | Role | Path |
|------|------|------|
| `2023-paper-1-question-paper.pdf` | Question paper | `paper-1/` |
| `2023-paper-1-memorandum.pdf` | Marking memo | `paper-1/` |
| `2023-paper-1-analysis-grid.pdf` | Cognitive / Bloom analysis grid | `paper-1/` |
| `2023-paper-2-question-paper.pdf` | Question paper | `paper-2/` |
| `2023-paper-2-memorandum.pdf` | Marking memo | `paper-2/` |
| `2023-paper-2-analysis-grid.pdf` | Cognitive / Bloom analysis grid | `paper-2/` |
| `2023-paper-2-sources.pdf` | Source booklet (Paper 2) | `paper-2/` |

## Why analysis grids matter

These are gold for AssessMate: they show how IEB Life Sciences maps questions to taxonomy levels. Use as the pattern for Bloom reports (same idea Mom already gives to AI).

## Ingest priority (later)

1. Analysis grids → taxonomy rules  
2. Question papers + memos → question bank pairs  
3. Sources → Paper 2 / SATAP-style generation (Phase 3+, not MVP)

## Ingested into app (Phase 1A — 11 July 2026)

| Concern | App module |
|---------|------------|
| Bloom columns K–E, AIM 1–3, difficulty E/M/D/VD, Paper II target % | `src/lib/constants/bloom-levels.ts` + `src/lib/content/taxonomy/ieb-ls-analysis-grid.ts` |
| Wizard Bloom focus radios | `BLOOM_FOCUS_OPTIONS` → wizard Advanced |

**Not ingested:** verbatim Paper 1/2 question text (copyright). Seed bank uses original pedagogical items instead.

## Local PDF text extract (11 July 2026)

See [EXTRACT_INDEX.md](./EXTRACT_INDEX.md). Full text under gitignored `_extracts/` (pypdf + Apple Vision OCR check). Lined blank pages confirmed; no further OCR needed for 1A/1B.
