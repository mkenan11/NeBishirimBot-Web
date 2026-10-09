"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api, ApiError, type DetailResponse } from "@/lib/api";
import { RecipeView } from "./RecipeView";
import { Button, Notice } from "./ui";

export function FavoriteDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<DetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!/^\d{1,18}$/.test(id)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- etibarsız URL
      setError("Resept tapılmadı.");
      return;
    }
    api
      .favorite(Number(id))
      .then(setData)
      .catch((e: ApiError) => setError(e.message));
  }, [id]);

  async function remove() {
    setBusy(true);
    try {
      await api.removeFavorite(Number(id));
      router.push("/app/favorites");
    } catch (e) {
      setError((e as ApiError).message);
      setBusy(false);
    }
  }

  return (
    <>
      <Link
        href="/app/favorites"
        className="mb-4 inline-flex min-h-10 items-center gap-1 rounded-full pr-3 text-[15px] font-medium text-forest-800 hover:underline"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Seçilmişlər
      </Link>

      {error && <Notice tone="error">{error}</Notice>}
      {!data && !error && <div className="h-64 animate-pulse rounded-3xl bg-forest-900/5" aria-hidden />}

      {data && (
        <RecipeView
          recipe={data.recipe}
          actions={
            confirm ? (
              <>
                <Button variant="danger" onClick={remove} busy={busy}>
                  Bəli, seçilmişlərdən sil
                </Button>
                <Button variant="ghost" onClick={() => setConfirm(false)}>
                  Ləğv et
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => setConfirm(true)}>
                <Trash2 className="size-4" aria-hidden />
                Seçilmişlərdən sil
              </Button>
            )
          }
        />
      )}
    </>
  );
}
