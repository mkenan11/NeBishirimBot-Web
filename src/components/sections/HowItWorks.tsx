import type { ScreenshotKey } from "@/content/site";
import { Screenshot } from "../Screenshot";
import { Section, SectionHeading } from "../Section";

const steps: { title: string; text: string; shot: ScreenshotKey }[] = [
  {
    title: "Ərzaqlarını əlavə et",
    text: "Evdə olanları vergüllə yaz, şəklini göndər və ya hazır siyahıdan seç. Siyahını istədiyin vaxt redaktə edə bilərsən.",
    shot: "ingredients",
  },
  {
    title: "Seçimlərini et",
    text: "Hazırlanma vaxtını (≤45 və ya 46–90 dəqiqə) və neçə nəfər üçün bişirəcəyini seç: 1, 2 və ya 4.",
    shot: "stepFilters",
  },
  {
    title: "Reseptini seç",
    text: "Uyğun reseptlərə bax, çatışmayan ərzaqları gör və bəyəndiyini açıb addım-addım hazırla.",
    shot: "stepRecipe",
  },
];

export function HowItWorks() {
  return (
    <Section id="nece-isleyir" labelledBy="how-title">
      <SectionHeading id="how-title" eyebrow="Necə işləyir?" title="Üç addımda hazır resept" align="center" />

      <ol className="mt-14 grid gap-14 md:grid-cols-3 md:gap-8">
        {steps.map((step, i) => (
          <li key={step.title} className="flex flex-col">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl leading-none font-semibold text-orange-500" aria-hidden>
                {i + 1}
              </span>
              <h3 className="text-2xl font-semibold text-forest-900">
                <span className="sr-only">Addım {i + 1}: </span>
                {step.title}
              </h3>
            </div>
            <p className="mt-3 mb-7 leading-relaxed text-muted">{step.text}</p>
            <div className="flex flex-1 items-start justify-center rounded-[28px] bg-sage p-4 sm:p-6">
              <Screenshot shot={step.shot} sizes="(max-width: 768px) 88vw, 330px" />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
