"use client";

import { Apple, Carrot, ChevronDown, CookingPot, Drumstick, Milk, Plus, Wheat, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { Pantry } from "@/lib/api";

// Kateqoriya adları botdan gəlir; ikon yalnız görünüş üçündür (tanınmayan ad ikonsuz göstərilir).
const ICONS: Record<string, LucideIcon> = {
  "Tərəvəz": Carrot,
  "Ət, balıq, yumurta": Drumstick,
  "Süd məhsulları": Milk,
  "Taxıl və paxlalı": Wheat,
  "Əsas və ədviyyat": CookingPot,
  "Meyvə": Apple,
};

/**
 * «Tez əlavə et»: yazmaq istəməyənlər üçün əsas giriş yolu.
 * Əvvəl ən populyar ~10 ərzaq, «Hamısı» ilə kateqoriyalar açılır. Hər toxunuş dərhal əlavə edir.
 */
export function QuickAdd({
  pantry,
  busy,
  onAdd,
}: {
  pantry: Pantry;
  busy: string | null;
  onAdd: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const all = pantry.suggestions ?? [];
  if (!all.length) return null;

  // Köhnə backend yalnız düz siyahı qaytarır: onda populyar = ilk 10, qrup = bir «Digər».
  const popular = pantry.popular?.length ? pantry.popular : all.slice(0, 10);
  const groups = pantry.suggestion_groups?.length ? pantry.suggestion_groups : [{ name: "Digər", items: all }];

  const chip = (name: string) => (
    <li key={name}>
      <button
        type="button"
        onClick={() => onAdd(name)}
        disabled={busy === `quick-${name}`}
        className="inline-flex min-h-9 items-center gap-1 rounded-full border border-dashed border-forest-900/30 bg-white/70 px-3 text-sm font-medium text-forest-800 transition-colors hover:border-solid hover:border-forest-800 hover:bg-white disabled:opacity-50"
      >
        <Plus className="size-3.5" aria-hidden />
        {name}
      </button>
    </li>
  );

  return (
    <section aria-labelledby="quick-title" className="mt-5 rounded-3xl border border-forest-900/12 bg-sage/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="quick-title" className="font-sans text-sm font-semibold tracking-normal text-forest-900">
            Tez əlavə et
          </h2>
          <p className="text-xs text-muted">Yazmadan — bir toxunuşla</p>
        </div>
        {all.length > popular.length && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls="quick-groups"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-white px-3 text-sm font-semibold text-forest-800 shadow-card hover:bg-cream"
          >
            {open ? "Daha az" : `Hamısı (${all.length})`}
            <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
          </button>
        )}
      </div>

      {open ? (
        <div id="quick-groups" className="mt-4 space-y-4">
          {groups.map((group) => {
            const Icon = ICONS[group.name];
            return (
              <div key={group.name}>
                <h3 className="mb-2 flex items-center gap-1.5 font-sans text-xs font-semibold tracking-wide text-muted uppercase">
                  {Icon && <Icon className="size-4 text-forest-700" aria-hidden />}
                  {group.name}
                </h3>
                <ul className="flex flex-wrap gap-2">{group.items.map(chip)}</ul>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">{popular.map(chip)}</ul>
      )}
    </section>
  );
}
