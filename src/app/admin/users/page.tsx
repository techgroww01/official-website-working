import { Users as UsersIcon, Shield, CheckCircle } from "lucide-react";

const DEMO_USERS = [
  { id: "1", name: "Umesh Patel", email: "umesh.code1@gmail.com", role: "super_admin", status: "active", mfa: true },
  { id: "2", name: "Engineering Lead", email: "tech@techgroww.co.in", role: "operations_manager", status: "active", mfa: true },
  { id: "3", name: "Editorial Specialist", email: "editor@techgroww.co.in", role: "content_manager", status: "active", mfa: false },
  { id: "4", name: "Recruitment Specialist", email: "hr@techgroww.co.in", role: "recruiter", status: "active", mfa: false },
  { id: "5", name: "Client Representative", email: "client@acme.com", role: "client_admin", status: "active", mfa: false },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Platform Team & Access Matrix</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Manage platform roles across Staff, Client, and Cohort users. MFA enforced on privileged administrator roles.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Assigned Role</th>
              <th className="px-4 py-3">MFA Status</th>
              <th className="px-4 py-3">Account Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {DEMO_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--ink)]">{u.name}</p>
                  <p className="font-mono-tech text-[11px] text-[var(--text-muted)]">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-[var(--brand-royal)] uppercase">
                    {u.role.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono-tech text-[11px]">
                  {u.mfa ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <Shield className="h-3 w-3" /> Enforced
                    </span>
                  ) : (
                    <span className="text-stone-400">Optional</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-emerald-700">
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
