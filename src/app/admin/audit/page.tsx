import { ShieldCheck, History } from "lucide-react";

const DEMO_AUDIT_LOGS = [
  { id: "1", action: "USER_INVITATION_ACCEPTED", resource: "user", actor: "system", time: "10 mins ago" },
  { id: "2", action: "PORTFOLIO_BLUEPRINT_VERIFIED", resource: "portfolio", actor: "umesh.code1@gmail.com", time: "1 hour ago" },
  { id: "3", action: "RETENTION_APPLICATIONS_PURGED", resource: "application", actor: "system_cron", time: "12 hours ago" },
  { id: "4", action: "SYSTEM_INITIALIZED", resource: "platform", actor: "system", time: "1 day ago" },
];

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Immutable Security Audit Ledger</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Cryptographically recorded operational events. Audit records are strictly append-only (UPDATE and DELETE prohibited by database triggers).
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Security Action</th>
              <th className="px-4 py-3">Target Resource</th>
              <th className="px-4 py-3">Actor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {DEMO_AUDIT_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-mono-tech text-[11px] text-[var(--text-muted)]">{log.time}</td>
                <td className="px-4 py-3 font-mono-tech font-bold text-[var(--ink)]">{log.action}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600 uppercase">{log.resource}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{log.actor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
