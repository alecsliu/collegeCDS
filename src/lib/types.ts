/**
 * CDS data contract — the source of truth the future ingest pipeline must fulfill.
 *
 * The app models the full Common Data Set, sections A–J. Every section carries a
 * curated "highlights" subset plus additional "full CDS" fields; the university
 * page toggles between them. A field typed `... | null` may render as "NR" (not
 * reported). A whole section typed `... | null` is absent for that university/year
 * and is dropped from the table of contents.
 *
 * Nothing here depends on how the data is stored; the mock dataset and the eventual
 * real pipeline both produce values shaped like `CdsRecord`.
 */

export type UniversityType = "Private" | "Public";

/** Stable metadata about an institution (does not change year to year). */
export interface University {
  slug: string;
  name: string;
  /** Short wordmark for cards, e.g. "NYU" or "Berkeley". Falls back to `name`. */
  shortName?: string;
  city: string;
  state: string;
  type: UniversityType;
  aliases: string[];
  /** Years with an available CDS record, most recent first. */
  years: number[];
}

/** CDS section A — General information. */
export interface GeneralSection {
  institutionalControl: string | null;
  academicCalendar: string | null;
  campusSetting: string | null;
  religiousAffiliation: string | null;
  website: string | null;
  // full CDS
  degreesOffered: string | null;
  applicationFee: number | null;
}

/** CDS section B — Enrollment & persistence. */
export interface EnrollmentSection {
  totalEnrollment: number | null;
  undergradEnrollment: number | null;
  firstYearRetention: number | null;
  sixYearGraduation: number | null;
  fourYearGraduation: number | null;
  // full CDS
  degreeSeekingUndergrad: number | null;
  graduateEnrollment: number | null;
  pctPartTimeUndergrad: number | null;
}

/** Weight an admission factor is given, per CDS section C7. */
export type FactorLevel =
  | "Very important"
  | "Important"
  | "Considered"
  | "Not considered";

export interface AdmissionFactor {
  factor: string;
  level: FactorLevel;
}

/** A 25th–75th percentile test-score band, per CDS section C9. */
export interface TestScoreRange {
  label: string;
  p25: number | null;
  p75: number | null;
}

/** CDS section C — First-time, first-year admission. */
export interface AdmissionsSection {
  acceptanceRate: number | null;
  applicants: number | null;
  admitted: number | null;
  enrolledFirstYear: number | null;
  applicationDeadline: string | null;
  testPolicy: string | null;
  pctSubmittingSat: number | null;
  pctSubmittingAct: number | null;
  factors: AdmissionFactor[];
  testScores: TestScoreRange[];
  waitlistOffered: number | null;
  waitlistAccepted: number | null;
  waitlistAdmitted: number | null;
  // full CDS
  pctTopTenth: number | null;
  pctTopQuarter: number | null;
  pctTopHalf: number | null;
  avgHsGpa: number | null;
  edApplicants: number | null;
  edAdmitted: number | null;
  notificationDate: string | null;
}

/** CDS section D — Transfer admission. */
export interface TransferSection {
  acceptsTransfers: string | null;
  applicants: number | null;
  admitted: number | null;
  enrolled: number | null;
  acceptanceRate: number | null;
  minCollegeGpa: number | null;
  // full CDS
  termsAvailable: string | null;
  minCreditsToTransfer: number | null;
  requiresEssay: string | null;
}

/** CDS section E — Academic offerings & policies. */
export interface OfferingsSection {
  specialStudyOptions: string[];
  requiredCoursework: string[];
  // full CDS
  mostPopularMajors: string[];
}

/** One row of a student demographic breakdown, per CDS section F1. */
export interface EthnicityRow {
  group: string;
  percent: number | null;
}

/** CDS section F — Student life. */
export interface StudentLifeSection {
  pctWomen: number | null;
  pctMen: number | null;
  pctOutOfState: number | null;
  pctInternational: number | null;
  pctLivingOnCampus: number | null;
  ethnicity: EthnicityRow[];
  // full CDS
  pctInState: number | null;
  pctDegreeSeeking: number | null;
  activitiesOffered: string[];
  housingOptions: string[];
}

