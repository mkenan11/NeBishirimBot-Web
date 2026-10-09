import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink } from "../Button";
import { GitHubIcon, LeafShape, TelegramIcon } from "../icons";
import { Section } from "../Section";

const stack = ["Python", "Gemini API", "PostgreSQL", "FastAPI", "Telegram Bot API", "Next.js"];

/** Telegram kanalı + layihənin hekayəsi + texnologiya: bir zolaqda, təkrarsız. */
export function About() {
  return (
    <Section id="haqqinda" tone="beige" labelledBy="about-title" className="border-y border-forest-900/10">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        <div className="relative overflow-hidden rounded-[28px] bg-forest-800 p-7 text-cream shadow-card sm:p-9">
          <LeafShape aria-hidden className="absolute -right-6 -bottom-8 size-36 text-forest-700" />
          <span className="relative grid size-12 place-items-center rounded-2xl bg-cream/10 ring-1 ring-cream/15">
            <TelegramIcon className="size-6" />
          </span>
          <h2 className="relative mt-6 text-3xl leading-tight font-semibold">Telegram-da da var</h2>
          <p className="relative mt-3 max-w-sm leading-relaxed text-cream/80">
            Brauzer açmaq istəmirsən? Eyni köməkçi Telegram botu kimi də işləyir: ərzaqları yaz, şəkil göndər,
            resept al.
          </p>
          <div className="relative mt-7">
            <ButtonLink href={site.links.telegram} variant="onDark">
              <TelegramIcon className="size-[18px]" />
              @NeBishirimBot
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-[28px] border border-forest-900/12 bg-cream p-7 shadow-card sm:p-9">
          <p className="text-sm font-semibold tracking-wide text-orange-ink uppercase">Haqqında</p>
          <h2 id="about-title" className="mt-3 text-3xl leading-tight font-semibold text-forest-900">
            Bir gündəlik sualdan yaranıb
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            «Evdə bunlar var, nə bişirim?» — {site.name} bu suala praktik cavab vermək üçün hazırlanıb: ərzaqlarını
            əlavə edirsən, AI onlara uyğun reseptləri Azərbaycan dilində təklif edir. Layihəni{" "}
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-forest-800 underline decoration-forest-800/30 underline-offset-4 hover:decoration-forest-800"
            >
              {site.creator}
            </a>{" "}
            hazırlayır.
          </p>

          <h3 className="mt-7 font-sans text-sm font-semibold tracking-normal text-forest-900">Necə hazırlanıb?</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stack.map((name) => (
              <li key={name} className="rounded-full border border-forest-900/15 bg-white px-3 py-1.5 text-sm text-forest-800">
                {name}
              </li>
            ))}
          </ul>
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-forest-800 underline decoration-forest-800/30 underline-offset-4 hover:decoration-forest-800"
          >
            <GitHubIcon className="size-5" />
            Mənbə kodu GitHub-da
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </Section>
  );
}
