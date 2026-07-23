import { NOT_REPORTED } from "@/lib/format";

export interface DataRow {
  label: string;
  /** Pre-formatted display value. Use `NOT_REPORTED` for unreported fields. */
  value: string;
  /** Optional subordinate CDS reference, e.g. "C1". */
  cdsRef?: string;
}

/**
 * The standard label / value data table. Numerals are tabular so columns align.
 * Unreported values render muted so a missing field is explicit, never hidden.
 */
export default function DataTable({ rows }: { rows: DataRow[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {rows.map((row) => {
          const missing = row.value === NOT_REPORTED;
          return (
            <tr
              key={row.label}
              className="border-b border-line transition-colors last:border-0 hover:bg-crimson-tint/20"
            >
              <th
                scope="row"
                className="py-2.5 pr-4 text-left align-top font-normal text-ink-2"
              >
                {row.label}
                {row.cdsRef && (
                  <span className="ml-1.5 text-xs text-ink-3">{row.cdsRef}</span>
                )}
              </th>
              <td
                className={`py-2.5 text-right align-top tabular-nums ${
                  missing ? "text-ink-3 italic" : "font-medium text-ink"
                }`}
              >
                {row.value}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
