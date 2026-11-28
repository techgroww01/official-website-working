"use client";

import React from "react";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`tg-shimmer rounded motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}

export interface PortalTableSkeletonProps {
  rows?: number;
  cols?: number;
}

/**
 * Portal table loading skeleton — inspired by loading-ui.com patterns.
 * Drop inside a Suspense boundary or conditional render while data loads.
 */
export function PortalTableSkeleton({ rows = 6, cols = 4 }: PortalTableSkeletonProps) {
  const columnCount = Math.max(2, Math.min(8, Math.round(cols)));
  const middleColCount = Math.max(0, columnCount - 2);

  return (
    <div role="status" aria-label="Loading data…">
      {/* Header row */}
      <div className="mb-3 flex items-center gap-4 border-b border-[var(--line)] pb-2">
        <Skeleton className="h-3 w-28 bg-[var(--line)]" />
        {Array.from({ length: middleColCount }).map((_, idx) => (
          <Skeleton key={idx} className="h-3 w-20 bg-[var(--line)]" />
        ))}
        <Skeleton className="ml-auto h-3 w-16 bg-[var(--line)]" />
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="tg-skeleton-row border-b border-[var(--line)] py-3"
          style={{ opacity: Math.max(0.35, 1 - i * 0.1) }}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--paper-elevated)]">
            <Skeleton className="h-4 w-4 rounded bg-[var(--line)]" />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-48 bg-[var(--line)]" />
            <Skeleton className="h-2.5 w-32 bg-[var(--paper-elevated)]" />
          </div>
          {Array.from({ length: middleColCount }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="hidden h-5 w-16 rounded-[var(--radius-pill)] bg-[var(--paper-elevated)] sm:block"
            />
          ))}
          <Skeleton className="h-3.5 w-20 bg-[var(--line)]" />
        </div>
      ))}
      <span className="sr-only">Loading table data, please wait.</span>
    </div>
  );
}

const STAT_GRID_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export interface PortalStatSkeletonProps {
  cols?: number;
}

/**
 * Portal card grid skeleton — for overview/stats cards.
 */
export function PortalStatSkeleton({ cols = 4 }: PortalStatSkeletonProps) {
  const clampedCols = Math.max(1, Math.min(4, Math.round(cols)));
  const lgGridClass = STAT_GRID_COLS[clampedCols] ?? "lg:grid-cols-4";

  return (
    <div
      role="status"
      aria-label="Loading stats…"
      className={`grid gap-4 sm:grid-cols-2 ${lgGridClass}`}
    >
      {Array.from({ length: clampedCols }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-5"
          style={{ opacity: 1 - i * 0.08 }}
        >
          <Skeleton className="h-3 w-20 bg-[var(--line)]" />
          <Skeleton className="mt-3 h-8 w-24 bg-[var(--paper-elevated)]" />
          <Skeleton className="mt-2 h-2.5 w-32 bg-[var(--paper-elevated)]" />
        </div>
      ))}
      <span className="sr-only">Loading statistics.</span>
    </div>
  );
}

export interface PortalDashboardSkeletonProps {
  statCols?: number;
  tableRows?: number;
  tableCols?: number;
  className?: string;
}

/**
 * Full portal overview skeleton composing stat cards + primary table.
 */
export function PortalDashboardSkeleton({
  statCols = 4,
  tableRows = 5,
  tableCols = 4,
  className = "",
}: PortalDashboardSkeletonProps) {
  return (
    <div aria-busy="true" className={`space-y-6 ${className}`}>
      <PortalStatSkeleton cols={statCols} />
      <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--portal-surface)] p-5">
        <PortalTableSkeleton rows={tableRows} cols={tableCols} />
      </div>
    </div>
  );
}

export interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Subtle directional highlight sweep for async status labels (e.g., PDF generation).
 */
export function TextShimmer({ children, className = "" }: TextShimmerProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent [background-image:linear-gradient(90deg,var(--text-muted)_0%,var(--brand-cobalt)_45%,var(--brand-sky)_50%,var(--brand-cobalt)_55%,var(--text-muted)_100%)] [background-size:200%_100%] motion-safe:animate-[tg-shimmer_1.8s_linear_infinite] motion-reduce:animate-none motion-reduce:text-[var(--text-muted)] motion-reduce:[background-image:none] ${className}`}
    >
      {children}
    </span>
  );
}

export interface BarsLoaderProps {
  label?: string;
  className?: string;
}

/**
 * Compact vertical activity bars for inline table refresh or filter states.
 */
export function BarsLoader({ label = "Loading", className = "" }: BarsLoaderProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex h-4 items-end gap-0.5 ${className}`}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="w-0.5 rounded-full bg-[var(--brand-royal)] motion-safe:animate-pulse motion-reduce:animate-none"
          style={{
            height: i % 2 === 0 ? "10px" : "16px",
            animationDelay: `${i * 120}ms`,
          }}
        />
      ))}
    </span>
  );
}

/**
 * ArcSpinner — simple SVG spinner for auth pages and loading states.
 * size: number (px) or "sm" | "md" | "lg" string shorthand.
 */
export interface ArcSpinnerProps {
  size?: number | "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

function resolveSize(size: ArcSpinnerProps["size"]): number {
  if (typeof size === "number") return size;
  if (size === "sm") return 16;
  if (size === "lg") return 32;
  return 24; // "md" or undefined
}

export function ArcSpinner({ size = 24, label, className = "" }: ArcSpinnerProps) {
  const px = resolveSize(size);
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label ?? "Loading"}
      className={`animate-spin motion-reduce:animate-none ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.2"
      />
      <path
        d="M12 2 A10 10 0 0 1 22 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
