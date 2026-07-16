# AssessMate — Legal & compliance (stub)

> **Discipline:** Legal / Compliance (POPIA · copyright · terms)  
> **Status:** Seeded stub — expand before public launch / paid tier  
> **Last updated:** 16 July 2026  
> **Pair with:** NORTH_STAR · ROADMAP Phase 2–4 · SECURITY_AND_THREAT_MODEL · parent-samples  

---

## Purpose

Home for product decisions that are **legal or compliance**, so they are not only buried in chat or ROADMAP bullets.

This is **not** legal advice. When in doubt (especially school contracts or paid tiers), consult a qualified SA advisor.

---

## In scope for AssessMate MVP

| Topic | Stance today | Where enforced |
|-------|--------------|----------------|
| **Learner PII / marks** | Out of MVP — do not store learner names/marks as core data | NORTH_STAR; threat model |
| **Educator account data** | Email, name, school optional — POPIA-minded; privacy policy in Phase 2 | Auth + profiles |
| **Past papers / parent samples** | Local reference only; **gitignored** binaries; do not republish | ADR-007; parent-samples README |
| **User-uploaded templates** (1E) | User retains rights; AssessMate stores privately to link on create; **no learner PII**; School share later | ADR-016; `/templates` UI copy; future Terms |
| **AI-generated content** | Teacher stays in control; teacher responsible for moderation use | NORTH_STAR principles |

---

## Phase checklist

### Phase 2 (parent pilot)

- [ ] Privacy policy **draft** (what we store, Supabase/Vercel regions, no learner PII)  
- [ ] Account delete / data erase path (Support-operable)  
- [ ] Remind parents: do not upload learner-identifying scripts into notes fields  

### Phase 3–4 (closed beta → public)

- [ ] Publish Terms of use + Privacy  
- [ ] Copyright reminder in-product: upload own materials; don’t redistribute past papers  
- [ ] Email confirmation **on** for public signup  
- [ ] Revisit if payments / school orgs need stronger DPIA-style notes  

---

## Open questions (track here)

| Question | Owner | Status |
|----------|-------|--------|
| Confirm EU Supabase region messaging for SA educators | You + privacy draft | Open |
| Template upload licence wording | BA + Legal lens | Seeded in `/templates` UI (educator-owned; Private); formal Terms before School share |
| Who owns generated paper text after export? | PO default: educator | Confirm in Terms |

---

## Related

- [NORTH_STAR.md](../NORTH_STAR.md) — product principles, scope, POPIA posture  
- [SECURITY_AND_THREAT_MODEL.md](../quality/SECURITY_AND_THREAT_MODEL.md) — technical controls  
- [ROADMAP_AND_CHECKLIST.md](../ROADMAP_AND_CHECKLIST.md) — Phase 2 privacy / Phase 4 terms  
- [parent-samples/README.md](../parent-samples/README.md) — copyright + gitignore  
