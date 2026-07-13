# Local text extracts (gitignored)

Full PDF text for Mom’s IEB Life Sciences Grade 12 Final 2023 lives under `_extracts/` on this machine only (ADR-007 / copyright).

## How to (re)generate

```bash
# needs pypdf (e.g. python3 -m venv /tmp/am-pdf && /tmp/am-pdf/bin/pip install pypdf)
python3 scripts/extract-ieb-ls-2023.py
# or: /tmp/am-pdf/bin/python scripts/extract-ieb-ls-2023.py
```

Weak pages (&lt; 200 extracted characters) are listed in `_extracts/EXTRACT_MANIFEST.json`. Spot-check with Apple Vision / Preview if unsure — on this pack they are **lined blank answer pages** (headers + copyright only), not unscanned questions.

## Inventory (13 July 2026)

| File | Pages | Method | Notes |
|------|-------|--------|-------|
| Paper 1 question paper | 44 | pypdf | p44 = lined blank |
| Paper 1 memorandum | 17 | pypdf | Full marking guidelines |
| Paper 1 analysis grid | 5 | pypdf | Already used for Bloom/AIM pattern |
| Paper 2 question paper | 20 | pypdf | p12–16, 18–20 = lined blanks |
| Paper 2 memorandum | 9 | pypdf | Full marking guidelines |
| Paper 2 analysis grid | 1 | pypdf | Target % already in app constants |
| Paper 2 sources booklet | 20 | pypdf | p1 low text (cover); body extracts fine; Phase 3+ for SATAP-style |

**OCR conclusion:** No further OCR required for Phase 1 bank / taxonomy work.

## App ingest policy

- Do **not** commit `_extracts/` or paste IEB wording into the seed bank.
- Seed bank remains original pedagogical items (`src/lib/content/question-bank/`).
- Taxonomy targets stay in `src/lib/constants/bloom-levels.ts` / `src/lib/content/taxonomy/`.
