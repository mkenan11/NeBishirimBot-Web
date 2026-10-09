import Link from "next/link";
import { site } from "@/content/site";
import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const linkClass = "underline-offset-4 transition-colors hover:text-cream hover:underline";

export function Footer() {
  return (
    <footer className="bg-forest-950 text-cream/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-cream">
            <Logo size={36} />
            <span className="text-lg">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed">
            Evdəki ərzaqlara uyğun resept tapan AI köməkçi — brauzerdə və Telegram-da, Azərbaycan dilində.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-wide text-cream uppercase">Linklər</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li>
              <a href={site.links.telegram} {...external} className={linkClass}>
                Telegram — @NeBishirimBot
              </a>
            </li>
            <li>
              <a href={site.links.github} {...external} className={linkClass}>
                GitHub
              </a>
            </li>
            <li>
              <Link href="/privacy" className={linkClass}>
                Məxfilik siyasəti
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-wide text-cream uppercase">Müəllif</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li className="text-cream">{site.creator}</li>
            <li>
              <a href={site.links.linkedin} {...external} className={linkClass}>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm sm:px-6">
          © <CurrentYear /> {site.name}. {site.creator} tərəfindən hazırlanıb.
        </p>
      </div>
    </footer>
  );
}
