/**
 * Renders an unreported value as "NR" with an accessible expansion — the
 * `<abbr>` gives a hover tooltip and is read as "Not reported" by screen
 * readers. The page carries a visible legend for the abbreviation too.
 */
export default function NotReported() {
  return (
    <abbr title="Not reported by the institution" className="cursor-help">
      NR
    </abbr>
  );
}
