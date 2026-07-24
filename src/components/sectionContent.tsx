import type { ReactNode } from "react";
import type { AidRow, CdsRecord, SectionKey } from "@/lib/types";
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

/**
 * A titled sub-block within a section. `full` blocks appear only in the Full CDS
 * view (and in print); `highlightOnly` blocks are the inverse.
 */
function SubBlock({
  title,
  children,
  full,
  highlightOnly,
}: {
  title: string;
  children: ReactNode;
  full?: boolean;
  highlightOnly?: boolean;
}) {
  const cls = full ? "cds-full" : highlightOnly ? "cds-highlight" : "";
  return (
    <div className={`mt-6 first:mt-0 ${cls}`}>
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

/** A simple headed two-column table for distributions. */
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

/** The financial-aid-awarded table (H1): type / recipients / average amount. */
function AidTable({ rows }: { rows: AidRow[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-line">
          <th className="py-2 pr-4 text-left font-medium text-ink-2">Type of aid</th>
          <th className="py-2 px-4 text-right font-medium text-ink-2">Recipients</th>
          <th className="py-2 text-right font-medium text-ink-2">Avg. amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.type} className="border-b border-line last:border-0">
            <td className="py-2 pr-4 text-left text-ink-2">{r.type}</td>
            <td className="px-4 py-2 text-right tabular-nums text-ink">
              {r.recipients === null ? <NotReported /> : formatNumber(r.recipients)}
            </td>
            <td className="py-2 text-right font-medium tabular-nums text-ink">
              {r.avgAmount === null ? <NotReported /> : formatCurrency(r.avgAmount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A wrapped list of pill tags. */
function TagList({ items, emptyText }: { items: string[]; emptyText?: string }) {
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

function formatGpa(value: number | null): string {
  return value === null ? NOT_REPORTED : value.toFixed(2);
}
function formatGpa1(value: number | null): string {
  return value === null ? NOT_REPORTED : value.toFixed(1);
}

/** Builds the body JSX for a section. Full-tier rows/blocks are tagged and
 *  hidden by CSS in the Highlights view; the toggle and print stylesheet
 *  control which are shown. */
export function renderSectionBody(
  key: SectionKey,
  record: CdsRecord,
): ReactNode {
  switch (key) {
    case "general": {
      const g = record.general;
      if (!g) return null;
      const rows: DataRow[] = [
        { label: "Institutional control", value: formatText(g.institutionalControl) },
        { label: "Coeducational status", value: formatText(g.classification) },
        { label: "Academic calendar", value: formatText(g.academicCalendar) },
        { label: "Degrees offered", value: formatText(g.degreesOffered), tier: "full" },
        { label: "Website", value: formatText(g.website) },
      ];
      return <DataTable rows={rows} />;
    }

    case "enrollment": {
      const e = record.enrollment;
      if (!e) return null;
      const rows: DataRow[] = [
        { label: "Total enrollment", value: formatNumber(e.totalEnrollment), cdsRef: "B1" },
        { label: "Undergraduate enrollment", value: formatNumber(e.undergradEnrollment), cdsRef: "B1" },
        { label: "Degree-seeking undergraduates", value: formatNumber(e.degreeSeekingUndergrad), cdsRef: "B1", tier: "full" },
        { label: "Undergraduate men", value: formatNumber(e.menUndergrad), cdsRef: "B1", tier: "full" },
        { label: "Undergraduate women", value: formatNumber(e.womenUndergrad), cdsRef: "B1", tier: "full" },
        { label: "Full-time undergraduates", value: formatNumber(e.fullTimeUndergrad), cdsRef: "B1", tier: "full" },
        { label: "Part-time undergraduates", value: formatNumber(e.partTimeUndergrad), cdsRef: "B1", tier: "full" },
        { label: "Non-degree undergraduates", value: formatNumber(e.nonDegreeUndergrad), cdsRef: "B1", tier: "full" },
        { label: "Graduate enrollment", value: formatNumber(e.graduateEnrollment), cdsRef: "B1", tier: "full" },
        { label: "First-year retention rate", value: formatPercent(e.firstYearRetention), cdsRef: "B22" },
        { label: "Four-year graduation rate", value: formatPercent(e.fourYearGraduation), cdsRef: "B11" },
        { label: "Five-year graduation rate", value: formatPercent(e.fiveYearGraduation), cdsRef: "B11", tier: "full" },
        { label: "Six-year graduation rate", value: formatPercent(e.sixYearGraduation), cdsRef: "B11" },
      ];
      return (
        <>
          <DataTable rows={rows} />
          <SubBlock title="Degrees awarded" full>
            <DataTable
              rows={[
                { label: "Bachelor’s degrees", value: formatNumber(e.bachelorsAwarded), cdsRef: "B3" },
                { label: "Master’s degrees", value: formatNumber(e.mastersAwarded), cdsRef: "B3" },
                { label: "Doctoral degrees", value: formatNumber(e.doctoratesAwarded), cdsRef: "B3" },
              ]}
            />
          </SubBlock>
        </>
      );
    }

    case "admissions": {
      const a = record.admissions;
      if (!a) return null;
      const overview: DataRow[] = [
        { label: "Acceptance rate", value: formatPercent(a.acceptanceRate), cdsRef: "C1–C2" },
        { label: "Applicants", value: formatNumber(a.applicants), cdsRef: "C1" },
        { label: "Admitted", value: formatNumber(a.admitted), cdsRef: "C1" },
        { label: "Enrolled first-year students", value: formatNumber(a.enrolledFirstYear), cdsRef: "C1" },
        { label: "Application deadline", value: formatText(a.applicationDeadline), cdsRef: "C15" },
        { label: "Notification date", value: formatText(a.notificationDate), cdsRef: "C16", tier: "full" },
        { label: "Applicant reply date", value: formatText(a.replyDate), cdsRef: "C16", tier: "full" },
        { label: "Enrollment deposit", value: formatCurrency(a.depositAmount), cdsRef: "C16", tier: "full" },
        { label: "Application fee", value: formatCurrency(a.applicationFee), cdsRef: "C13", tier: "full" },
        { label: "Fee waiver available", value: formatText(a.feeWaiverAvailable), cdsRef: "C13", tier: "full" },
        { label: "Testing policy", value: formatText(a.testPolicy), cdsRef: "C8" },
        { label: "Submitting SAT scores", value: formatPercent(a.pctSubmittingSat), cdsRef: "C9" },
        { label: "Submitting ACT scores", value: formatPercent(a.pctSubmittingAct), cdsRef: "C9" },
      ];
      const ed: DataRow[] = [
        { label: "Early decision offered", value: formatText(a.edOffered), cdsRef: "C21" },
        { label: "Early decision deadline", value: formatText(a.edDeadline), cdsRef: "C21" },
        { label: "Early decision applicants", value: formatNumber(a.edApplicants), cdsRef: "C21" },
        { label: "Early decision admitted", value: formatNumber(a.edAdmitted), cdsRef: "C21" },
        { label: "Early action offered", value: formatText(a.eaOffered), cdsRef: "C22" },
        { label: "Early action applicants", value: formatNumber(a.eaApplicants), cdsRef: "C22" },
        { label: "Early action admitted", value: formatNumber(a.eaAdmitted), cdsRef: "C22" },
      ];
      const rank: DataRow[] = [
        { label: "In top tenth of high-school class", value: formatPercent(a.pctTopTenth), cdsRef: "C11" },
        { label: "In top quarter", value: formatPercent(a.pctTopQuarter), cdsRef: "C11" },
        { label: "In top half", value: formatPercent(a.pctTopHalf), cdsRef: "C11" },
        { label: "In bottom half", value: formatPercent(a.pctBottomHalf), cdsRef: "C11" },
        { label: "In bottom quarter", value: formatPercent(a.pctBottomQuarter), cdsRef: "C11" },
        { label: "Average high-school GPA", value: formatGpa(a.avgHsGpa), cdsRef: "C12" },
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

          {(a.satEbrwDist.length > 0 || a.actDist.length > 0) && (
            <SubBlock title="Score distributions" full>
              <DataTable
                rows={[
                  { label: "SAT composite (25th–75th)", value: formatRange(a.satComposite25, a.satComposite75), cdsRef: "C9" },
                ]}
              />
              {a.satEbrwDist.length > 0 && (
                <div className="mt-4">
                  <HeadedTable
                    head={["SAT EBRW", "Share enrolled"]}
                    rows={a.satEbrwDist.map((b) => [b.band, formatPercent(b.percent)])}
                  />
                </div>
              )}
              {a.satMathDist.length > 0 && (
                <div className="mt-4">
                  <HeadedTable
                    head={["SAT Math", "Share enrolled"]}
                    rows={a.satMathDist.map((b) => [b.band, formatPercent(b.percent)])}
                  />
                </div>
              )}
              {a.actDist.length > 0 && (
                <div className="mt-4">
                  <HeadedTable
                    head={["ACT composite", "Share enrolled"]}
                    rows={a.actDist.map((b) => [b.band, formatPercent(b.percent)])}
                  />
                </div>
              )}
            </SubBlock>
          )}

          <SubBlock title="Class rank & GPA" full>
            <DataTable rows={rank} />
            {a.gpaDist.length > 0 && (
              <div className="mt-4">
                <HeadedTable
                  head={["High-school GPA", "Share enrolled"]}
                  rows={a.gpaDist.map((b) => [b.band, formatPercent(b.percent)])}
                />
              </div>
            )}
          </SubBlock>

          <SubBlock title="Early decision & early action" full>
            <DataTable rows={ed} />
          </SubBlock>

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
        { label: "Application deadline", value: formatText(t.applicationDeadline), cdsRef: "D5", tier: "full" },
        { label: "Transfer applicants", value: formatNumber(t.applicants), cdsRef: "D2" },
        { label: "Transfer students admitted", value: formatNumber(t.admitted), cdsRef: "D2" },
        { label: "Transfer students enrolled", value: formatNumber(t.enrolled), cdsRef: "D2" },
        { label: "Transfer acceptance rate", value: formatPercent(t.acceptanceRate), cdsRef: "D2" },
        { label: "Minimum college GPA", value: formatGpa1(t.minCollegeGpa), cdsRef: "D7" },
        { label: "Minimum credits to transfer", value: formatNumber(t.minCreditsToTransfer), cdsRef: "D5", tier: "full" },
        { label: "Maximum credits transferable", value: formatNumber(t.maxTransferCredits), cdsRef: "D9", tier: "full" },
        { label: "Minimum credits at this institution", value: formatNumber(t.minCreditsAtInstitution), cdsRef: "D11", tier: "full" },
        { label: "Requires an essay", value: formatText(t.requiresEssay), cdsRef: "D4", tier: "full" },
        { label: "Requires college transcript", value: formatText(t.requiresCollegeTranscript), cdsRef: "D4", tier: "full" },
        { label: "Requires good academic standing", value: formatText(t.requiresGoodStanding), cdsRef: "D4", tier: "full" },
      ];
      return <DataTable rows={rows} />;
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
          <SubBlock title="Most popular majors" full>
            <TagList items={o.mostPopularMajors} />
          </SubBlock>
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
        { label: "Aged 25 or older", value: formatPercent(f.pct25OrOlder), cdsRef: "F1", tier: "full" },
        { label: "Average age", value: f.averageAge === null ? NOT_REPORTED : String(f.averageAge), cdsRef: "F1", tier: "full" },
        { label: "In fraternities / sororities", value: formatPercent(f.pctGreekLife), cdsRef: "F1", tier: "full" },
        { label: "Living in college housing", value: formatPercent(f.pctLivingOnCampus), cdsRef: "F1" },
        { label: "ROTC", value: formatText(f.rotcOffered), cdsRef: "F2", tier: "full" },
      ];
      return (
        <>
          <SubBlock title="Enrollment demographics">
            <DataTable rows={demographics} />
          </SubBlock>
          {f.ethnicity.length > 0 && (
            <SubBlock title="Race / ethnicity (degree-seeking undergraduates)">
              <HeadedTable
                head={["Group", "Share"]}
                rows={f.ethnicity.map((e) => [e.group, formatPercent(e.percent)])}
              />
            </SubBlock>
          )}
          <SubBlock title="Activities offered" full>
            <TagList items={f.activitiesOffered} />
          </SubBlock>
          <SubBlock title="Housing options" full>
            <TagList items={f.housingOptions} />
          </SubBlock>
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
        { label: "Average aid package", value: formatCurrency(c.avgAidPackage), cdsRef: "H2", tier: "full" },
        { label: "Average need-based grant", value: formatCurrency(c.avgNeedGrant), cdsRef: "H2", tier: "full" },
        { label: "Average need-based loan", value: formatCurrency(c.avgNeedLoan), cdsRef: "H2", tier: "full" },
        { label: "Graduating with debt", value: formatPercent(c.pctGraduatingWithDebt), cdsRef: "H5", tier: "full" },
        { label: "Average debt at graduation", value: formatCurrency(c.avgDebtAtGraduation), cdsRef: "H5", tier: "full" },
        { label: "Average federal debt", value: formatCurrency(c.avgFederalDebt), cdsRef: "H5", tier: "full" },
      ];
      return (
        <>
          <SubBlock title="Cost of attendance">
            <DataTable rows={tuition} />
          </SubBlock>
          <SubBlock title="Financial aid">
            <DataTable rows={aid} />
          </SubBlock>
          {c.aidAwarded.length > 0 && (
            <SubBlock title="Aid awarded by type" full>
              <AidTable rows={c.aidAwarded} />
            </SubBlock>
          )}
          <SubBlock title="Applying for aid" full>
            <DataTable
              rows={[
                { label: "Applied for need-based aid", value: formatNumber(c.numApplyingForAid), cdsRef: "H2" },
                { label: "Determined to have need", value: formatNumber(c.numWithNeed), cdsRef: "H2" },
                { label: "Received need-based aid", value: formatNumber(c.numReceivedNeedAid), cdsRef: "H2" },
              ]}
            />
          </SubBlock>
          <SubBlock title="Aid application requirements" full>
            <DataTable
              rows={[
                { label: "FAFSA required", value: formatText(c.fafsaRequired), cdsRef: "H6" },
                { label: "CSS Profile required", value: formatText(c.cssProfileRequired), cdsRef: "H6" },
                { label: "Priority filing date", value: formatText(c.aidPriorityDeadline), cdsRef: "H6" },
              ]}
            />
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
        { label: "Part-time faculty", value: formatNumber(ac.partTimeFaculty), cdsRef: "I1", tier: "full" },
        { label: "Total faculty", value: formatNumber(ac.totalFaculty), cdsRef: "I1", tier: "full" },
        { label: "Faculty with a terminal degree", value: formatPercent(ac.pctTerminalDegree), cdsRef: "I1", tier: "full" },
        { label: "Female faculty", value: formatPercent(ac.pctFemaleFaculty), cdsRef: "I1", tier: "full" },
        { label: "Minority faculty", value: formatPercent(ac.pctMinorityFaculty), cdsRef: "I1", tier: "full" },
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

    case "degrees": {
      const d = record.degrees;
      if (!d) return null;
      return (
        <>
          <SubBlock title="Total conferred" full>
            <DataTable
              rows={[
                { label: "Bachelor’s degrees conferred", value: formatNumber(d.totalConferred), cdsRef: "J1" },
              ]}
            />
          </SubBlock>
          <SubBlock title="By field of study" highlightOnly>
            <HeadedTable
              head={["Field of study", "Share of degrees"]}
              rows={d.byField.map((r) => [r.field, formatPercent(r.percent)])}
            />
          </SubBlock>
          <SubBlock title="By field of study (detailed)" full>
            <HeadedTable
              head={["Field of study", "Share of degrees"]}
              rows={d.byFieldFull.map((r) => [r.field, formatPercent(r.percent)])}
            />
          </SubBlock>
        </>
      );
    }
  }
}
