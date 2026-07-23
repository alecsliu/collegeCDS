import type {
  AdmissionFactor,
  CdsRecord,
  ClassSizeRow,
  TestScoreRange,
} from "@/lib/types";

/**
 * Mock CDS records — one per university/year. These stand in for the structured
 * output of the future ingest pipeline (§7 of the PRD). Numbers are illustrative
 * and roughly plausible, not authoritative.
 *
 * Coverage intentionally exercises the UI:
 *   - Several schools (nyu, harvard, stanford, uc-berkeley, michigan) have two
 *     years to drive the year selector.
 *   - `ut-austin` omits the Academics section (`ratio: null`) and several fields
 *     to drive the variable table of contents and "Not reported" states.
 */

const HOLISTIC_FACTORS: AdmissionFactor[] = [
  { factor: "Rigor of secondary school record", level: "Very important" },
  { factor: "Academic GPA", level: "Very important" },
  { factor: "Application essay", level: "Very important" },
  { factor: "Recommendations", level: "Important" },
  { factor: "Extracurricular activities", level: "Important" },
  { factor: "Talent / ability", level: "Important" },
  { factor: "Character / personal qualities", level: "Very important" },
  { factor: "First-generation status", level: "Considered" },
  { factor: "Standardized test scores", level: "Considered" },
  { factor: "Interview", level: "Considered" },
];

const CLASS_SIZES = (under20: number): ClassSizeRow[] => [
  { range: "2–9 students", percent: Math.round(under20 * 0.42) },
  { range: "10–19 students", percent: Math.round(under20 * 0.58) },
  { range: "20–29 students", percent: Math.round((100 - under20) * 0.55) },
  { range: "30–39 students", percent: Math.round((100 - under20) * 0.2) },
  { range: "40–49 students", percent: Math.round((100 - under20) * 0.1) },
  { range: "50+ students", percent: Math.round((100 - under20) * 0.15) },
];

/** Test-score seed: `null` means test-blind (no scores reported). */
type Sat = {
  ebrw: [number, number];
  math: [number, number];
  /** ACT 25th–75th, or `null` when ACT isn't reported. */
  act: [number, number] | null;
} | null;

interface Seed {
  slug: string;
  year: number;
  // Admissions
  acc: number;
  apps: number;
  adm: number;
  enr: number;
  deadline: string;
  policy: string;
  sat: Sat;
  /** waitlist: [offered, accepted, admitted]; any may be null. */
  wl: [number | null, number | null, number | null];
  // Enrollment
  total: number;
  ug: number;
  ret: number;
  g6: number;
  g4: number;
  // Cost & aid
  tIn: number;
  tOut: number;
  fees: number | null;
  rb: number;
  aid: number | null;
  met: number | null;
  recv: number | null;
  // Academics — `ratio: null` omits the whole section.
  ratio: string | null;
  fac?: number | null;
  u20?: number | null;
}

function build(s: Seed): CdsRecord {
  const testScores: TestScoreRange[] = s.sat
    ? [
        { label: "SAT Evidence-Based Reading & Writing", p25: s.sat.ebrw[0], p75: s.sat.ebrw[1] },
        { label: "SAT Math", p25: s.sat.math[0], p75: s.sat.math[1] },
        { label: "ACT Composite", p25: s.sat.act?.[0] ?? null, p75: s.sat.act?.[1] ?? null },
      ]
    : [];

  return {
    slug: s.slug,
    year: s.year,
    admissions: {
      acceptanceRate: s.acc,
      applicants: s.apps,
      admitted: s.adm,
      enrolledFirstYear: s.enr,
      applicationDeadline: s.deadline,
      testPolicy: s.policy,
      factors: HOLISTIC_FACTORS,
      testScores,
      waitlistOffered: s.wl[0],
      waitlistAccepted: s.wl[1],
      waitlistAdmitted: s.wl[2],
    },
    enrollment: {
      totalEnrollment: s.total,
      undergradEnrollment: s.ug,
      firstYearRetention: s.ret,
      sixYearGraduation: s.g6,
      fourYearGraduation: s.g4,
    },
    cost: {
      tuitionInState: s.tIn,
      tuitionOutState: s.tOut,
      requiredFees: s.fees,
      roomAndBoard: s.rb,
      avgNeedAid: s.aid,
      pctNeedMet: s.met,
      pctReceivingAid: s.recv,
    },
    academics:
      s.ratio === null
        ? null
        : {
            studentFacultyRatio: s.ratio,
            fullTimeFaculty: s.fac ?? null,
            pctClassesUnder20: s.u20 ?? null,
            classSizes: s.u20 != null ? CLASS_SIZES(s.u20) : [],
          },
  };
}

