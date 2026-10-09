"use client";

import Link from "next/link";
import { Camera, ImageUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { AiWaiting } from "./AiWaiting";
import { Button, Notice, ScreenTitle } from "./ui";

const MAX_SIDE = 1600;

/** Şəkli brauzerdə kiçildib JPEG edir: yükləmə sürətli olur və server limitinə sığır. */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("encode"))), "image/jpeg", 0.85),
  );
}

const STATUS_TEXT: Record<string, string> = {
  no_food: "Bu şəkildə ərzaq müəyyən edə bilmədim. Ərzaqların şəklini göndər.",
  unclear: "Şəkil kifayət qədər aydın deyil. Daha işıqlı və aydın foto göndər.",
  empty: "Şəkildə etibarlı ərzaq adı müəyyən edə bilmədim. Daha aydın foto göndər və ya ərzaqları mətnlə yaz.",
};

type Row = { name: string; selected: boolean };

export function PhotoScreen() {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "analyzing" | "review" | "saving" | "done">("idle");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function choose(file: File | undefined) {
    if (!file) return;
    setError(null);
    setResult(null);
    setRows([]);
    setPreview(URL.createObjectURL(file));
    setPhase("analyzing");
    try {
      const image = await shrink(file).catch(() => {
        throw new ApiError(0, "decode", "Bu şəkli aça bilmədim. JPG və ya PNG şəkil seç.");
      });
      const data = await api.photo(image);
      if (data.status !== "ok") {
        setError(STATUS_TEXT[data.status]);
        setPhase("idle");
        return;
      }
      setRows(data.names.map((name) => ({ name, selected: true })));
      setPhase("review");
    } catch (e) {
      setError((e as ApiError).message);
      setPhase("idle");
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  async function confirm() {
    const names = rows.filter((row) => row.selected && row.name.trim()).map((row) => row.name.trim());
    if (!names.length) {
      setError("Ən azı bir ərzaq seç.");
      return;
    }
    setPhase("saving");
    setError(null);
    try {
      const data = await api.addNames(names);
      const lines = [];
      if (data.added.length) lines.push(`Əlavə olundu: ${data.added.join(", ")}.`);
      if (data.existing.length) lines.push(`Artıq siyahında var: ${data.existing.join(", ")}.`);
      setResult(lines.join(" "));
      setPhase("done");
    } catch (e) {
      setError((e as ApiError).message);
      setPhase("review");
    }
  }

  return (
    <>
      <ScreenTitle
        title="Şəkildən tanıma"
        subtitle="Masadakı və ya soyuducudakı ərzaqların şəklini çək — tanınanları yoxla və təsdiqlə."
      />

      <input
        ref={input}
        id="photo-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(event) => choose(event.target.files?.[0])}
      />

      {phase === "idle" || phase === "done" ? (
        <label
          htmlFor="photo-input"
          className="flex cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-forest-900/35 bg-white shadow-card px-6 py-10 text-center transition-colors hover:border-forest-700 focus-within:border-forest-700"
        >
          <span className="grid size-14 place-items-center rounded-full bg-sage text-forest-800">
            <Camera className="size-7" aria-hidden />
          </span>
          <span className="text-lg font-semibold text-forest-900">
            {phase === "done" ? "Başqa şəkil göndər" : "Şəkil çək və ya seç"}
          </span>
          <span className="text-sm text-muted">Hər şəkil ayrıca yoxlanılır. Şəkil yalnız tanıma üçün istifadə olunur.</span>
        </label>
      ) : null}

      <div className="mt-4 space-y-4" aria-live="polite">
        {error && <Notice tone="error">{error}</Notice>}
        {result && (
          <Notice tone="success">
            {result}{" "}
            <Link href="/app" className="font-semibold underline underline-offset-4">
              Ərzaqlarıma bax
            </Link>
          </Notice>
        )}

        {preview && phase !== "idle" && phase !== "done" && (
          // eslint-disable-next-line @next/next/no-img-element -- yerli blob önizləməsi, optimizasiya lazım deyil
          <img src={preview} alt="Seçdiyin şəkil" className="max-h-64 w-full rounded-3xl object-cover" />
        )}

        {phase === "analyzing" && <AiWaiting kind="photo" cards={2} />}

        {(phase === "review" || phase === "saving") && (
          <div className="rounded-3xl border border-forest-900/15 bg-white p-4 shadow-card sm:p-5">
            <p className="font-semibold text-forest-900">Tanınan ərzaqlar</p>
            <p className="mt-1 text-sm text-muted">
              Lazım olmayanın işarəsini götür, adı səhvdirsə düzəlt. Sən təsdiqləməyincə heç nə əlavə olunmur.
            </p>
            <ul className="mt-4 space-y-2">
              {rows.map((row, i) => (
                <li key={i} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`photo-${i}`}
                    checked={row.selected}
                    onChange={() => setRows(rows.map((r, j) => (j === i ? { ...r, selected: !r.selected } : r)))}
                    className="size-5 shrink-0 accent-[#1d412e]"
                  />
                  <label htmlFor={`photo-name-${i}`} className="sr-only">
                    Ərzaq adı {i + 1}
                  </label>
                  <input
                    id={`photo-name-${i}`}
                    value={row.name}
                    maxLength={50}
                    onChange={(event) => setRows(rows.map((r, j) => (j === i ? { ...r, name: event.target.value } : r)))}
                    className={`min-h-11 flex-1 rounded-xl bg-cream px-3 text-[16px] border border-forest-900/25 outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-700/25 ${
                      row.selected ? "" : "text-muted line-through"
                    }`}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={confirm} busy={phase === "saving"}>
                Seçilənləri əlavə et
              </Button>
              <Button variant="ghost" onClick={() => input.current?.click()} disabled={phase === "saving"}>
                <ImageUp className="size-4" aria-hidden />
                Başqa şəkil
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
