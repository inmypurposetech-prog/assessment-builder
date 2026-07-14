# AssessMate — UX, UI & Accessibility

> **Disciplines:** UX/UI Designer · Design System · Frontend · Change (adoption)  
> **Status:** Active — **follow this file on every UI change** (industry baseline for 50s+ educators)  
> **Last updated:** 14 July 2026 (Phase 1C — review UX)
  
> **Bar:** WCAG 2.2 Level **AA** where practical; GOV.UK / NHS-style clarity over SaaS density

---

## Honesty check (are we “industry best practice” today?)

**Mostly on track for MVP.** Product UX (large text, plain language, wizard, subject-aware cognitive models) plus parent-smoke interaction fixes and Phase 1C review (edit/replace/delete, live totals, proud-to-present bar). Remaining gaps: shared empty/loading components, skip link, full SR/keyboard audit (Phase 2).

| Area | Today | Target (best practice) |
|------|-------|------------------------|
| Link affordance | Always-underlined back + auth links | Keep; never colour-only / hover-only |
| Auth pending state | Busy until navigation + “Opening your dashboard…” | Keep |
| Wizard step change | Scroll to top + focus step `h1` | Keep |
| Dependent fields | `curriculum-matrix.ts` filters subject/grade | Extend matrix as content grows |
| Generate busy | “Building your paper…” until review loads | Keep; never silent fail |
| Review screen | Edit / Replace / Delete + live totals + proud bar | Export follows in 1D |
| Empty / loading / error | Partial shared patterns | Shared components Phase 2 |
| Skip link / SR audit | Not done | Phase 2 |

**Rule for Cursor / future chats:** Implement new UI to the **Target** column. Do not copy weak patterns from older screens without fixing them.

---

## Design principles

1. **One primary action per screen** (especially wizard steps).  
2. **Plain language** — “Marking memo”, not jargon.  
3. **Large text** — root font ~18px; comfortable line-height.  
4. **Minimum 44px** tap/click targets (`min-h-12` on controls).  
5. **Autosave / never lose work** — local draft + cloud save.  
6. **Preview before irreversible** — especially generate/export.  
7. **Teacher in control** — AI suggestions always editable.  
8. **Subject-aware UI** — Maths cognitive % vs Life Sciences Bloom (never show the wrong model).  
9. **Always show system status** — loading, saving, success, failure (WCAG 4.1.3).  
10. **Don’t strand the user** — clear escape (“Back to dashboard”), scroll/focus on step change, no dead-end option sets.

---

## Visual language (current)

| Token | Value | Role |
|-------|-------|------|
| `--primary` | `#0d7377` | Actions, links, focus |
| `--background` | `#fafafa` | Page |
| `--foreground` | `#1a1a1a` | Text |
| `--muted-foreground` | `#4a4a4a` | Secondary text |
| `--border` | `#c5d0d0` | Borders |

Primitives: `src/components/ui/{button,input,card}.tsx` — treat as the seed **design system**.  
When adding components: reuse tokens, keep variants few (`primary` / `secondary` / `ghost`).

**Avoid (product rule):** purple-gradient AI clichés; dense dashboards; tiny ghost links as only CTAs.

### Link & navigation affordance (mandatory)

Parent finding: **“Back to dashboard” was not obviously visible.**

Industry / a11y baseline:

- Links must be **recognisable without hover** (underline by default, or use a `secondary`/`ghost` **Button** as the escape hatch).  
- Do **not** rely on colour alone (WCAG 1.4.1).  
- Escape paths (“Back to dashboard”) stay **above the fold** on first paint of each wizard step and remain keyboard-reachable.  
- Prefer: `underline` always on text links, or a full-width-friendly button: “Back to dashboard”.

---

## Accessibility (a11y) checklist

Target mindset: **WCAG 2.2 Level AA** where practical for MVP. Inspired by GOV.UK Design System patterns (progressive disclosure, clear errors, focus management).

### Every UI change

- [ ] Visible **focus** ring (`focus-visible`)  
- [ ] Labels on inputs (`Input` component pattern)  
- [ ] Errors via `role="alert"` where appropriate  
- [ ] Colour not the only signal (text + colour)  
- [ ] Contrast: body text on background sufficient  
- [ ] Keyboard: can complete wizard without mouse  
- [ ] Hit targets ≥ 44×44 CSS px  
- [ ] `lang="en-ZA"` on document (already on layout)  
- [ ] Images/diagrams (later): meaningful alt text  
- [ ] **Loading / busy:** control or region shows status until the next view is ready  
- [ ] **Step / route change:** scroll to top (or to heading) **and** move focus to the new `h1` (or `tabIndex={-1}` heading)  
- [ ] **Dependent options:** hide, disable with reason, or show empty-state copy — never a silent invalid combo  

### Known gaps (track here)

