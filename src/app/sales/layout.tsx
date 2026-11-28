import { redirect } from "next/navigation";
import { PortalShell, type PortalNavItem } from "@/components/portal/PortalShell";
import { getServerAuthContext } from "@/lib/auth/session";
import { getAccessiblePortals } from "@/lib/rbac/roles";
import {
  TrendingUp,
  Inbox,
  Building2,
  DollarSign,
  BarChart3,
} from "lucide-react";

const SALES_NAV: readonly PortalNavItem[] = [
  { href: "/sales", label: "Overview", icon: TrendingUp },
  { href: "/sales/leads", label: "Inbound Leads", icon: Inbox },
  { href: "/sales/opportunities", label: "Deals & Pipeline", icon: DollarSign },
  { href: "/sales/contacts", label: "Accounts & Orgs", icon: Building2 },
  { href: "/sales/reports", label: "Sales Reports", icon: BarChart3 },
];

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuthContext();
  if (!auth) {
    redirect("/login?next=/sales");
  }

  const accessible = getAccessiblePortals(auth.roles);
  if (!accessible.includes("sales")) {
    redirect(accessible[0] ? `/${accessible[0]}` : "/login");
  }

  return (
    <PortalShell
      portal="sales"
      title="Sales Portal & CRM Pipeline"
      user={{
        fullName: auth.fullName,
        email: auth.email,
        roles: auth.roles,
      }}
      accessiblePortals={accessible}
      navItems={SALES_NAV}
    >
      {children}
    </PortalShell>
  );
}
