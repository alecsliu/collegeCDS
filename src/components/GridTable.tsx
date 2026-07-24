import { NOT_REPORTED } from "@/lib/format";
import NotReported from "@/components/NotReported";

export interface GridRow {
  label: string;
  /** Pre-formatted cell values, one per column. `NOT_REPORTED` renders as NR. */
  values: string[];
  /** Indent the row label to show it's a sub-category. */
  indent?: boolean;
  /** Emphasize (bold + top rule) — for total / subtotal rows. */
  emphasize?: boolean;
}

/** Optional grouped header spanning several columns (e.g. "Full-time"). */
export interface GridGroup {
  label: string;
  span: number;
}

/**
 * A multi-column data grid for the CDS's matrix tables (enrollment by
 * status×gender, racial/ethnic categories, graduation-rate cohorts, aid by
 * type). Row hierarchy is shown via indentation and emphasized total rows.
 */
export default function GridTable({
  firstCol,
  groups,
  columns,
  rows,
}: {
  firstCol?: string;
  groups?: GridGroup[];
  columns: string[];
  rows: GridRow[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          {groups && (
            <tr>
              <th />
              {groups.map((g, i) => (
                <th
                  key={i}
                  colSpan={g.span}
                  className="border-b border-line pb-1 text-center text-xs font-semibold uppercase tracking-wide text-ink-3"
                >
                  {g.label}
                </th>
              ))}
            </tr>
          )}
          <tr className="border-b border-line">
            <th className="py-2 pr-4 text-left font-medium text-ink-2">
              {firstCol ?? ""}
            </th>
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 text-right font-medium text-ink-2">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.label}
              className={
                r.emphasize
                  ? "border-t border-line"
                  : "border-b border-line last:border-0"
              }
            >
              <th
                scope="row"
                className={`py-2 pr-4 text-left align-top ${
                  r.indent ? "pl-4" : ""
                } ${r.emphasize ? "font-medium text-ink" : "font-normal text-ink-2"}`}
              >
                {r.label}
              </th>
              {r.values.map((v, i) => {
                const missing = v === NOT_REPORTED;
                return (
                  <td
                    key={i}
                    className={`px-3 py-2 text-right align-top tabular-nums ${
                      missing
                        ? "italic text-ink-3"
                        : r.emphasize
                          ? "font-semibold text-ink"
                          : "text-ink"
                    }`}
                  >
                    {missing ? <NotReported /> : v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
