import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070708",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#c8ff3c",
            borderRadius: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 52, background: "#0b0b0c", borderRadius: 6 }} />
            <div style={{ width: 48, height: 14, background: "#0b0b0c", borderRadius: 6 }} />
            <div style={{ width: 22, height: 52, background: "#0b0b0c", borderRadius: 6 }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
