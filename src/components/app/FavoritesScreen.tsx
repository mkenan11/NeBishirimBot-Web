"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { api, ApiError, type FavoriteItem } from "@/lib/api";
import { Button, Notice, ScreenTitle } from "./ui";

export function FavoritesScreen() {
  const [items, setItems] = useState<FavoriteItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(offset: number) {
    setBusy(true);
    try {
      const data = await api.favorites(offset);
      setItems((current) => (offset && current ? [...current, ...data.items] : data.items));
      setTotal(data.total);
    } catch (e) {
      setItems((current) => current ?? []);
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- siyahı serverdən oxunur
    void load(0);
  }, []);

  return (
    <>
      <ScreenTitle
        title="Seçilmiş reseptlər"
        subtitle={items && total ? `Cəmi: ${total} resept` : "Bəyəndiyin reseptlər burada saxlanılır."}
      />
      {error && <Notice tone="error">{error}</Notice>}

      {items === null ? (
        <div className="h-40 animate-pulse rounded-3xl bg-forest-900/5" aria-hidden />
      ) : items.length === 0 ? (
        <div className="rounded-3xl bg-sage px-6 py-8 text-center">
          <p className="font-semibold text-forest-900">Hələ seçilmiş reseptin yoxdur.</p>
          <p className="mt-1 text-[15px] text-muted">
            Resepti açanda «Seçilmişlərə əlavə et» düyməsi ilə saxlaya bilərsən.
          </p>
          <Link
            href="/app/recipes"
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-forest-800 px-5 font-semibold text-cream hover:bg-forest-700"
          >
            Resept tap
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/app/favorites/${item.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-forest-900/10 hover:ring-forest-900/30"
                >
                  <span className="flex-1">
                    <span className="block font-semibold text-forest-900">{item.name}</span>
                    <span className="mt-0.5 block text-sm text-muted">
                      təx. {item.total} dəq · {item.servings} nəfər
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          {items.length < total && (
            <div className="mt-4 text-center">
              <Button variant="secondary" busy={busy} onClick={() => load(items.length)}>
                Daha çox göstər
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
