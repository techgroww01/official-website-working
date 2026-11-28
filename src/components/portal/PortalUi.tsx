import React from "react";
import Link from "next/link";

export interface PortalTableProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function PortalTable({
  children,
  className = "",
  ariaLabel = "Portal data table",
}: PortalTableProps) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] shadow-xs ${className}`}
    >
      <div
        className="overflow-x-auto"
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}

export interface PortalStatusDotProps {
  tone?: "success" | "info" | "warn" | "danger" | "neutral";
  pulse?: boolean;
  label?: string;
  className?: string;
}

const DOT_BG: Record<NonNullable<PortalStatusDotProps["tone"]>, string> = {
  success: "bg-[var(--status-success)]",
  info: "bg-[var(--brand-royal)]",
  warn: "bg-[var(--status-warn)]",
  danger: "bg-[var(--status-danger)]",
  neutral: "bg-[var(--line-control)]",
};

const PILL_STYLES: Record<NonNullable<PortalStatusDotProps["tone"]>, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-rose-200 bg-rose-50 text-rose-900",
  neutral: "border-[var(--line)] bg-[var(--portal-bg)] text-[var(--ink)]",
};

export function PortalStatusDot({
  tone = "info",
  pulse = false,
  label,
  className = "",
}: PortalStatusDotProps) {
  const dot = (
    <span className="relative inline-flex h-2 w-2 shrink-0 items-center justify-center" aria-hidden="true">
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-55 motion-safe:animate-ping motion-reduce:hidden ${DOT_BG[tone]}`}
        />
      )}
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${DOT_BG[tone]}`} />
    </span>
  );

  if (!label) {
    return <span className={`inline-flex items-center ${className}`}>{dot}</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${PILL_STYLES[tone]} ${className}`}
    >
      {dot}
      <span>{label}</span>
    </span>
  );
}

export type PortalEmptyVariant =
  | "media"
  | "broadcasts"
  | "tickets"
  | "interviews"
  | "offers"
  | "leads"
  | "projects"
  | "tasks"
  | "notifications"
  | "generic";

