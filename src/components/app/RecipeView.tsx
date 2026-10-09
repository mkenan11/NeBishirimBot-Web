import { CirclePlay, Clock, Flame, ShoppingBasket, Users } from "lucide-react";
import type { ReactNode } from "react";
import type { RecipeDetail } from "@/lib/api";

/** Tam reseptin görünüşü: həm axtarışdan, həm seçilmişlərdən açılanda eynidir. */
export function RecipeView({ recipe, actions }: { recipe: RecipeDetail; actions?: ReactNode }) {
  const missing = new Set(recipe.missing);
  const time = [`hazırlıq ${recipe.prep}`, `bişirmə ${recipe.cook}`];
  if (recipe.finish) time.push(`soyutma/dincəltmə ${recipe.finish}`);

  return (
    <article>
      <h1 className="text-[2rem] leading-tight font-semibold text-forest-900">{recipe.name}</h1>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-muted">
        <li className="inline-flex items-center gap-1.5">
          <Users className="size-4 text-forest-700" aria-hidden />
          {recipe.servings} nəfərlik
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Clock className="size-4 text-forest-700" aria-hidden />
          {recipe.total} dəq
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Flame className="size-4 text-forest-700" aria-hidden />
          {recipe.method}
        </li>
      </ul>
      <p className="mt-1.5 text-sm text-muted">Vaxt: {time.join(" + ")} dəq</p>

      {actions && <div className="mt-5 flex flex-wrap gap-2">{actions}</div>}

      <section aria-labelledby="ingredients-title" className="mt-8">
        <h2 id="ingredients-title" className="text-xl font-semibold text-forest-900">
          Lazım olan ərzaqlar
        </h2>
        <p className="mt-1 text-sm text-muted">Miqdarlar təxminidir.</p>
        <ul className="mt-3 divide-y divide-forest-900/8 rounded-3xl bg-white ring-1 ring-forest-900/10">
          {recipe.ingredients.map((item) => (
            <li key={item.name} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <span className={missing.has(item.name) ? "font-medium text-orange-ink" : "text-ink"}>
                {item.name}
                {missing.has(item.name) && <span className="sr-only"> (siyahında yoxdur)</span>}
              </span>
              <span className="text-right text-[15px] text-muted">{item.quantity}</span>
            </li>
          ))}
        </ul>
        {recipe.missing.length > 0 && (
          <p className="mt-3 flex items-start gap-2 rounded-2xl bg-beige px-4 py-3 text-[15px] text-forest-900">
            <ShoppingBasket className="mt-0.5 size-4 shrink-0 text-orange-ink" aria-hidden />
            <span>
              <strong className="font-semibold">Alınacaq:</strong> {recipe.missing.join(", ")}
            </span>
          </p>
        )}
      </section>

      <section aria-labelledby="steps-title" className="mt-8">
        <h2 id="steps-title" className="text-xl font-semibold text-forest-900">
          Hazırlanması
        </h2>
        <ol className="mt-3 space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest-800 text-sm font-semibold text-cream">
                {i + 1}
              </span>
              <p className="pt-0.5 leading-relaxed text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {recipe.note && (
        <p className="mt-6 rounded-2xl bg-sage px-4 py-3 leading-relaxed text-forest-900">💡 {recipe.note}</p>
      )}

      <a
        href={recipe.video_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-forest-800/25 px-5 font-semibold text-forest-800 hover:border-forest-800/60"
      >
        <CirclePlay className="size-5" aria-hidden />
        YouTube-da hazırlanmasına bax
      </a>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        AI reseptində və videolarda olan ərzaqları, allergenləri və təhlükəsizlik qaydalarını özün də yoxla.
      </p>
    </article>
  );
}
