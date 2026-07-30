# Parent pilot — Session One (comprehensive facilitator guide)

> **Who this is for:** Tanielle (facilitator), running the **first** live session with Dad and/or Mom.  
> **Goal:** Prove Phase 1 DoD — they complete one draft end-to-end and answer *“Would you use the workflow again next term?”*  
> **Time:** ~20–30 minutes per parent (plus 5 min briefing).  
> **Prod URL:** https://assessment-builder-sooty.vercel.app/  
> **Pair with:** ROADMAP Phase 1 DoD · Phase 2 pilot briefings · `.cursor/rules/parent-pilot-reminders.mdc` · ADR-014  
> **Last updated:** 29 July 2026

This is **not** the full 2-week Phase 2 pilot yet. Session One is the “can they finish one paper and would they try again?” gate.

---

## 0. Before you invite them (your checklist)

Do these yourself first. Do **not** start a parent session until every box is true.

### Product ready

- [ ] Phase 1E merged to `main` (or you are deliberately testing a Vercel preview — prefer **production** for parents)
- [ ] Migration `004_templates_phase1e.sql` applied on cloud Supabase (templates bucket exists)
- [ ] You personally smoke-tested on prod: signup/login → create → **Build my paper** → review → **Download for moderation**
- [ ] Email confirmation strategy: **off** for pilot (so they can log in without hunting inbox) — Supabase → Authentication → Providers → Email

### Environment ready

- [ ] Prefer their **home laptop or desktop** (not phone)
- [ ] Browser: **Chrome** or **Microsoft Edge** (latest)
- [ ] Stable Wi‑Fi
- [ ] They can download files (Downloads folder not blocked by school policy if they use a work machine)
- [ ] Optional: Zoom/phone call so you can see their screen or talk them through

### Accounts ready (pick one strategy)

| Strategy | When to use |
|----------|-------------|
| **A — They sign up themselves** | Best: real emails; practice Forgot password later |
| **B — You create accounts beforehand** | If they hate signup forms; send them email + temporary password |

For Session One, **Strategy A** is fine if email confirm is off.

Suggested test emails (examples — use real ones they check):

- Dad: something like `dad+assessmate@…` or his normal email  
- Mom: her normal email  

Have a notepad ready for: password they chose (if they ask you to keep it), bugs, exact error text.

### What you will *not* ask them to do in Session One

- Judge pixel-perfect match to Dad’s Word / Mom’s IEB past paper  
- Upload DBE/IEB national past papers into the product  
- Enter learner names, marks, or scripts anywhere  
- Complete a 2-week multi-assessment pilot

---

## 1. Message to send them (copy-paste)

### WhatsApp / email — invite (send the day before or morning of)

```text
Hi [Dad/Mom],

I’d love 20–30 minutes with you on AssessMate (the assessment tool we’ve been building).

Please use a laptop or desktop (not your phone), and open this link in Chrome or Edge:

https://assessment-builder-sooty.vercel.app/

We’ll create one practice assessment together, download it, and I’ll ask two short questions at the end.

Important before we start: the download will look familiar in structure (paper + memo), but it won’t look exactly like your usual Word/PDF template yet. That’s OK — I want to know if the workflow helps first; we’ll improve the look next.

Reply with a time that works. Thanks!
```

### Reminder 15 minutes before

```text
Starting soon — please sit at the laptop, open Chrome or Edge, and keep this tab ready:

https://assessment-builder-sooty.vercel.app/

I’ll call / WhatsApp you when we start.
```

---

## 2. Opening briefing (say this out loud — ~2 minutes)

Use almost these words:

> Thanks for helping. Today we’re testing whether AssessMate can help you set a paper faster — not whether the download looks identical to your department file yet.
>
> You’ll: open the site on this computer → create an account or log in → create one assessment → let it build a draft → glance at the review screen → download the file.
>
> When the file downloads: Maths will be a ZIP with several Word documents; Life Sciences will be one PDF.
>
> I’m going to ask two separate questions at the end:
> 1) Would you use this **workflow** again next term?
> 2) Is the **formatting** good enough for moderation yet?
>
> It’s OK if (2) is “no.” A “yes” to (1) still counts as a win for this stage.
>
> Please don’t type learner names or marks into any notes fields — only teacher materials.

Then: “Any questions before we click?”

---

## 3. Shared steps — open the site

