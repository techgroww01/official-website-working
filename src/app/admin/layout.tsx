import { redirect } from "next/navigation";
import { PortalShell, type PortalNavItem } from "@/components/portal/PortalShell";
import { getServerAuthContext } from "@/lib/auth/session";
import { getAccessiblePortals } from "@/lib/rbac/roles";
import {
  FileText,
  Briefcase,
  Layers,
  Image,
  BookOpen,
  Settings,
  Users,
  ShieldCheck,
  Send,
} from "lucide-react";

const ADMIN_NAV: readonly PortalNavItem[] = [
  { href: "/admin", label: "Overview", icon: Layers },
  { href: "/admin/pages", label: "Pages CMS", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/work", label: "Work Portfolio", icon: Layers },
  { href: "/admin/insights", label: "Insights Blog", icon: BookOpen },
  { href: "/admin/media", label: "Media Assets", icon: Image },
  { href: "/admin/broadcasts", label: "Broadcasts", icon: Send },
  { href: "/admin/users", label: "Team & Access", icon: Users },
  { href: "/admin/audit", label: "Audit Logs", icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuthContext();
  if (!auth) {
    redirect("/login?next=/admin");
  }

  const accessible = getAccessiblePortals(auth.roles);
  if (!accessible.includes("admin")) {
    redirect(accessible[0] ? `/${accessible[0]}` : "/login");
  }

  return (
    <PortalShell
      portal="admin"
      title="Admin CMS & Platform Control"
      user={{
        fullName: auth.fullName,
        email: auth.email,
        roles: auth.roles,
      }}
      accessiblePortals={accessible}
      navItems={ADMIN_NAV}
    >
      {children}
    </PortalShell>
  );
}
