import { Settings, Users, Bell } from "lucide-react";

export default function ClientSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Client Account Settings & Notifications</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Manage authorized team members, email notification preferences, and security options.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--brand-royal)]" />
            <h3 className="font-display text-base font-bold text-[var(--ink)]">Authorized Organization Members</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Users within your organization assigned <code className="font-mono-tech">client_admin</code>, <code className="font-mono-tech">client_member</code>, or <code className="font-mono-tech">client_viewer</code> roles.
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[var(--brand-royal)]" />
            <h3 className="font-display text-base font-bold text-[var(--ink)]">Notification Preferences</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Receive transactional updates when milestone deliverables are uploaded or when support ticket responses are posted.
          </p>
        </div>
      </div>
    </div>
  );
}
