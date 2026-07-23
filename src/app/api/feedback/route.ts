import { NextResponse } from "next/server";

/**
 * Feedback intake. In the MVP-of-the-MVP there is no database, so this validates
 * the payload and logs it server-side. The request shape (message, optional
 * email, auto-captured university/year/pageUrl) is the contract the real backend
 * will fulfill by writing to the `feedback` table (§7.5 of the PRD).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, email, slug, year, pageUrl } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json(
      { error: "A message is required." },
      { status: 400 },
    );
  }

  // Stand-in for persistence. Replace with a DB write when the backend lands.
  console.log("[feedback]", {
    message: message.trim().slice(0, 2000),
    email: typeof email === "string" ? email : null,
    slug: typeof slug === "string" ? slug : null,
    year: typeof year === "number" ? year : null,
    pageUrl: typeof pageUrl === "string" ? pageUrl : null,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
