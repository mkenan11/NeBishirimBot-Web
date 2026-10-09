"use client";

import { Check } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TourItem = { id: string; tab: string; title: string; points: string[]; visual: ReactNode };

/** Əlçatan tab-lar: ox düymələri ilə keçid, bütün panellər serverdə render olunur. */
export function ProductTourTabs({ items }: { items: TourItem[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Məhsul turu"
        onKeyDown={onKeyDown}
        className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0"
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tour-tab-${item.id}`}
            aria-selected={active === i}
            aria-controls={`tour-panel-${item.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`min-h-11 shrink-0 rounded-full border px-5 text-[15px] font-semibold transition-colors ${
              active === i
                ? "border-forest-800 bg-forest-800 text-cream"
                : "border-forest-900/15 bg-white text-forest-800 hover:border-forest-900/40"
            }`}
          >
            {item.tab}
          </button>
        ))}
      </div>

      {items.map((item, i) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`tour-panel-${item.id}`}
          aria-labelledby={`tour-tab-${item.id}`}
          hidden={active !== i}
          className="mt-10 grid items-center gap-10 md:grid-cols-2 md:gap-16"
        >
          <div className="md:order-2">{item.visual}</div>
          <div className="md:order-1">
            <h3 className="text-[1.9rem] leading-tight font-semibold text-forest-900 sm:text-4xl">{item.title}</h3>
            <ul className="mt-6 space-y-4">
              {item.points.map((point) => (
                <li key={point} className="flex gap-3 text-lg leading-relaxed text-ink">
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-sage text-forest-800">
                    <Check className="size-4" aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
}
