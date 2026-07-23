"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-crimson"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M6 7V3h8v4M6 15H4v-5h12v5h-2M6 13h8v4H6z" strokeLinejoin="round" />
      </svg>
      Print / save as PDF
    </button>
  );
}
