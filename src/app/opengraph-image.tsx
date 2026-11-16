import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RepForge — free-first fitness by Idowu Elijah Oluwasegun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded Google / social preview — not a personal photo */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#070708",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#c8ff3c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div style={{ width: 14, height: 36, background: "#0b0b0c", borderRadius: 4 }} />
            <div style={{ width: 28, height: 10, background: "#0b0b0c", borderRadius: 4 }} />
            <div style={{ width: 14, height: 36, background: "#0b0b0c", borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>RepForge Nigeria</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            IDOWU ELIJAH OLUWASEGUN
          </div>
          <div style={{ fontSize: 26, color: "#a1a1aa", maxWidth: 920, lineHeight: 1.35 }}>
            Built so Nigerians can choose healthy daily exercise — look good, feel stronger, stay
            fit without an expensive gym just to begin.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 22, color: "#c8ff3c", fontWeight: 700 }}>
            Free fitness app · Founder sessions available
          </div>
          <div style={{ fontSize: 20, color: "#71717a" }}>Lagos, Nigeria</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
