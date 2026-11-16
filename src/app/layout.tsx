import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import { introScript } from "@/lib/intro";
import { BRAND, PROJECTS_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(PROJECTS_URL),
  title: {
    default: `Projects — ${BRAND}`,
    template: `%s — ${BRAND}`,
  },
  description:
    "BytesPlatform combines product strategy, UI/UX, web and mobile engineering, AI and automation, SEO and growth to design and build digital products that hold up in production.",
  applicationName: BRAND,
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: PROJECTS_URL,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f6f8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The intro script sets data-intro on <html> before first paint
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <PageIntro />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
