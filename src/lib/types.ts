/**
 * CDS data contract — the source of truth the future ingest pipeline must fulfill.
 *
 * A field typed `... | null` means the value may be "Not reported" for a given
 * university/year. A whole section typed `... | null` means that CDS section is
 * absent for that university/year and should NOT appear in the table of contents.
 *
 * Nothing here depends on how the data is stored; the mock dataset and the eventual
 * real pipeline both produce values shaped like `CdsRecord`.
 */

export type UniversityType = "Private" | "Public";

/** Stable metadata about an institution (does not change year to year). */
export interface University {
  /** URL-safe identifier, e.g. "nyu". */
  slug: string;
  /** Canonical display name, e.g. "New York University". */
  name: string;
  city: string;
  state: string;
  type: UniversityType;
  /** Nicknames / abbreviations that should resolve to this school in search. */
  aliases: string[];
  /** Years with an available CDS record, most recent first. */
  years: number[];
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

/** One row of the class-size distribution, per CDS section I3. */
export interface ClassSizeRow {
  range: string;
  /** Percent of undergraduate class sections in this size band. */
  percent: number | null;
}

/** CDS section C — Admissions. */
export interface AdmissionsSection {
  /** Overall acceptance rate, percent (0–100). */
  acceptanceRate: number | null;
  applicants: number | null;
  admitted: number | null;
  enrolledFirstYear: number | null;
  applicationDeadline: string | null;
  testPolicy: string | null;
  factors: AdmissionFactor[];
  testScores: TestScoreRange[];
  waitlistOffered: number | null;
  waitlistAccepted: number | null;
  waitlistAdmitted: number | null;
}

/** CDS section B — Enrollment & outcomes. */
export interface EnrollmentSection {
  totalEnrollment: number | null;
  undergradEnrollment: number | null;
  /** First-year retention rate, percent. */
  firstYearRetention: number | null;
  /** Six-year graduation rate, percent. */
  sixYearGraduation: number | null;
  /** Four-year graduation rate, percent. */
  fourYearGraduation: number | null;
}

/** CDS sections G & H — Cost & aid. */
export interface CostSection {
  tuitionInState: number | null;
  tuitionOutState: number | null;
  requiredFees: number | null;
  roomAndBoard: number | null;
  /** Average need-based aid award, dollars. */
  avgNeedAid: number | null;
  /** Percent of need met, on average. */
  pctNeedMet: number | null;
  /** Percent of undergraduates receiving any need-based aid. */
  pctReceivingAid: number | null;
}

/** CDS sections I & E — Academics & faculty. */
export interface AcademicsSection {
  studentFacultyRatio: string | null;
  fullTimeFaculty: number | null;
  /** Percent of class sections with fewer than 20 students. */
  pctClassesUnder20: number | null;
  classSizes: ClassSizeRow[];
}

/**
 * A full CDS record for one university in one year.
 * Any of the four sections may be `null` when that section is unavailable —
 * this drives a variable table of contents.
 */
export interface CdsRecord {
  slug: string;
  year: number;
  admissions: AdmissionsSection | null;
  enrollment: EnrollmentSection | null;
  cost: CostSection | null;
  academics: AcademicsSection | null;
}

/** The four CDS section groups this app renders, in fixed display order. */
export type SectionKey = "admissions" | "enrollment" | "cost" | "academics";

export interface SectionMeta {
  key: SectionKey;
  /** Plain-language, primary label. */
  title: string;
  /** Subordinate official CDS reference, e.g. "Section C". */
  cdsRef: string;
  /** One-line description for the ToC / section header. */
  blurb: string;
}

/** Fixed order + labels for the sections. */
export const SECTIONS: SectionMeta[] = [
  {
    key: "admissions",
    title: "Admissions",
    cdsRef: "Section C",
    blurb: "Selectivity, deadlines, test scores, and waitlist activity.",
  },
  {
    key: "enrollment",
    title: "Enrollment & outcomes",
    cdsRef: "Section B",
    blurb: "Enrollment size, retention, and graduation rates.",
  },
  {
    key: "cost",
    title: "Cost & aid",
    cdsRef: "Sections G & H",
    blurb: "Tuition, fees, room & board, and financial aid.",
  },
  {
    key: "academics",
    title: "Academics & faculty",
    cdsRef: "Sections I & E",
    blurb: "Student-faculty ratio and class-size distribution.",
  },
];
