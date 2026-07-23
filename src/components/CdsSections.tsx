"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS, type CdsRecord, type SectionKey } from "@/lib/types";
import { renderSectionBody } from "@/components/sectionContent";

/**
 * The core university-page interaction: a collapsible section table of contents
 * paired with collapsible content sections.
 *
 * Per the PRD default, sections load collapsed with the ToC visible; clicking a
 * ToC entry expands that section and scrolls to it. The section currently in
 * view is marked with the crimson accent.
 */
export default function CdsSections({
  record,
  available,
}: {
  record: CdsRecord;
  available: SectionKey[];
}) {
  const sections = SECTIONS.filter((s) => available.includes(s.key));
  const [expanded, setExpanded] = useState<Set<SectionKey>>(new Set());
  const [activeKey, setActiveKey] = useState<SectionKey | null>(
    sections[0]?.key ?? null,
  );
  const refs = useRef<Map<SectionKey, HTMLElement>>(new Map());

  const allOpen = expanded.size === sections.length;

  function toggle(key: SectionKey) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function openAndScroll(key: SectionKey) {
    setExpanded((prev) => new Set(prev).add(key));
    setActiveKey(key);
    // Wait a frame so the section is expanded before scrolling to it.
    requestAnimationFrame(() => {
      refs.current.get(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function setAll(open: boolean) {
    setExpanded(open ? new Set(sections.map((s) => s.key)) : new Set());
  }

  // Scroll-spy: highlight whichever section header is nearest the top.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveKey(visible[0].target.getAttribute("data-key") as SectionKey);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="gap-10 lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* Table of contents */}
      <nav
        aria-label="Sections"
        className="mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-3">
            On this page
          </h2>
          <button
            type="button"
            onClick={() => setAll(!allOpen)}
            className="text-xs font-medium text-crimson hover:text-crimson-dark"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
        <ul className="space-y-0.5">
          {sections.map((s) => {
            const isActive = activeKey === s.key;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => openAndScroll(s.key)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-baseline gap-2 rounded-control border-l-2 py-1.5 pl-3 pr-2 text-left text-sm transition-colors ${
                    isActive
                      ? "border-crimson bg-crimson-tint text-crimson"
                      : "border-transparent text-ink-2 hover:bg-crimson-tint/50 hover:text-ink"
                  }`}
                >
                  <span className="font-medium">{s.title}</span>
                  <span className="ml-auto shrink-0 text-xs text-ink-3">
                    {s.cdsRef.replace(/Sections?\s*/i, "").trim()}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Content sections */}
      <div className="min-w-0 space-y-4">
        {sections.map((s) => {
          const isOpen = expanded.has(s.key);
          return (
            <section
              key={s.key}
              id={`section-${s.key}`}
              data-key={s.key}
              ref={(el) => {
                if (el) refs.current.set(s.key, el);
              }}
              className="scroll-mt-24 overflow-hidden rounded-card border border-line bg-surface"
            >
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(s.key)}
                  aria-expanded={isOpen}
                  aria-controls={`body-${s.key}`}
                  className="section-rule flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-lg font-semibold text-ink">
                      {s.title}
                    </span>
                    <span className="block text-sm text-ink-2">{s.blurb}</span>
                  </span>
                  <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-3">
                    {s.cdsRef}
                  </span>
                  <Chevron open={isOpen} />
                </button>
              </h2>
              {isOpen && (
                <div id={`body-${s.key}`} className="border-t border-line px-5 py-5">
                  {renderSectionBody(s.key, record)}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-crimson transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
