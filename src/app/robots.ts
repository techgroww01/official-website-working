import type { MetadataRoute } from "next";
import { COMPANY_CONFIG } from "@/lib/company-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/sales",
          "/recruitment",
          "/client",
          "/intern",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/invite",
          "/auth",
          "/careers/status",
          "/api",
        ],
      },
    ],
    sitemap: `${COMPANY_CONFIG.siteUrl}/sitemap.xml`,
  };
}
