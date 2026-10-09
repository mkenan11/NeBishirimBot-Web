"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { api, ApiError, recipeSlug, type Mode, type RecipesResponse, type RecipesState, type SearchAction } from "@/lib/api";
import { Button, Chip, Notice, ScreenTitle, Thinking } from "./ui";

const MODES: { value: Mode; label: string }[] = [
  { value: "all", label: "Bütün təkliflər" },
  { value: "owned", label: "Yalnız evdəkilərlə" },
  { value: "extra", label: "Əlavə 1–2 ərzaqla" },
];
const TIMES = [
  { value: 0, label: "Hamısı" },
  { value: 45, label: "≤45 dəq" },
  { value: 90, label: "46–90 dəq" },
];
const SERVINGS = [1, 2, 4];
const GROUPS = [
  { missing: 0, label: "Yalnız evdəkilərlə" },
  { missing: 1, label: "Əlavə 1 ərzaqla" },
  { missing: 2, label: "Əlavə 2 ərzaqla" },
];

export function RecipesScreen() {
  const [data, setData] = useState<RecipesResponse | null>(null);
  const [thinking, setThinking] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  async function run(task: () => Promise<RecipesResponse>, aiLabel?: string) {
    setError(null);
    setBusy(true);
    if (aiLabel) setThinking(aiLabel);
    try {
      setData(await task());
    } catch (e) {
      const err = e as ApiError;
      if (err.code === "basket_changed" || err.code === "no_search") setData({ state: null, notice: err.message });
      setError({ code: err.code, message: err.message });
    } finally {
      setBusy(false);
      setThinking(null);
    }
  }

  useEffect(() => {
    // «Nə bişirim?» düyməsindən gəldikdə axtarışı dərhal başladırıq.
    const start = new URLSearchParams(window.location.search).has("start");
    if (start) window.history.replaceState(null, "", "/app/recipes");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ilk yükləmə: serverdən state oxunur
    void run(start ? api.search : api.recipes, start ? "Reseptlər hazırlanır..." : undefined);
  }, []);

  const state = data?.state;

  return (
    <>
      <ScreenTitle title="Nə bişirim?" subtitle="Siyahındakı ərzaqlara uyğun 5 resept. Vaxt və nəfər sayını seç." />

      <div className="space-y-3" aria-live="polite">
        {error && error.code !== "basket_changed" && error.code !== "no_search" && (
          <Notice tone="error">
            {error.message}
            {error.code === "empty_pantry" && (
              <>
                {" "}
                <Link href="/app" className="font-semibold underline underline-offset-4">
                  Ərzaqlarına keç
                </Link>
              </>
            )}
          </Notice>
        )}
        {data?.notice && <Notice>{data.notice}</Notice>}
      </div>

      {thinking ? (
        <div className="mt-4">
          <Thinking label={thinking} />
        </div>
      ) : data === null ? (
        <div className="mt-4 h-40 animate-pulse rounded-3xl bg-forest-900/5" aria-hidden />
      ) : !state ? (
        <div className="mt-4 rounded-3xl bg-sage px-6 py-8 text-center">
          <p className="text-lg font-semibold text-forest-900">Evdəkilərlə nə hazırlaya bilərsən?</p>
          <p className="mt-1 text-[15px] text-muted">Siyahındakı ərzaqlara görə AI uyğun reseptlər seçəcək.</p>
          <Button className="mt-5" onClick={() => run(api.search, "Reseptlər hazırlanır...")}>
            <Search className="size-4" aria-hidden />
            Reseptləri tap
          </Button>
        </div>
      ) : (
        <Results state={state} busy={busy} run={run} />
      )}

      <p className="mt-8 text-xs leading-relaxed text-muted">
        Vaxt hazırlıq, bişirmə və gözləmə daxil təxminidir. Siyahında miqdar yoxdur — reseptdə yazılan miqdarları evdə
        yoxla. AI bəzən səhv edə bilər.
      </p>
    </>
  );
}

