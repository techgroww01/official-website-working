import { getServerAuthContext } from "@/lib/auth/session";
import { CreditCard, ShieldAlert, CheckCircle, FileText } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ClientBillingPage() {
  const auth = await getServerAuthContext();
  if (!auth) redirect("/login");

  // Strict RBAC: only client_admin or staff can view billing
  const canViewBilling =
    auth.roles.includes("client_admin") ||
    auth.roles.includes("super_admin") ||
    auth.roles.includes("operations_manager");

  if (!canViewBilling) {
    return (
      <div className="rounded-[var(--radius-md)] border border-rose-200 bg-rose-50 p-6 text-rose-900 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-700" />
          <h2 className="font-display font-bold text-base">Restricted Financial Portal</h2>
        </div>
        <p className="text-xs">
          Financial statements, invoices, and billing receipts are restricted to authorized <code className="font-mono-tech font-bold">Client Admins</code>. Please contact your organization’s administrator for billing inquiries.
        </p>
      </div>
    );
  }

  const invoices = [
    { id: "INV-2026-001", description: "Phase 01 Discovery & Architecture Kickoff", amount: "Paid", date: "Feb 2026", status: "paid" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Invoices & Billing Statements</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Review official commercial statements, payment records, and contract receipts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Billing Account</p>
          <p className="font-display mt-1 text-lg font-bold text-[var(--ink)]">Good Standing</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Current Outstanding</p>
          <p className="font-display mt-1 text-lg font-bold text-emerald-700">INR 0.00</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">GST / Tax Invoice Status</p>
          <p className="font-display mt-1 text-lg font-bold text-[var(--ink)]">Verified</p>
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Invoice Number</th>
              <th className="px-4 py-3">Statement Description</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-mono-tech font-bold text-[var(--brand-royal)]">{inv.id}</td>
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{inv.description}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{inv.date}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-emerald-700">
                    {inv.status}
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
