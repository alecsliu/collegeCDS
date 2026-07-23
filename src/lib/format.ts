/** Value formatting for the data tables. `null` always renders as "Not reported". */

export const NOT_REPORTED = "Not reported";

export function formatNumber(value: number | null): string {
  if (value === null) return NOT_REPORTED;
  return value.toLocaleString("en-US");
}

export function formatCurrency(value: number | null): string {
  if (value === null) return NOT_REPORTED;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatPercent(value: number | null): string {
  if (value === null) return NOT_REPORTED;
  return `${value}%`;
}

export function formatText(value: string | null): string {
  return value === null ? NOT_REPORTED : value;
}

/** A 25th–75th percentile band, e.g. "710–760". */
export function formatRange(
  p25: number | null,
  p75: number | null,
): string {
  if (p25 === null || p75 === null) return NOT_REPORTED;
  return `${p25}–${p75}`;
}
