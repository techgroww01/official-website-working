import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

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
          backgroundColor: "#070D19",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 120 120" fill="none">
          <polygon points="60,12 20,76 42,76 60,54" fill="#38BDF8" />
          <polygon points="60,12 100,76 78,76 60,54" fill="#0284C7" />
          <polygon points="60,54 42,76 60,68" fill="#0369A1" />
          <polygon points="60,54 78,76 60,68" fill="#0284C7" />
          <polygon points="60,68 42,76 8,96 28,96 60,78" fill="#0284C7" />
          <polygon points="60,68 78,76 112,96 92,96 60,78" fill="#1D4ED8" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
