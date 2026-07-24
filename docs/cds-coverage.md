# CDS coverage map

Tracks every Common Data Set item against where it appears in the app, so
"every field is accounted for" is verifiable rather than assumed. Status:

- ✅ shown
- 🟡 partial (shown, but less granular than the CDS)
- ⬜ not yet shown

> Reference form: CDS 2025–26. Mock data is illustrative. Rendering lives in
> `src/components/sectionContent.tsx`; data shapes in `src/lib/types.ts`.

## A — General information
| Item | Status | Where |
|---|---|---|
| A1 address / website | ✅ | Website (address is metadata) |
| A2 institutional control | ✅ | Institutional control |
| A3 coeducational classification | ✅ | Coeducational status |
| A4 academic calendar | ✅ | Academic calendar |
| A5 degrees offered | 🟡 | "Degrees offered" (summary string, not the full checklist) |

_Removed as non-CDS: "religious affiliation", "campus setting"._

## B — Enrollment & persistence
| Item | Status | Where |
|---|---|---|
| B1 enrollment by status × gender × level | ✅ | Enrollment-by-status-and-gender matrix |
| B2 enrollment by racial/ethnic category | ✅ | Enrollment-by-racial/ethnic-category table |
| B3 degrees conferred by level | 🟡 | "Degrees awarded" (3 levels) |
| B4–B11 graduation-rate cohort | 🟡 | Graduation-rates table (summary cohort) |
| B12–B21 Pell / loan graduation breakdown | ✅ | Graduation-rates table (by aid group) |
| B22 first-year retention rate | ✅ | First-year retention rate |

## C — First-year admission
| Item | Status | Where |
|---|---|---|
| C1 applied/admitted/enrolled | 🟡 | Overview (totals only — **gender & FT/PT granularity ⬜**) |
| C2 waitlist | 🟡 | Waitlist activity (**"ranked?" flag ⬜**) |
| C5 units required/recommended | ⬜ | — |
| C7 factors | ✅ | Factors in the admission decision |
| C8 test policy | ✅ | Testing policy |
| C9 % submitting + score distributions | ✅ | Overview + Score distributions |
| C11 class rank | ✅ | Class rank & GPA |
| C12 HS GPA distribution | ✅ | Class rank & GPA |
| C13 application fee / waiver | ✅ | Overview (full tier) |
| C15–C16 deadlines / notification / reply / deposit | ✅ | Overview (full tier) |
| C21/C22 early decision / early action | ✅ | Early decision & early action |
| Acceptance rate, yield (derived) | ✅ | Calculated metrics block |

## D — Transfer admission
| Item | Status | Where |
|---|---|---|
| D1 accepts transfers | ✅ | Accepts transfer students |
| D2 applied/admitted/enrolled | 🟡 | Totals (**gender granularity ⬜**) |
| D3–D5 terms / deadline | ✅ | Terms available, application deadline |
| D7 minimum GPA | ✅ | Minimum college GPA |
| D9/D11 max transferable / min at institution | ✅ | Full tier |
| D4 required materials | ✅ | Requires essay / transcript / good standing |

## E — Academic offerings & policies
| Item | Status | Where |
|---|---|---|
| E1 special study options | ✅ | Special study options |
| E2 required coursework areas | ✅ | Required coursework for graduation |

## F — Student life
| Item | Status | Where |
|---|---|---|
| F1 demographics (out-of-state, intl, age, housing, greek) | ✅ | Enrollment demographics |
| F1 racial/ethnic percentages | ✅ | Race/ethnicity table |
| F1 activities offered | ✅ | Activities offered |
| F2 ROTC | ✅ | ROTC |
| F3 housing options | ✅ | Housing options |

## G — Annual expenses
| Item | Status | Where |
|---|---|---|
| G1 tuition & fees | ✅ | Cost of attendance |
| G6 room & board | ✅ | Cost of attendance |
| G7/G9 books, other expenses | ✅ | Cost of attendance (full tier) |
| Per-credit-hour / tuition plan | ⬜ | — |

## H — Financial aid
| Item | Status | Where |
|---|---|---|
| H1 aid awarded by type | 🟡 | Aid-awarded-by-type table (**first-year vs all-undergrad columns ⬜**) |
| H2 need counts & average awards | ✅ | Financial aid + Applying for aid |
| H5 indebtedness | ✅ | Graduating with debt, average / federal debt |
| H6 FAFSA / CSS / priority date | ✅ | Aid application requirements |
| Net price (derived) | ✅ | Financial aid (to move to Calculated block) |

## I — Faculty & class size
| Item | Status | Where |
|---|---|---|
| I1 faculty counts / ratio / terminal-degree | 🟡 | Overview (**full/part-time × gender matrix ⬜**) |
| I3 class-size distribution | ✅ | Class-size distribution |

## J — Degrees conferred
| Item | Status | Where |
|---|---|---|
| J1 degrees by CIP field | ✅ | By field of study (curated + detailed) |

## Known remaining gaps (roadmap)
- C1/D2 gender & full/part-time granularity (needs the same GridTable matrix as B1)
- C5 units required/recommended table
- C2 "waitlist ranked?" flag
- H1 aid-awarded columns split by cohort (first-year vs all undergrad)
- I1 faculty full/part-time × gender matrix
- A5 degrees-offered full checklist; G per-credit / tuition-plan items
- Cross-year format handling: two missing states (NR = blank vs "Not collected")