export interface PortalEmptyStateProps {
  variant?: PortalEmptyVariant;
  title: string;
  description: string;
  action?: React.ReactNode;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

function EmptyIllustrationSvg({ variant }: { variant: PortalEmptyVariant }) {
  return (
    <svg
      width="120"
      height="88"
      viewBox="0 0 120 88"
      fill="none"
      aria-hidden="true"
      className="mx-auto"
    >
      {/* Blueprint grid backdrop */}
      <rect
        x="8"
        y="6"
        width="104"
        height="76"
        rx="10"
        fill="#f7f7f5"
        stroke="#d8d2c7"
        strokeWidth="1.25"
      />
      <path
        d="M32 6v76M60 6v76M88 6v76M8 30h104M8 58h104"
        stroke="#e8e4dc"
        strokeWidth="1"
      />
      {variant === "media" && (
        <>
          <rect x="26" y="20" width="68" height="48" rx="6" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
          <polygon points="36,58 52,38 66,52 76,42 86,58" fill="#38bdf8" fillOpacity="0.28" stroke="#0284c7" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="44" cy="32" r="4.5" fill="#1d4ed8" />
        </>
      )}
      {variant === "broadcasts" && (
        <>
          <path d="M28 52V36l36-14v44L28 52z" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M64 34c7 3 11 8 11 10s-4 7-11 10" stroke="#0284c7" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M74 26c11 5 16 12 16 18s-5 13-16 18" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="34" y="54" width="10" height="12" rx="2" fill="#e8e4dc" stroke="#070d19" strokeWidth="1.25" />
        </>
      )}
      {variant === "tickets" && (
        <>
          <rect x="24" y="22" width="72" height="44" rx="7" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" />
          <path d="M36 37h48M36 47h34" stroke="#0284c7" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="84" cy="54" r="8" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1.5" />
          <path d="M81 54l2 2 4-4" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {variant === "interviews" && (
        <>
          <rect x="24" y="20" width="72" height="48" rx="6" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" />
          <path d="M24 32h72" stroke="#d8d2c7" strokeWidth="1.25" />
          <circle cx="44" cy="26" r="2" fill="#0284c7" />
          <circle cx="52" cy="26" r="2" fill="#38bdf8" />
          <circle cx="50" cy="49" r="8" fill="#e8e4dc" stroke="#070d19" strokeWidth="1.25" />
          <path d="M64 46h22M64 53h16" stroke="#0284c7" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
      {variant === "offers" && (
        <>
          <rect x="30" y="16" width="60" height="56" rx="5" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" />
          <path d="M40 30h40M40 40h28" stroke="#070d19" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="72" cy="54" r="9" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1.5" />
          <polygon points="72,48 67,57 77,57" fill="#1d4ed8" />
        </>
      )}
      {variant === "leads" && (
        <>
          <polygon points="28,22 92,22 70,48 70,66 50,66 50,48" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M38 30h44" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="56" r="3" fill="#0284c7" />
        </>
      )}
      {variant === "projects" && (
        <>
          <rect x="22" y="22" width="32" height="44" rx="5" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="66" y="22" width="32" height="44" rx="5" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" />
          <path d="M54 44h12" stroke="#070d19" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M29 34h18M29 43h14M73 34h18M73 43h14" stroke="#38bdf8" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
      {variant === "tasks" && (
        <>
          <rect x="28" y="18" width="64" height="52" rx="6" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" />
          <rect x="37" y="29" width="10" height="10" rx="2.5" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1.4" />
          <path d="M54 34h28" stroke="#070d19" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="37" y="47" width="10" height="10" rx="2.5" fill="#f7f7f5" stroke="#6e7785" strokeWidth="1.4" />
          <path d="M54 52h22" stroke="#6e7785" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {variant === "notifications" && (
        <>
          <path
            d="M60 20c-10 0-17 7-17 17v11l-5 7h44l-5-7V37c0-10-7-17-17-17z"
            fill="#ffffff"
            stroke="#1d4ed8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M54 59a6 6 0 0 0 12 0" stroke="#0284c7" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="77" cy="27" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
        </>
      )}
      {variant === "generic" && (
        <>
          <polygon points="60,18 32,64 48,64 60,46" fill="#0284c7" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="60,18 88,64 72,64 60,46" fill="#1d4ed8" fillOpacity="0.22" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M40 68h40" stroke="#070d19" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function PortalEmptyState({
  variant = "generic",
  title,
  description,
  action,
  badge = "STATE · NO_RECORDS",
  icon: Icon,
  className = "",
}: PortalEmptyStateProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 text-center shadow-xs ${className}`}
    >
      <div className="mx-auto max-w-md">
        <EmptyIllustrationSvg variant={variant} />
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--portal-bg)] px-3 py-1 font-mono-tech text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          {Icon && <Icon className="h-3.5 w-3.5 text-[var(--brand-cobalt)]" />}
          <span>{badge}</span>
        </div>
        <h2 className="font-display mt-3 text-lg font-bold text-[var(--ink)]">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export interface PortalKpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: "cobalt" | "emerald" | "amber" | "neutral";
  progressPercent?: number;
  statusLabel?: string;
  className?: string;
}

const ACCENT_STROKE: Record<NonNullable<PortalKpiCardProps["accent"]>, string> = {
  cobalt: "stroke-[var(--brand-cobalt)]",
  emerald: "stroke-[var(--status-success)]",
  amber: "stroke-[var(--status-warn)]",
  neutral: "stroke-[var(--line-control)]",
};

const ACCENT_DOT: Record<NonNullable<PortalKpiCardProps["accent"]>, PortalStatusDotProps["tone"]> = {
  cobalt: "info",
  emerald: "success",
  amber: "warn",
  neutral: "neutral",
};

export function PortalKpiCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
  accent = "cobalt",
  progressPercent,
  statusLabel,
  className = "",
}: PortalKpiCardProps) {
  const clampedProgress =
    typeof progressPercent === "number"
      ? Math.max(0, Math.min(100, progressPercent))
      : undefined;
  const circumference = 2 * Math.PI * 14;
  const dashOffset =
    clampedProgress !== undefined
      ? circumference - (clampedProgress / 100) * circumference
      : circumference;

  const content = (
    <div className="relative flex h-full flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono-tech text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          {label}
        </span>

        {clampedProgress !== undefined ? (
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            aria-hidden="true"
            className="shrink-0 -rotate-90"
          >
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#e8e4dc"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className={ACCENT_STROKE[accent]}
            />
          </svg>
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--portal-bg)]">
            {Icon ? (
              <Icon className="h-4 w-4 text-[var(--brand-royal)]" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <polygon points="8,2 2,13 6,13 8,9" fill="#0284c7" />
                <polygon points="8,2 14,13 10,13 8,9" fill="#1d4ed8" />
              </svg>
            )}
          </span>
        )}
      </div>

      <div>
        <div className="font-mono-tech text-2xl font-bold tracking-tight text-[var(--ink)] tabular-nums">
          {value}
        </div>
        {(hint || statusLabel) && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {statusLabel && (
              <PortalStatusDot tone={ACCENT_DOT[accent]} label={statusLabel} />
            )}
            {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
          </div>
        )}
      </div>
    </div>
  );

  const baseClassName = `group block rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5 shadow-xs transition-[transform,border-color,box-shadow] duration-150 ${
    href
      ? "hover:-translate-y-0.5 hover:border-[var(--brand-cobalt)] hover:shadow-sm motion-reduce:hover:translate-y-0"
      : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}

export interface CertificateSealProps {
  size?: "sm" | "md" | "lg";
  status?: "issued" | "pending" | "revoked";
  className?: string;
}

const SEAL_PX: Record<NonNullable<CertificateSealProps["size"]>, number> = {
  sm: 56,
  md: 80,
  lg: 96,
};

export function CertificateSeal({
  size = "md",
  status = "issued",
  className = "",
}: CertificateSealProps) {
  const px = SEAL_PX[size];
  const primary =
    status === "revoked"
      ? "#b42318"
      : status === "pending"
      ? "#6e7785"
      : "#1d4ed8";
  const secondary =
    status === "revoked"
      ? "#e11d48"
      : status === "pending"
      ? "#94a3b8"
      : "#0284c7";
  const ringBg =
    status === "revoked"
      ? "#fff1f2"
      : status === "pending"
      ? "#f7f7f5"
      : "#f0f9ff";

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="48" cy="48" r="44" fill={ringBg} stroke={primary} strokeWidth="2" />
      <circle
        cx="48"
        cy="48"
        r="37"
        stroke={secondary}
        strokeWidth="1.25"
        strokeDasharray="4 3"
      />
      <polygon points="48,20 26,58 38,58 48,44" fill={secondary} />
      <polygon points="48,20 70,58 58,58 48,44" fill={primary} />
      <polygon points="48,44 38,58 48,53" fill="#070d19" fillOpacity="0.22" />
      <polygon points="48,53 38,58 19,70 30,70 48,59" fill={secondary} />
      <polygon points="48,53 58,58 77,70 66,70 48,59" fill={primary} />
    </svg>
  );
}

export interface PortalPhaseStep {
  id: string;
  label: string;
  detail?: string;
  status: "completed" | "current" | "upcoming";
}

export interface PortalPhaseStepperProps {
  steps: readonly PortalPhaseStep[];
  className?: string;
  ariaLabel?: string;
}

export function PortalPhaseStepper({
  steps,
  className = "",
  ariaLabel = "Delivery phases",
}: PortalPhaseStepperProps) {
  if (steps.length === 0) return null;

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={`rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5 shadow-xs ${className}`}
    >
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className={`relative flex flex-col gap-2 rounded-[var(--radius-sm)] border p-3.5 transition-colors ${
                isCurrent
                  ? "border-[var(--brand-royal)] bg-sky-50/70"
                  : isCompleted
                  ? "border-[var(--line)] bg-[var(--portal-bg)]"
                  : "border-[var(--line)] bg-[var(--portal-surface)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-tech text-[11px] font-semibold text-[var(--text-muted)] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="7.5"
                    fill={
                      isCompleted
                        ? "var(--status-success)"
                        : isCurrent
                        ? "var(--brand-royal)"
                        : "var(--portal-surface)"
                    }
                    stroke={
                      isCompleted
                        ? "var(--status-success)"
                        : isCurrent
                        ? "var(--brand-royal)"
                        : "var(--line-control)"
                    }
                    strokeWidth="1.5"
                  />
                  {isCompleted && (
                    <path
                      d="M5.75 9.25 7.9 11.4l4.35-4.5"
                      stroke="#ffffff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {isCurrent && <circle cx="9" cy="9" r="3" fill="#ffffff" />}
                </svg>
              </div>
              <p className="text-xs font-semibold text-[var(--ink)]">{step.label}</p>
              {step.detail && (
                <p className="text-[11px] leading-snug text-[var(--text-muted)]">{step.detail}</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
