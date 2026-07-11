# Phase 0 — Parent interview notes

Captured **29 June 2026** from Tanielle's parents (FET educators).

---

## Dad — Mathematics

### Core ask

> How can I use AI to **maximise time** on setting papers and memorandums with the **correct cognitive levels**, then get output I'm **proud to present**?

### Subject-specific: NOT Bloom's taxonomy

Mathematics uses **CAPS cognitive levels**, not Bloom's:

| Level | Target % |
|-------|----------|
| Knowledge | 20% |
| Routine procedure | 35% |
| Complex procedure | 30% |
| Problem solving | 15% |

The app must **validate mark distribution** against these weights when subject = Mathematics.

### Biggest pain

- **Time** setting papers with correct cognitive spread **and** memos
- Wants same (or better) quality he's produced for years, faster
- Uses a **GDE memo template** he created — whole Maths department uses it

### Product implications (priority order)

1. **Upload GDE memo / paper template** — render exports to match department format (**June 2026 P2 pack received** — see `docs/parent-samples/mathematics/dbe/grade-12/`)
2. **Cognitive level sliders** with Maths defaults above (not Bloom's UI) — guide PDF received
3. **Memo + answer book** generation from locked questions, matching department layout
4. **AI as assistant** — correct prompts in, polished paper + memo out
5. Moderation-ready PDF/DOCX export
6. **School-shared templates** — whole Maths department already shares his format

---

## Mom — Life Sciences (IEB focus)

*Source: WhatsApp voice note, transcribed 29 June 2026*

### How she creates papers today

- Types everything manually
- Finds **past IEB papers**, copies questions, tries to copy diagrams
- **10–12 hours** per paper (typing, cutting, pasting diagrams)

### Biggest frustrations

1. **Diagrams** — blurry screenshots, can't scale, must search internet
2. **PDF → Word** — diagrams jump, formatting breaks
3. **Formatting mismatch** between source paper and her document
4. Moderator requires **PDF**, specific layout (see below)

### Moderator / formatting requirements

- **Font:** Arial 12
- **Line spacing:** 1.5
- **Lined paper** with extra lines (bigger handwriting)
- **Line gap:** ~2 between ruled lines
- Export as **PDF**

### Memorandums

- Copy-paste from past papers, or **AI** (IEB style, grade-appropriate)
- Gives AI a **past paper Bloom example** and asks it to match that structure

### CAPS / IEB coverage

- For **IEB:** includes **SAGS** (Subject Assessment Guidelines) — aims, content coverage, aims 1–3, required taxonomies
- Ensures Bloom's / CAPS compliance

### Volume per year (approximate)

| Term | Papers / exams |
|------|----------------|
| Term 1 | 2 papers |
| Term 2 | 2 papers + 2 exams |
| Term 3 | ~2 papers |
| Term 4 | ~2 papers + exams |

### Assessment types she mentioned (complex — Phase 2+)

- **Practical / PAT** — hands-on experiment, students design practical
- **Paper 2 SATAP** — argumentative essay with ~5 sources **for** and ~5 **against**, each 10–12 lines, accredited / peer-reviewed sources, pictures/diagrams, students evaluate sources

### Product implications (priority order)

1. **Formatting engine** — Arial 12, 1.5 spacing, lined paper, PDF export (huge pain)
2. **Diagram handling** — search, scale, crisp embed (not blurry paste)
3. **Bloom's taxonomy** from example template (she already uses AI this way)
4. **SAGS-aware generation** for IEB Life Sciences
5. SATAP / PAT formats later (high complexity)

---

## Unified product direction

| Person | Subject | Cognitive model | #1 pain | #1 feature |
|--------|---------|-----------------|---------|------------|
| Dad | Mathematics | Knowledge / Routine / Complex / Problem solving | Time + cognitive balance + memos | GDE template + cognitive validators |
| Mom | Life Sciences | Bloom's (+ SAGS for IEB) | Diagrams + formatting (10–12 hrs/paper) | PDF export + diagram tools |

### MVP focus (revised)

**Phase 2 generation should ship:**

1. Dad: cycle test with **Maths cognitive %** validator + **GDE template upload**
2. Mom: cycle test with **Bloom's report** + **Arial 12 / 1.5 / PDF** export

**Defer:** SATAP Paper 2, full PAT workflow, peer-reviewed source bank

---

## Open questions for follow-up

- [ ] Dad: share **GDE memo template** file (Word/PDF)
- [ ] Mom: share **example IEB paper + Bloom layout** she gives AI
- [ ] Both: exact **grades** they teach most (10 / 11 / 12)
- [ ] Both: **DBE vs IEB** per parent (mom clearly IEB; confirm dad)
