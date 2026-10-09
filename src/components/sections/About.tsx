import { site } from "@/content/site";
import { Section } from "../Section";

export function About() {
  return (
    <Section id="haqqinda" tone="beige" labelledBy="about-title">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-wide text-orange-ink uppercase">Haqqında</p>
          <h2 id="about-title" className="text-[2rem] leading-[1.15] font-semibold text-forest-900 sm:text-4xl">
            Bir gündəlik sualdan yaranıb
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          <blockquote className="border-l-4 border-orange-500 pl-5 font-display text-2xl text-forest-900">
            «Evdə bunlar var, nə bişirim?»
          </blockquote>
          <p>
            {site.name} bu suala praktik cavab vermək üçün hazırlanıb: ərzaqlarını əlavə edirsən, bot isə onlara
            uyğun reseptləri Azərbaycan dilində təklif edir.
          </p>
          <p>
            Məhsul həm brauzerdə, həm Telegram-da işləyir; hər ikisi eyni backend-dən istifadə edir. Layihəni{" "}
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
        </div>
      </div>
    </Section>
  );
}
