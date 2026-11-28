import { redirect } from "next/navigation";
import { PortalShell, type PortalNavItem } from "@/components/portal/PortalShell";
import { getServerAuthContext } from "@/lib/auth/session";
import { getAccessiblePortals } from "@/lib/rbac/roles";
import {
  Users,
  Briefcase,
  Calendar,
  FileCheck,
  ShieldCheck,
  Award,
} from "lucide-react";

const RECRUITMENT_NAV: readonly PortalNavItem[] = [
  { href: "/recruitment", label: "Overview", icon: Users },
  { href: "/recruitment/candidates", label: "Candidate Pipeline", icon: Users },
  { href: "/recruitment/jobs", label: "Job Requisitions", icon: Briefcase },
  { href: "/recruitment/interviews", label: "Interview Schedule", icon: Calendar },
  { href: "/recruitment/offers", label: "Extended Offers", icon: Award },
  { href: "/recruitment/retention", label: "DPDP Retention Queue", icon: ShieldCheck },
];

export default async function RecruitmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuthContext();
  if (!auth) {
    redirect("/login?next=/recruitment");
  }

  const accessible = getAccessiblePortals(auth.roles);
  if (!accessible.includes("recruitment")) {
    redirect(accessible[0] ? `/${accessible[0]}` : "/login");
  }

  return (
    <PortalShell
      portal="recruitment"
      title="Recruitment Portal & Privacy-First ATS"
      user={{
        fullName: auth.fullName,
        email: auth.email,
        roles: auth.roles,
      }}
      accessiblePortals={accessible}
      navItems={RECRUITMENT_NAV}
    >
      {children}
    </PortalShell>
  );
}
