import { Send, Mail, Users } from "lucide-react";

export default function AdminBroadcastsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Newsletter Broadcasts & Audience</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Manage double-opted architecture briefing subscribers and draft email campaigns via Resend.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Active Subscribers</p>
          <p className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">Ready</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Daily Reserve Guard</p>
          <p className="font-display mt-1 text-2xl font-bold text-emerald-700">Active (80/100)</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">One-Click Unsubscribe</p>
          <p className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">RFC 8058 Compliant</p>
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 text-center">
        <Mail className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <p className="mt-3 text-sm font-semibold text-[var(--ink)]">No Active Campaigns</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Draft newsletter briefings can be previewed or tested before broadcast dispatch.
        </p>
      </div>
    </div>
  );
}
