"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api, ApiError, parseRecipeSlug, type DetailResponse } from "@/lib/api";
import { RecipeView } from "./RecipeView";
import { Button, Notice, Thinking } from "./ui";

type Phase =
  | { kind: "loading" }
  | { kind: "meat" }
  | { kind: "error"; message: string }
  | { kind: "ready"; data: DetailResponse };

export function RecipeDetailScreen() {
  const { slug } = useParams<{ slug: string }>();
  const target = parseRecipeSlug(slug);
  const [phase, setPhase] = useState<Phase>(target ? { kind: "loading" } : { kind: "error", message: "Resept tapılmadı." });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const open = useCallback(
    async (species?: "beef" | "lamb") => {
      if (!target) return;
      setPhase({ kind: "loading" });
      try {
        setPhase({ kind: "ready", data: await api.open(target, species) });
      } catch (e) {
        const error = e as ApiError;
        setPhase(error.code === "meat_choice" ? { kind: "meat" } : { kind: "error", message: error.message });
      }
    },
    // slug dəyişəndə yenidən açılır
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slug],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resept serverdən açılır
    void open();
  }, [open]);

  async function save() {
    if (!target || phase.kind !== "ready") return;
    setSaving(true);
    setSaveError(null);
    try {
      await api.save(target);
      setPhase({ kind: "ready", data: { ...phase.data, saved: true } });
    } catch (e) {
      setSaveError((e as ApiError).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link
        href="/app/recipes"
        className="mb-4 inline-flex min-h-10 items-center gap-1 rounded-full pr-3 text-[15px] font-medium text-forest-800 hover:underline"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Reseptlər
      </Link>

      {phase.kind === "loading" && <Thinking label="Ətraflı resept hazırlanır..." />}

      {phase.kind === "error" && (
        <Notice tone="error">
          {phase.message}{" "}
          <Link href="/app/recipes" className="font-semibold underline underline-offset-4">
            Siyahıya qayıt
          </Link>
        </Notice>
      )}

      {phase.kind === "meat" && <MeatChoice onChoose={open} />}

      {phase.kind === "ready" && (
        <RecipeView
          recipe={phase.data.recipe}
          actions={
            <>
              <Button onClick={save} busy={saving} disabled={phase.data.saved}>
                <Star className={`size-4 ${phase.data.saved ? "fill-current" : ""}`} aria-hidden />
                {phase.data.saved ? "Seçilmişlərdədir" : "Seçilmişlərə əlavə et"}
              </Button>
              {saveError && <p className="w-full text-sm text-[#7a2114]">{saveError}</p>}
            </>
          }
        />
      )}
    </>
  );
}

function MeatChoice({ onChoose }: { onChoose: (species: "beef" | "lamb") => void }) {
  const [unknown, setUnknown] = useState(false);

  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-forest-900/10">
      <p className="text-lg font-semibold text-forest-900">Siyahındakı «Ət» hansı növdür?</p>
      <p className="mt-1 text-[15px] text-muted">Resepti düzgün miqdar və vaxtla hazırlamaq üçün lazımdır.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onChoose("beef")}>Mal əti</Button>
        <Button onClick={() => onChoose("lamb")}>Qoyun əti</Button>
        <Button variant="ghost" onClick={() => setUnknown(true)}>
          Bilmirəm
        </Button>
      </div>
      {unknown && (
        <div className="mt-4">
          <Notice>
            Ətin növünü{" "}
            <Link href="/app" className="font-semibold underline underline-offset-4">
              Ərzaqlarım
            </Link>{" "}
            bölməsində dəqiqləşdir (məsələn, «Mal əti»), sonra yenidən axtar.
          </Notice>
        </div>
      )}
    </div>
  );
}
