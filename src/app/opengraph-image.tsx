import { ImageResponse } from "next/og";

export const alt =
  "Common Data Set — university admissions & cost data on one page";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 16,
              background: "#7a1f2b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#faf7f2",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            CDS
          </div>
          <div style={{ fontSize: 30, color: "#57514d" }}>Common Data Set</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              color: "#1c1a19",
              lineHeight: 1.1,
              maxWidth: 940,
            }}
          >
            University admissions and cost data, on one clean page.
          </div>
          <div style={{ fontSize: 32, color: "#57514d" }}>
            Admissions · Enrollment · Cost &amp; aid · Academics — no PDFs.
          </div>
        </div>

        <div
          style={{ width: 180, height: 8, borderRadius: 4, background: "#7a1f2b" }}
        />
      </div>
    ),
    { ...size },
  );
}
