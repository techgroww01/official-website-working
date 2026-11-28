import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Bell,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Layers,
  TrendingUp,
} from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/portal/PortalShell";
import { getServerAuthContext } from "@/lib/auth/session";
import { getAccessiblePortals, type PortalKey } from "@/lib/rbac/roles";
import { NotificationsClient } from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

const PORTAL_NAV_META: Record<
  PortalKey,
  { label: string; href: string; icon: PortalNavItem["icon"] }
> = {
  admin: { label: "Admin CMS", href: "/admin", icon: Layers },
  sales: { label: "Sales CRM", href: "/sales", icon: TrendingUp },
  recruitment: { label: "Recruitment ATS", href: "/recruitment", icon: Briefcase },
  client: { label: "Client Portal", href: "/client", icon: FolderKanban },
  intern: { label: "Intern Portal", href: "/intern", icon: GraduationCap },
};

export default async function NotificationsPage() {
  const auth = await getServerAuthContext();
  if (!auth) {
    redirect("/login?next=/notifications");
  }

  const accessible = getAccessiblePortals(auth.roles);
  const primaryPortal: PortalKey = accessible[0] ?? "client";

  const navItems: PortalNavItem[] = [
    ...accessible.map((key) => ({
      href: PORTAL_NAV_META[key].href,
      label: PORTAL_NAV_META[key].label,
      icon: PORTAL_NAV_META[key].icon,
    })),
    {
      href: "/notifications",
      label: "Notifications",
      icon: Bell,
    },
  ];

  return (
    <PortalShell
      portal={primaryPortal}
      title="Notifications & Activity"
      user={{
        fullName: auth.fullName,
        email: auth.email,
        roles: auth.roles,
      }}
      accessiblePortals={accessible}
      navItems={navItems}
    >
      <NotificationsClient />
    </PortalShell>
  );
}
