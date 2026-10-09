/**
 * Saytın əsas ünvanı: NEXT_PUBLIC_SITE_URL → Vercel-in production domeni → lokal.
 * Boş dəyər də "təyin olunmayıb" sayılır (Vercel boş env-i "" kimi ötürür).
 */
function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  name: "NeBishirimBot",
  title: "NeBishirimBot — Evdəki ərzaqlara uyğun reseptlər",
  description:
    "Evdə olan ərzaqları əlavə et və NeBishirimBot ilə uyğun reseptlər tap. Şəkildən ərzaq tanıma, resept təklifləri və daha çoxu.",
  url: siteUrl(),
  locale: "az_AZ",
  links: {
    telegram: "https://t.me/NeBishirimBot",
    github: "https://github.com/mkenan11/NeBishirimBot",
    linkedin: "https://www.linkedin.com/in/kanan-mammadov1/",
  },
  creator: "Kanan Mammadov",
} as const;

export const nav = [
  { label: "Ana səhifə", href: "/#top" },
  { label: "Necə işləyir?", href: "/#nece-isleyir" },
  { label: "Funksiyalar", href: "/#funksiyalar" },
  { label: "Haqqında", href: "/#haqqinda" },
] as const;

/**
 * Real Telegram screenshot-ları `public/screenshots/` qovluğunda bu adlarla saxlanılır
 * (.png, .jpg və ya .webp). Fayl yoxdursa, səhifədə neytral yer tutucu görünür.
 */
export const screenshots = {
  ingredients: {
    file: "ingredients",
    alt: "Telegram-da «Ərzaqlarım» siyahısı: su, un, makaron, kartof, soğan və digər ərzaqlar, altında Nə bişirim?, Əlavə et və Tez əlavə et düymələri",
    label: "Ərzaqlarım",
  },
  photo: {
    file: "photo",
    alt: "İstifadəçinin göndərdiyi ərzaq şəkli və botun cavabı: şəkildən tanınıb siyahıya əlavə olunan ərzaqlar",
    label: "Şəkildən tanıma",
  },
  filters: {
    file: "filters",
    alt: "Resept siyahısının altında rejim, hazırlanma vaxtı (Hamısı, ≤45 dəq, 46–90 dəq) və nəfər sayı (1, 2, 4) düymələri",
    label: "Vaxt və nəfər seçimi",
  },
  recipes: {
    file: "recipes",
    alt: "«Nə bişirim?» cavabı: yalnız evdəkilərlə, əlavə 1 və 2 ərzaqla hazırlanan 5 resept, hazırlanma vaxtı və çatışmayan ərzaqlar",
    label: "Resept təklifləri",
  },
  recipeDetail: {
    file: "recipe-detail",
    alt: "Lobya qovurması resepti: 2 nəfərlik ərzaq miqdarları, ümumi vaxt və 7 addımlı hazırlanma qaydası",
    label: "Resept detalları",
  },
  stepFilters: {
    file: "step-filters",
    alt: "Rejim düymələri (Bütün təkliflər, Yalnız evdəkilərlə, Əlavə 1–2 ərzaqla), vaxt və nəfər sayı seçimləri",
    label: "Vaxt və nəfər seçimi",
  },
  stepRecipe: {
    file: "step-recipe",
    alt: "Lobya qovurması resepti: lazım olan ərzaqlar və miqdarları",
    label: "Resept",
  },
  favorites: {
    file: "favorites",
    alt: "«Seçilmiş reseptlər» bölməsi: 8 saxlanmış resept, hər biri hazırlanma vaxtı və nəfər sayı ilə",
    label: "Seçilmiş reseptlər",
  },
} as const;

export type ScreenshotKey = keyof typeof screenshots;
