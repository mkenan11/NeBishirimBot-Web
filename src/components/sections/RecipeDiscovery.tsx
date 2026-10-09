import { Clock, ShoppingBasket, Users } from "lucide-react";
import { Screenshot } from "../Screenshot";
import { Section, SectionHeading } from "../Section";

const modes = [
  {
    name: "Bütün təkliflər",
    text: "Qarışıq seçim: evdəkilərlə hazırlanan və 1–2 əlavə ərzaq istəyən reseptlər bir siyahıda.",
  },
  {
    name: "Yalnız evdəkilərlə",
    text: "Heç nə almadan, yalnız siyahındakı ərzaqlarla hazırlana bilən yeməklər.",
  },
  {
    name: "Əlavə 1–2 ərzaqla",
    text: "Bir-iki məhsul alsan hazırlaya biləcəyin reseptlər. Nəyin çatışmadığı dərhal görünür.",
  },
];

const filters = [
  { icon: Clock, label: "Hazırlanma vaxtı", values: ["Hamısı", "≤45 dəq", "46–90 dəq"] },
  { icon: Users, label: "Nəfər sayı", values: ["1 nəfər", "2 nəfər", "4 nəfər"] },
];

export function RecipeDiscovery() {
  return (
    <Section id="reseptler" labelledBy="recipes-title">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto w-full max-w-[540px] pb-4 pl-4 sm:pb-6 sm:pl-6">
          <div aria-hidden className="absolute inset-0 right-8 rounded-[36px] bg-beige" />
          <Screenshot shot="filters" sizes="(max-width: 768px) 88vw, 523px" className="relative" />
        </div>

        <div>
          <SectionHeading
            id="recipes-title"
            eyebrow="Resept təklifləri"
            title="Evdəkilərə uyğun reseptlər, aydın bölgü ilə"
            intro="«Nə bişirim?» düyməsinə basanda bot siyahındakı ərzaqlara uyğun 5 resept təklif edir. Bəyənmədinsə, «Başqa təkliflər» ilə yenilərini istə."
          />

          <dl className="mt-8 divide-y divide-forest-900/10 border-y border-forest-900/10">
            {modes.map((mode) => (
              <div key={mode.name} className="py-4 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="font-semibold text-forest-900">{mode.name}</dt>
                <dd className="mt-1 leading-relaxed text-muted sm:mt-0">{mode.text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 space-y-4">
            {filters.map(({ icon: Icon, label, values }) => (
              <div key={label} className="flex flex-wrap items-center gap-2">
                <span className="mr-1 inline-flex items-center gap-2 text-sm font-semibold text-forest-900">
                  <Icon className="size-4 text-orange-ink" aria-hidden />
                  {label}:
                </span>
                {values.map((v) => (
                  <span key={v} className="rounded-full bg-sage px-3 py-1 text-sm text-forest-800">
                    {v}
                  </span>
                ))}
              </div>
            ))}
            <p className="flex items-start gap-2 text-sm leading-relaxed text-muted">
              <ShoppingBasket className="mt-0.5 size-4 shrink-0 text-orange-ink" aria-hidden />
              <span>
                <strong className="font-semibold text-forest-900">Çatışmayan ərzaqlar</strong> hər reseptin yanında
                göstərilir — bişirməyə başlamazdan əvvəl nə alacağını bilirsən.
              </span>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
