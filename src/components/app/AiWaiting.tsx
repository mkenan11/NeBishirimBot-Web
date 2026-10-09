"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = {
  search: ["Ərzaqların yoxlanılır…", "Uyğun yeməklər seçilir…", "Çatışmayan ərzaqlar hesablanır…", "Az qaldı…"],
  recipe: ["Resept hazırlanır…", "Miqdarlar hesablanır…", "Addımlar yazılır…", "Az qaldı…"],
  photo: ["Şəkil analiz edilir…", "Ərzaqlar tanınır…", "Az qaldı…"],
};

/**
 * AI cavabını gözləyərkən (5–20 san): skeleton kartlar və mərhələli mesajlar.
 * Mesajlar gözləməni hiss olunan dərəcədə qısaldır; animasiya prefers-reduced-motion-da dayanır.
 */
export function AiWaiting({ kind = "search", cards = 3 }: { kind?: keyof typeof STEPS; cards?: number }) {
  const steps = STEPS[kind];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 3500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <p className="flex items-center gap-2 rounded-2xl bg-sage px-4 py-3 font-medium text-forest-900">
        <Sparkles className="size-4 shrink-0 animate-pulse text-orange-ink" aria-hidden />
        {steps[step]}
        <span className="ml-auto text-xs font-normal text-muted">5–20 san</span>
      </p>
      {Array.from({ length: cards }, (_, i) => (
        <div
          key={i}
          aria-hidden
          className="rounded-2xl border border-l-4 border-forest-900/10 border-l-forest-900/15 bg-white px-4 py-4 shadow-card"
        >
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-forest-900/10" />
          <div className="mt-2.5 h-3 w-1/3 animate-pulse rounded-full bg-forest-900/8" />
        </div>
      ))}
    </div>
  );
}