function Results({
  state,
  busy,
  run,
}: {
  state: RecipesState;
  busy: boolean;
  run: (task: () => Promise<RecipesResponse>, aiLabel?: string) => Promise<void>;
}) {
  const more = (action: SearchAction) => run(() => api.more(action), "Başqa reseptlər axtarılır...");

  return (
    <>
      <fieldset className="mt-2" disabled={busy}>
        <legend className="sr-only">Seçim</legend>
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white p-1 ring-1 ring-forest-900/10">
          {MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              aria-pressed={state.mode === mode.value}
              onClick={() =>
                state.mode !== mode.value && run(() => api.mode(mode.value), "Seçiminə uyğun reseptlər axtarılır...")
              }
              className={`min-h-11 rounded-xl px-2 text-[13px] leading-tight font-semibold sm:text-sm ${
                state.mode === mode.value ? "bg-forest-800 text-cream" : "text-forest-800 hover:bg-forest-900/5"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4 flex flex-wrap items-center gap-2" disabled={busy}>
        <legend className="mb-2 text-sm font-semibold text-forest-900">Hazırlanma vaxtı</legend>
        {TIMES.map((time) => (
          <Chip
            key={time.value}
            active={state.time_limit === time.value}
            onClick={() => run(() => api.preference("time_limit", time.value))}
          >
            {time.label}
          </Chip>
        ))}
      </fieldset>

      <fieldset className="mt-4 flex flex-wrap items-center gap-2" disabled={busy}>
        <legend className="mb-2 text-sm font-semibold text-forest-900">Nəfər sayı</legend>
        {SERVINGS.map((value) => (
          <Chip
            key={value}
            active={state.servings === value}
            onClick={() => run(() => api.preference("servings", value))}
          >
            {value} nəfər
          </Chip>
        ))}
      </fieldset>

      <div className="mt-6">
        {state.complete ? (
          GROUPS.map((group) => {
            const items = state.recipes.filter((r) => r.missing.length === group.missing);
            if (!items.length) return null;
            return (
              <section key={group.missing} className="mb-6" aria-label={group.label}>
                <h2 className="mb-2 font-sans text-sm font-semibold tracking-wide text-orange-ink uppercase">
                  {group.label}
                </h2>
                <ul className="space-y-2">
                  {items.map((recipe) => (
                    <li key={recipe.index}>
                      <Link
                        href={`/app/recipes/${recipeSlug({ mode: state.mode, page: state.page, index: recipe.index })}`}
                        className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-forest-900/10 transition-shadow hover:ring-forest-900/30"
                      >
                        <span className="flex-1">
                          <span className="block font-semibold text-forest-900">{recipe.name}</span>
                          <span className="mt-0.5 block text-sm text-muted">
                            təx. {recipe.minutes} dəq · {recipe.method}
                          </span>
                          {recipe.missing.length > 0 && (
                            <span className="mt-1 block text-sm font-medium text-orange-ink">
                              Çatışmayan: {recipe.missing.join(", ")}
                            </span>
                          )}
                        </span>
                        <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })
        ) : (
          <Notice>Bu seçimlə 5 reseptlik bölgü hələ tamamlanmayıb. Yenidən axtar və ya seçimi dəyiş.</Notice>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {state.can_complete && (
          <Button variant="secondary" disabled={busy} onClick={() => more("complete")}>
            <RefreshCw className="size-4" aria-hidden />5 resept tap
          </Button>
        )}
        {state.can_findtime && (
          <Button variant="secondary" disabled={busy} onClick={() => more("findtime")}>
            <Search className="size-4" aria-hidden />
            Bu vaxta uyğun reseptlər tap
          </Button>
        )}
        {state.can_more && (
          <Button variant="secondary" disabled={busy} onClick={() => more("more")}>
            <RefreshCw className="size-4" aria-hidden />
            Başqa təkliflər
          </Button>
        )}
      </div>

      {state.pages > 1 && (
        <nav aria-label="Səhifələr" className="mt-4 flex items-center justify-between">
          <Button variant="ghost" disabled={busy || state.page === 0} onClick={() => run(() => api.page(-1))}>
            <ChevronLeft className="size-4" aria-hidden />
            Əvvəlki 5
          </Button>
          <span className="text-sm text-muted">
            Səhifə {state.page + 1}/{state.pages}
          </span>
          <Button
            variant="ghost"
            disabled={busy || state.page >= state.pages - 1}
            onClick={() => run(() => api.page(1))}
          >
            Növbəti 5
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </nav>
      )}

      <div className="mt-6 text-center">
        <Button variant="ghost" disabled={busy} onClick={() => run(api.search, "Reseptlər hazırlanır...")}>
          Yeni axtarış
        </Button>
      </div>
    </>
  );
}
