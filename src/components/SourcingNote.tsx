/**
 * Attribution shown at the foot of every university/year page. The raw source
 * file is never linked or displayed — data is parsed and presented, not re-hosted.
 */
export default function SourcingNote({
  name,
  year,
}: {
  name: string;
  year: number;
}) {
  return (
    <p className="mt-8 border-t border-line pt-5 text-sm text-ink-3">
      Derived from {name}’s {year} Common Data Set. Figures shown here are
      illustrative mock data for this prototype.
    </p>
  );
}