Walk them through slowly. You click only if they’re stuck; prefer they drive.

1. Open **Chrome** or **Edge** on the **desktop/laptop**.  
2. In the address bar, paste exactly:  
   `https://assessment-builder-sooty.vercel.app/`  
3. Press Enter.  
4. Confirm they see the AssessMate landing page (not a blank error).  
5. Click **Sign up** (first time) or **Log in** (returning).

### Sign up (first time)

1. Enter full name.  
2. Optional: school name.  
3. Enter email they can access.  
4. Choose a password (use **Show password** if helpful).  
5. Submit.  
6. They should land on the **dashboard** (“Welcome, …”).  
   - If stuck on “confirm email”: you turn confirm-email off in Supabase, or confirm them in Authentication → Users.

### Log in (returning)

1. Email + password.  
2. If wrong password: use **Forgot password?** and check inbox/spam.  
3. Wait until the dashboard finishes loading (busy state is normal).

**Pass check:** They can see **+ Create assessment** and **My templates**.

---

## 4. Script A — Dad (Mathematics / CAPS)

**Target:** Grade 12 **cycle test** → Build → Review → Download **Maths pack (ZIP)**.

### A1. Create assessment

1. Click **+ Create assessment**.  
2. Wizard step 1 — Assessment type: choose **Cycle test**. Continue.  
3. Step 2 — Curriculum:  
   - Exam body: **DBE / CAPS**  
   - Subject: **Mathematics**  
   - Grade: **12**  
   - Term: pick current/relevant term  
   Continue.  
4. Step 3 — Scope: **Pick topics** (or Whole term).  
   - Prefer topics like Finance / Trigonometry if offered (matches his March 2026 cycle sample).  
   Continue.  
5. Step 4 — Settings: leave defaults or set marks/time he likes (e.g. 50 marks / 60 min). Continue.  
6. Step 5 — Advanced:  
   - Confirm **cognitive %** show Knowledge / Routine / Complex / Problem solving (not Bloom).  
   - Leave totals at department standard **20 / 35 / 30 / 15** unless he wants to tweak (must sum to 100).  
   - Optional: **Template pack** — AssessMate default is fine for Session One.  
     (If he has a school cover ready: My templates first — see §6 — then select it here.)  
   - Notes: optional; **no learner names**.

### A2. Build

1. Click primary **Build my paper** (not only “Save and finish”).  
2. Wait for “Building your paper…” until the **review** screen opens.  
3. If error / monthly cap: note exact message; try again once; fall back to a saved draft another day.

### A3. Review (keep short)

1. Scroll the list of questions.  
2. Ask him to **edit one** question title/stem or marks if something looks wrong — or skip if fine.  
3. Glance at **proud to present** bar (blockers vs cautions) — explain yellow/red in plain language.  
4. Click **Save review** if he edited.

### A4. Download

1. Find **Download for moderation** / **Download Maths pack (DOCX ZIP)**.  
2. Click it; wait until busy finishes (“Download started…” or browser download).  
3. Open the Downloads folder.  
4. Open the ZIP. He should see roughly:  
   - question paper  
   - memorandum (with K/R/C/P style)  
   - answer book  
   - cognitive summary  
5. Open the question paper in Word if he wants — remind again: **structure-first, not his June binary**.

### A5. Feedback questions (write answers down)

| # | Ask | Record |
|---|-----|--------|
| 1 | Would you use this **workflow** again next term? | Yes / No / Maybe + why |
| 2 | Is **formatting** good enough for moderation **yet**? | Yes / No / Maybe + what’s wrong |
| 3 | What was confusing or slow? | Free text |
| 4 | Time feel: faster / same / slower than usual for a first draft? | Pick one |
| 5 | Quality of questions 1–5 (gut feel) | 1–5 |

**Phase 1 Dad DoD tick:** completed download **and** Q1 is Yes or strong Maybe.

---

## 5. Script B — Mom (Life Sciences / IEB)

**Target:** Life Sciences **cycle-test-style** (or short exam) → Build → Review → Download **PDF**.

### B1. Create assessment

1. **+ Create assessment**.  
2. Type: **Cycle test** (prefer over Final exam for Session One).  
3. Curriculum:  
   - Exam body: **IEB**  
   - Subject: **Life Sciences**  
   - Grade: **12** (or 10/11 if that’s what she teaches most)  
   - Term: relevant  
