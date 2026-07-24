import type {
  AdmissionFactor,
  AidAvgRow,
  AidCountRow,
  AidTypeRow,
  CdsRecord,
  ClassSizeRow,
  DegreeRow,
  DegreeTypeRow,
  EnrollMatrixRow,
  FacultyCountRow,
  GenderStageRow,
  GradRateGroup,
  RaceRow,
  ResidencyRow,
  ScoreBandRow,
  StatusGenderRow,
  TestScoreRange,
  UnitRow,
} from "@/lib/types";
import { UNIVERSITIES } from "@/data/universities";

/**
 * Mock CDS records — one per university/year, spanning the full Common Data Set
 * (sections A–J). These stand in for the structured output of the future ingest
 * pipeline (§7 of the PRD). Numbers are illustrative and roughly plausible, not
 * authoritative.
 *
 * The seed below carries the section-specific figures (admissions, enrollment,
 * cost, faculty). The remaining sections (A general info, D transfer, E offerings,
 * F student life, J degrees) are derived per school from its metadata and headline
 * numbers, so the dataset stays compact while every school renders all sections.
 *
 * Coverage still exercises the UI: five schools have two years, and `ut-austin`
 * keeps several "Not reported" fields (fees, aid, ACT, waitlist).
 */

const META = new Map(UNIVERSITIES.map((u) => [u.slug, u]));

// The full CDS C7 factor list (6 academic + 12 nonacademic), with illustrative
// weights for a selective holistic reader.
const HOLISTIC_FACTORS: AdmissionFactor[] = [
  { factor: "Rigor of secondary school record", level: "Very important" },
  { factor: "Class rank", level: "Considered" },
  { factor: "Academic GPA", level: "Very important" },
  { factor: "Standardized test scores", level: "Considered" },
  { factor: "Application essay", level: "Very important" },
  { factor: "Recommendation(s)", level: "Important" },
  { factor: "Interview", level: "Considered" },
  { factor: "Extracurricular activities", level: "Important" },
  { factor: "Talent / ability", level: "Important" },
  { factor: "Character / personal qualities", level: "Very important" },
  { factor: "First generation", level: "Considered" },
  { factor: "Alumni/ae relation", level: "Considered" },
  { factor: "Geographical residence", level: "Considered" },
  { factor: "State residency", level: "Not considered" },
  { factor: "Religious affiliation / commitment", level: "Not considered" },
  { factor: "Volunteer work", level: "Considered" },
  { factor: "Work experience", level: "Considered" },
  { factor: "Level of applicant’s interest", level: "Considered" },
];

// I3 reports the *number* of undergraduate class sections in each size band.
// `under20` is the share (%) of sections under 20; `total` is the section count.
const CLASS_SIZES = (under20: number, total: number): ClassSizeRow[] => {
  const over = 100 - under20;
  const pct = [under20 * 0.42, under20 * 0.58, over * 0.55, over * 0.2, over * 0.1, over * 0.15];
  const labels = [
    "2–9 students", "10–19 students", "20–29 students",
    "30–39 students", "40–49 students", "50+ students",
  ];
  return labels.map((range, i) => ({ range, count: Math.round((total * pct[i]) / 100) }));
};

// ——— Per-school details for the derived sections ———
const WEBSITES: Record<string, string> = {
  nyu: "nyu.edu",
  harvard: "harvard.edu",
  yale: "yale.edu",
  princeton: "princeton.edu",
  columbia: "columbia.edu",
  stanford: "stanford.edu",
  mit: "mit.edu",
  penn: "upenn.edu",
  cornell: "cornell.edu",
  brown: "brown.edu",
  dartmouth: "dartmouth.edu",
  duke: "duke.edu",
  northwestern: "northwestern.edu",
  usc: "usc.edu",
  "uc-berkeley": "berkeley.edu",
  ucla: "ucla.edu",
  michigan: "umich.edu",
  "ut-austin": "utexas.edu",
};

const SETTINGS: Record<string, string> = {
  nyu: "Large city",
  harvard: "Midsize city",
  yale: "Midsize city",
  princeton: "Small town",
  columbia: "Large city",
  stanford: "Suburban",
  mit: "Midsize city",
  penn: "Large city",
  cornell: "Rural / college town",
  brown: "Midsize city",
  dartmouth: "Rural / college town",
  duke: "Midsize city",
  northwestern: "Suburban",
  usc: "Large city",
  "uc-berkeley": "Midsize city",
  ucla: "Large city",
  michigan: "College town",
  "ut-austin": "Large city",
};

const QUARTER = new Set(["stanford", "northwestern", "ucla", "dartmouth"]);
const OPEN_CURRICULUM = new Set(["brown"]);