/** CDS sections G & H — Annual expenses & financial aid. */
export interface CostSection {
  tuitionInState: number | null;
  tuitionOutState: number | null;
  requiredFees: number | null;
  roomAndBoard: number | null;
  avgNeedAid: number | null;
  pctNeedMet: number | null;
  pctReceivingAid: number | null;
  // full CDS
  booksAndSupplies: number | null;
  otherExpenses: number | null;
  avgNetPrice: number | null;
  avgDebtAtGraduation: number | null;
  pctGraduatingWithDebt: number | null;
}

/** One row of the class-size distribution, per CDS section I3. */
export interface ClassSizeRow {
  range: string;
  percent: number | null;
}

/** CDS section I — Instructional faculty & class size. */
export interface FacultySection {
  studentFacultyRatio: string | null;
  fullTimeFaculty: number | null;
  pctClassesUnder20: number | null;
  classSizes: ClassSizeRow[];
  // full CDS
  totalFaculty: number | null;
  pctTerminalDegree: number | null;
}

/** One row of degrees conferred by field, per CDS section J. */
export interface DegreeRow {
  field: string;
  percent: number | null;
}

/** CDS section J — Degrees conferred by disciplinary area. */
export interface DegreesSection {
  byField: DegreeRow[];
  // full CDS
  totalConferred: number | null;
}

/**
 * A full CDS record for one university in one year, spanning sections A–J.
 * Any section may be `null` when that section is unavailable.
 */
export interface CdsRecord {
  slug: string;
  year: number;
  general: GeneralSection | null;
  enrollment: EnrollmentSection | null;
  admissions: AdmissionsSection | null;
  transfer: TransferSection | null;
  offerings: OfferingsSection | null;
  studentLife: StudentLifeSection | null;
  cost: CostSection | null;
  faculty: FacultySection | null;
  degrees: DegreesSection | null;
}

/** Detail level the university page is showing. */
export type Tier = "highlights" | "full";

/** The CDS section groups this app renders, in fixed display order (A → J). */
export type SectionKey =
  | "general"
  | "enrollment"
  | "admissions"
  | "transfer"
  | "offerings"
  | "studentLife"
  | "cost"
  | "faculty"
  | "degrees";

export interface SectionMeta {
  key: SectionKey;
  title: string;
  cdsRef: string;
  blurb: string;
}

/** Fixed order + labels for the sections, following the CDS's own A–J order. */
export const SECTIONS: SectionMeta[] = [
  {
    key: "general",
    title: "General information",
    cdsRef: "Section A",
    blurb: "Institution type, academic calendar, and campus setting.",
  },
  {
    key: "enrollment",
    title: "Enrollment & persistence",
    cdsRef: "Section B",
    blurb: "Enrollment size, retention, and graduation rates.",
  },
  {
    key: "admissions",
    title: "First-year admission",
    cdsRef: "Section C",
    blurb: "Selectivity, deadlines, test scores, and waitlist activity.",
  },
  {
    key: "transfer",
    title: "Transfer admission",
    cdsRef: "Section D",
    blurb: "Transfer applicants, admits, and requirements.",
  },
  {
    key: "offerings",
    title: "Academic offerings & policies",
    cdsRef: "Section E",
    blurb: "Special study options and required coursework.",
  },
  {
    key: "studentLife",
    title: "Student life",
    cdsRef: "Section F",
    blurb: "Student demographics and campus housing.",
  },
  {
    key: "cost",
    title: "Cost & aid",
    cdsRef: "Sections G & H",
    blurb: "Tuition, fees, room & board, and financial aid.",
  },
  {
    key: "faculty",
    title: "Faculty & class size",
    cdsRef: "Section I",
    blurb: "Student-faculty ratio and class-size distribution.",
  },
  {
    key: "degrees",
    title: "Degrees conferred",
    cdsRef: "Section J",
    blurb: "Share of bachelor’s degrees by field.",
  },
];
