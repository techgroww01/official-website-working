import { Megaphone, Pin } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "Welcome to the Tech Groww Engineering Internship Cohort",
    date: "1 week ago",
    isPinned: true,
    body: "Kickoff sessions are recorded and available in your curriculum drive. Please ensure you have accepted the NDA and completed initial workstation setup.",
  },
  {
    id: "a2",
    title: "Office Hours with Principal Architect: Saturday 11:00 AM",
    date: "3 days ago",
    isPinned: false,
    body: "Join us this Saturday for live code review and Q&A covering Next.js App Router patterns and Supabase RLS security design.",
  },
];

export default function InternAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Cohort Announcements</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Official briefings, schedule changes, and technical webinar announcements from cohort mentors.
        </p>
      </div>

      <div className="space-y-4">
        {ANNOUNCEMENTS.map((a) => (
          <div
            key={a.id}
            className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {a.isPinned && <Pin className="h-4 w-4 text-[var(--brand-royal)]" />}
                <h3 className="font-display text-base font-bold text-[var(--ink)]">{a.title}</h3>
              </div>
              <span className="font-mono-tech text-[11px] text-[var(--text-muted)]">{a.date}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
