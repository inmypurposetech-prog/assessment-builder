# Parent pilot — Dad Session One (30 July 2026)

> **Facilitator:** Tanielle  
> **Participant:** Dad (Mathematics / CAPS / GDE)  
> **Recording:** `~/Downloads/AssessMate Phase 1 - Demo with Daddy.m4a` (~49 min)  
> **Raw auto-transcript (Whisper base, error-prone):** [`pilot-recordings/AssessMate Phase 1 - Demo with Daddy.txt`](./pilot-recordings/AssessMate%20Phase%201%20-%20Demo%20with%20Daddy.txt)  
> **Script:** [`PARENT_PILOT_SESSION_ONE.md`](./PARENT_PILOT_SESSION_ONE.md)  
> **Export briefing given:** structure-first (not June 2026 binary clone) — yes

---

## Gate answers (Phase 1 DoD)

| # | Question | Answer |
|---|----------|--------|
| 1 | Would you use this **workflow** again next term? | **Yes** — work in progress; wants to keep moving it forward |
| 2 | Is **formatting** good enough for moderation **yet**? | **No** — expects improvement (Phase 6 / fidelity iterate) |
| 3 | Confusing or slow? | Post–Save review “where next?”; landing dual CTAs; email confirm friction; download affordance (words vs icon) |
| 4 | Time feel (first draft) | Not scored formally; session ~45–50 min including signup + teaching |
| 5 | Question quality 1–5 | Not scored formally; bank shortfall limited the pack (see below) |

**DoD:** Dad completed create → Build my paper → review → download Maths DOCX pack (4 files). **Q1 = Yes** → Dad Phase 1 DoD met for workflow. Formatting fidelity remains a tracked backlog item (not a Phase 1 failure).

---

## What went well

- Large text / colours — he likes them.
- Information broken into stages — clear enough; not “too many words.”
- Autosave / draft idea resonates.
- Cognitive % on advanced step matches what he needs (K/R/C/P).
- Separate pack files (paper / memo / answer book / cognitive) make sense.
- Happy that Phase 6 will improve look; pack content direction is right.

---

## Product feedback → backlog (priority)

### P0 — blocks trust / correctness

1. **Memo = marking guidelines, not answer key**  
   Show method steps with ticks (e.g. correct factorisation, correct substitution into quadratic formula), not only final answers. Both roots + method marks matter — learners can earn method marks without both roots correct.

2. **Question bank depth**  
   Demo hit **bank shortfall ~11 / 50 marks** for chosen topics. Dad does **not** want that error as a normal teacher-facing state; AI should fill gaps with new questions when the bank is thin. Need more Maths exemplars ingested (cycle tests + packs).

3. **Export fidelity vs his GDE template**  
   - Geometry statement/reason instructions must **not** appear if the paper has no geometry.  
   - Don’t instruct learners to “number answers like the paper” if the **answer book already has numbers**.  
   - Answer-book ruling: lines shouldn’t feel like they “just end” mid-page — full working space.

### P1 — wizard & cognitive UX

4. **Wizard field order:** **Subject → exam body → grade → assessment type** (types filtered by subject). Order of peripherals less important once subject is first.

5. **Difficulty preset:** Replace/add a primary option **“Match the cognitive levels”** that locks/shows department defaults (**Knowledge 20% / Routine 35% / Complex 30% / Problem solving 15%**) as confirmation. Easy / Balanced / Challenging alone are not worthwhile for Maths.

6. **Practical cognitive workaround he already uses with AI:** When models struggle to hit 20% Knowledge alone, combine **Knowledge + Routine = 55%** and still hit Complex 30% + Problem solving 15%. Product should support that without breaking validation messaging.

7. **Term ↔ assessment-type dependency:** e.g. June exam must not allow Term 3 — disable/preselect valid terms or hide term when implied by exam type.

8. **Marks ↔ duration heuristics (his school):** ~**50 marks per hour**; class tests often **40 marks / 45 minutes**; cycle tests scale similarly.

9. **Topic taxonomy:** Treat **equations & inequalities** as a first-class topic; don’t bury calculus oddly under algebra — align labels with how CAPS/his department documents topics.

10. **Maths assessment types beyond cycle/exam:** informal **class exercise / practice**; formal **investigation, assignment, project** (distinct from Life Sciences practicals).

### P2 — review & navigation UX

11. **Confirm** control on each question (and separately on memo) — not only Edit / Replace / Delete. Affirms “I like this; keep it.”

12. **Edit memo separately** from editing the question stem.

13. After **Save review**, next step is unclear — need an obvious path (dashboard / download / continue).

14. Landing: **Sign up for free** and **Get started** feel like the same action — clarify or merge.

15. Prefer always-visible **text** download CTA over icon-only affordance.

16. Signup **email confirmation** friction during pilot (prefer confirm-off for Session One).

### Later / nice-to-have

17. Auto-marking / “mark on the side” as a future selling point (not MVP).  
18. Multiple-choice: mostly Grades 10–11; no hard ban, rarely used in his papers.  
19. School field on signup: useful later for JP/school-scoped templates; optional is fine for now.  
20. Cognitive-level debates between teachers are real — product should expose definitions (knowledge vs plug-into-formula as routine vs complex vs unseen problem solving).

---

## Samples to chase (Dad)

Per `parent-samples/README.md` wishlist — remind him:

- More **cycle-test** papers + memos (G12, then G10–11)
- Another Paper 1 / finals pack if available
- School cover / letterhead if not only in the June pack
- Topic list for “this term” if written

Binaries → `docs/parent-samples/` (gitignored) → update folder `MANIFEST.md` + NORTH_STAR Artifacts.

---

## Facilitator notes (Tanielle) — same session

- **Get Started** on landing did not work reliably (nested `<a><button>` hit target) — fixed on branch `cursor/pilot-ux-dad-notes` via `ButtonLink`.
- Buttons felt **only clickable on the text**, not the full padded control — same root cause; nav CTAs now use full-surface links.
- Wizard copy still said **“Defaults match what your parents use”** — product-owner nickname leaked into teacher UI; replaced with department-standards wording.
- **“Private school cover”** read as private-*school* (weird); reworded to school cover / visible only to you.
- **Save review → where next?** — sticky bar now points to Download for moderation + Back to dashboard, and scrolls to the download section after save.

---

## Mom Session One

Done 9 Aug 2026 — [`MOM_SESSION_ONE_2026-08-09.md`](./MOM_SESSION_ONE_2026-08-09.md). **Use workflow again: Yes.** Formatting fidelity still backlog.
