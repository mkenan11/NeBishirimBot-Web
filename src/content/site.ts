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
 * NeBishirimBot web app-in real ekran görüntüləri (`public/screenshots/`, 390px telefon ekranı, 2x).
 * Fayl yoxdursa, səhifədə neytral yer tutucu görünür.
 */
export const screenshots = {
  ingredients: {
    file: "ui-ingredients",
    alt: "NeBishirimBot web app-də «Ərzaqlarım» ekranı: ərzaq əlavə etmə sahəsi və 14 ərzaqlıq siyahı",
    label: "Ərzaqlarım",
  },
  photo: {
    file: "ui-photo",
    alt: "Şəkildən tanıma ekranı: yüklənmiş ərzaq şəkli və təsdiq üçün tanınan ərzaqların siyahısı",
    label: "Şəkildən tanıma",
  },
  recipes: {
    file: "ui-recipes",
    alt: "«Nə bişirim?» ekranı: rejim, hazırlanma vaxtı və nəfər sayı seçimləri, evdəki ərzaqlara uyğun reseptlər",
    label: "Resept təklifləri",
  },
  recipeDetail: {
    file: "ui-recipe-detail",
    alt: "Pomidor Yumurta resepti: 2 nəfərlik, 15 dəqiqə, ərzaq miqdarları və «Seçilmişlərə əlavə et» düyməsi",
    label: "Resept detalları",
  },
  favorites: {
    file: "ui-favorites",
    alt: "«Seçilmiş reseptlər» ekranı: 4 saxlanmış resept, hazırlanma vaxtı və nəfər sayı ilə",
    label: "Seçilmiş reseptlər",
  },
} as const;

export type ScreenshotKey = keyof typeof screenshots;
