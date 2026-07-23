import { ImageResponse } from "next/og";
import { getDefaultYear, getRecord, getUniversity } from "@/lib/data";
import { UNIVERSITIES } from "@/data/universities";

export const alt = "University Common Data Set";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ slug: u.slug }));
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 52, fontWeight: 700, color: "#7a1f2b" }}>{value}</div>
      <div style={{ fontSize: 24, color: "#57514d" }}>{label}</div>
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uni = getUniversity(slug);
  const year = getDefaultYear(slug);
  const record = year ? getRecord(slug, year) : undefined;

  const acc = record?.admissions?.acceptanceRate;
  const ug = record?.enrollment?.undergradEnrollment;
  const cost = record?.cost?.tuitionOutState;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f2",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#7a1f2b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#faf7f2",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            CDS
          </div>
          <div style={{ fontSize: 28, color: "#57514d" }}>
            {`Common Data Set${year ? ` · ${year}` : ""}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: "#1c1a19",
              lineHeight: 1.05,
              maxWidth: 1040,
            }}
          >
            {uni?.name ?? "University"}
          </div>
          {uni && (
            <div style={{ fontSize: 30, color: "#57514d" }}>
              {`${uni.city}, ${uni.state} · ${uni.type}`}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 80 }}>
          {acc != null && <Stat label="Acceptance rate" value={`${acc}%`} />}
          {ug != null && (
            <Stat label="Undergraduates" value={ug.toLocaleString("en-US")} />
          )}
          {cost != null && (
            <Stat
              label="Tuition"
              value={`$${Math.round(cost / 1000)}k`}
            />
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
