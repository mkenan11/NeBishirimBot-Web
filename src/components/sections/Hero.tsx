import { ArrowRight, Camera, ShieldCheck, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink } from "../Button";
import { LeafShape, TelegramIcon } from "../icons";
import { HeroDemo } from "./HeroDemo";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <LeafShape aria-hidden className="absolute top-24 -left-16 size-40 -scale-x-100 text-sage" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-16 sm:px-6 md:pt-14 lg:grid-cols-[1fr_1.02fr] lg:gap-14 lg:pb-24">
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-sage px-3 py-1.5 text-sm font-medium text-forest-800">
            <Sparkles className="size-4 text-orange-ink" aria-hidden />
            AI resept köməkçisi · Azərbaycanca
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[2.6rem] leading-[1.04] font-semibold text-forest-900 [text-wrap:wrap] sm:text-6xl lg:text-[4.1rem]"
          >
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
            Ərzaqlarını yaz və ya şəklini çək — {site.name} onlarla hazırlaya biləcəyin reseptləri, çatışmayanları və
            addımları göstərir.
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

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-forest-600" aria-hidden />
              Qeydiyyat lazım deyil
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Camera className="size-4 text-forest-600" aria-hidden />
              Şəkildən tanıma
            </li>
            <li className="inline-flex items-center gap-1.5">
              <TelegramIcon className="size-4 text-forest-600" />
              Brauzerdə və Telegram-da
            </li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[480px]">
          {/* Yarpaq kartın arxasındadır: küncdən görünür, mətnin üstünə heç vaxt düşmür. */}
          <LeafShape aria-hidden className="absolute -top-10 -right-8 size-20 text-orange-500 sm:-top-12 sm:-right-10 sm:size-24" />
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
