import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Outfit } from "next/font/google";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { CookieBanner } from "@/components/public/CookieBanner";
import "./globals.css";

const fontDisplay = Outfit({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY_CONFIG.siteUrl),
  title: {
    default: "Tech Groww | Web, Salesforce & Custom Software Engineering",
    template: "%s | Tech Groww",
  },
  description:
    "Technology that drives growth. Greater Noida engineering studio building custom web and mobile software, Salesforce & OmniStudio solutions, UI/UX systems, and enterprise platforms.",
  openGraph: {
    type: "website",
    siteName: "Tech Groww",
    locale: "en_IN",
    title: "Tech Groww | Technology That Drives Growth",
    description:
      "Custom web & mobile engineering, Salesforce ecosystem solutions, UI/UX design, enterprise software, and IT consulting from Greater Noida, India.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_CONFIG.brandName,
    url: COMPANY_CONFIG.siteUrl,
    foundingDate: String(COMPANY_CONFIG.foundedYear),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Greater Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: COMPANY_CONFIG.hq.postalCode,
      addressCountry: COMPANY_CONFIG.hq.country,
    },
    sameAs: [COMPANY_CONFIG.socials.linkedin, COMPANY_CONFIG.socials.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: COMPANY_CONFIG.emails.general,
      ...(COMPANY_CONFIG.confirmations.canonicalPhone
        ? { telephone: COMPANY_CONFIG.confirmations.canonicalPhone }
        : {}),
    },
  };

  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-[var(--brand-royal)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <CookieBanner gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
