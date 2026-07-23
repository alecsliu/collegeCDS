import type { ReactNode } from "react";
import type { CdsRecord, SectionKey, Tier } from "@/lib/types";
import DataTable, { type DataRow } from "@/components/DataTable";
import NotReported from "@/components/NotReported";
import {
  NOT_REPORTED,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRange,
  formatText,
} from "@/lib/format";

/** Keep highlight rows always; include `full` rows only in the Full CDS view. */
function visible(rows: DataRow[], mode: Tier): DataRow[] {
  return mode === "full" ? rows : rows.filter((r) => r.tier !== "full");
}

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
                {missing ? <NotReported /> : value}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** A wrapped list of pill tags (special study options, required coursework). */
function TagList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText?: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm italic text-ink-3">{emptyText ?? NOT_REPORTED}</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line bg-crimson-tint/40 px-3 py-1 text-sm text-ink-2"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** GPA shows two decimals; null renders as "Not reported". */
function formatGpa(value: number | null): string {
  return value === null ? NOT_REPORTED : value.toFixed(2);
}

/** Builds the body JSX for a given section from a record, at the chosen tier. */
export function renderSectionBody(
  key: SectionKey,
  record: CdsRecord,
  mode: Tier,
): ReactNode {
  const full = mode === "full";

  switch (key) {
    case "general": {
      const g = record.general;
      if (!g) return null;
      const rows: DataRow[] = [
        { label: "Institutional control", value: formatText(g.institutionalControl), cdsRef: "A1" },
        { label: "Academic calendar", value: formatText(g.academicCalendar), cdsRef: "A1" },
        { label: "Campus setting", value: formatText(g.campusSetting), cdsRef: "A1" },
        { label: "Religious affiliation", value: g.religiousAffiliation ?? "None", cdsRef: "A1" },
        { label: "Degrees offered", value: formatText(g.degreesOffered), cdsRef: "A1", tier: "full" },
        { label: "Application fee", value: formatCurrency(g.applicationFee), cdsRef: "C13", tier: "full" },
        { label: "Website", value: formatText(g.website), cdsRef: "A0" },
      ];
      return <DataTable rows={visible(rows, mode)} />;
    }

    case "enrollment": {
      const e = record.enrollment;
      if (!e) return null;
      const rows: DataRow[] = [
        { label: "Total enrollment", value: formatNumber(e.totalEnrollment), cdsRef: "B1" },
        { label: "Undergraduate enrollment", value: formatNumber(e.undergradEnrollment), cdsRef: "B1" },
        { label: "Degree-seeking undergraduates", value: formatNumber(e.degreeSeekingUndergrad), cdsRef: "B1", tier: "full" },
        { label: "Graduate enrollment", value: formatNumber(e.graduateEnrollment), cdsRef: "B1", tier: "full" },
        { label: "Part-time undergraduates", value: formatPercent(e.pctPartTimeUndergrad), cdsRef: "B1", tier: "full" },
        { label: "First-year retention rate", value: formatPercent(e.firstYearRetention), cdsRef: "B22" },
        { label: "Six-year graduation rate", value: formatPercent(e.sixYearGraduation), cdsRef: "B11" },
        { label: "Four-year graduation rate", value: formatPercent(e.fourYearGraduation), cdsRef: "B11" },
      ];
      return <DataTable rows={visible(rows, mode)} />;
    }

    case "admissions": {
      const a = record.admissions;
      if (!a) return null;
      const overview: DataRow[] = [
        { label: "Acceptance rate", value: formatPercent(a.acceptanceRate), cdsRef: "C1–C2" },
        { label: "Applicants", value: formatNumber(a.applicants), cdsRef: "C1" },
        { label: "Admitted", value: formatNumber(a.admitted), cdsRef: "C1" },
        { label: "Enrolled first-year students", value: formatNumber(a.enrolledFirstYear), cdsRef: "C1" },
        { label: "Early decision applicants", value: formatNumber(a.edApplicants), cdsRef: "C21", tier: "full" },
        { label: "Early decision admitted", value: formatNumber(a.edAdmitted), cdsRef: "C21", tier: "full" },
        { label: "Application deadline", value: formatText(a.applicationDeadline), cdsRef: "C15" },
        { label: "Notification date", value: formatText(a.notificationDate), cdsRef: "C16", tier: "full" },
        { label: "Testing policy", value: formatText(a.testPolicy), cdsRef: "C8" },
        { label: "Submitting SAT scores", value: formatPercent(a.pctSubmittingSat), cdsRef: "C9" },
        { label: "Submitting ACT scores", value: formatPercent(a.pctSubmittingAct), cdsRef: "C9" },
      ];
      const rank: DataRow[] = [
        { label: "In top tenth of high-school class", value: formatPercent(a.pctTopTenth), cdsRef: "C11" },
        { label: "In top quarter", value: formatPercent(a.pctTopQuarter), cdsRef: "C11" },
        { label: "In top half", value: formatPercent(a.pctTopHalf), cdsRef: "C11" },
        { label: "Average high-school GPA", value: formatGpa(a.avgHsGpa), cdsRef: "C12" },
      ];
      return (
        <>
          <SubBlock title="Overview">
            <DataTable rows={visible(overview, mode)} />
          </SubBlock>

          {a.testScores.length > 0 && (
            <SubBlock title="Test scores (25th–75th percentile)">
              <HeadedTable
                head={["Test", "25th–75th"]}
                rows={a.testScores.map((t) => [t.label, formatRange(t.p25, t.p75)])}
              />
            </SubBlock>
          )}

          {full && (
            <SubBlock title="Class rank & GPA">
              <DataTable rows={rank} />
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

    case "transfer": {
      const t = record.transfer;
      if (!t) return null;
      const rows: DataRow[] = [
        { label: "Accepts transfer students", value: formatText(t.acceptsTransfers), cdsRef: "D1" },
        { label: "Terms available", value: formatText(t.termsAvailable), cdsRef: "D3", tier: "full" },
        { label: "Transfer applicants", value: formatNumber(t.applicants), cdsRef: "D2" },
        { label: "Transfer students admitted", value: formatNumber(t.admitted), cdsRef: "D2" },
        { label: "Transfer students enrolled", value: formatNumber(t.enrolled), cdsRef: "D2" },
        { label: "Transfer acceptance rate", value: formatPercent(t.acceptanceRate), cdsRef: "D2" },
        { label: "Minimum college GPA", value: t.minCollegeGpa === null ? NOT_REPORTED : t.minCollegeGpa.toFixed(1), cdsRef: "D7" },
        { label: "Minimum credits to transfer", value: formatNumber(t.minCreditsToTransfer), cdsRef: "D5", tier: "full" },
        { label: "Requires an essay", value: formatText(t.requiresEssay), cdsRef: "D4", tier: "full" },
      ];
      return <DataTable rows={visible(rows, mode)} />;
    }

    case "offerings": {
      const o = record.offerings;
      if (!o) return null;
      return (
        <>
          <SubBlock title="Special study options">
            <TagList items={o.specialStudyOptions} />
          </SubBlock>
          <SubBlock title="Required coursework for graduation">
            <TagList
              items={o.requiredCoursework}
              emptyText="Open curriculum — no specific course requirements."
            />
          </SubBlock>
          {full && (
            <SubBlock title="Most popular majors">
              <TagList items={o.mostPopularMajors} />
            </SubBlock>
          )}
        </>
      );
    }

    case "studentLife": {
      const f = record.studentLife;
      if (!f) return null;
      const demographics: DataRow[] = [
        { label: "Women", value: formatPercent(f.pctWomen), cdsRef: "F1" },
        { label: "Men", value: formatPercent(f.pctMen), cdsRef: "F1" },
        { label: "From in state", value: formatPercent(f.pctInState), cdsRef: "F1", tier: "full" },
        { label: "From out of state", value: formatPercent(f.pctOutOfState), cdsRef: "F1" },
        { label: "International (nonresident)", value: formatPercent(f.pctInternational), cdsRef: "F1" },
        { label: "Degree-seeking undergraduates", value: formatPercent(f.pctDegreeSeeking), cdsRef: "F1", tier: "full" },
        { label: "Living in college housing", value: formatPercent(f.pctLivingOnCampus), cdsRef: "F1" },
      ];
      return (
        <>
          <SubBlock title="Enrollment demographics">
            <DataTable rows={visible(demographics, mode)} />
          </SubBlock>
          {f.ethnicity.length > 0 && (
            <SubBlock title="Race / ethnicity (degree-seeking undergraduates)">
              <HeadedTable
                head={["Group", "Share"]}
                rows={f.ethnicity.map((e) => [e.group, formatPercent(e.percent)])}
              />
            </SubBlock>
          )}
          {full && (
            <SubBlock title="Activities offered">
              <TagList items={f.activitiesOffered} />
            </SubBlock>
          )}
          {full && (
            <SubBlock title="Housing options">
              <TagList items={f.housingOptions} />
            </SubBlock>
          )}
        </>
      );
    }

    case "cost": {
      const c = record.cost;
      if (!c) return null;
      const tuition: DataRow[] = [
        { label: "Tuition (in-state)", value: formatCurrency(c.tuitionInState), cdsRef: "G1" },
        { label: "Tuition (out-of-state)", value: formatCurrency(c.tuitionOutState), cdsRef: "G1" },
        { label: "Required fees", value: formatCurrency(c.requiredFees), cdsRef: "G1" },
        { label: "Room & board", value: formatCurrency(c.roomAndBoard), cdsRef: "G6" },
        { label: "Books & supplies", value: formatCurrency(c.booksAndSupplies), cdsRef: "G7", tier: "full" },
        { label: "Other expenses (est.)", value: formatCurrency(c.otherExpenses), cdsRef: "G9", tier: "full" },
      ];
      const aid: DataRow[] = [
        { label: "Average need-based award", value: formatCurrency(c.avgNeedAid), cdsRef: "H2" },
        { label: "Average percent of need met", value: formatPercent(c.pctNeedMet), cdsRef: "H2" },
        { label: "Undergraduates receiving need-based aid", value: formatPercent(c.pctReceivingAid), cdsRef: "H2" },
        { label: "Average net price", value: formatCurrency(c.avgNetPrice), cdsRef: "H2", tier: "full" },
        { label: "Graduating with debt", value: formatPercent(c.pctGraduatingWithDebt), cdsRef: "H5", tier: "full" },
        { label: "Average debt at graduation", value: formatCurrency(c.avgDebtAtGraduation), cdsRef: "H5", tier: "full" },
      ];
      return (
        <>
          <SubBlock title="Cost of attendance">
            <DataTable rows={visible(tuition, mode)} />
          </SubBlock>
          <SubBlock title="Financial aid">
            <DataTable rows={visible(aid, mode)} />
          </SubBlock>
        </>
      );
    }

    case "faculty": {
      const ac = record.faculty;
      if (!ac) return null;
      const overview: DataRow[] = [
        { label: "Student-faculty ratio", value: formatText(ac.studentFacultyRatio), cdsRef: "I1" },
        { label: "Full-time faculty", value: formatNumber(ac.fullTimeFaculty), cdsRef: "I1" },
        { label: "Total faculty (full & part time)", value: formatNumber(ac.totalFaculty), cdsRef: "I1", tier: "full" },
        { label: "Faculty with a terminal degree", value: formatPercent(ac.pctTerminalDegree), cdsRef: "I1", tier: "full" },
        { label: "Class sections with fewer than 20 students", value: formatPercent(ac.pctClassesUnder20), cdsRef: "I3" },
      ];
      return (
        <>
          <SubBlock title="Overview">
            <DataTable rows={visible(overview, mode)} />
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

    case "degrees": {
      const d = record.degrees;
      if (!d) return null;
      return (
        <>
          {full && (
            <SubBlock title="Total conferred">
              <DataTable
                rows={[
                  { label: "Bachelor’s degrees conferred", value: formatNumber(d.totalConferred), cdsRef: "J1" },
                ]}
              />
            </SubBlock>
          )}
          <SubBlock title="By field of study">
            <HeadedTable
              head={["Field of study", "Share of degrees"]}
              rows={d.byField.map((r) => [r.field, formatPercent(r.percent)])}
            />
          </SubBlock>
        </>
      );
    }
  }
}
