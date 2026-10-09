"use client";

import { Check, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type WakeLockSentinelLike = { release: () => Promise<void> };

/**
 * Bişirmə rejimi: addımlar toxunanda işarələnir; dəstəklənən brauzerdə ekran sönmür
 * (Screen Wake Lock API). Mətbəxdə əl yaşıl olanda belə rahat oxunsun deyə böyük toxunma sahəsi.
 */
export function CookingSteps({ steps }: { steps: string[] }) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [awake, setAwake] = useState(false);
  const [supported, setSupported] = useState(false);
  const lock = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- brauzer imkanı yalnız client-də məlumdur
    setSupported("wakeLock" in navigator);
    return () => void lock.current?.release();
  }, []);

  async function toggleAwake() {
    if (lock.current) {
      await lock.current.release();
      lock.current = null;
      setAwake(false);
      return;
    }
    try {
      const nav = navigator as Navigator & { wakeLock: { request: (type: "screen") => Promise<WakeLockSentinelLike> } };
      lock.current = await nav.wakeLock.request("screen");
      setAwake(true);
    } catch {
      setAwake(false);
    }
  }

  const toggle = (i: number) =>
    setDone((current) => {
      const next = new Set(current);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section aria-labelledby="steps-title" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="steps-title" className="text-xl font-semibold text-forest-900">
            Hazırlanması
          </h2>
          <p className="mt-1 text-sm text-muted">
            {done.size}/{steps.length} addım · bitirdiyin addıma toxun
          </p>
        </div>
        {supported && (
          <button
            type="button"
            aria-pressed={awake}
            onClick={toggleAwake}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors ${
              awake ? "border-forest-800 bg-forest-800 text-cream" : "border-forest-900/20 bg-white text-forest-800"
            }`}
          >
            <Sun className="size-4" aria-hidden />
            Ekran sönməsin
          </button>
        )}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-forest-900/10" aria-hidden>
        <div
          className="h-full rounded-full bg-forest-600 transition-[width] duration-300"
          style={{ width: `${(done.size / Math.max(steps.length, 1)) * 100}%` }}
        />
      </div>

      <ol className="mt-4 space-y-2">
        {steps.map((step, i) => {
          const finished = done.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={finished}
                onClick={() => toggle(i)}
                className={`flex w-full gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                  finished
                    ? "border-forest-900/10 bg-sage/60"
                    : "border-forest-900/15 bg-white shadow-card hover:border-forest-900/40"
                }`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                    finished ? "bg-forest-600 text-cream" : "bg-forest-800 text-cream"
                  }`}
                >
                  {finished ? <Check className="size-4" aria-hidden /> : i + 1}
                </span>
                <span className={`pt-0.5 text-[16px] leading-relaxed ${finished ? "text-muted line-through" : "text-ink"}`}>
                  {step}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {steps.length > 0 && done.size === steps.length && (
        <p className="mt-4 rounded-2xl bg-forest-800 px-4 py-3 text-center font-semibold text-cream">Nuş olsun! 🍽️</p>
      )}
    </section>
  );
}
