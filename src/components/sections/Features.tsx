import { Camera, Clock, ListChecks, ListOrdered, ShoppingBasket, Sparkles, Star, Users } from "lucide-react";
import { Section, SectionHeading } from "../Section";

const features = [
  { icon: ShoppingBasket, title: "Ərzaqların idarə olunması", text: "Əlavə et, adını dəyiş, lazımsızı sil." },
  { icon: Camera, title: "Şəkildən tanıma", text: "Şəkildəki ərzaqları AI müəyyən edir." },
  { icon: Sparkles, title: "AI resept təklifləri", text: "Siyahına uyğun real yemək ideyaları." },
  { icon: Clock, title: "Vaxt filtrləri", text: "≤45 dəqiqə və ya 46–90 dəqiqə." },
  { icon: Users, title: "Nəfər sayı", text: "1, 2 və ya 4 nəfərlik miqdarlar." },
  { icon: ListChecks, title: "Çatışmayan ərzaqlar", text: "Nəyin əlavə lazım olduğu əvvəlcədən bəlli." },
  { icon: Star, title: "Seçilmiş reseptlər", text: "Bəyəndiklərin bir bölmədə saxlanılır." },
  { icon: ListOrdered, title: "Hazırlanma addımları", text: "Hər resept üçün addım-addım qayda." },
];

export function Features() {
  return (
    <Section id="funksiyalar" tone="sage" labelledBy="features-title">
      <SectionHeading id="features-title" eyebrow="Funksiyalar" title="Bir botda hamısı" />
      <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-forest-900/10 ring-1 ring-forest-900/10 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <li key={title} className="bg-cream p-4 sm:p-6">
            <Icon className="size-6 text-forest-700" aria-hidden />
            <h3 className="mt-3 font-sans text-[15px] leading-snug font-semibold tracking-normal text-forest-900 sm:mt-4 sm:text-[17px]">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-[15px]">{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
