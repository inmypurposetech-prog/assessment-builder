# AssessMate — UX, UI & Accessibility

> **Disciplines:** UX/UI Designer · Design System · Frontend · Change (adoption)  
> **Status:** Active  
> **Last updated:** 11 July 2026

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

---

## Accessibility (a11y) checklist

Target mindset: **WCAG 2.2 Level AA** where practical for MVP.

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

### Known gaps (track here)

- [ ] Full keyboard audit of wizard  
- [ ] Screen reader pass on login + dashboard  
- [ ] Skip link to main content  
- [ ] Reduced-motion preference for future animations  

---

## Key user journeys (UX)

| Journey | Happy path | Failure UX |
|---------|------------|------------|
| Signup | Clear fields → success or “confirm email” message (`getSignupSuccessMessage`) | Plain error, no stack traces |
| Login | Dashboard | Mapped via `getAuthErrorMessage` — wrong password vs unconfirmed email |
| Create assessment | 5-step wizard → save → list on dashboard | Disable Continue until valid; Maths % must total 100; step 5 branches Maths CAPS % vs LS Bloom |

### UX notes (2026-07-11)

- Auth copy lives in `src/lib/auth/messages.ts` so parents see actionable next steps (confirm email) instead of a generic failure.  
- Wizard Advanced step is **subject-aware** (Maths cognitive % vs Life Sciences Bloom) — never show the wrong taxonomy.  
- Local draft hydrate uses `useSyncExternalStore` (no flash/effect anti-pattern) so autosave remains reliable for 50s+ users.
| Generate (Phase 1) | Progress steps → review | Retry; never silent fail |
| Export (Phase 1) | Download DOCX/PDF | Explain if template missing |

---

## Design system backlog

- [ ] Document component API in this file as components grow  
- [ ] Empty / loading / error pattern components  
- [ ] Modal / confirm dialog (export, delete) — accessible  
- [ ] Form fieldset patterns for radio groups (wizard already custom)

---

## Related

- Parent UX evidence: [parent-interview-notes.md](../parent-interview-notes.md)  
- Tokens in code: `src/app/globals.css`  
