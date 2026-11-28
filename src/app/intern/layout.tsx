import { redirect } from "next/navigation";
import { PortalShell, type PortalNavItem } from "@/components/portal/PortalShell";
import { getServerAuthContext } from "@/lib/auth/session";
import { getAccessiblePortals } from "@/lib/rbac/roles";
import {
  GraduationCap,
  CheckSquare,
  Award,
  Megaphone,
  UserCheck,
} from "lucide-react";

const INTERN_NAV: readonly PortalNavItem[] = [
  { href: "/intern", label: "Dashboard", icon: GraduationCap },
  { href: "/intern/tasks", label: "Tasks & Submissions", icon: CheckSquare },
  { href: "/intern/announcements", label: "Cohort Briefings", icon: Megaphone },
  { href: "/intern/certificate", label: "Certificate", icon: Award },
  { href: "/intern/onboarding", label: "Onboarding & NDA", icon: UserCheck },
];

export default async function InternLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuthContext();
  if (!auth) {
    redirect("/login?next=/intern");
  }

  const accessible = getAccessiblePortals(auth.roles);
  if (!accessible.includes("intern")) {
    redirect(accessible[0] ? `/${accessible[0]}` : "/login");
  }

  return (
    <PortalShell
      portal="intern"
      title="Intern Portal & Cohort Platform"
      user={{
        fullName: auth.fullName,
        email: auth.email,
        roles: auth.roles,
      }}
      accessiblePortals={accessible}
      navItems={INTERN_NAV}
    >
      {children}
    </PortalShell>
  );
}
