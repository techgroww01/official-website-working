import { Calendar, Clock, Video } from "lucide-react";

export default function RecruitmentInterviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Interview Schedules</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Scheduled rounds, video conference links, and assigned interviewers.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 text-center">
        <Calendar className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <p className="mt-3 text-sm font-semibold text-[var(--ink)]">Interviews Synchronized</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Interviews scheduled through the candidate review page appear here with Google Meet integration.
        </p>
      </div>
    </div>
  );
}
