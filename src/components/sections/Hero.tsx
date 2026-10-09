import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink } from "../Button";
import { LeafShape, TelegramIcon } from "../icons";
import { Logo } from "../Logo";
import { Screenshot } from "../Screenshot";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-24">
        <div>
          <div className="inline-flex items-center gap-2.5 rounded-full bg-sage py-1.5 pr-4 pl-1.5 text-sm font-medium text-forest-800">
            <Logo size={28} />
            Web və Telegram · Azərbaycanca
          </div>

          <h1 id="hero-title" className="mt-6 text-[2.5rem] leading-[1.06] font-semibold text-forest-900 [text-wrap:wrap] sm:text-6xl lg:text-[4.1rem]">
            Evdə bunlar var,
            <br />
            <span className="relative whitespace-nowrap">
              nə bişirim?
              <svg
                aria-hidden="true"
                viewBox="0 0 300 16"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-orange-500"
              >
                <path d="M3 11c60-7 140-10 294-4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted sm:text-xl">
            Evdəki ərzaqları yaz və ya şəklini göndər. {site.name} onlarla nə hazırlaya biləcəyini təklif edir:
            hazırlanma vaxtı, miqdarlar və addımlarla birlikdə.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/app">
              İndi sına
              <ArrowRight className="size-[18px]" aria-hidden />
            </ButtonLink>
            <ButtonLink href={site.links.telegram} variant="secondary">
              <TelegramIcon className="size-[18px]" />
              Telegram-da aç
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm text-muted">Qeydiyyat lazım deyil — birbaşa brauzerdə başla.</p>
        </div>

        <div className="relative mx-auto w-full max-w-[540px] pt-4 pr-4 sm:pt-6 sm:pr-6">
          <div aria-hidden className="absolute inset-0 top-0 left-8 rounded-[36px] bg-sage" />
          <LeafShape aria-hidden className="absolute -top-5 -right-4 z-10 size-16 text-orange-500 sm:size-20" />
          <Screenshot shot="recipes" preload sizes="(max-width: 640px) 88vw, 523px" className="relative" />
        </div>
      </div>
    </section>
  );
}
