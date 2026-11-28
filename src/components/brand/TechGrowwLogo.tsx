import React from "react";

interface TechGrowwLogoProps {
  variant?: "dark" | "light" | "portal";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Pure-vector Tech Groww horizontal lockup faithfully traced from techgroww_logo.svg geometry
 * (pending final C-11 visual sign-off). Uses >= 4.5:1 deepened stops on light & portal white surfaces.
 */
export function TechGrowwLogo({
  variant = "dark",
  size = "md",
  className = "",
}: TechGrowwLogoProps) {
  const isDark = variant === "dark";
  const heightPx = size === "sm" ? 28 : size === "lg" ? 42 : 34;

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={heightPx}
        height={heightPx}
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="60,12 20,76 42,76 60,54"
          fill={isDark ? "#38BDF8" : "#0369A1"}
        />
        <polygon
          points="60,12 100,76 78,76 60,54"
          fill={isDark ? "#0284C7" : "#1D4ED8"}
        />
        <polygon
          points="60,54 42,76 60,68"
          fill={isDark ? "#0369A1" : "#075985"}
        />
        <polygon
          points="60,54 78,76 60,68"
          fill={isDark ? "#0284C7" : "#0369A1"}
        />
        <polygon
          points="60,68 42,76 8,96 28,96 60,78"
          fill={isDark ? "#0284C7" : "#0369A1"}
        />
        <polygon
          points="60,68 78,76 112,96 92,96 60,78"
          fill={isDark ? "#1D4ED8" : "#1E40AF"}
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-base font-extrabold tracking-[0.14em] ${
            isDark ? "text-white" : "text-[var(--ink)]"
          }`}
        >
          TECH
        </span>
        <span
          className={`font-mono-tech text-[10px] font-medium tracking-[0.38em] ${
            isDark ? "text-[var(--text-muted-dark)]" : "text-[var(--brand-royal)]"
          }`}
        >
          GROWW
        </span>
      </span>
    </span>
  );
}