// C5 — representative high-school units required / recommended.
const UNIT_REQ: UnitRow[] = [
  { subject: "Total academic units", required: 16, recommended: 18 },
  { subject: "English", required: 4, recommended: 4, indent: true },
  { subject: "Mathematics", required: 3, recommended: 4, indent: true },
  { subject: "Science", required: 2, recommended: 3, indent: true },
  { subject: "Of these, must be lab", required: 2, recommended: 3, indent: true },
  { subject: "Foreign language", required: 2, recommended: 4, indent: true },
  { subject: "Social studies", required: 2, recommended: 3, indent: true },
  { subject: "History", required: 1, recommended: 2, indent: true },
  { subject: "Academic electives", required: 2, recommended: 3, indent: true },
  { subject: "Computer science", required: null, recommended: 1, indent: true },
  { subject: "Visual / performing arts", required: 1, recommended: 1, indent: true },
];

// IPEDS racial/ethnic categories (shares sum to 100). Used for the F ethnicity
// percentages and the B2 enrollment-by-race counts.
const RACE = [
  { group: "Nonresident (international)", pct: 9 },
  { group: "Hispanic or Latino", pct: 16 },
  { group: "Black or African American", pct: 8 },
  { group: "White", pct: 34 },
  { group: "American Indian or Alaska Native", pct: 1 },
  { group: "Asian", pct: 22 },
  { group: "Native Hawaiian or other Pacific Islander", pct: 1 },
  { group: "Two or more races", pct: 6 },
  { group: "Race / ethnicity unknown", pct: 3 },
];

const DEGREE_DISTS: Record<string, DegreeRow[]> = {
  stem: [
    { field: "Engineering", percent: 24 },
    { field: "Computer & information sciences", percent: 16 },
    { field: "Biological sciences", percent: 12 },
    { field: "Social sciences", percent: 11 },
    { field: "Physical sciences", percent: 8 },
    { field: "Business", percent: 8 },
    { field: "Mathematics", percent: 7 },
    { field: "Other fields", percent: 14 },
  ],
  arts: [
    { field: "Visual & performing arts", percent: 16 },
    { field: "Business", percent: 15 },
    { field: "Social sciences", percent: 14 },
    { field: "Communication & journalism", percent: 11 },
    { field: "Liberal arts & humanities", percent: 9 },
    { field: "Health professions", percent: 8 },
    { field: "Psychology", percent: 7 },
    { field: "Other fields", percent: 20 },
  ],
  balanced: [
    { field: "Social sciences", percent: 20 },
    { field: "Biological sciences", percent: 14 },
    { field: "Engineering", percent: 10 },
    { field: "Computer & information sciences", percent: 10 },
    { field: "Mathematics", percent: 7 },
    { field: "Psychology", percent: 7 },
    { field: "History", percent: 6 },
    { field: "Other fields", percent: 26 },
  ],
};

const DEGREE_VARIANT: Record<string, keyof typeof DEGREE_DISTS> = {
  mit: "stem",
  "uc-berkeley": "stem",
  michigan: "stem",
  "ut-austin": "stem",
  cornell: "stem",
  nyu: "arts",
  usc: "arts",
  columbia: "arts",
};

