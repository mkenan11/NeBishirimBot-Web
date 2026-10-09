import Link from "next/link";
import { nav, site } from "@/content/site";
import { ButtonLink } from "./Button";
import { GitHubIcon } from "./icons";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-900/8 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-semibold text-forest-900">
          <Logo size={34} preload />
          <span className="text-[17px] tracking-tight">{site.name}</span>
        </Link>

        <nav aria-label="Əsas menyu" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[15px] text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-full px-3 py-2 transition-colors hover:text-forest-900">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors hover:text-forest-900"
              >
                <GitHubIcon className="size-4" />
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ButtonLink href="/app" className="min-h-10! px-5! text-sm!">
              İndi sına
            </ButtonLink>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
