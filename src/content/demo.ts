// Landing demosu üçün nümunə: reseptlər NeBishirimBot-un real Gemini cavablarından götürülüb.
// Demo AI çağırmır; real axtarış /app-dadır.
export const DEMO_INGREDIENTS = ["Kartof", "Yumurta", "Soğan", "Pomidor", "Makaron", "Pendir", "Toyuq", "Düyü"];

export type DemoRecipe = { name: string; minutes: number; method: string; uses: string[]; extra?: string[] };

export const DEMO_RECIPES: DemoRecipe[] = [
  { name: "Pomidor yumurta", minutes: 15, method: "Tavada qovurma", uses: ["Pomidor", "Yumurta", "Soğan"] },
  { name: "Kartof şorbası", minutes: 40, method: "Qaynatma", uses: ["Kartof", "Soğan"] },
  { name: "Pendirli makaron", minutes: 20, method: "Qaynatma", uses: ["Makaron", "Pendir"] },
  { name: "Toyuqlu düyü şorbası", minutes: 45, method: "Qaynatma", uses: ["Toyuq", "Düyü", "Soğan"] },
  { name: "Soğanlı omlet", minutes: 15, method: "Tavada", uses: ["Yumurta", "Soğan"] },
  { name: "Kartof püresi və toyuq", minutes: 45, method: "Qaynatma və qızartma", uses: ["Kartof", "Toyuq"], extra: ["Kərə yağı"] },
  { name: "Toyuqlu makaron", minutes: 35, method: "Qazanda", uses: ["Toyuq", "Makaron", "Pomidor"] },
  { name: "Pendirli kartof qratin", minutes: 50, method: "Sobada", uses: ["Kartof", "Pendir"], extra: ["Süd"] },
];

/** Seçilmiş ərzaqlara ən uyğun 3 nümunə resept: çatışmayan ən çox 2 ərzaq. */
export function matchRecipes(selected: string[]) {
  const have = new Set(selected);
  return DEMO_RECIPES.map((recipe) => {
    const missing = [...recipe.uses.filter((item) => !have.has(item)), ...(recipe.extra ?? [])];
    const used = recipe.uses.filter((item) => have.has(item)).length;
    return { ...recipe, missing, used };
  })
    .filter((recipe) => recipe.used > 0 && recipe.missing.length <= 2)
    .sort((a, b) => a.missing.length - b.missing.length || b.used - a.used)
    .slice(0, 3);
}
