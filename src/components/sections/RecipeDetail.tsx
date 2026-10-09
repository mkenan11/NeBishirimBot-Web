import { CirclePlay, ListOrdered, Scale, Star } from "lucide-react";
import { Screenshot } from "../Screenshot";
import { Section, SectionHeading } from "../Section";

const points = [
  { icon: Scale, title: "Ərzaq miqdarları", text: "Seçdiyin nəfər sayına görə hesablanmış təxmini miqdarlar." },
  { icon: ListOrdered, title: "Hazırlanma addımları", text: "Başdan sona ardıcıl, qısa addımlar." },
  { icon: Star, title: "Seçilmişlərə əlavə et", text: "Bəyəndiyin resepti bir düymə ilə saxla." },
  { icon: CirclePlay, title: "YouTube-da axtar", text: "Həmin yeməyin hazırlanma videolarını YouTube-da aç." },
];

export function RecipeDetail() {
  return (
    <Section tone="beige" labelledBy="detail-title">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <SectionHeading
            id="detail-title"
            eyebrow="Resept detalları"
            title="Resepti aç, hazırlamağa başla"
            intro="Reseptin üzərinə bas — lazım olan hər şey bir mesajda."
          />
          <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon className="size-6 text-orange-ink" aria-hidden />
                <p className="mt-2 font-semibold text-forest-900">{title}</p>
                <p className="mt-1 leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <Screenshot shot="recipeDetail" sizes="(max-width: 768px) 92vw, 550px" className="mx-auto" />
      </div>
    </Section>
  );
}
