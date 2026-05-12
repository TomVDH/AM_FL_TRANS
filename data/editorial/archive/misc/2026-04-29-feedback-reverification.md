# Re-verification: feedback-2026-04-29.json against fresh excels (2026-05-03)

**Source:** [data/editorial/feedback-2026-04-29.json](feedback-2026-04-29.json) — 8 cells + codex updates staged 2026-04-29 from E0-E4 screenshots, never applied.

**Verified against:** fresh `excels/*.xlsx` post-pull from G Drive 2026-05-03.

---

## FB-BIK-1: 3_asses.masses_E3Proxy.xlsx::E3_Mine1F_localization!J138

- **Speaker:** Sturdy Ass
- **EN:** But Hard Ass says he hasn't seen any Humans for weeks.
- **EN actual now:** But Hard Ass says he hasn't seen any Humans for weeks.
- **Expected current_nl:** `Maar Hard zegt dat hij al weken geen Mensen heeft gezien.`
- **Proposed_nl:** `Maar Bikkelharde zegt dat hij al weken geen Mensen heeft gezien.`
- **Actual_nl now:** `Maar Bikkeharde zegt dat hij al weken geen Mensen heeft gezien.`
- **Verdict:** ✅ RESOLVED 2026-05-04 — batch g (BIKKELHARDE-003) fixed the typo in this cell; current value is now `Maar Bikkelharde zegt dat hij al weken geen Mensen heeft gezien.`

## FB-BIK-2: 10_asses.masses_E10Proxy.xlsx::E10_Credits_localization!J38

- **Speaker:** 71
- **EN:** Hard Ass
- **EN actual now:** Hard Ass
- **Expected current_nl:** `Bikkeharde Ezel`
- **Proposed_nl:** `Bikkelharde Ezel`
- **Actual_nl now:** `Bikkelharde Ezel`
- **Verdict:** ✅ ALREADY APPLIED

## FB-BIK-3: 6_asses.masses_E6Proxy.xlsx::E6_World_localization!J14

- **Speaker:** Sturdy Ass
- **EN:** Uncle Hard can't abandon his post.
- **EN actual now:** Uncle Hard can't abandon his post.
- **Expected current_nl:** `Oom Bikkehard kan zijn post niet verlaten, Kameraad.`
- **Proposed_nl:** `Oom Bikkelharde kan zijn post niet verlaten, Kameraad.`
- **Actual_nl now:** `Oom Bikkehard kan zijn post niet verlaten, Kameraad.`
- **Verdict:** 🟡 STILL ACTIONABLE

## FB-STAL-1: 2_asses.masses_E2Proxy.xlsx::E2_World_A2_localization!J24

- **Speaker:** Nice Ass
- **EN:** Not the Stable too!—
- **EN actual now:** Not the Stable too!—
- **Expected current_nl:** `Niet de Stal!-`
- **Proposed_nl:** `Niet de Stal ook!—`
- **Actual_nl now:** `Niet de Stal!-`
- **Verdict:** 🟡 STILL ACTIONABLE

## FB-HAPPY-1: 1_asses.masses_E1Proxy.xlsx::E1_RedFields_localization!J7

- **Speaker:** 19
- **EN:** Happy Ass
- **EN actual now:** Happy Ass
- **Expected current_nl:** `Happy Ezel`
- **Proposed_nl:** `Blije Ezel`
- **Actual_nl now:** `Happy Ezel`
- **Verdict:** 🟡 STILL ACTIONABLE

## FB-NICE-IDIOM-1: 2_asses.masses_E2Proxy.xlsx::E2_Confession_localization!J53

- **Speaker:** Nice Ass
- **EN:** Golly, what do you mean?
- **EN actual now:** Golly, what do you mean?
- **Expected current_nl:** `Amai, waarover ben je bezig?`
- **Proposed_nl:** `Amai, waar heb je het over?`
- **Actual_nl now:** `Amai, waarover ben je bezig?`
- **Verdict:** 🟡 STILL ACTIONABLE

## FB-BAD-WORD-1: 3_asses.masses_E3Proxy.xlsx::E3_BadCave_localization!J18

- **Speaker:** Bad Ass
- **EN:** Most are broken, but I rebuilt this one. I'm using the rest for spare parts.
- **EN actual now:** Most are broken, but I rebuilt this one. I'm using the rest for spare parts.
- **Expected current_nl:** `De meeste zijn kapot, maar deze heb ik herbouwd. De rest gebruik ik voor reserveonderdelen.`
- **Proposed_nl:** `De meeste zijn kapot, maar deze heb ik gerepareerd. De rest gebruik ik voor reserveonderdelen.`
- **Actual_nl now:** `De meeste zijn kapot, maar deze heb ik herbouwd. De rest gebruik ik voor reserveonderdelen.`
- **Verdict:** 🟡 STILL ACTIONABLE

## FB-OLD-HET-1: 1_asses.masses_E1Proxy.xlsx::E1_Stable2F_localization!J32

- **Speaker:** Old Ass
- **EN:** Please young Comrade, you have to play my role now!
- **EN actual now:** Please young Comrade, you have to play my role now!
- **Expected current_nl:** `Jonge Kameraad, nu is het aan u. Gij moet van me overnemen.`
- **Proposed_nl:** `Jonge Kameraad, nu is het aan u. Gij moet HET van me overnemen.`
- **Actual_nl now:** `Jonge Kameraad, nu is het aan u. Gij moet van me overnemen.`
- **Verdict:** 🟡 STILL ACTIONABLE

---

## Summary

- ✅ Already applied (drop from JSON): **1** — ['FB-BIK-2']
- 🟡 Still actionable (keep in JSON): **6** — ['FB-BIK-3', 'FB-STAL-1', 'FB-HAPPY-1', 'FB-NICE-IDIOM-1', 'FB-BAD-WORD-1', 'FB-OLD-HET-1']
- ✅ Resolved by batch g (2026-05-04): **1** — ['FB-BIK-1']

## Codex updates from feedback JSON


Note: per pre-pull diff, Hard Ass canonical `Bikkelharde` (with L) is at least partly applied on remote (E10_Credits!J38). Verify codex `data/json/codex_*.json` matches the Bikkelharde lock.
