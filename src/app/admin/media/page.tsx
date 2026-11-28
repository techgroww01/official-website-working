import { Image as ImageIcon, ShieldCheck } from "lucide-react";

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Media & Static Asset Library</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Inspect uploaded imagery, documents, and brand vectors. User SVG uploads are strictly prohibited by server validation.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-[var(--brand-royal)] shrink-0" />
        <div>
          <span className="font-semibold">Security Enforcement:</span> All CMS imagery is limited to PNG, JPEG, and WebP with mandatory magic-byte inspection. SVG uploads are blocked to eliminate stored XSS vectors.
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 text-center">
        <ImageIcon className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <p className="mt-3 text-sm font-semibold text-[var(--ink)]">Asset Repository Ready</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Assets uploaded across CMS pages, articles, and proposals appear here with verifiable MIME and byte size metadata.
        </p>
      </div>
    </div>
  );
}