// Deterministic per-school variation so figures differ but stay stable.
function hash(slug: string, salt: number): number {
  let x = 2166136261 ^ salt;
  for (let i = 0; i < slug.length; i++) {
    x ^= slug.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}
function pick(slug: string, salt: number, min: number, max: number): number {
  return min + (hash(slug, salt) % (max - min + 1));
}
const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

/** Split a total into men/women/unknown using a women fraction `w` (0–1). */
function genderSplit(total: number, w: number) {
  const unknown = Math.round(total * 0.01);
  const rest = total - unknown;
  const men = Math.round(rest * (1 - w));
  return { men, women: rest - men, unknown };
}

// ——— Full-CDS distribution templates (by selectivity tier) ———
const SAT_BANDS = ["700–800", "600–699", "500–599", "400–499", "300–399", "200–299"];
const ACT_BANDS = ["30–36", "24–29", "18–23", "12–17", "6–11", "Below 6"];
const GPA_BANDS = ["4.0", "3.75–3.99", "3.50–3.74", "3.25–3.49", "3.00–3.24", "2.50–2.99", "Below 2.50"];
const SAT_DIST = {
  elite: [72, 24, 3, 1, 0, 0],
  selective: [55, 35, 8, 2, 0, 0],
  moderate: [35, 42, 18, 4, 1, 0],
};
const ACT_DIST = {
  elite: [88, 10, 2, 0, 0, 0],
  selective: [70, 24, 5, 1, 0, 0],
  moderate: [45, 40, 13, 2, 0, 0],
};
const GPA_DIST = {
  elite: [58, 30, 8, 3, 1, 0, 0],
  selective: [40, 32, 17, 7, 3, 1, 0],
  moderate: [22, 30, 25, 14, 6, 2, 1],
};
type SelTier = "elite" | "selective" | "moderate";
const selTier = (acc: number): SelTier =>
  acc < 8 ? "elite" : acc < 20 ? "selective" : "moderate";
const bands = (labels: string[], pcts: number[]): ScoreBandRow[] =>
  labels.map((band, i) => ({ band, percent: pcts[i] }));

const SPECIAL_STUDY_FULL = [
  "Accelerated program", "Cooperative (work-study) education", "Distance learning",
  "Double major", "Dual enrollment", "English as a Second Language (ESL)",
  "Exchange student program", "Honors program", "Independent study", "Internships",
  "Liberal arts / career combination", "Part-time degree program", "Study abroad",
  "Teacher certification", "Undergraduate research", "Weekend college",
];
const REQUIRED_FULL = [
  "Arts / fine arts", "Computer literacy", "English (composition)", "Foreign languages",
  "History", "Humanities", "Mathematics", "Philosophy", "Sciences (lab)", "Social science",
];
const ACTIVITIES_FULL = [
  "Campus ministries", "Choral groups", "Concert band", "Dance", "Drama / theater",
  "International student organization", "Jazz band", "Literary magazine", "Marching band",
  "Model UN", "Music ensembles", "Musical theater", "Pep band", "Radio station",
  "Student government", "Student newspaper", "Student-run film society",
  "Symphony orchestra", "Television station", "Yearbook",
];
const HOUSING_FULL = [
  "Coed residence halls", "Men’s residence halls", "Women’s residence halls",
  "Apartments for single students", "Apartments for married students",
  "Housing for students with disabilities", "Housing for international students",
  "Fraternity / sorority housing", "Cooperative housing", "Living-learning communities",
  "Theme housing", "Wellness / substance-free housing",
];

// J1 — the full CIP-2020 disciplinary list. Each variant weights its major
// fields; the rest get a small share, then everything is normalized to 100%.
const CIP_NAMES = [
  "Agriculture", "Natural resources & conservation", "Architecture",
  "Area, ethnic & gender studies", "Communication & journalism",
  "Communication technologies", "Computer & information sciences",
  "Personal & culinary services", "Education", "Engineering",
  "Engineering technologies", "Foreign languages & linguistics",
  "Family & consumer sciences", "Law & legal studies", "English language & literature",
  "Liberal arts & general studies", "Library science", "Biological & biomedical sciences",
  "Mathematics & statistics", "Military science & technologies", "Interdisciplinary studies",
  "Parks, recreation & fitness", "Philosophy & religious studies",
  "Theology & religious vocations", "Physical sciences", "Science technologies", "Psychology",
  "Homeland security & law enforcement", "Public administration & social services",
  "Social sciences", "Construction trades", "Mechanic & repair technologies",
  "Precision production", "Transportation & materials moving", "Visual & performing arts",
  "Health professions", "Business, management & marketing", "History",
];
const cipDist = (majors: Record<string, number>): DegreeRow[] => {
  const raw = CIP_NAMES.map((field) => ({ field, w: majors[field] ?? 0.2 }));
  const sum = raw.reduce((a, r) => a + r.w, 0);
  return raw.map((r) => ({ field: r.field, percent: Math.round((r.w / sum) * 1000) / 10 }));
};
const CIP_FULL: Record<keyof typeof DEGREE_DISTS, DegreeRow[]> = {
  stem: cipDist({
    "Engineering": 22, "Computer & information sciences": 15, "Biological & biomedical sciences": 11,
    "Social sciences": 9, "Mathematics & statistics": 7, "Physical sciences": 7,
    "Business, management & marketing": 7, "Health professions": 5, "Psychology": 4,
    "Interdisciplinary studies": 3, "Visual & performing arts": 3, "Architecture": 2,
    "Communication & journalism": 2, "English language & literature": 2, "History": 1,
  }),
  arts: cipDist({
    "Visual & performing arts": 15, "Business, management & marketing": 14, "Social sciences": 12,
    "Communication & journalism": 10, "Liberal arts & general studies": 8, "Health professions": 7,
    "Psychology": 6, "Biological & biomedical sciences": 5, "English language & literature": 5,
    "Computer & information sciences": 4, "Foreign languages & linguistics": 3, "History": 3,
    "Interdisciplinary studies": 3, "Engineering": 3, "Education": 2,
  }),
  balanced: cipDist({
    "Social sciences": 18, "Biological & biomedical sciences": 13, "Engineering": 9,
    "Computer & information sciences": 9, "Psychology": 7, "Mathematics & statistics": 6,
    "History": 5, "English language & literature": 5, "Business, management & marketing": 5,
    "Visual & performing arts": 5, "Interdisciplinary studies": 4, "Physical sciences": 4,
    "Health professions": 3, "Communication & journalism": 3, "Foreign languages & linguistics": 2,
    "Area, ethnic & gender studies": 2,
  }),
};

/** Test-score seed: `null` means test-blind (no scores reported). */
type Sat = {
  ebrw: [number, number];
  math: [number, number];
  act: [number, number] | null;
} | null;

interface Seed {
  slug: string;
  year: number;
  acc: number;
  apps: number;
  adm: number;
  enr: number;
  deadline: string;
  policy: string;
  sat: Sat;
  wl: [number | null, number | null, number | null];
  total: number;
  ug: number;
  ret: number;
  g6: number;
  g4: number;
  tIn: number;
  tOut: number;
  fees: number | null;
  rb: number;
  aid: number | null;
  met: number | null;
  recv: number | null;
  /** `ratio: null` omits the Faculty & class size section. */
  ratio: string | null;
  fac?: number | null;
  u20?: number | null;
}

function build(s: Seed): CdsRecord {
  const meta = META.get(s.slug);
  const isPrivate = meta?.type === "Private";

  const testScores: TestScoreRange[] = s.sat
    ? [
        { label: "SAT Evidence-Based Reading & Writing", p25: s.sat.ebrw[0], p75: s.sat.ebrw[1] },
        { label: "SAT Math", p25: s.sat.math[0], p75: s.sat.math[1] },
        { label: "ACT Composite", p25: s.sat.act?.[0] ?? null, p75: s.sat.act?.[1] ?? null },
      ]
    : [];

  // D — Transfer admission (derived from first-year figures).
  const tRate = clamp(Math.round(s.acc * 1.2), 3, 50);
  const tApps = Math.round(s.apps * 0.11);
  const tAdm = Math.round((tApps * tRate) / 100);

  // F — Student life (derived per type/size with stable variation).
  const women = s.slug === "mit" ? 41 : pick(s.slug, 1, 48, 57);
  const onCampus =
    s.ug < 9000
      ? pick(s.slug, 4, 72, 100)
      : s.ug < 20000
        ? pick(s.slug, 4, 45, 72)
        : pick(s.slug, 4, 25, 45);

  // Full-CDS derived values.
  const st = selTier(s.acc);
  const variant = DEGREE_VARIANT[s.slug] ?? "balanced";
  const dist = DEGREE_DISTS[variant];
  const topTenth = clamp(94 - Math.round(s.acc * 0.8), 45, 96);
  const topQuarter = clamp(topTenth + 5, 0, 99);
  const topHalf = clamp(topQuarter + 3, 0, 100);
  const hasEd = isPrivate && s.slug !== "mit"; // MIT is early action, not ED
  const edApps = hasEd ? Math.round(s.apps * 0.08) : null;
  const eaApps = hasEd ? null : Math.round(s.apps * 0.35);
  const stickerInState = s.tIn + s.rb + (s.fees ?? 0);
  const pctPart = pick(s.slug, 8, 3, 12);
  const grad = s.total - s.ug;
  const bachelors = Math.round(s.ug * 0.24);
  const avgDebt = isPrivate
    ? pick(s.slug, 13, 12000, 26000)
    : pick(s.slug, 13, 18000, 30000);
  const numRecvNeed = s.recv === null ? null : Math.round((s.ug * s.recv) / 100);
  const avgNeedLoan = pick(s.slug, 25, 4000, 7000);
  const aidNull = s.aid === null;

  // H1 — aid awarded by type ($), need-based vs non-need-based.
  const pNeed = s.aid === null ? 0 : (numRecvNeed ?? 0) * s.aid;
  const nnPool = Math.round(s.ug * 0.12) * (s.aid === null ? 22000 : Math.round(s.aid * 0.4));
  const nb = (frac: number) => (aidNull ? null : Math.round(pNeed * frac));
  const nn = (frac: number) => Math.round(nnPool * frac);
  const ws1 = Math.round(s.ug * 0.08 * 2600);
  const ws2 = Math.round(s.ug * 0.02 * 2000);
  const aidByType: AidTypeRow[] = [
    { type: "Federal grants", needBased: nb(0.15), nonNeed: nn(0.05), indent: true },
    { type: "State grants", needBased: nb(0.08), nonNeed: nn(0.05), indent: true },
    { type: "Institutional grants", needBased: nb(0.7), nonNeed: nn(0.8), indent: true },
    { type: "External (private) grants", needBased: nb(0.07), nonNeed: nn(0.1), indent: true },
    { type: "Total scholarships / grants", needBased: nb(1), nonNeed: nnPool, emphasize: true },
    { type: "Student loans (excl. parent)", needBased: nb(0.25), nonNeed: nn(0.15), indent: true },
    { type: "Federal Work-Study", needBased: ws1, nonNeed: null, indent: true },
    { type: "State / other work-study", needBased: ws2, nonNeed: nn(0.03), indent: true },
    { type: "Total self-help", needBased: aidNull ? null : Math.round(pNeed * 0.25) + ws1 + ws2, nonNeed: nn(0.18), emphasize: true },
    { type: "Parent loans", needBased: null, nonNeed: nn(0.3) },
    { type: "Tuition waivers", needBased: nb(0.02), nonNeed: nn(0.05) },
    { type: "Athletic awards", needBased: null, nonNeed: nn(0.08) },
  ];

  // H2 — students awarded aid (counts) and average awards, by cohort.
  const cohorts: [number, number, number] = [s.enr, Math.round(s.ug * 0.94), Math.round(s.ug * 0.06)];
  const recvFrac = (s.recv ?? 45) / 100;
  const cLine = (label: string, frac: number): AidCountRow => ({
    label,
    ftFirstYear: Math.round(cohorts[0] * frac),
    ftUndergrad: Math.round(cohorts[1] * frac),
    ltFtUndergrad: Math.round(cohorts[2] * frac),
  });
  const aidCounts: AidCountRow[] = [
    { label: "Degree-seeking undergraduates", ftFirstYear: cohorts[0], ftUndergrad: cohorts[1], ltFtUndergrad: cohorts[2] },
    cLine("Applied for need-based aid", 0.6),
    cLine("Determined to have need", 0.5),
    cLine("Awarded any financial aid", recvFrac),
    cLine("Awarded need-based scholarship / grant", recvFrac * 0.9),
    cLine("Awarded need-based self-help", recvFrac * 0.55),
    cLine("Awarded non-need scholarship / grant", 0.15),
    cLine("Need fully met", recvFrac * ((s.met ?? 70) / 100)),
  ];
  const aLine = (label: string, val: number | null, unit: "currency" | "percent"): AidAvgRow => ({
    label,
    ftFirstYear: val,
    ftUndergrad: val,
    ltFtUndergrad: val,
    unit,
  });
  const aidAverages: AidAvgRow[] = [
    aLine("Average percent of need met", s.met, "percent"),
    aLine("Average financial aid package", s.aid === null ? null : Math.round(s.aid * 1.15), "currency"),
    aLine("Average need-based scholarship / grant", s.aid, "currency"),
    aLine("Average need-based self-help", pick(s.slug, 26, 2500, 5000), "currency"),
    aLine("Average need-based loan", avgNeedLoan, "currency"),
  ];
  const typesOfAid = [
    "Federal Direct Subsidized Loans", "Federal Direct Unsubsidized Loans", "Federal PLUS Loans",
    "State loans", "Institutional loans", "Federal Pell", "Federal SEOG",
    "State scholarships / grants", "Institutional scholarships / grants",
  ];
  const awardCriteria = ["Academics", "Alumni affiliation", "Art", "Athletics", "Leadership", "Music / drama", "State / district residency"];
  const nonresidentAidPolicy = isPrivate
    ? "Institutional need-based and non-need-based aid available"
    : "Limited institutional aid available to nonresidents";

  // B3 — degrees awarded by type.
  const degreesByType: DegreeTypeRow[] = [
    { type: "Certificate / diploma", count: Math.round(grad * 0.05) },
    { type: "Associate", count: 0 },
    { type: "Bachelor’s", count: bachelors },
    { type: "Post-bachelor’s certificate", count: Math.round(grad * 0.03) },
    { type: "Master’s", count: Math.round(grad * 0.4) },
    { type: "Post-master’s certificate", count: Math.round(grad * 0.02) },
    { type: "Doctoral — research/scholarship", count: Math.round(grad * 0.08) },
    { type: "Doctoral — professional practice", count: Math.round(grad * 0.05) },
    { type: "Doctoral — other", count: Math.round(grad * 0.01) },
  ];

  // I1 — instructional-faculty counts (full/part-time × category).
  const facFt = s.fac ?? 0;
  const facPt = Math.round(facFt * 0.4);
  const facFemale = pick(s.slug, 17, 32, 48);
  const facMinority = pick(s.slug, 18, 18, 38);
  const facTerminal = pick(s.slug, 15, 88, 99);
  const fp = (p: number): [number, number] => [
    Math.round((facFt * p) / 100),
    Math.round((facPt * p) / 100),
  ];
  const fc = (label: string, ft: number, pt: number): FacultyCountRow => ({
    label,
    fullTime: ft,
    partTime: pt,
    total: ft + pt,
  });
  const facultyCounts: FacultyCountRow[] = [
    { label: "Total instructional faculty", fullTime: facFt, partTime: facPt, total: facFt + facPt, emphasize: true },
    fc("Members of minority groups", ...fp(facMinority)),
    fc("Women", ...fp(facFemale)),
    fc("Men", facFt - fp(facFemale)[0], facPt - fp(facFemale)[1]),
    fc("Nonresident (international)", ...fp(5)),
    fc("With doctorate / terminal degree", ...fp(facTerminal)),
    fc("Highest degree master’s (not terminal)", ...fp(Math.max(0, 100 - facTerminal - 3))),
    fc("Highest degree bachelor’s", ...fp(2)),
    fc("Highest degree unknown / other", ...fp(1)),
  ];
  const totalSections = Math.round(s.ug * 0.22);
  const classSubsections =
    s.u20 != null
      ? CLASS_SIZES(clamp(s.u20 + 15, 0, 95), Math.round(totalSections * 0.5))
      : [];

  // B1 — enrollment matrix (full/part-time × gender). Splits are illustrative.
  const w = women / 100;
  const mkEnroll = (
    label: string,
    total: number,
    ftFrac: number,
    opts: { indent?: boolean; emphasize?: boolean } = {},
  ): EnrollMatrixRow => {
    const ft = Math.round(total * ftFrac);
    const pt = total - ft;
    const ftu = Math.round(ft * 0.01);
    const ptu = Math.round(pt * 0.01);
    const ftMen = Math.round((ft - ftu) * (1 - w));
    const ptMen = Math.round((pt - ptu) * (1 - w));
    return {
      label,
      ftMen,
      ftWomen: ft - ftu - ftMen,
      ftUnknown: ftu,
      ptMen,
      ptWomen: pt - ptu - ptMen,
      ptUnknown: ptu,
      ...opts,
    };
  };
  const dsUg = Math.round(s.ug * 0.98);
  const ugFtFrac = (100 - pctPart) / 100;
  const enrollmentMatrix: EnrollMatrixRow[] = [
    mkEnroll("Degree-seeking, first-time first-year", s.enr, 0.98, { indent: true }),
    mkEnroll("All other degree-seeking undergraduates", dsUg - s.enr, ugFtFrac, { indent: true }),
    mkEnroll("Total degree-seeking undergraduates", dsUg, ugFtFrac, { emphasize: true }),
    mkEnroll("Non-degree undergraduates", s.ug - dsUg, 0.3, { indent: true }),
    mkEnroll("Total undergraduates", s.ug, ugFtFrac, { emphasize: true }),
    mkEnroll("Total graduate students", grad, 0.6, { emphasize: true }),
  ];

  // B2 — enrollment by racial/ethnic category (counts).
  const raceEthnicity: RaceRow[] = [
    ...RACE.map((r) => ({
      group: r.group,
      firstYear: Math.round((s.enr * r.pct) / 100),
      undergrad: Math.round((s.ug * r.pct) / 100),
    })),
    { group: "Total", firstYear: s.enr, undergrad: s.ug },
  ];

  // B4–B21 — graduation-rate cohort with the Pell breakdown.
  const gradGroup = (label: string, share: number, rate: number): GradRateGroup => {
    const cohort = Math.round(s.enr * share);
    return { label, cohort, completed: Math.round((cohort * rate) / 100), rate };
  };
  const gradRates: GradRateGroup[] = [
    gradGroup("All students", 1, s.g6),
    gradGroup("Pell Grant recipients", 0.2, clamp(s.g6 - 4, 0, 100)),
    gradGroup("Federal loan, non-Pell", 0.15, clamp(s.g6 - 2, 0, 100)),
    gradGroup("Neither Pell nor loan", 0.65, clamp(s.g6 + 1, 0, 100)),
  ];

  // C1 — applications by gender, enrollee status, and residency.
  const gA = genderSplit(s.apps, w);
  // Slight per-school skew so admit/yield rates differ by gender.
  const gD = genderSplit(s.adm, clamp(w + ((hash(s.slug, 30) % 7) - 3) / 100, 0.35, 0.65));
  const gE = genderSplit(s.enr, clamp(w + ((hash(s.slug, 31) % 5) - 2) / 100, 0.35, 0.65));
  const byGender: GenderStageRow[] = [
    { group: "Men", applied: gA.men, admitted: gD.men, enrolled: gE.men },
    { group: "Women", applied: gA.women, admitted: gD.women, enrolled: gE.women },
    { group: "Unknown", applied: gA.unknown, admitted: gD.unknown, enrolled: gE.unknown },
    { group: "Total", applied: s.apps, admitted: s.adm, enrolled: s.enr },
  ];
  const ftPt = (n: number): [number, number] => {
    const ft = Math.round(n * 0.98);
    return [ft, n - ft];
  };
  const enrolledByStatus: StatusGenderRow[] = (
    [
      ["Men", gE.men],
      ["Women", gE.women],
      ["Unknown", gE.unknown],
      ["Total", s.enr],
    ] as [string, number][]
  ).map(([group, n]) => ({ group, fullTime: ftPt(n)[0], partTime: ftPt(n)[1] }));

  const pctOut = isPrivate ? pick(s.slug, 2, 60, 85) : pick(s.slug, 2, 12, 35);
  const pctIntl = isPrivate ? pick(s.slug, 3, 10, 24) : pick(s.slug, 3, 8, 18);
  const resSplit = (stage: string, T: number): ResidencyRow => {
    const international = Math.round((T * pctIntl) / 100);
    const unknown = Math.round(T * 0.02);
    const domestic = T - international - unknown;
    const outState = Math.round((domestic * pctOut) / 100);
    return { stage, inState: domestic - outState, outState, international, unknown, total: T };
  };
  const byResidency: ResidencyRow[] = [
    resSplit("Applied", s.apps),
    resSplit("Admitted", s.adm),
    resSplit("Enrolled", s.enr),
  ];

  // D2 — transfer applicants by gender.
  const teEnr = Math.round(tAdm * 0.75);
  const tgA = genderSplit(tApps, w);
  const tgD = genderSplit(tAdm, w);
  const tgE = genderSplit(teEnr, w);
  const transferByGender: GenderStageRow[] = [
    { group: "Men", applied: tgA.men, admitted: tgD.men, enrolled: tgE.men },
    { group: "Women", applied: tgA.women, admitted: tgD.women, enrolled: tgE.women },
    { group: "Unknown", applied: tgA.unknown, admitted: tgD.unknown, enrolled: tgE.unknown },
    { group: "Total", applied: tApps, admitted: tAdm, enrolled: teEnr },
  ];

  // C2 — waitlist ranking.
  const hasWl = s.wl[0] !== null;
  const wlRanked = !hasWl
    ? null
    : ["mit", "princeton", "michigan"].includes(s.slug)
      ? "Yes"
      : "No";
  const wlReleased = wlRanked === "Yes" ? "Yes" : hasWl ? "N/A" : null;

  return {
    slug: s.slug,
    year: s.year,
    general: {
      institutionalControl: isPrivate ? "Private, nonprofit" : "Public, state",
      academicCalendar: QUARTER.has(s.slug) ? "Quarter" : "Semester",
      campusSetting: SETTINGS[s.slug] ?? null,
      religiousAffiliation: null,
      website: WEBSITES[s.slug] ? `www.${WEBSITES[s.slug]}` : null,
      classification: "Coeducational",
      degreesOffered: "Bachelor’s, Master’s, Doctoral",
      campusBelongingUrl: WEBSITES[s.slug] ? `www.${WEBSITES[s.slug]}/belonging` : null,
    },
    enrollment: {
      totalEnrollment: s.total,
      undergradEnrollment: s.ug,
      firstYearRetention: s.ret,
      sixYearGraduation: s.g6,
      fourYearGraduation: s.g4,
      fiveYearGraduation: clamp(s.g4 + Math.round((s.g6 - s.g4) * 0.7), s.g4, s.g6),
      graduateEnrollment: grad,
      enrollmentMatrix,
      raceEthnicity,
      gradRates,
      bachelorsAwarded: bachelors,
      mastersAwarded: Math.round(grad * 0.4),
      doctoratesAwarded: Math.round(grad * 0.08),
      degreesByType,
    },
    admissions: {
      acceptanceRate: s.acc,
      applicants: s.apps,
      admitted: s.adm,
      enrolledFirstYear: s.enr,
      applicationDeadline: s.deadline,
      testPolicy: s.policy,
      // Test-blind schools don't collect scores → not reported.
      pctSubmittingSat: s.sat === null ? null : pick(s.slug, 5, 45, 72),
      pctSubmittingAct: s.sat === null ? null : pick(s.slug, 6, 18, 38),
      factors: HOLISTIC_FACTORS,
      testScores,
      waitlistOffered: s.wl[0],
      waitlistAccepted: s.wl[1],
      waitlistAdmitted: s.wl[2],
      byGender,
      enrolledByStatus,
      byResidency,
      waitlistRanked: wlRanked,
      waitlistReleasedStudents: wlReleased,
      waitlistReleasedCounselors: wlReleased,
      hsCompletionRequirement: "High school diploma required; GED accepted",
      collegePrepProgram: "Recommended",
      openAdmission: "No",
      unitRequirements: UNIT_REQ,
      deferredAdmission: "Yes — up to one year",
      earlyAdmissionHs: "No",
      applicationFee: pick(s.slug, 7, 65, 90),
      feeWaiverAvailable: "Yes",
      satComposite25: s.sat ? s.sat.ebrw[0] + s.sat.math[0] : null,
      satComposite75: s.sat ? s.sat.ebrw[1] + s.sat.math[1] : null,
      satEbrwDist: s.sat ? bands(SAT_BANDS, SAT_DIST[st]) : [],
      satMathDist: s.sat ? bands(SAT_BANDS, SAT_DIST[st]) : [],
      actDist: s.sat && s.sat.act ? bands(ACT_BANDS, ACT_DIST[st]) : [],
      gpaDist: bands(GPA_BANDS, GPA_DIST[st]),
      pctTopTenth: topTenth,
      pctTopQuarter: topQuarter,
      pctTopHalf: topHalf,
      pctBottomHalf: clamp(100 - topHalf, 0, 100),
      pctBottomQuarter: clamp(Math.round((100 - topHalf) * 0.4), 0, 100),
      avgHsGpa: Number((3.95 - s.acc * 0.01).toFixed(2)),
      notificationDate: s.deadline.startsWith("November") ? "Late March" : "Late March / April 1",
      replyDate: "May 1 (Candidates’ Reply Date)",
      depositDeadline: "May 1",
      depositAmount: isPrivate ? pick(s.slug, 24, 500, 800) : pick(s.slug, 24, 200, 500),
      edOffered: hasEd ? "Yes" : "No",
      edDeadline: hasEd ? "November 1" : null,
      edApplicants: edApps,
      edAdmitted: edApps ? Math.round((edApps * clamp(s.acc * 2.4, 8, 40)) / 100) : null,
      eaOffered: hasEd ? "No" : "Yes",
      eaApplicants: eaApps,
      eaAdmitted: eaApps ? Math.round((eaApps * clamp(s.acc * 1.5, 10, 50)) / 100) : null,
    },
    transfer: {
      acceptsTransfers: "Yes",
      applicants: tApps,
      admitted: tAdm,
      enrolled: Math.round(tAdm * 0.75),
      acceptanceRate: tRate,
      minCollegeGpa: s.acc < 8 ? 3.5 : s.acc < 18 ? 3.3 : 3.0,
      byGender: transferByGender,
      termsAvailable: "Fall and spring",
      applicationDeadline: "March 1",
      minCreditsToTransfer: 24,
      maxTransferCredits: 64,
      minCreditsAtInstitution: 60,
      requiresEssay: "Yes",
      requiresCollegeTranscript: "Yes",
      requiresGoodStanding: "Yes",
      minHsGpa: null,
      acceptsMilitaryCredit: "Yes (ACE, CLEP, DSST)",
    },
    offerings: {
      specialStudyOptions: SPECIAL_STUDY_FULL,
      requiredCoursework: OPEN_CURRICULUM.has(s.slug) ? [] : REQUIRED_FULL,
      mostPopularMajors: dist.slice(0, 3).map((d) => d.field),
    },
    studentLife: {
      pctWomen: women,
      pctMen: 100 - women,
      pctOutOfState: pctOut,
      pctInternational: pctIntl,
      pctLivingOnCampus: onCampus,
      ethnicity: RACE.map((r) => ({ group: r.group, percent: r.pct })),
      pctInState: isPrivate
        ? pick(s.slug, 16, 15, 40)
        : pick(s.slug, 16, 65, 88),
      pctDegreeSeeking: pick(s.slug, 9, 88, 99),
      pct25OrOlder: pick(s.slug, 19, 1, 8),
      averageAge: pick(s.slug, 20, 18, 21),
      pctGreekLife: pick(s.slug, 21, 5, 35),
      rotcOffered:
        !isPrivate || ["mit", "cornell", "princeton"].includes(s.slug)
          ? "Yes (Army, Navy, Air Force)"
          : "At a cooperating institution",
      activitiesOffered: ACTIVITIES_FULL,
      housingOptions: HOUSING_FULL,
    },
    cost: {
      tuitionInState: s.tIn,
      tuitionOutState: s.tOut,
      requiredFees: s.fees,
      roomAndBoard: s.rb,
      avgNeedAid: s.aid,
      pctNeedMet: s.met,
      pctReceivingAid: s.recv,
      booksAndSupplies: pick(s.slug, 10, 1000, 1500),
      otherExpenses: pick(s.slug, 11, 2000, 3500),
      avgNetPrice: s.aid === null ? null : Math.round(stickerInState - s.aid),
      avgDebtAtGraduation: avgDebt,
      avgFederalDebt: Math.round(avgDebt * 0.6),
      pctGraduatingWithDebt: pick(s.slug, 14, 25, 55),
      avgAidPackage: s.aid === null ? null : Math.round(s.aid * 1.15),
      avgNeedGrant: s.aid,
      avgNeedLoan,
      fafsaRequired: "Yes",
      cssProfileRequired: isPrivate ? "Yes" : "No",
      aidPriorityDeadline: isPrivate ? "February 1" : "March 2",
      netPriceCalculatorUrl: WEBSITES[s.slug] ? `www.${WEBSITES[s.slug]}/npc` : null,
      perCreditHour: Math.round(s.tIn / 30),
      tuitionVariesByYear: "No",
      aidByType,
      aidCounts,
      aidAverages,
      nonresidentAidPolicy,
      typesOfAid,
      awardCriteria,
    },
    faculty:
      s.ratio === null
        ? null
        : {
            studentFacultyRatio: s.ratio,
            fullTimeFaculty: s.fac ?? null,
            pctClassesUnder20: s.u20 ?? null,
            classSizes: s.u20 != null ? CLASS_SIZES(s.u20, totalSections) : [],
            partTimeFaculty: s.fac != null ? facPt : null,
            totalFaculty: s.fac != null ? facFt + facPt : null,
            pctTerminalDegree: facTerminal,
            pctFemaleFaculty: facFemale,
            pctMinorityFaculty: facMinority,
            facultyCounts,
            classSubsections,
          },
    degrees: {
      byField: dist,
      totalConferred: bachelors,
      byFieldFull: CIP_FULL[variant],
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

  // ————————————————————————————— UT Austin (several "Not reported" fields)
  { slug: "ut-austin", year: 2023, acc: 29.1, apps: 66077, adm: 19249, enr: 8459, deadline: "December 1", policy: "Test-optional", sat: { ebrw: [620, 720], math: [640, 770], act: null }, wl: [null, null, null], total: 51991, ug: 40916, ret: 96, g6: 88, g4: 73, tIn: 11448, tOut: 40582, fees: null, rb: 12374, aid: null, met: null, recv: 45, ratio: "18:1", fac: 3100, u20: 40 },
];

export const RECORDS: CdsRecord[] = SEEDS.map(build);
