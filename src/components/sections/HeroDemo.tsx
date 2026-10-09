"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { useState } from "react";
import { DEMO_INGREDIENTS, matchRecipes } from "@/content/demo";

/**
 * Hero-dakı canlı demo: ərzaqları seç → nümunə reseptlər dərhal yenilənir.
 * AI çağırmır (xərcsiz və ani); nəticələr real cavablardan götürülmüş nümunələrdir.
 */
export function HeroDemo() {
  const [selected, setSelected] = useState<string[]>(["Kartof", "Yumurta", "Soğan"]);
  const results = matchRecipes(selected);

  const toggle = (item: string) =>
    setSelected((list) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]));

  return (
    <div className="relative rounded-[28px] border border-forest-900/15 bg-white p-5 shadow-phone sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-forest-900">Evdə nə var?</p>
        <p className="text-xs text-muted">Toxun və seç</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {DEMO_INGREDIENTS.map((item) => {
          const on = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(item)}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                on
                  ? "border-forest-800 bg-forest-800 text-cream"
                  : "border-forest-900/20 bg-cream text-forest-800 hover:border-forest-900/45"
              }`}
            >
              {on && <Check className="size-3.5" aria-hidden />}
              {item}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-forest-900/12" />
        <span className="text-xs font-semibold tracking-wide text-orange-ink uppercase">Nə bişirim?</span>
        <span className="h-px flex-1 bg-forest-900/12" />
      </div>

      <ul className="mt-4 space-y-2" aria-live="polite" aria-label="Nümunə reseptlər">
        {results.length ? (
          results.map((recipe) => (
            <li
              key={recipe.name}
              className={`flex items-center gap-3 rounded-2xl border border-l-4 border-forest-900/12 bg-cream px-4 py-3 ${
                recipe.missing.length ? "border-l-orange-500" : "border-l-forest-600"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-forest-900">{recipe.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                  <Clock className="size-3.5" aria-hidden /> {recipe.minutes} dəq
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  recipe.missing.length ? "bg-beige text-orange-ink" : "bg-sage text-forest-800"
                }`}
              >
                {recipe.missing.length ? `+ ${recipe.missing.join(", ")}` : "Hamısı evdə"}
              </span>
            </li>
          ))
        ) : (
          <li className="rounded-2xl border border-dashed border-forest-900/25 px-4 py-6 text-center text-sm text-muted">
            Ən azı bir ərzaq seç
          </li>
        )}
      </ul>

      <Link
        href="/app"
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-semibold text-forest-950 transition-colors hover:bg-orange-600"
      >
        Öz ərzaqlarınla sına
        <ArrowRight className="size-4" aria-hidden />
      </Link>
      <p className="mt-2.5 text-center text-xs text-muted">Bu, nümunədir. Real reseptləri AI sənin siyahına görə hazırlayır.</p>
    </div>
  );
}
