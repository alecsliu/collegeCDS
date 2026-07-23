import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";

const serif = Source_Serif_4({
  variable: "--ff-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sans = Inter({
  variable: "--ff-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const title = "Common Data Set — university admissions & cost data on one page";
const description =
  "Read standardized Common Data Set information for universities — admissions, enrollment, cost & aid, and academics — on a clean page. No PDFs, no downloads.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s · Common Data Set",
  },
  description,
  applicationName: "Common Data Set",
  openGraph: {
    type: "website",
    siteName: "Common Data Set",
    title,
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-crimson focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
