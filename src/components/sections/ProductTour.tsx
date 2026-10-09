import type { ScreenshotKey } from "@/content/site";
import { Screenshot } from "../Screenshot";
import { Section, SectionHeading } from "../Section";
import { ProductTourTabs, type TourItem } from "./ProductTourTabs";

const tour: (Omit<TourItem, "visual"> & { shot: ScreenshotKey })[] = [
  {
    id: "pantry",
    tab: "Ərzaqlarım",
    title: "Evdə nə var — hamısı bir siyahıda",
    points: [
      "Yaz və ya «Tez əlavə et»-dən bir toxunuşla seç",
      "Hərf səhvləri avtomatik düzəlir: kelem → Kələm",
      "Adını dəyiş, sil, səhvən silsən geri qaytar",
    ],
    shot: "ingredients",
  },
  {
    id: "photo",
    tab: "Şəkildən tanıma",
    title: "Şəkli çək, ərzaqları tanısın",
    points: [
      "AI şəkildəki ərzaqları müəyyən edir",
      "Lazım olmayanı çıxar, adı səhvdirsə düzəlt",
      "Sən təsdiqləməyincə heç nə əlavə olunmur",
    ],
    shot: "photo",
  },
  {
    id: "recipes",
    tab: "Resept təklifləri",
    title: "Evdəkilərə uyğun 5 resept",
    points: [
      "Yalnız evdəkilərlə, yoxsa 1–2 əlavə ərzaqla",
      "Hazırlanma vaxtı və 1, 2 və ya 4 nəfər seçimi",
      "Çatışmayan ərzaqlar hər reseptin yanında görünür",
    ],
    shot: "recipes",
  },
  {
    id: "detail",
    tab: "Resept",
    title: "Addım-addım, rahat bişir",
    points: [
      "Seçdiyin nəfər sayına görə miqdarlar",
      "Bitirdiyin addımı işarələ, ekran sönməsin",
      "YouTube-da hazırlanma videolarını aç",
    ],
    shot: "recipeDetail",
  },
  {
    id: "favorites",
    tab: "Seçilmişlər",
    title: "Bəyəndiklərin itməsin",
    points: ["Bir toxunuşla seçilmişlərə saxla", "İstədiyin vaxt yenidən aç", "Lazım olmayanı sil"],
    shot: "favorites",
  },
];

export function ProductTour() {
  const items: TourItem[] = tour.map(({ shot, ...item }) => ({
    ...item,
    visual: (
      <div className="relative mx-auto flex w-full max-w-[440px] justify-center py-2">
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage"
        />
        <Screenshot shot={shot} className="relative" />
      </div>
    ),
  }));

  return (
    <Section id="funksiyalar" labelledBy="tour-title">
      <SectionHeading
        id="tour-title"
        eyebrow="Məhsul turu"
        title="Bir toxunuşla ərzaqdan resepte"
        intro="Brauzerdə və Telegram-da eyni AI və eyni resept məntiqi işləyir."
        align="center"
      />
      <ProductTourTabs items={items} />
    </Section>
  );
}
