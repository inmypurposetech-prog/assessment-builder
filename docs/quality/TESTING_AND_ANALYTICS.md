# AssessMate — Testing, Quality & Analytics

> **Disciplines:** Quality/Testing Engineer · Data & Insights · Quant · Support  
> **Status:** Seeded (manual testing today; automation Phase 2+)  
> **Last updated:** 11 July 2026

---

## Quality goals

| Stage | Bar |
|-------|-----|
| Now | Manual happy-path; build+lint green |
| Parent MVP | Written UAT script; no P0 on generate/export |
| Public | CI lint/build; unit tests for validators; basic e2e smoke |
| School | Coverage on billing/sharing; analytics dashboards |

---

## Test strategy

```text
                    ▲  Few
           E2E / UAT│  Parent pilot scripts; later Playwright
                    │
        Integration │  Server actions + Supabase (optional early)
                    │
              Unit  │  Cognitive totals, titles, auth messages, mark validators
                    ▼  Many
```

### Unit (start Phase 1–2)

- [ ] `mathsCognitiveTotal` === 100 validator  
- [ ] `buildAssessmentTitle`  
- [ ] `getAuthErrorMessage` / signup outcomes  
- [ ] Future: mark sum === totalMarks; Bloom distribution helpers  

### Integration

- [ ] Save assessment as logged-in user (RLS allows)  
- [ ] Unauthenticated cannot read others’ assessments  

### E2E / UAT

- [ ] Manual: signup → wizard → save (today)  
- [ ] Manual Phase 1: generate → edit → export  
- [ ] Playwright smoke (Phase 2+): login + dashboard  

### Non-functional

- [ ] Generation latency acceptable (&lt; ~60s with progress UI)  
- [ ] Cost cap cannot be exceeded silently  

---

## Coverage reporting (when tests exist)

Planned:

```bash
# TBD when test runner added (Vitest recommended)
npm run test
npm run test:coverage
```

- [ ] Add Vitest (or Jest) + coverage script  
- [ ] Publish coverage summary in CI artifact or PR comment  
- [ ] Track coverage % here monthly once enabled:

| Month | Unit coverage | Notes |
|-------|---------------|-------|
| — | — | Not started |

**Target (post Phase 2):** critical domain libs ≥ 70% line coverage; UI optional.

---

## Manual test log

| Date | What | Result | Tester |
|------|------|--------|--------|
| 2026-06/07 | Signup/login/wizard/save | Works when email confirm handled | Tanielle |
| 2026-07-11 | `npm run lint` + `npm run build` | Pass (wizard localStorage hydrate fixed for React hooks lint) | Cursor + Tanielle |
| 2026-07-11 | Auth message helpers + Maths cognitive wizard fields | Code review; unit tests deferred to Phase 2 | Cursor |
| 2026-07-11 | Production smoke (signup → wizard → save) | Signup 400 on prod; likely existing email — clearer signup errors shipping | Tanielle |
| 2026-07-11 | Signup error copy (`getSignupErrorMessage`) | Maps already-registered / weak password / invalid email | Cursor |

---

## Analytics & insights (Data & Insights / Quant)

### Product metrics (implement Phase 3+)

| Metric | Why | Source (planned) |
|--------|-----|------------------|
| Signups | Growth | Supabase Auth |
| Assessments created | Activation | `assessments` insert |
| Generations / user / month | Cost + engagement | generation log table |
| Exports | Value moment | export events |
| Template uploads | Differentiator usage | templates table |
| “Would use again” | Qualitative | Pilot form |

### Cost metrics (Quant)

| Metric | Why |
|--------|-----|
| AI $ (or R) per generation | Pricing floor |
| AI $ per active user / month | Tier sustainability |
| Error rate on generate | Reliability |

### Privacy

- Prefer aggregated analytics  
- No learner PII  
- Document any third-party analytics (e.g. Vercel Analytics, Plausible) in NORTH_STAR/privacy before enabling  

### Tooling backlog

- [ ] Vercel Analytics or privacy-friendly alternative  
- [ ] Simple `events` table or log file for generations  
- [ ] Monthly cost spreadsheet (acceptable until warehouse needed)

---

## Accessibility testing

See [design/UX_AND_ACCESSIBILITY.md](../design/UX_AND_ACCESSIBILITY.md).  
QA owns: keyboard pass + contrast spot-check on each UI release.

---

## Related

- ROADMAP Phase 2 hardening  
- architecture/OVERVIEW pipelines  
