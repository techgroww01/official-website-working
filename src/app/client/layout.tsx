import { redirect } from "next/navigation";
import { PortalShell, type PortalNavItem } from "@/components/portal/PortalShell";
import { getServerAuthContext } from "@/lib/auth/session";
import { getAccessiblePortals } from "@/lib/rbac/roles";
import {
  FolderKanban,
  CheckCircle2,
  FileText,
  CreditCard,
  LifeBuoy,
  Settings,
} from "lucide-react";

const CLIENT_NAV: readonly PortalNavItem[] = [
  { href: "/client", label: "Overview", icon: FolderKanban },
  { href: "/client/projects", label: "Projects & Milestones", icon: CheckCircle2 },
  { href: "/client/billing", label: "Invoices & Billing", icon: CreditCard },
  { href: "/client/tickets", label: "Support & Requests", icon: LifeBuoy },
  { href: "/client/settings", label: "Team & Notifications", icon: Settings },
];

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuthContext();
  if (!auth) {
    redirect("/login?next=/client");
  }

  const accessible = getAccessiblePortals(auth.roles);
  if (!accessible.includes("client")) {
    redirect(accessible[0] ? `/${accessible[0]}` : "/login");
  }

  return (
    <PortalShell
      portal="client"
      title="Client Workspace & Project Delivery"
      user={{
        fullName: auth.fullName,
        email: auth.email,
        roles: auth.roles,
      }}
      accessiblePortals={accessible}
      navItems={CLIENT_NAV}
    >
      {children}
    </PortalShell>
  );
}
