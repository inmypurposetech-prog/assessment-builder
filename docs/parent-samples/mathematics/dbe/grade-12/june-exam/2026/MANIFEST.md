# Mathematics · DBE/CAPS (GDE style) · Grade 12 · June exam · 2026 · Paper 2

Source: Dad (July 2026). These are **papers he set himself** using the department template approach described in his interview — not past IEB/DBE exam packs. Filed under `dbe/` as CAPS/GDE public-school style (confirm if his school is IEB).

| File | Role | Path |
|------|------|------|
| `2026-june-paper-2-question-paper.docx` | Question paper (his set paper) | `paper-2/` |
| `2026-june-paper-2-memorandum.docx` | Memorandum in department style | `paper-2/` |
| `2026-june-paper-2-answer-book.docx` | Learner answer book for P2 | `paper-2/` |
| `caps-maths-cognitive-levels-explained.pdf` | Cognitive levels guide (Knowledge / Routine / Complex / Problem solving) | `../../cognitive-guides/` |
| `gde-style-paper-exemplar-…docx` | Copy of paper kept as **template exemplar** | `../../templates/` |
| `gde-style-memo-exemplar-…docx` | Copy of memo kept as **template exemplar** | `../../templates/` |

## Product significance

1. **Template fidelity** — gold standard for “upload my school’s format → generate into that format.”
2. **Answer book** — export pack is paper + memo + answer book (not paper alone).
3. **Cognitive guide** — authoritative copy of Maths levels (not Bloom’s); drive validators and educator UI copy from this PDF.
4. **Department sharing** — interview said whole Maths department uses his template → supports **school-shared templates** later.

## Ingested into app (Phase 1A — 11 July 2026)

| Concern | App module |
|---------|------------|
| CAPS level definitions + 20/35/30/15 validators | `src/lib/constants/cognitive-levels.ts` |
| Template pack v1 (layout notes, memo codes K/R/C/P, answer-book rules) | `src/lib/content/template-packs/maths-gde-june-p2.ts` |
| Wizard Advanced copy | `src/components/wizard/wizard-shell.tsx` |

Binaries remain local only (ADR-007). Do not copy question wording from this pack into the seed bank.
