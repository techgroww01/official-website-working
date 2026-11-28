"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

function Sk({ className = "" }: SkeletonProps) {
  return <div className={`tg-shimmer rounded ${className}`} aria-hidden="true" />;
}

/**
 * Portal table loading skeleton — inspired by loading-ui.com patterns.
 * Drop inside a Suspense boundary or conditional render while data loads.
 */
export function PortalTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading data…" className="animate-in fade-in duration-300">
      {/* Header row */}
      <div className="mb-3 flex gap-4 border-b border-[var(--line)] pb-2">
        <Sk className="h-3 w-28 bg-[var(--line)]" />
        <Sk className="h-3 w-20 bg-[var(--line)]" />
        <Sk className="ml-auto h-3 w-16 bg-[var(--line)]" />
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="tg-skeleton-row border-b border-[var(--line)] py-3"
          style={{ opacity: 1 - i * 0.1 }}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--paper-elevated)]">
            <Sk className="h-4 w-4 rounded bg-[var(--line)]" />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Sk className="h-3.5 w-48 bg-[var(--line)]" />
            <Sk className="h-2.5 w-32 bg-[var(--paper-elevated)]" />
          </div>
          <Sk className="h-5 w-16 rounded-[var(--radius-pill)] bg-[var(--paper-elevated)]" />
          <Sk className="h-3.5 w-20 bg-[var(--line)]" />
        </div>
      ))}
      <span className="sr-only">Loading table data, please wait.</span>
    </div>
  );
}

/**
 * Portal card grid skeleton — for overview/stats cards.
 */
export function PortalStatSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading stats…"
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-${cols}`}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-5"
          style={{ opacity: 1 - i * 0.08 }}
        >
          <Sk className="h-3 w-20 bg-[var(--line)]" />
          <Sk className="mt-3 h-8 w-24 bg-[var(--paper-elevated)]" />
          <Sk className="mt-2 h-2.5 w-32 bg-[var(--paper-elevated)]" />
        </div>
      ))}
      <span className="sr-only">Loading statistics.</span>
    </div>
  );
}

/**
 * Empty state illustration for portal tables / lists.
 */
export interface PortalEmptyStateProps {
  title?: string;
  body?: string;
  description?: string;
  badge?: string;
  variant?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
}

export function PortalEmptyState({
  title = "Nothing here yet",
  body,
  description,
  icon,
  action,
}: PortalEmptyStateProps) {
  const displayBody = body ?? description ?? "Items you create or receive will appear here.";
  const IconComponent =
    icon && typeof icon === "function"
      ? (icon as React.ComponentType<{ className?: string }>)
      : null;

  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--line-control)] bg-[var(--paper-elevated)] px-6 py-14 text-center">
      {IconComponent ? (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--text-muted)] shadow-sm">
          <IconComponent className="h-6 w-6" />
        </span>
      ) : icon ? (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--text-muted)] shadow-sm">
          {icon as React.ReactNode}
        </span>
      ) : (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          className="mb-4 h-14 w-14 text-[var(--line-control)]"
          aria-hidden="true"
        >
          <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6" y1="18" x2="42" y2="18" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.5" />
          <line x1="14" y1="26" x2="34" y2="26" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.4" />
          <line x1="14" y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.3" />
        </svg>
      )}
      <p className="font-display text-base font-bold text-[var(--ink)]">{title}</p>
      <p className="mt-1.5 max-w-xs text-sm text-[var(--text-muted)]">{displayBody}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
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
