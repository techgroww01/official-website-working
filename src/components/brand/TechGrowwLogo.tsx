import React, { useId } from "react";

interface TechGrowwLogoProps {
  variant?: "dark" | "light" | "portal";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: {
    px: 28,
    techText: "text-sm",
    growwText: "text-[9px]",
    gap: "gap-2",
  },
  md: {
    px: 34,
    techText: "text-base",
    growwText: "text-[10px]",
    gap: "gap-2.5",
  },
  lg: {
    px: 42,
    techText: "text-lg",
    growwText: "text-[11px]",
    gap: "gap-3",
  },
} as const;

/**
 * Pure-vector Tech Groww horizontal lockup matching public/brand/mark.svg geometry.
 * Uses >= 4.5:1 deepened stops on light & portal white surfaces and instance-scoped gradient IDs.
 */
export function TechGrowwLogo({
  variant = "dark",
  size = "md",
  className = "",
}: TechGrowwLogoProps) {
  const isDark = variant === "dark";
  const uid = useId().replace(/:/g, "");
  const sizing = SIZE_MAP[size];

  const leftGradId = `tg-logo-l-${uid}`;
  const rightGradId = `tg-logo-r-${uid}`;
  const wingLeftGradId = `tg-logo-wl-${uid}`;
  const wingRightGradId = `tg-logo-wr-${uid}`;

  return (
    <span className={`inline-flex items-center ${sizing.gap} select-none ${className}`}>
      <svg
        width={sizing.px}
        height={sizing.px}
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {isDark ? (
            <>
              <linearGradient
                id={leftGradId}
                x1="60"
                y1="12"
                x2="22"
                y2="86"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient
                id={rightGradId}
                x1="60"
                y1="12"
                x2="98"
                y2="86"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="45%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient
                id={wingLeftGradId}
                x1="12"
                y1="96"
                x2="60"
                y2="70"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient
                id={wingRightGradId}
                x1="60"
                y1="70"
                x2="108"
                y2="96"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </>
          ) : (
            <>
              <linearGradient
                id={leftGradId}
                x1="60"
                y1="12"
                x2="22"
                y2="86"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient
                id={rightGradId}
                x1="60"
                y1="12"
                x2="98"
                y2="86"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </>
          )}
        </defs>

        {/* Left & right faceted arrowheads */}
        <polygon points="60,12 20,76 42,76 60,54" fill={`url(#${leftGradId})`} />
        <polygon points="60,12 100,76 78,76 60,54" fill={`url(#${rightGradId})`} />

        {/* Center inner bevel facets */}
        <polygon
          points="60,54 42,76 60,68"
          fill={isDark ? "#0369A1" : "#075985"}
          opacity={isDark ? 0.9 : 1}
        />
        <polygon points="60,54 78,76 60,68" fill={isDark ? "#0284C7" : "#0369A1"} />

        {/* Splayed chevron wings */}
        <polygon
          points="60,68 42,76 8,96 28,96 60,78"
          fill={isDark ? `url(#${wingLeftGradId})` : "#0369A1"}
        />
        <polygon
          points="60,68 78,76 112,96 92,96 60,78"
          fill={isDark ? `url(#${wingRightGradId})` : "#1E40AF"}
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display ${sizing.techText} font-extrabold tracking-[0.14em] ${
            isDark ? "text-white" : "text-[var(--ink)]"
          }`}
        >
          TECH
        </span>
        <span className="sr-only"> </span>
        <span
          className={`font-mono-tech ${sizing.growwText} font-medium tracking-[0.38em] ${
            isDark ? "text-[var(--text-muted-dark)]" : "text-[var(--brand-royal)]"
          }`}
        >
          GROWW
        </span>
      </span>
    </span>
  );
}