const SEEDS: Seed[] = [
  // ————————————————————————————— NYU
  { slug: "nyu", year: 2023, acc: 12.2, apps: 120172, adm: 14630, enr: 5899, deadline: "January 5", policy: "Test-optional", sat: { ebrw: [710, 760], math: [740, 790], act: [33, 35] }, wl: [34117, 18500, 1041], total: 59144, ug: 29401, ret: 94, g6: 87, g4: 84, tIn: 58168, tOut: 58168, fees: 3186, rb: 22032, aid: 42553, met: 66, recv: 48, ratio: "8:1", fac: 4700, u20: 60 },
  { slug: "nyu", year: 2022, acc: 12.8, apps: 105000, adm: 13440, enr: 5730, deadline: "January 5", policy: "Test-optional", sat: { ebrw: [700, 750], math: [730, 790], act: [32, 35] }, wl: [31000, 16800, 890], total: 58226, ug: 28773, ret: 93, g6: 86, g4: 83, tIn: 56500, tOut: 56500, fees: 3100, rb: 21536, aid: 40120, met: 64, recv: 47, ratio: "9:1", fac: 4600, u20: 59 },

  // ————————————————————————————— Harvard
  { slug: "harvard", year: 2023, acc: 3.4, apps: 61220, adm: 2081, enr: 1647, deadline: "January 1", policy: "Test-optional", sat: { ebrw: [730, 780], math: [760, 800], act: [34, 36] }, wl: [3500, 2100, 45], total: 30631, ug: 7240, ret: 98, g6: 98, g4: 86, tIn: 54269, tOut: 54269, fees: 4795, rb: 19502, aid: 65000, met: 100, recv: 55, ratio: "7:1", fac: 2400, u20: 74 },
  { slug: "harvard", year: 2022, acc: 3.2, apps: 57786, adm: 1954, enr: 1620, deadline: "January 1", policy: "Test-optional", sat: { ebrw: [720, 780], math: [750, 800], act: [33, 36] }, wl: [3300, 2000, 30], total: 30391, ug: 7178, ret: 98, g6: 97, g4: 85, tIn: 52659, tOut: 52659, fees: 4655, rb: 18941, aid: 62800, met: 100, recv: 54, ratio: "7:1", fac: 2350, u20: 73 },

  // ————————————————————————————— Yale
  { slug: "yale", year: 2023, acc: 4.6, apps: 52250, adm: 2404, enr: 1554, deadline: "January 2", policy: "Test-optional", sat: { ebrw: [720, 780], math: [740, 800], act: [33, 35] }, wl: [1000, 780, 32], total: 14567, ug: 6590, ret: 99, g6: 97, g4: 88, tIn: 62250, tOut: 62250, fees: 0, rb: 18450, aid: 64700, met: 100, recv: 52, ratio: "6:1", fac: 4600, u20: 76 },

  // ————————————————————————————— Princeton
  { slug: "princeton", year: 2023, acc: 5.7, apps: 38019, adm: 2167, enr: 1500, deadline: "January 1", policy: "Test-optional", sat: { ebrw: [730, 780], math: [760, 800], act: [34, 36] }, wl: [1300, 900, 40], total: 8846, ug: 5604, ret: 98, g6: 98, g4: 90, tIn: 57690, tOut: 57690, fees: 3630, rb: 19860, aid: 62200, met: 100, recv: 61, ratio: "5:1", fac: 1300, u20: 73 },

  // ————————————————————————————— Columbia
  { slug: "columbia", year: 2023, acc: 3.9, apps: 60377, adm: 2358, enr: 1550, deadline: "January 1", policy: "Test-optional", sat: { ebrw: [730, 780], math: [760, 800], act: [34, 35] }, wl: [2800, 1900, 60], total: 33776, ug: 8902, ret: 98, g6: 96, g4: 87, tIn: 65524, tOut: 65524, fees: 3078, rb: 16156, aid: 66150, met: 100, recv: 50, ratio: "6:1", fac: 4370, u20: 82 },

  // ————————————————————————————— Stanford
  { slug: "stanford", year: 2023, acc: 3.7, apps: 56378, adm: 2075, enr: 1736, deadline: "January 5", policy: "Test-optional", sat: { ebrw: [720, 770], math: [750, 800], act: [34, 35] }, wl: [600, 450, 15], total: 17529, ug: 7761, ret: 99, g6: 96, g4: 78, tIn: 58416, tOut: 58416, fees: 2145, rb: 19922, aid: 63400, met: 100, recv: 47, ratio: "5:1", fac: 2280, u20: 69 },
  { slug: "stanford", year: 2022, acc: 3.9, apps: 55471, adm: 2190, enr: 1700, deadline: "January 5", policy: "Test-optional", sat: { ebrw: [710, 770], math: [740, 800], act: [33, 35] }, wl: [580, 430, 12], total: 17246, ug: 7645, ret: 99, g6: 95, g4: 77, tIn: 56169, tOut: 56169, fees: 2085, rb: 18619, aid: 61000, met: 100, recv: 47, ratio: "5:1", fac: 2240, u20: 68 },

  // ————————————————————————————— MIT
  { slug: "mit", year: 2023, acc: 4.0, apps: 33796, adm: 1353, enr: 1136, deadline: "January 4", policy: "Test required", sat: { ebrw: [730, 780], math: [780, 800], act: [34, 36] }, wl: [762, 500, 18], total: 11858, ug: 4638, ret: 99, g6: 96, g4: 89, tIn: 57986, tOut: 57986, fees: 368, rb: 18790, aid: 57000, met: 100, recv: 58, ratio: "3:1", fac: 1080, u20: 68 },

  // ————————————————————————————— Penn
  { slug: "penn", year: 2023, acc: 5.9, apps: 54588, adm: 3218, enr: 2420, deadline: "January 5", policy: "Test-optional", sat: { ebrw: [720, 770], math: [760, 800], act: [34, 35] }, wl: [3400, 2200, 55], total: 28201, ug: 10572, ret: 98, g6: 96, g4: 88, tIn: 61710, tOut: 61710, fees: 7240, rb: 18580, aid: 60800, met: 100, recv: 46, ratio: "6:1", fac: 4700, u20: 71 },

  // ————————————————————————————— Cornell
  { slug: "cornell", year: 2023, acc: 7.5, apps: 71164, adm: 5330, enr: 3450, deadline: "January 2", policy: "Test-optional", sat: { ebrw: [710, 770], math: [740, 790], act: [33, 35] }, wl: [6800, 4300, 190], total: 25898, ug: 15735, ret: 97, g6: 95, g4: 88, tIn: 65204, tOut: 65204, fees: 0, rb: 17722, aid: 51900, met: 100, recv: 47, ratio: "9:1", fac: 1700, u20: 57 },

  // ————————————————————————————— Brown
  { slug: "brown", year: 2023, acc: 5.1, apps: 51302, adm: 2609, enr: 1730, deadline: "January 3", policy: "Test-optional", sat: { ebrw: [720, 770], math: [750, 800], act: [34, 35] }, wl: [2900, 1800, 70], total: 10609, ug: 7222, ret: 98, g6: 95, g4: 87, tIn: 65146, tOut: 65146, fees: 1416, rb: 16908, aid: 58400, met: 100, recv: 45, ratio: "6:1", fac: 1010, u20: 70 },

  // ————————————————————————————— Dartmouth
  { slug: "dartmouth", year: 2023, acc: 6.2, apps: 28336, adm: 1756, enr: 1180, deadline: "January 3", policy: "Test-optional", sat: { ebrw: [720, 780], math: [750, 800], act: [32, 35] }, wl: [2100, 1300, 55], total: 6746, ug: 4458, ret: 98, g6: 95, g4: 87, tIn: 62658, tOut: 62658, fees: 0, rb: 17418, aid: 60300, met: 100, recv: 48, ratio: "7:1", fac: 690, u20: 63 },

  // ————————————————————————————— Duke
  { slug: "duke", year: 2023, acc: 6.3, apps: 49469, adm: 3120, enr: 1742, deadline: "January 2", policy: "Test-optional", sat: { ebrw: [720, 780], math: [750, 800], act: [34, 35] }, wl: [3500, 2200, 90], total: 17148, ug: 6640, ret: 98, g6: 96, g4: 88, tIn: 63450, tOut: 63450, fees: 2216, rb: 17436, aid: 58600, met: 100, recv: 46, ratio: "8:1", fac: 3500, u20: 73 },

  // ————————————————————————————— Northwestern
  { slug: "northwestern", year: 2023, acc: 7.2, apps: 51000, adm: 3670, enr: 2050, deadline: "January 2", policy: "Test-optional", sat: { ebrw: [710, 770], math: [750, 800], act: [33, 35] }, wl: [3800, 2400, 80], total: 22603, ug: 8659, ret: 98, g6: 95, g4: 86, tIn: 63936, tOut: 63936, fees: 0, rb: 19494, aid: 56700, met: 100, recv: 44, ratio: "6:1", fac: 3300, u20: 78 },

  // ————————————————————————————— USC
  { slug: "usc", year: 2023, acc: 12.0, apps: 69000, adm: 8280, enr: 3480, deadline: "January 15", policy: "Test-optional", sat: { ebrw: [690, 760], math: [720, 790], act: [32, 35] }, wl: [8000, 5100, 210], total: 47310, ug: 20790, ret: 96, g6: 92, g4: 78, tIn: 66640, tOut: 66640, fees: 1602, rb: 17910, aid: 47800, met: 96, recv: 43, ratio: "9:1", fac: 4700, u20: 62 },

  // ————————————————————————————— UC Berkeley (test-blind)
  { slug: "uc-berkeley", year: 2023, acc: 11.4, apps: 128196, adm: 14612, enr: 6931, deadline: "November 30", policy: "Test-blind", sat: null, wl: [20000, 8500, 1200], total: 45307, ug: 32831, ret: 96, g6: 94, g4: 76, tIn: 14226, tOut: 46326, fees: 2652, rb: 20909, aid: 24800, met: 82, recv: 45, ratio: "20:1", fac: 1620, u20: 56 },
  { slug: "uc-berkeley", year: 2022, acc: 11.6, apps: 112821, adm: 13092, enr: 6553, deadline: "November 30", policy: "Test-blind", sat: null, wl: [18500, 8000, 900], total: 45057, ug: 32143, ret: 95, g6: 93, g4: 75, tIn: 14226, tOut: 44115, fees: 2604, rb: 19926, aid: 23400, met: 80, recv: 44, ratio: "20:1", fac: 1600, u20: 55 },

  // ————————————————————————————— UCLA (test-blind)
  { slug: "ucla", year: 2023, acc: 8.6, apps: 145904, adm: 12569, enr: 6387, deadline: "November 30", policy: "Test-blind", sat: null, wl: [22000, 9800, 800], total: 46430, ug: 32423, ret: 97, g6: 92, g4: 82, tIn: 13401, tOut: 46326, fees: 1798, rb: 17230, aid: 23600, met: 80, recv: 46, ratio: "18:1", fac: 2300, u20: 52 },

  // ————————————————————————————— Michigan
  { slug: "michigan", year: 2023, acc: 17.7, apps: 87600, adm: 15505, enr: 8500, deadline: "February 1", policy: "Test-optional", sat: { ebrw: [680, 740], math: [700, 790], act: [31, 34] }, wl: [18000, 11000, 500], total: 51225, ug: 32695, ret: 97, g6: 93, g4: 82, tIn: 16736, tOut: 55334, fees: 328, rb: 13106, aid: 21400, met: 88, recv: 42, ratio: "11:1", fac: 6900, u20: 58 },
  { slug: "michigan", year: 2022, acc: 18.0, apps: 84289, adm: 15172, enr: 8300, deadline: "February 1", policy: "Test-optional", sat: { ebrw: [670, 730], math: [690, 780], act: [31, 34] }, wl: [17000, 10400, 420], total: 50695, ug: 32282, ret: 97, g6: 92, g4: 81, tIn: 16178, tOut: 53232, fees: 318, rb: 12592, aid: 20600, met: 86, recv: 42, ratio: "11:1", fac: 6800, u20: 57 },

  // ————————————————————————————— UT Austin (missing Academics + fields)
  { slug: "ut-austin", year: 2023, acc: 29.1, apps: 66077, adm: 19249, enr: 8459, deadline: "December 1", policy: "Test-optional", sat: { ebrw: [620, 720], math: [640, 770], act: null }, wl: [null, null, null], total: 51991, ug: 40916, ret: 96, g6: 88, g4: 73, tIn: 11448, tOut: 40582, fees: null, rb: 12374, aid: null, met: null, recv: 45, ratio: null },
];

export const RECORDS: CdsRecord[] = SEEDS.map(build);
