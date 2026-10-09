import type { Metadata, Viewport } from "next";
import { Fraunces, Onest } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.creator, url: site.links.linkedin }],
  creator: site.creator,
  keywords: [
    "NeBishirimBot",
    "nə bişirim",
    "resept",
    "yemək reseptləri",
    "Telegram bot",
    "Azərbaycan dilində",
    "ərzaq",
    "AI",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1d412e",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="az" className={`${onest.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-forest-800 px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Əsas məzmuna keç
        </a>
        {children}
      </body>
    </html>
  );
}
