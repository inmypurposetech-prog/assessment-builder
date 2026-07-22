# DBE NSC Grade 12 corpus (Mathematics + Life Sciences)

> **Source:** Downloaded from the **DBE** past-paper / exam website (July 2026).  
> **Not** Dad/Mom school-authored packs — national NSC papers and SBA guides.  
> **Copyright:** Government exam materials. Keep **local only** (gitignored binaries). **Do not** commit PDFs, republish in the app, paste verbatim into the seed bank, or ship as product content without confirmed clearance / licence. Layout/structure reference for export fidelity is fine; content ingest stays deferred.

## Clearance / download enquiries (remind)

From the DBE **Matric Exams Revision** page (NSC previous papers for revision):

> For enquiries regarding downloading the exam papers please contact the webmaster on **012 357 3762 / 3752 / 3799**.

Screenshot: [dbe-matric-exams-revision-webmaster-contact.png](./dbe-matric-exams-revision-webmaster-contact.png)

Cursor rule: `.cursor/rules/dbe-past-paper-copyright.mdc` (re-surfaces this in relevant chats).

## Where files live

| Corpus | Path |
|--------|------|
| Maths SBA guides (teacher + learner) | `mathematics/dbe/sba-guides/` |
| LS SBA guides (teacher + learner) | `life-sciences/dbe/sba-guides/` |
| Maths G12 May–June (2021–2025) | `mathematics/dbe/grade-12/june-exam/{year}/paper-{1\|2}/` |
| Maths G12 November (2021–2025) | `mathematics/dbe/grade-12/final-exam/{year}/paper-{1\|2}/` |
| LS G12 May–June (2021–2025) | `life-sciences/dbe/grade-12/june-exam/{year}/paper-{1\|2}/` |
| LS G12 November (2021–2025) | `life-sciences/dbe/grade-12/final-exam/{year}/paper-{1\|2}/` |

Typical roles per paper folder: `question-paper`, `memorandum` (MG), `answer-book` (Maths P2), occasionally `addendum` / `question-paper-afr` / `question-paper-alt`.

## Coverage notes / gaps in this download batch

| Gap | Notes |
|-----|--------|
| Maths May–June **2023** Eng question papers | Only MGs present |
| LS May–June **2024** P1 Eng question paper | Only MG present (`MG Eng (1)` was identical duplicate — skipped) |
| Maths Nov **2025** P1 MG | Not in batch |
| Maths Nov **2023** Eng vs `Eng (1)` | **Different files** — kept both as `question-paper` + `question-paper-alt` |

## Product use (allowed vs not)

| Allowed now | Not without clearance |
|-------------|------------------------|
| Local layout / cover / answer-book structure reference | Publishing PDFs in repo or product |
| Compare AssessMate export structure to national pack shape | Verbatim question/memo text in seed bank or AI prompts shipped to users |
| SBA guide structure for future PAT/SBA features (out of MVP) | Treating DBE downloadability as a product redistribution licence |

See also `docs/legal/COMPLIANCE.md` and ADR-007.
