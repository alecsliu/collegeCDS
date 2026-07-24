# CDS coverage map

Every Common Data Set item mapped to where it appears in the app, so coverage is
verifiable. Grounded in the **CDS 2025–26** template. Status:

- ✅ shown · 🟡 partial (shown, less granular than the form) · ⬜ not yet shown

> Rendering: `src/components/sectionContent.tsx`; shapes: `src/lib/types.ts`;
> data: `src/data/records.ts`. Mock data is illustrative.

## A — General information
| Item | Status | Notes |
|---|---|---|
| A1 address / website | ✅ | Website (address is metadata) |
| A2 source of institutional control | ✅ | Public / Private nonprofit / Proprietary |
| A3 undergraduate classification | ✅ | Coeducational / men's / women's |
| A4 academic year calendar | ✅ | Semester/Quarter/… |
| A5 degrees offered | 🟡 | Summary string, not the 12-box checklist |
| A6 campus-belonging webpage | ⬜ | new item |

## B — Enrollment & persistence
| Item | Status | Notes |
|---|---|---|
| B1 enrollment matrix (FT/PT × men/women/**unknown** × level) | 🟡 | matrix shown; missing the **Unknown-sex** column and the "Other first-year degree-seeking" row |
| B2 enrollment by racial/ethnic category | 🟡 | shown; missing the 3rd column (Total incl. non-degree) |
| B3 degrees awarded by type | 🟡 | 3 levels shown; form has **9 award types** |
| B4–B21 graduation-rate cohort (Pell / subsidized-loan / neither) | 🟡 | summarized by aid group; form is a full A–H grid × 2 cohorts |
| B22 first-year retention rate | ✅ | |

## C — First-year admission
| Item | Status | Notes |
|---|---|---|
| C1 applied/admitted/enrolled | 🟡 | totals only — **by gender, by FT/PT status, and by residency (in-state/out-of-state/international/unknown) ⬜** |
| C2 waitlist | 🟡 | counts shown — **"is it ranked?" + released to students/counselors ⬜** |
| C3 HS completion requirement | ⬜ | |
| C4 college-prep program required/recommended | ⬜ | |
| C5 units required/recommended | ⬜ | 12-row table |
| C6 open-admission policy | ⬜ | |
| C7 factors (18) | ✅ | now the full academic + nonacademic list |
| C8 SAT/ACT policy detail | 🟡 | policy shown; latest-date & placement-tests ⬜ |
| C9 % submitting + percentiles + distributions | 🟡 | shown; missing SAT-composite band table + full ACT sub-scores + 50th percentile |
| C10 class rank | ✅ | |
| C11 HS GPA distribution | ✅ | |
| C12 average GPA + % submitting GPA | ✅ | |
| C13 application fee / waiver / online policy | 🟡 | fee + waiver shown |
| C14–C17 deadlines / notification / reply / deposit | ✅ | |
| C18 deferred admission | ⬜ | |
| C19 early admission of HS students | ⬜ | |
| C21/C22 early decision / early action (+ restrictive) | ✅ | |
| acceptance rate, yield (derived) | ✅ | Calculated block |

## D — Transfer admission
| Item | Status | Notes |
|---|---|---|
| D1 accepts transfers / advanced standing | ✅ | |
| D2 applied/admitted/enrolled | 🟡 | totals — **by gender ⬜** |
| D3 terms | ✅ | |
| D4 min credits vs. first-year | ✅ | |
| D5 required items (transcripts/essay/test/good standing) | 🟡 | shown as yes/no |
| D6 min HS GPA | ⬜ | |
| D7 min college GPA | ✅ | |
| D9 dates | 🟡 | one deadline shown |
| D12–D17 transfer-credit policies | 🟡 | max transferable / min-at-institution shown |
| D18–D22 military/veteran credit | ⬜ | |

## E — Academic offerings & policies
| Item | Status | Notes |
|---|---|---|
| E1 special study options (19-box list) | ✅ | |
| E3 required coursework areas | ✅ | (E2 removed from form) |

## F — Student life
| Item | Status | Notes |
|---|---|---|
| F1 demographics (out-of-state, greek, housing, age) | ✅ | |
| F1 racial/ethnic percentages | ✅ | |
| F2 activities offered (21-box list) | ✅ | |
| F3 ROTC (Army/Navy/Air Force, on-campus vs cooperating) | 🟡 | single line |
| F4 housing options (12-box list) | ✅ | |

## G — Annual expenses
| Item | Status | Notes |
|---|---|---|
| G0 net-price-calculator URL | ⬜ | |
| G1 tuition / fees / food & housing | ✅ | |
| G2 credits per term / G3 varies by year / G4 varies by program | ⬜ | |
| G5 estimated expenses (books, transport, other; resident vs commuter) | 🟡 | books + other shown, no commuter split |
| G6 per-credit-hour charges | ⬜ | |

## H — Financial aid
| Item | Status | Notes |
|---|---|---|
| H1 aid awarded by type (need vs non-need columns) | 🟡 | one-column summary; form splits need/non-need across grants/self-help/waivers/athletic |
| H2 counts & averages (lines A–M) | 🟡 | key lines shown; not by FT-first-year / FT-ug / <FT-ug columns |
| H2A non-need scholarship counts | ⬜ | |
| H4 borrowers count | ✅ | |
| H5 indebtedness by loan source (any/federal/institutional/state/private) | 🟡 | avg + federal shown; not per-source table |
| H6/H7 nonresident aid policy | ⬜ | |
| H8/H9 forms required + filing dates | ✅ | FAFSA/CSS/priority date |
| H12–H14 types of aid & award criteria | ⬜ | |

## I — Instructional faculty & class size
| Item | Status | Notes |
|---|---|---|
| I1 faculty by FT/PT, gender, minority, nonresident, degree level | 🟡 | totals + terminal-degree/female/minority %; not the full A–J count table |
| I2 student-to-faculty ratio | ✅ | |
| I3 class sizes (sections **and subsections**) | 🟡 | sections shown; **subsections ⬜** |

## J — Degrees conferred
| Item | Status | Notes |
|---|---|---|
| J1 degrees by CIP field (~34 categories) | 🟡 | ~16-category breakdown; full CIP-2020 list ⬜ |

## Priority roadmap (biggest gaps)
1. **C1 / D2 matrices** — applied/admitted/enrolled by gender, FT/PT status, and residency (GridTable).
2. **C5** units required/recommended table.
3. **C2** waitlist "ranked?" + released-to-counselors flags.
4. **H1 / H2** full aid tables (need vs non-need; FT-first-year / FT-ug / <FT-ug columns).
5. **I1** full faculty count table; **I3** subsections.
6. **B3** 9 award types; **J1** full CIP list; **B1** Unknown-sex column.
7. Smaller: A6, C3/C4/C6/C18/C19, D6/D18–22, G0/G2–G6, H2A/H6/H12–14.
8. Cross-year: two missing states (NR = blank vs "Not collected").
