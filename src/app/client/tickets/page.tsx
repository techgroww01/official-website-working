import { LifeBuoy, MessageSquare } from "lucide-react";

export default function ClientTicketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Support Tickets & Service Requests</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Direct line of inquiry to your Tech Groww delivery lead for architecture questions, bug reports, and change requests.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 text-center">
        <LifeBuoy className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <p className="mt-3 text-sm font-semibold text-[var(--ink)]">No Active Support Tickets</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          All milestones and deliverables are operating cleanly. Need technical assistance? Submit a request to your lead.
        </p>
      </div>
    </div>
  );
}