- [x] Wizard “Back to dashboard” always-visible affordance (underline always on) — done 11 Jul 2026  
- [x] Login/signup: keep busy state until `router` navigation completes (+ “Opening your dashboard…”) — done 11 Jul 2026  
- [x] Wizard: on step change → `scrollTo(0)` + focus step heading — done 11 Jul 2026  
- [x] Curriculum cascade: subject/grade availability by exam body (`curriculum-matrix.ts`) — done 11 Jul 2026  
- [x] Review: scroll + focus page `h1`; generate busy until review; proud-to-present uses text + colour (not colour alone) — done 14 Jul 2026  
- [ ] Full keyboard audit of wizard + review  
- [ ] Screen reader pass on login + dashboard + review  
- [ ] Skip link to main content  
- [ ] Reduced-motion preference for future animations  
- [ ] Shared Empty / Loading / Error components  

---

## Interaction standards (apply to all future work)

### 1. Pending navigation after auth

**Implemented:** Login/signup keep `loading` true on success, show `Opening your dashboard…` (`aria-live="polite"`), and only clear busy on error / confirm-email.

### 2. Wizard step change — scroll & focus

**Implemented:** `useEffect` on `step` → `window.scrollTo(0)` + focus `h1` (`tabIndex={-1}`).

### 3. Dependent options / empty combinations

**Implemented:** `src/lib/constants/curriculum-matrix.ts` drives subject/grade lists. Changing exam body or subject clears invalid children and shows a plain-language `cascadeNote`. Empty states explain when nothing is available.

To restrict a combo later, edit `SUPPORTED_CURRICULUM` (do not leave unsupported options clickable).

### 4. Escape links & wayfinding

**Implemented:** “Back to dashboard” uses always-on underline + `min-h-12` hit target (wizard + review).

### 5. Generate → review busy state

**Implemented:** `GenerateAssessmentButton` keeps `aria-busy` and shows **Building your paper…** (`role="status"`) until `/assessments/[id]/review` loads. Rebuild from review confirms overwrite first.

### 6. Review edit / replace / delete

**Implemented** (`/assessments/[id]/review`):

- One question card at a time; primary actions are **Edit**, **Replace**, **Delete** (min-h-12).  
- **Live totals:** paper marks, memo marks, target + subject-aware CAPS % or Bloom mark share.  
- **Proud to present** bar: plain-language blockers (empty memo, marks mismatch) and cautions (CAPS ±5pp, bank shortfall). Colour pairs with text labels (“Fix:” / “Note:”).  
- Replace lists unused seed-bank items for the same subject/grade/exam body; empty list explains why.  
- **Save review** persists `generated_content` via `saveGeneratedAssessment`.

---

## Key user journeys (UX)

| Journey | Happy path | Failure UX |
|---------|------------|------------|
| Signup | Clear fields → success or “confirm email” message (`getSignupSuccessMessage`) | Mapped via `getSignupErrorMessage` |
| Login | Busy until dashboard; then dashboard | Mapped via `getAuthErrorMessage` |
| Create assessment | 5-step wizard → **Build my paper** or save draft | Disable Continue until valid; Maths % must sum to 100 |
| Generate | Busy → review | Alert + retry; monthly cap message if 429 |
| Review | Edit / replace / delete → Save review | Alert on save fail; proud bar lists blockers |
| Export (Phase 1D) | Download DOCX/PDF | Explain if template missing |

### UX notes

- Auth copy: `src/lib/auth/messages.ts`.  
- Wizard Advanced: subject-aware (Maths CAPS % with guide bullets vs LS Bloom focus from IEB grid pattern).  
- Local draft: stable `useSyncExternalStore` snapshot (avoid tab crash).  
- Phase 1A (11 Jul 2026): invalid Maths totals use `role="alert"`; Bloom radios from `BLOOM_FOCUS_OPTIONS`.  
- **Parent smoke 11 July 2026:** wizard usable end-to-end; raised link visibility, post-login loading gap, step scroll, dependent options — captured as standards above.  
- **Phase 1B (14 Jul 2026):** Structured `POST /api/generate` only.  
- **Phase 1C (14 Jul 2026):** Review at `/assessments/[id]/review`; dashboard **Review paper** / **Build my paper**; wizard primary CTA **Build my paper**.

---

## Design system backlog

- [x] Always-visible secondary nav / text-link styles (wizard + auth)  
- [x] Auth busy until navigation (`aria-busy` + status)  
- [x] Wizard scroll + focus heading on step change  
- [x] `supportedCurriculum` matrix + cascading selects  
- [x] Review shell + proud-to-present + live taxonomy totals  
- [ ] Document component API in this file as components grow  
- [ ] Empty / loading / error pattern components  
- [ ] Modal / confirm dialog (export, delete) — accessible (review delete uses `window.confirm` for now)  
- [ ] Form fieldset patterns for radio groups (wizard already custom)

---

## Related

- Parent UX evidence: [parent-interview-notes.md](../parent-interview-notes.md)  
- Tokens in code: `src/app/globals.css`  
- Quality UAT: [TESTING_AND_ANALYTICS.md](../quality/TESTING_AND_ANALYTICS.md)  
- Roadmap: Phase 1D export next; Phase 2 a11y harden  
