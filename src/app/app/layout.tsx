import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "@/components/app/AppNav";
import { TelegramIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { default: "Web app", template: `%s — ${site.name}` },
  robots: { index: false, follow: true },
};

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-forest-900/8 bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-forest-900">
            <Logo size={30} preload />
            <span className="text-[16px] tracking-tight">{site.name}</span>
          </Link>
          <AppNav variant="top" />
          <a
            href={site.links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-medium text-forest-800 hover:bg-forest-900/5"
          >
            <TelegramIcon className="size-4" />
            <span className="hidden sm:inline">Telegram-da aç</span>
            <span className="sm:hidden">Telegram</span>
          </a>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 pt-6 pb-28 sm:px-6 md:pb-16">
        {children}
      </main>
      <AppNav variant="bottom" />
    </>
  );
}
