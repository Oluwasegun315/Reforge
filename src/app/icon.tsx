import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Branded RepForge favicon — lime tile + dumbbell mark */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c8ff3c",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <div style={{ width: 6, height: 14, background: "#0b0b0c", borderRadius: 2 }} />
          <div style={{ width: 14, height: 4, background: "#0b0b0c", borderRadius: 2 }} />
          <div style={{ width: 6, height: 14, background: "#0b0b0c", borderRadius: 2 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
