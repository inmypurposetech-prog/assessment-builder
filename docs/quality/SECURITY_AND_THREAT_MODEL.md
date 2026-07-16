# AssessMate — Security & threat model (InfoSec)

> **Disciplines:** Information Security / Cyber · Penetration testing mindset · Backend · DBA · Support  
> **Status:** Seeded 16 July 2026 (MVP Track A — checklist first; tooling deferred)  
> **Pair with:** [`TESTING_AND_ANALYTICS.md`](./TESTING_AND_ANALYTICS.md) · [`architecture/OVERVIEW.md`](../architecture/OVERVIEW.md) · ROADMAP Phase 2  

---

## Why this exists

AssessMate is built quickly with AI assistance (“vibe coding” speed). That raises the risk of **hidden bugs and weak security assumptions**. Safeguarding = systematic **threat thinking + automated checks + occasional adversarial review** — not one vendor product.

This lens owns:

| Concern | In scope for MVP |
|---------|------------------|
| Authn / Authz | Supabase Auth, session cookies, who can read whose assessments |
| Data protection | RLS, no learner PII, secrets hygiene, POPIA-minded |
| API abuse | Generate/export session checks, rate limits / caps |
| Supply chain / deps | Don’t commit secrets; keep deps updated lightly |
| Safe failure | Clear errors; no stack traces to anonymous clients |

**Out of MVP:** Full external pen-test firm engagement, bug bounty, formal SOC2, red-team — revisit at closed beta / paid tier.

---

## Threat model (short)

| Asset | Who might abuse it | What goes wrong | Primary control today |
|-------|--------------------|-----------------|----------------------|
| Educator account | Credential stuffing / weak password | Account takeover | Supabase Auth; Show/Forgot password; strong password guidance |
| Assessment JSON | Other logged-in users, anon | Cross-tenant data leak | RLS `user_id = auth.uid()`; API session checks |
| Generate / export APIs | Bot or abusive user | Cost spike / DoS | Session 401; monthly gen cap 429; export needs content |
| `.env` / service role | Leak in git or client | Full DB bypass | Gitignore; never ship service role to browser |
| Auth redirects | Open redirect / phishing | Session theft | Supabase redirect **allowlist** only |
| Parent samples | Accidental publish | Copyright / POPIA-ish risk | Gitignored binaries (ADR-007) |
| AI provider keys | Leak / runaway spend | Bill shock | Cap + bank-first; keys server-only when added |

---

## Phase 0–1 — already in place (keep honest)

- [x] Session-gated `/api/generate` and `/api/export` (401 when signed out)  
- [x] Monthly generation cap (429)  
- [x] No learner PII in product scope (NORTH_STAR)  
- [x] Parent PDF/DOCX gitignored  
- [x] Forgot password + Show password (WCAG-aligned visibility)  
- [ ] Re-verify RLS policies on `assessments`, `profiles`, `generation_usage` against migrations (tick after SQL review)

---

## Phase 2 — security checklist (before wider invitation)

Do these **before** non-parent closed beta:

### Identity & session

- [ ] Confirm email strategy documented (pilot off / public on)  
- [ ] Redirect allowlist: localhost + prod `/auth/callback` only (no wildcards)  
- [ ] Smoke: cannot access `/dashboard` or another user’s `/assessments/[id]` when logged out / as other user  
- [ ] Password reset link expiry behaviour understood (R11)

### Authorisation & data

- [ ] RLS audit: every user-owned table has policies; no “anon read all” on assessments  
- [ ] Integration note logged: unauthenticated cannot read others’ assessments (`TESTING_AND_ANALYTICS`)  
- [ ] Export only returns bytes for assessments owned by the session user  

### Abuse & availability

- [ ] Finer rate limit on generate (beyond monthly cap) — e.g. per-minute  
- [ ] Consider light rate limit on export and auth email send (Supabase has provider limits)  
- [ ] Kill switch plan if AI budget exceeded (ROADMAP)

### Observability & privacy

- [ ] Error monitoring (Sentry free tier or similar) — no secrets in client events  
- [ ] Privacy policy draft (Phase 2) — POPIA-minded: educator email/school only for MVP  
- [ ] Account delete path (right to erasure / supportable ops)

### Dependency & deploy

- [ ] CI: `lint` + `build` on PR (broken AI-generated code fails loud)  
- [ ] Periodic `npm audit` / Dependabot optional; don’t panic-update all deps mid-pilot  

### Adversarial pass (lightweight “pen test”)

Solo / friend hour — not a firm yet:

- [ ] Replay: copy another assessment UUID while logged in as User B → expect 404/empty  
- [ ] Call `/api/generate` and `/api/export` with no cookies → 401  
- [ ] Call export with someone else’s UUID while logged in → 404  
- [ ] Try XSS in question text / title (render: no `dangerouslySetInnerHTML` without sanitize)  
- [ ] Confirm service role key never appears in browser Network/JS  

---

## Testing tools: KaneAI vs Playwright (recommendation)

Context: LinkedIn / Lucy Wang post on **KaneAI** (TestMu AI) for AI-driven UI testing alongside “vibe coding”.

| Option | Fit for AssessMate | Verdict |
|--------|--------------------|---------|
| **Manual parent UAT + smoke scripts** | Phase 1–2 core | **Keep** — product truth for 50s+ educators |
| **CI lint + build** | Catches compile breaks from AI edits | **Do in Phase 2** (highest ROI) |
| **Playwright** (open, GitHub Actions–friendly) | Login → wizard → generate → review smoke | **Prefer** when automating E2E |
| **Vitest unit tests** | Cognitive validators, auth message maps | **Prefer** Phase 2 unit layer |
| **KaneAI / hosted AI test agents** | Plain-English cases, self-healing selectors, multi-browser | **Defer** — paid, vendor lock-in; useful later if Playwright maintenance hurts |
| **External pen-test firm** | Full adversarial | **Defer** to paid tier / B2G readiness |

**Decision (ADR-015):** Do **not** adopt KaneAI for Phase 2. Safeguard via discipline checklist + CI + Playwright/Vitest when we automate. Revisit KaneAI only if E2E maintenance cost justifies a paid agent.

InfoSec ≠ UI regression: KaneAI helps catch product bugs; **RLS, secrets, and authz** still need the checklist above.

---

## Documentation Gate — InfoSec lens

On security-sensitive PRs (auth, RLS, APIs, Storage, payments):

- [ ] Threat note (1–5 lines) in PR or this file  
- [ ] ROADMAP Auth & security / Phase 2 security ticks updated  
- [ ] Learning entry if a new op/tool was used  

---

## Related

- OVERVIEW § Security architecture  
- ROADMAP § Auth & security · Phase 2 Quality & safety  
- RUNBOOK support table (auth issues)  
- ADR-015 (testing tooling deferral)
