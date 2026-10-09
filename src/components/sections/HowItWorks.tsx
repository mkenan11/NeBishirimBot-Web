import { ChefHat, ShoppingBasket, SlidersHorizontal } from "lucide-react";
import { Section, SectionHeading } from "../Section";

const steps = [
  {
    icon: ShoppingBasket,
    title: "Ərzaqlarını əlavə et",
    text: "Yaz, şəklini çək və ya hazır siyahıdan bir toxunuşla seç. Hərf səhvlərini özümüz düzəldirik.",
  },
  {
    icon: SlidersHorizontal,
    title: "Seçimlərini et",
    text: "Yalnız evdəkilərlə, yoxsa 1–2 əlavə ərzaqla? Hazırlanma vaxtı və neçə nəfər üçün?",
  },
  {
    icon: ChefHat,
    title: "Bişirməyə başla",
    text: "Miqdarları, çatışmayan ərzaqları və addımları gör. Bəyəndiyini seçilmişlərə saxla.",
  },
];

export function HowItWorks() {
  return (
    <Section id="nece-isleyir" labelledBy="how-title" className="border-y border-forest-900/10" tone="beige">
      <SectionHeading id="how-title" eyebrow="Necə işləyir?" title="Üç addımda hazır resept" align="center" />

      <ol className="relative mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative rounded-3xl border border-forest-900/12 bg-cream p-6 shadow-card">
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-forest-800 text-cream">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="font-display text-5xl leading-none font-semibold text-orange-500/80" aria-hidden>
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-forest-900">
              <span className="sr-only">Addım {i + 1}: </span>
              {title}
            </h3>
            <p className="mt-2 leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
