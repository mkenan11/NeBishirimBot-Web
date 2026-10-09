"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, RefreshCw, Search, Users } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { api, ApiError, recipeSlug, type Mode, type RecipesResponse, type RecipesState, type SearchAction } from "@/lib/api";
import { AiWaiting } from "./AiWaiting";
import { Button, Notice, ScreenTitle } from "./ui";

const MODES: { value: Mode; label: string }[] = [
  { value: "all", label: "Hamısı" },
  { value: "owned", label: "Yalnız evdəkilər" },
  { value: "extra", label: "+1–2 ərzaqla" },
];
const TIMES = [
  { value: 0, label: "Hər vaxt" },
  { value: 45, label: "≤45 dəq" },
  { value: 90, label: "46–90 dəq" },
];
const SERVINGS = [1, 2, 4];
const GROUPS = [
  { missing: 0, label: "Yalnız evdəkilərlə" },
  { missing: 1, label: "Əlavə 1 ərzaqla" },
  { missing: 2, label: "Əlavə 2 ərzaqla" },
];

type Run = (task: () => Promise<RecipesResponse>, ai?: boolean) => Promise<void>;

export function RecipesScreen() {
  const [data, setData] = useState<RecipesResponse | null>(null);
  const [thinking, setThinking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  const run: Run = async (task, ai = false) => {
    setError(null);
    setBusy(true);
    setThinking(ai);
    try {
      setData(await task());
    } catch (e) {
      const err = e as ApiError;
      if (err.code === "basket_changed" || err.code === "no_search") setData({ state: null, notice: err.message });
      setError({ code: err.code, message: err.message });
    } finally {
      setBusy(false);
      setThinking(false);
    }
  };

  useEffect(() => {
    // «Nə bişirim?» düyməsindən gəldikdə axtarışı dərhal başladırıq.
    const start = new URLSearchParams(window.location.search).has("start");
    if (start) window.history.replaceState(null, "", "/app/recipes");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ilk yükləmə: serverdən state oxunur
    void run(start ? api.search : api.recipes, start);
  }, []);

  const state = data?.state;

  return (
    <>
      <ScreenTitle title="Nə bişirim?" subtitle="Siyahındakı ərzaqlara uyğun 5 resept." />

      <div className="space-y-3 empty:hidden" aria-live="polite">
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

      {state ? (
        <Results state={state} busy={busy} thinking={thinking} run={run} />
      ) : thinking || data === null ? (
        <div className="mt-4">{thinking ? <AiWaiting /> : <div className="h-40 animate-pulse rounded-3xl bg-forest-900/5" aria-hidden />}</div>
      ) : (
        <div className="mt-4 rounded-3xl border border-forest-900/15 bg-white px-6 py-8 text-center shadow-card">
          <p className="text-lg font-semibold text-forest-900">Evdəkilərlə nə hazırlaya bilərsən?</p>
          <p className="mt-1 text-[15px] text-muted">AI siyahındakı ərzaqlara uyğun reseptlər seçəcək.</p>
          <Button className="mt-5" onClick={() => run(api.search, true)}>
            <Search className="size-4" aria-hidden />
            Reseptləri tap
          </Button>
        </div>
      )}

      <p className="mt-8 text-xs leading-relaxed text-muted">
        Vaxt hazırlıq, bişirmə və gözləmə daxil təxminidir. Reseptdə yazılan miqdarları evdə yoxla. AI bəzən səhv edə
        bilər.
      </p>
    </>
  );
}

/** Kompakt seçim qrupu: aktiv dəyər doldurulmuş «hap» kimi görünür. */
function Segmented<T extends number | string>({
  label,
  icon,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  icon?: ReactNode;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-0.5 rounded-full border border-forest-900/15 bg-white p-1 shadow-card">
      {icon && <span className="px-1.5 text-forest-700">{icon}</span>}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          disabled={disabled}
          onClick={() => value !== option.value && onChange(option.value)}
          className={`min-h-9 rounded-full px-3 text-[13px] font-semibold whitespace-nowrap transition-colors disabled:opacity-60 ${
            value === option.value ? "bg-forest-800 text-cream" : "text-forest-800 hover:bg-forest-900/5"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Results({ state, busy, thinking, run }: { state: RecipesState; busy: boolean; thinking: boolean; run: Run }) {
  const more = (action: SearchAction) => run(() => api.more(action), true);

  return (
    <>
      {/* Filtrlər yığcamdır ki, nəticələr ekranın yuxarısında görünsün. */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-1 rounded-full border border-forest-900/15 bg-white p-1 shadow-card" role="group" aria-label="Seçim">
          {MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              aria-pressed={state.mode === mode.value}
              disabled={busy}
              onClick={() => state.mode !== mode.value && run(() => api.mode(mode.value), true)}
              className={`min-h-10 rounded-full px-2 text-[13px] leading-tight font-semibold transition-colors disabled:opacity-60 sm:text-sm ${
                state.mode === mode.value ? "bg-forest-800 text-cream" : "text-forest-800 hover:bg-forest-900/5"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Segmented
            label="Hazırlanma vaxtı"
            icon={<Clock className="size-4" aria-hidden />}
            options={TIMES}
            value={state.time_limit}
            disabled={busy}
            onChange={(value) => run(() => api.preference("time_limit", value))}
          />
          <Segmented
            label="Nəfər sayı"
            icon={<Users className="size-4" aria-hidden />}
            options={SERVINGS.map((n) => ({ value: n, label: `${n}` }))}
            value={state.servings}
            disabled={busy}
            onChange={(value) => run(() => api.preference("servings", value))}
          />
        </div>
      </div>

      <div className="mt-5">
        {thinking ? (
          <AiWaiting />
        ) : state.complete ? (
          GROUPS.map((group) => {
            const items = state.recipes.filter((r) => r.missing.length === group.missing);
            if (!items.length) return null;
            return (
              <section key={group.missing} className="mb-5" aria-label={group.label}>
                <h2 className="mb-2 flex items-center gap-2 font-sans text-xs font-semibold tracking-wide text-muted uppercase">
                  <span className={`size-2 rounded-full ${group.missing ? "bg-orange-500" : "bg-forest-600"}`} aria-hidden />
                  {group.label}
                </h2>
                <ul className="space-y-2">
                  {items.map((recipe) => (
                    <li key={recipe.index}>
                      <Link
                        href={`/app/recipes/${recipeSlug({ mode: state.mode, page: state.page, index: recipe.index })}`}
                        className={`group flex items-center gap-3 rounded-2xl border border-l-4 border-forest-900/15 bg-white px-4 py-3.5 shadow-card transition-colors hover:border-forest-900/40 ${
                          group.missing ? "border-l-orange-500" : "border-l-forest-600"
                        }`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-[17px] leading-snug font-semibold text-forest-900">{recipe.name}</span>
                          <span className="mt-1 block text-sm text-muted">{recipe.method}</span>
                          {recipe.missing.length > 0 && (
                            <span className="mt-2 flex flex-wrap gap-1.5">
                              {recipe.missing.map((item) => (
                                <span key={item} className="rounded-full bg-beige px-2 py-0.5 text-xs font-semibold text-orange-ink">
                                  + {item}
                                </span>
                              ))}
                            </span>
                          )}
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-forest-800">
                            <Clock className="size-3.5" aria-hidden />
                            {recipe.minutes} dəq
                          </span>
                          <ChevronRight className="size-5 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </span>
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

      {!thinking && (
        <>
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
                {state.page + 1} / {state.pages}
              </span>
              <Button variant="ghost" disabled={busy || state.page >= state.pages - 1} onClick={() => run(() => api.page(1))}>
                Növbəti 5
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </nav>
          )}

          <div className="mt-4 text-center">
            <Button variant="ghost" disabled={busy} onClick={() => run(api.search, true)}>
              Yeni axtarış
            </Button>
          </div>
        </>
      )}
    </>
  );
}
