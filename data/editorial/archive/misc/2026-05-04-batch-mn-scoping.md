# Batch m/n Scoping — 2026-05-04

Scoped from `_corpus-scoping-2026-05-03.md` §A10/A11. Corpus verified against fresh `excels/` post-pull (2026-05-03). Decisions locked same session.

---

## Batch m — `, Kameraad` in NL but no `, Comrade` in EN (14 cells)

**Decision:** Remove Kameraad tag from all 14 lines. Comrade as address form is editorial noise added during Phase-C that has no EN source basis for these lines.

**False-positive filter:** cells where EN *does* say "Comrade" are excluded (those are correct).

**Capitalization note:** All variants (`, Kameraad` / `, kameraad` / `, kameraaden` / mid-sentence `, kameraad,`) treated uniformly — strip, clean surrounding punctuation.

| ID | File | Sheet | Row | Speaker | EN | Current NL | Proposed NL |
|----|------|-------|-----|---------|-----|------------|-------------|
| KAMERAAD-001 | 10_asses.masses_E10Proxy.xlsx | E10_Government_localization | J145 | Big Ass | No Ass gets left behind. | Geen Ezel wordt achtergelaten, Kameraad. | Geen Ezel wordt achtergelaten. |
| KAMERAAD-002 | 10_asses.masses_E10Proxy.xlsx | E10_ProphetSpeech_localization | J56 | Cole-Machine | Yet, all of us here, both Humans and donkeys, are rational beings. | Toch zijn wij hier allemaal, zowel Mensen als Ezels, rationele wezens, kameraaden. | Toch zijn wij hier allemaal, zowel Mensen als Ezels, rationele wezens. |
| KAMERAAD-003 | 10_asses.masses_E10Proxy.xlsx | E10_ProphetSpeech_localization | J66 | Cole-Machine | Like you, these Asses think of themselves as intelligent animals. | Net als gij, kameraad, denken deze Ezels van zichzelf dat ze intelligente dieren zijn. | Net als gij denken deze Ezels van zichzelf dat ze intelligente dieren zijn. |
| KAMERAAD-004 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J6 | Sturdy Ass | It's not like you to nod off at your post. | 't Is niks voor jou om in te dommelen op je post, Kameraad. | 't Is niks voor jou om in te dommelen op je post. |
| KAMERAAD-005 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J14 | Sturdy Ass | Uncle Hard can't abandon his post. | Oom Bikkelharde kan zijn post niet verlaten, Kameraad. | Oom Bikkelharde kan zijn post niet verlaten. |
| KAMERAAD-006 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J15 | Sturdy Ass | The Humans are still trying to breach the Barricades and our Territory must be protected. | De Mensen proberen nog steeds de Barricades te doorbreken en ons Territorium moet beschermd worden, Kameraad. | De Mensen proberen nog steeds de Barricades te doorbreken en ons Territorium moet beschermd worden. |
| KAMERAAD-007 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J33 | Sturdy Ass | Which way should we go? | Welke weg moeten we nemen, Kameraad? | Welke weg moeten we nemen? |
| KAMERAAD-008 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J63 | Sturdy Ass | The structure lacks integrity and we can't fit through the door. | De structuur mist elke integriteit en we passen niet door die deur, Kameraad. | De structuur mist elke integriteit en we passen niet door die deur. |
| KAMERAAD-009 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J74 | Sturdy Ass | Is everything all right in there? Do you need any help? | Is alles in orde daarbinnen? Heb je hulp nodig, kameraad? | Is alles in orde daarbinnen? Heb je hulp nodig? |
| KAMERAAD-010 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J78 | Sturdy Ass | Would you like me to show you the Old Church next? | Zal ik je de Oude Kerk laten zien, Kameraad? | Zal ik je de Oude Kerk laten zien? |
| KAMERAAD-011 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J135 | Sturdy Ass | What should I call this? | Hoe zou ik dit noemen, kameraad? | Hoe zou ik dit noemen? |
| KAMERAAD-012 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J183 | Sturdy Ass | Sad, this Memorial Garden is coming along beautifully. | Triestige, dit Herdenkingstuintje wordt echt prachtig, Kameraad. | Triestige, dit Herdenkingstuintje wordt echt prachtig. |
| KAMERAAD-013 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J219 | Sturdy Ass | What's the perfect title to commemorate the opening of Bottoms Up? | Wat is nu de perfecte titel om de opening van Bottoms Up te vieren, Kameraad? | Wat is nu de perfecte titel om de opening van Bottoms Up te vieren? |
| KAMERAAD-014 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J262 | Sturdy Ass | Help? We don't help traitors. | Helpen? Wij helpen geen verraders, Kameraad. | Helpen? Wij helpen geen verraders. |

---

## Batch n — English fragments in Slow Ass NL (1 real hit)

**Total flagged by scoping script:** 12 cells
**False positives:** 11 — `no`/`is`/`had` as substrings in Dutch words (nodig, Snotje, is, had), plus 3 `Sorry` cells kept as naturalized Flemish loanword (EN also says "Sorry"; 1:1 intentional match)
**Real hits:** 1

**Decision on "Sorry":** Keep. Fully naturalized in Flemish Dutch. EN source also uses "Sorry" — intentional 1:1. Not an English bleed.

| ID | File | Sheet | Row | Speaker | EN | Current NL | Proposed NL |
|----|------|-------|-----|---------|-----|------------|-------------|
| SLOW-EN-001 | 6_asses.masses_E6Proxy.xlsx | E6_World_localization | J339 | Slow Ass | Sturdy, will you come with us? P-p-please? | Stevige, kom je met ons mee? P-p-please... alsjebbblieft? | Stevige, kom je met ons mee? P-p-p-alsjeblieft? |

**Note on J339:** Translator left both English "P-p-please" and Dutch "alsjebbblieft" (itself stuttered). Proposed fix: drop the English word, stutter only the Dutch. "alsjeblieft" gains one stutter level to match the emotional register of the plea.

---

## False positive log (batch n)

| Cell | Found | Reason excluded |
|------|-------|----------------|
| E1_Farm J39 | `no` | Substring in "nodig" |
| E1_TheProtest J79 | `Sorry` | Naturalized loanword; EN match |
| E1_TheProtest J80 | `no` | Substring in "nog niet" |
| E4_Mine1F J10 | `no` | Substring in "Snotje" |
| E4_Mine1F J56 | `no` | Substring in "Snotje" |
| E5_CircusMain J165 | `Sorry` | Naturalized loanword; EN match |
| E5_CircusMain J174 | `Sorry` | Naturalized loanword; EN match |
| E5_ZooCapture J21 | `no` | Substring in "nog"/"niet" |
| E6_World J259 | `no` | Substring in "nodig" |
| E6_World J261 | `no` | Substring in "nodig" |
| E6_World J287 | `no` | Substring in "genoeg"/"avond" |