4. Scope: topics or whole term — let her choose what feels natural.  
5. Settings: defaults OK.  
6. Advanced:  
   - Confirm **Bloom’s** focus options (not Maths cognitive %).  
   - Diagrams checkbox: she may tick Include diagrams — warn export won’t solve diagram pain yet.  
   - Template: default OK for Session One.  
   - Notes: no learner PII.

### B2. Build → Review → Download

Same pattern as Dad:

1. **Build my paper** → wait for review.  
2. Optional: edit/replace one question; Save review.  
3. **Download Life Sciences PDF**.  
4. Open the PDF: check readable text size, spacing, lined blanks, memo + Bloom sheet present.

Remind: Helvetica stand-in for Arial is OK for this stage; moderator “exact Arial” may still be a later fidelity item.

### B3. Feedback questions

Same table as Dad (§A5). Extra optional:

| # | Ask | Record |
|---|-----|--------|
| 6 | Did diagrams / formatting worry you more than the questions? | Yes / No |

**Phase 1 Mom DoD tick:** completed PDF download **and** Q1 Yes or strong Maybe.

---

## 6. Optional — My templates (only if time + file ready)

Use if they have a **school cover / letterhead** they own (not a national past paper).

1. Dashboard → **My templates**.  
2. Read the reminder: educator materials only; **Private**; no learner scripts.  
3. Upload one PDF/DOCX/ZIP ≤10 MB; name it clearly.  
4. New assessment → Advanced → select that template (or default).  
5. Note: export **does not yet** fill their Word binary — selection is saved for later fidelity.

Skip entirely if Session One is already long.

---

## 7. Samples to ask for at the end (soft ask)

If energy is good:

**Dad still useful:** school cover if separate; Grade 10 pack; topics for this term.  
**Mom still useful:** a real **cycle test**; one paper where **diagrams** were painful; moderator checklist if written.

You store under `docs/parent-samples/` later (gitignored binaries + MANIFEST). Do **not** have them upload DBE/IEB national packs into AssessMate.

---

## 8. If something breaks (quick triage)

| Symptom | What you do |
|---------|-------------|
| Blank page / “couldn’t load” | Hard refresh; try Edge↔Chrome; clear site data for the URL; retry |
| Signup “already registered” | Switch to Log in |
| Stuck after signup (confirm email) | Supabase: confirm user or disable confirm-email for pilot |
| Build fails / 401 | Log out → log in → retry |
| Build 429 monthly cap | Note it; use another account or wait; don’t debug AI keys mid-session |
| Download does nothing | Check pop-up/download blockers; try again; note browser |
| ZIP won’t open | Confirm they used Maths path; try Windows built-in unzip |
| They hate the look of the file | Reassure; capture under Q2; do **not** treat as Session One failure if Q1 is yes |

Write: **exact screen**, **button clicked**, **error text**, **time**.

---

## 9. After the session (same day)

- [ ] Fill answers into a note (Notion/Notes/`docs/quality/TESTING_AND_ANALYTICS.md` log row)  
- [ ] Tick ROADMAP Phase 1 DoD boxes for Dad and/or Mom if met  
- [ ] List formatting gaps for fidelity backlog (Phase 6 / export iterate)  
- [ ] List UX bugs for a fix branch  
- [ ] Thank them; say you’ll improve formatting based on Q2  

### Mini log template

```text
Date:
Parent: Dad / Mom
Browser / OS:
Account email:
Completed download? Y/N
Q1 use workflow again:
Q2 formatting ready for moderation:
Blockers:
Bugs (screen + text):
Samples promised:
```

---

## 10. Success criteria (Session One)

| Result | Meaning |
|--------|---------|
| Both Q1 ≈ yes + downloads worked | Phase 1 DoD largely met → plan Phase 2 (2–3 real papers / 2 weeks) |
| Download worked, Q1 no | Product not ready; fix top blockers before more polish |
| Couldn’t finish path | Treat as P0; fix before inviting again |

---

## Related

- Prod: https://assessment-builder-sooty.vercel.app/  
- ROADMAP Phase 1 DoD · Phase 2 Pilot briefings  
- UX: large text, busy states, back links  
- Export: ADR-014 structure-first  
- Templates: ADR-016 Private only  
- Ops deferrals (containers/DO): ADR-017  
