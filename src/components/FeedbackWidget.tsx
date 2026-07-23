"use client";

import { useState } from "react";

interface FeedbackContext {
  slug?: string;
  year?: number;
}

/**
 * Collapsible feedback form. Used in two places: on the home page (general) and
 * on a university/year page, where it auto-captures the school, year, and URL so
 * reports are actionable and double as a data-quality signal.
 */
export default function FeedbackWidget({
  context,
  title = "Have feedback or spot an error?",
}: {
  context?: FeedbackContext;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          email: email || null,
          slug: context?.slug ?? null,
          year: context?.year ?? null,
          pageUrl: typeof window !== "undefined" ? window.location.href : null,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("done");
      setMessage("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-card border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-ink">{title}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-crimson transition-transform ${
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
      </button>

      {open && (
        <div className="border-t border-line px-5 py-5">
          {status === "done" ? (
            <p className="text-sm text-ink-2">
              Thanks — your note was recorded. It helps us keep the data accurate.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              {context?.slug && (
                <p className="text-xs text-ink-3">
                  Attached to this page: {context.slug}
                  {context.year ? ` · ${context.year}` : ""}.
                </p>
              )}
              <div>
                <label
                  htmlFor="fb-message"
                  className="mb-1 block text-sm font-medium text-ink-2"
                >
                  Message <span className="text-crimson">*</span>
                </label>
                <textarea
                  id="fb-message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What’s wrong, missing, or could be clearer?"
                  className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-crimson"
                />
              </div>
              <div>
                <label
                  htmlFor="fb-email"
                  className="mb-1 block text-sm font-medium text-ink-2"
                >
                  Email <span className="text-ink-3">(optional)</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-crimson"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "sending" || !message.trim()}
                  className="rounded-control bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson-dark disabled:opacity-50"
                >
                  {status === "sending" ? "Sending…" : "Send feedback"}
                </button>
                {status === "error" && (
                  <span className="text-sm text-crimson">
                    Something went wrong — please try again.
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
