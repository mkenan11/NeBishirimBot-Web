import { site } from "@/content/site";
import { ButtonLink } from "../Button";
import { LeafShape, TelegramIcon } from "../icons";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-forest-900 text-cream">
      <LeafShape aria-hidden className="absolute -right-10 -bottom-14 size-32 text-orange-500/90 sm:-right-6 sm:-bottom-8 sm:size-56" />
      <LeafShape aria-hidden className="absolute top-8 -left-10 size-32 -scale-x-100 text-forest-700" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 md:py-28">
        <h2 id="cta-title" className="mx-auto max-w-2xl text-4xl leading-tight font-semibold sm:text-5xl">
          Bu gün nə bişirəcəyini tap.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-cream/75">
          Evdə olanları yaz, qalanını {site.name} təklif etsin — brauzerdə və ya Telegram-da.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/app" variant="onDark">
            İndi sına
          </ButtonLink>
          <ButtonLink href={site.links.telegram} variant="onDarkOutline">
            <TelegramIcon className="size-[18px]" />
            Telegram-da aç
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
