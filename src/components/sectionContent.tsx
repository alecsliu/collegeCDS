import type { ReactNode } from "react";
import type { CdsRecord, SectionKey } from "@/lib/types";
import DataTable, { type DataRow } from "@/components/DataTable";
import {
  NOT_REPORTED,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRange,
  formatText,
} from "@/lib/format";

/** A titled sub-block within a section. */
function SubBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

/** A simple headed table for distributions (test scores, factors, class sizes). */
function HeadedTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: [string, string][];
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-line">
          <th className="py-2 pr-4 text-left font-medium text-ink-2">{head[0]}</th>
          <th className="py-2 text-right font-medium text-ink-2">{head[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, value]) => {
          const missing = value === NOT_REPORTED;
          return (
            <tr key={label} className="border-b border-line last:border-0">
              <td className="py-2 pr-4 text-left text-ink-2">{label}</td>
              <td
                className={`py-2 text-right tabular-nums ${
                  missing ? "text-ink-3 italic" : "font-medium text-ink"
                }`}
              >
                {value}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Builds the body JSX for a given section from a record. */
export function renderSectionBody(
  key: SectionKey,
  record: CdsRecord,
): ReactNode {
  switch (key) {
    case "admissions": {
      const a = record.admissions;
      if (!a) return null;
      const overview: DataRow[] = [
        { label: "Acceptance rate", value: formatPercent(a.acceptanceRate), cdsRef: "C1–C2" },
        { label: "Applicants", value: formatNumber(a.applicants), cdsRef: "C1" },
        { label: "Admitted", value: formatNumber(a.admitted), cdsRef: "C1" },
        { label: "Enrolled first-year students", value: formatNumber(a.enrolledFirstYear), cdsRef: "C1" },
        { label: "Application deadline", value: formatText(a.applicationDeadline), cdsRef: "C15" },
        { label: "Testing policy", value: formatText(a.testPolicy), cdsRef: "C8" },
      ];
      return (
        <>
          <SubBlock title="Overview">
            <DataTable rows={overview} />
          </SubBlock>

          {a.testScores.length > 0 && (
            <SubBlock title="Test scores (25th–75th percentile)">
              <HeadedTable
                head={["Test", "25th–75th"]}
                rows={a.testScores.map((t) => [t.label, formatRange(t.p25, t.p75)])}
              />
            </SubBlock>
          )}

          <SubBlock title="Factors in the admission decision">
            <HeadedTable
              head={["Factor", "Weight"]}
              rows={a.factors.map((f) => [f.factor, f.level])}
            />
          </SubBlock>

          <SubBlock title="Waitlist activity">
            <DataTable
              rows={[
                { label: "Offered a waitlist place", value: formatNumber(a.waitlistOffered) },
                { label: "Accepted a place", value: formatNumber(a.waitlistAccepted) },
                { label: "Admitted from waitlist", value: formatNumber(a.waitlistAdmitted) },
              ]}
            />
          </SubBlock>
        </>
      );
    }

    case "enrollment": {
      const e = record.enrollment;
      if (!e) return null;
      const rows: DataRow[] = [
        { label: "Total enrollment", value: formatNumber(e.totalEnrollment), cdsRef: "B1" },
        { label: "Undergraduate enrollment", value: formatNumber(e.undergradEnrollment), cdsRef: "B1" },
        { label: "First-year retention rate", value: formatPercent(e.firstYearRetention), cdsRef: "B22" },
        { label: "Six-year graduation rate", value: formatPercent(e.sixYearGraduation), cdsRef: "B11" },
        { label: "Four-year graduation rate", value: formatPercent(e.fourYearGraduation), cdsRef: "B11" },
      ];
      return <DataTable rows={rows} />;
    }

    case "cost": {
      const c = record.cost;
      if (!c) return null;
      const tuition: DataRow[] = [
        { label: "Tuition (in-state)", value: formatCurrency(c.tuitionInState), cdsRef: "G1" },
        { label: "Tuition (out-of-state)", value: formatCurrency(c.tuitionOutState), cdsRef: "G1" },
        { label: "Required fees", value: formatCurrency(c.requiredFees), cdsRef: "G1" },
        { label: "Room & board", value: formatCurrency(c.roomAndBoard), cdsRef: "G6" },
      ];
      const aid: DataRow[] = [
        { label: "Average need-based award", value: formatCurrency(c.avgNeedAid), cdsRef: "H2" },
        { label: "Average percent of need met", value: formatPercent(c.pctNeedMet), cdsRef: "H2" },
        { label: "Undergraduates receiving need-based aid", value: formatPercent(c.pctReceivingAid), cdsRef: "H2" },
      ];
      return (
        <>
          <SubBlock title="Cost of attendance">
            <DataTable rows={tuition} />
          </SubBlock>
          <SubBlock title="Financial aid">
            <DataTable rows={aid} />
          </SubBlock>
        </>
      );
    }

    case "academics": {
      const ac = record.academics;
      if (!ac) return null;
      const overview: DataRow[] = [
        { label: "Student-faculty ratio", value: formatText(ac.studentFacultyRatio), cdsRef: "I1" },
        { label: "Full-time faculty", value: formatNumber(ac.fullTimeFaculty), cdsRef: "I1" },
        { label: "Class sections with fewer than 20 students", value: formatPercent(ac.pctClassesUnder20), cdsRef: "I3" },
      ];
      return (
        <>
          <SubBlock title="Overview">
            <DataTable rows={overview} />
          </SubBlock>
          {ac.classSizes.length > 0 && (
            <SubBlock title="Class-size distribution">
              <HeadedTable
                head={["Class size", "Share of sections"]}
                rows={ac.classSizes.map((r) => [r.range, formatPercent(r.percent)])}
              />
            </SubBlock>
          )}
        </>
      );
    }
  }
}
