import { ImageResponse } from "next/og";

export const alt = "Tech Groww — Technology That Drives Growth.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

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
          backgroundColor: "#070D19",
          color: "#FFFFFF",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Architectural accent border & subtle cobalt/royal corner geometry */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            display: "flex",
            background: "linear-gradient(90deg, #0284C7 0%, #38BDF8 50%, #1D4ED8 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-90px",
            bottom: "-90px",
            width: "420px",
            height: "420px",
            borderRadius: "999px",
            border: "1px solid rgba(56, 189, 248, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "260px",
              height: "260px",
              borderRadius: "999px",
              border: "1px solid rgba(29, 78, 216, 0.28)",
              display: "flex",
            }}
          />
        </div>

        {/* Top row: Brand Mark + Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
          }}
        >
          <svg width="72" height="72" viewBox="0 0 120 120" fill="none">
            <polygon points="60,12 20,76 42,76 60,54" fill="#38BDF8" />
            <polygon points="60,12 100,76 78,76 60,54" fill="#0284C7" />
            <polygon points="60,54 42,76 60,68" fill="#0369A1" />
            <polygon points="60,54 78,76 60,68" fill="#0284C7" />
            <polygon points="60,68 42,76 8,96 28,96 60,78" fill="#0284C7" />
            <polygon points="60,68 78,76 112,96 92,96 60,78" fill="#1D4ED8" />
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontSize: "34px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                lineHeight: 1,
                color: "#FFFFFF",
              }}
            >
              TECH
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.42em",
                lineHeight: 1,
                color: "#94A3B8",
              }}
            >
              GROWW
            </span>
          </div>
        </div>

        {/* Centerpiece Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "940px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "2px",
                backgroundColor: "#38BDF8",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#38BDF8",
              }}
            >
              Engineering &amp; Salesforce Studio
            </span>
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              display: "flex",
            }}
          >
            Technology That Drives Growth.
          </div>
        </div>

        {/* Bottom Metadata Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.14)",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              color: "#CBD5E1",
              fontWeight: 500,
            }}
          >
            Greater Noida, India · Web, Salesforce &amp; Enterprise Engineering
          </span>
          <span
            style={{
              fontSize: "20px",
              color: "#38BDF8",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            techgroww.co.in
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
