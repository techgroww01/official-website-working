import type { MetadataRoute } from "next";
import { COMPANY_CONFIG } from "@/lib/company-config";
import {
  getOpenJobs,
  getPublishedInsights,
  getPublishedServices,
  getPublishedWork,
} from "@/lib/cms/public-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = COMPANY_CONFIG.siteUrl;
  const now = new Date();

  const [services, work, insights, jobs] = await Promise.all([
    getPublishedServices(),
    getPublishedWork(),
    getPublishedInsights(),
    getOpenJobs(),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/work",
    "/insights",
    "/careers",
    "/careers/internships",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...work.map((w) => ({
      url: `${baseUrl}/work/${w.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...insights.map((i) => ({
      url: `${baseUrl}/insights/${i.slug}`,
      lastModified: new Date(i.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...jobs.map((j) => ({
      url: `${baseUrl}/careers/${j.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
