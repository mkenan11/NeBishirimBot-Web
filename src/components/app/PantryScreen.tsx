"use client";

import Link from "next/link";
import { ArrowUp, Camera, Check, UtensilsCrossed, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { api, ApiError, type Pantry, type PantryItem, type TextResult } from "@/lib/api";
import { QuickAdd } from "./QuickAdd";
import { Button, Notice, ScreenTitle, Stat } from "./ui";

type Message = { tone: "info" | "error" | "success"; lines: string[] };

function summarize(result: TextResult): string[] {
  const lines: string[] = [];
  if (result.added.length) lines.push(`Əlavə olundu: ${result.added.join(", ")}`);
  if (result.existing.length) lines.push(`Artıq siyahındadır: ${result.existing.join(", ")}`);
  if (result.corrected.length) lines.push(`Yazılışı düzəldildi: ${result.corrected.join(", ")}`);
  if (result.skipped.length) lines.push(`Mövcud olmayanlar əlavə edilmədi: ${result.skipped.join(", ")}`);
  if (result.invalid.length) lines.push(`Anlamadım, əlavə etmədim: ${result.invalid.join(", ")}`);
  return lines;
}

export function PantryScreen() {
  const [pantry, setPantry] = useState<Pantry | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [pending, setPending] = useState<{ names: string[]; selected: Set<string> } | null>(null);
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);
  const [undo, setUndo] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    api
      .pantry()
      .then(setPantry)
      .catch((error: ApiError) => {
        setPantry({ items: [] });
        setMessage({ tone: "error", lines: [error.message] });
      });
  }, []);

  async function run<T>(key: string, task: () => Promise<T>): Promise<T | undefined> {
    setBusy(key);
    try {
      return await task();
    } catch (error) {
      setMessage({ tone: "error", lines: [(error as ApiError).message] });
    } finally {
      setBusy(null);
    }
  }

  async function addText(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setUndo(null);
    const result = await run("add", () => api.addText(text));
    if (!result) return;
    setPantry(result);
    setText("");
    const lines = summarize(result);
    if (result.unknown.length) {
      setPending({ names: result.unknown, selected: new Set(result.unknown) });
    } else if (!lines.length) {
      lines.push("Ərzaq müəyyən edə bilmədim. Məsələn: Kartof, yumurta, soğan");
    }
    setMessage(lines.length ? { tone: result.added.length ? "success" : "info", lines } : null);
  }

  async function quickAdd(name: string) {
    setUndo(null);
    const result = await run(`quick-${name}`, () => api.addNames([name]));
    if (!result) return;
    setPantry(result);
    setMessage(null);
  }

  async function confirmPending() {
    if (!pending) return;
    const names = pending.names.filter((name) => pending.selected.has(name));
    if (names.length) {
      const result = await run("confirm", () => api.addNames(names));
      if (!result) return;
      setPantry(result);
      setMessage({ tone: "success", lines: [`Əlavə olundu: ${names.join(", ")}`] });
    }
    setPending(null);
  }

  async function saveRename(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const result = await run(`rename-${editing.id}`, () => api.rename(editing.id, editing.name));
    if (!result) return;
    setPantry(result);
    setEditing(null);
    setMessage(null);
  }

  async function remove(item: PantryItem) {
    const result = await run(`remove-${item.id}`, () => api.remove(item.id));
    if (!result) return;
    setPantry(result);
    setUndo(`«${item.name}» silindi.`);
    setMessage(null);
  }

  async function clearAll() {
    const result = await run("clear", () => api.clear());
    setConfirmClear(false);
    if (!result) return;
    setPantry(result);
    setUndo(`${result.removed} ərzaq silindi.`);
  }

  async function restore() {
    const result = await run("undo", () => api.undo());
    setUndo(null);
    if (result) setPantry(result);
  }

  const items = pantry?.items ?? null;
  const count = items?.length ?? 0;

  return (
    <>
      <ScreenTitle
        title="Ərzaqlarım"
        subtitle="Evdə olanları əlavə et, sonra resept tap."
        aside={items && <Stat value={count} label="ərzaq" />}
      />

      {/* Telegram-dakı kimi tək giriş sətri: yaz, Enter bas və ya şəkil çək. */}
      <form
        onSubmit={addText}
        className="flex items-center gap-1.5 rounded-full border border-forest-900/20 bg-white p-1.5 pl-4 shadow-card focus-within:border-forest-700 focus-within:ring-2 focus-within:ring-forest-700/20"
      >
        <label htmlFor="ingredients" className="sr-only">
          Ərzaq əlavə et
        </label>
        <input
          id="ingredients"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={1500}
          enterKeyHint="send"
          autoComplete="off"
          placeholder="Kartof, yumurta, soğan…"
          className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-ink outline-none placeholder:text-muted/70"
        />
        <Link
          href="/app/photo"
          aria-label="Şəkildən əlavə et"
          title="Şəkildən əlavə et"
          className="grid size-10 shrink-0 place-items-center rounded-full text-forest-800 hover:bg-forest-900/5"
        >
          <Camera className="size-5" aria-hidden />
        </Link>
        <button
          type="submit"
          aria-label="Əlavə et"
          disabled={!text.trim() || busy === "add"}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-800 text-cream transition-colors hover:bg-forest-700 disabled:bg-forest-800/35"
        >
          <ArrowUp className="size-5" aria-hidden />
        </button>
      </form>
      <p className="mt-2 px-4 text-xs text-muted">Vergüllə ayır — hərf səhvlərini özümüz düzəldirik.</p>

      {pantry && <QuickAdd pantry={pantry} busy={busy} onAdd={quickAdd} />}

      <div className="mt-4 space-y-3 empty:hidden" aria-live="polite">
        {message && (
          <Notice tone={message.tone}>
            {message.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </Notice>
        )}

        {pending && (
          <div className="rounded-3xl border border-forest-900/15 bg-beige p-4 sm:p-5">
            <p className="font-semibold text-forest-900">Bu adları tanımadım. Yenə də əlavə edilsin?</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {pending.names.map((name) => {
                const checked = pending.selected.has(name);
                return (
                  <li key={name}>
                    <button
                      type="button"
                      aria-pressed={checked}
                      onClick={() => {
                        const selected = new Set(pending.selected);
                        if (checked) selected.delete(name);
                        else selected.add(name);
                        setPending({ ...pending, selected });
                      }}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium ${
                        checked ? "bg-forest-800 text-cream" : "border border-forest-900/20 bg-cream text-muted line-through"
                      }`}
                    >
                      {checked && <Check className="size-4" aria-hidden />}
                      {name}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button onClick={confirmPending} busy={busy === "confirm"}>
                Seçilənləri əlavə et
              </Button>
              <Button variant="ghost" onClick={() => setPending(null)}>
                Keç
              </Button>
            </div>
          </div>
        )}

        {undo && (
          <div role="status" className="flex items-center justify-between gap-3 rounded-2xl bg-forest-900 px-4 py-2.5 text-cream">
            <span className="text-[15px]">{undo}</span>
            <button
              type="button"
              onClick={restore}
              disabled={busy === "undo"}
              className="min-h-10 rounded-full px-3 font-semibold text-orange-500 hover:bg-cream/10"
            >
              Geri qaytar
            </button>
          </div>
        )}
      </div>

      <section aria-labelledby="pantry-list" className="mt-7">
        <div className="flex min-h-9 items-center justify-between">
          <h2 id="pantry-list" className="font-sans text-sm font-semibold tracking-normal text-forest-900">
            Siyahım
          </h2>
          {count > 0 &&
            (confirmClear ? (
              <span className="flex items-center gap-1">
                <Button variant="danger" className="min-h-9! px-3! text-sm!" onClick={clearAll} busy={busy === "clear"}>
                  Hamısını sil
                </Button>
                <Button variant="ghost" className="min-h-9! px-3! text-sm!" onClick={() => setConfirmClear(false)}>
                  Ləğv et
                </Button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="min-h-9 rounded-full px-3 text-sm font-medium text-muted hover:text-[#a3261a]"
              >
                Hamısını sil
              </button>
            ))}
        </div>

        {items === null ? (
          <div className="mt-2 flex flex-wrap gap-2" aria-hidden>
            {[72, 96, 64, 88, 80].map((w) => (
              <span key={w} className="h-10 animate-pulse rounded-full bg-forest-900/8" style={{ width: w }} />
            ))}
          </div>
        ) : count === 0 ? (
          <p className="mt-2 rounded-3xl border-2 border-dashed border-forest-900/25 bg-white/60 px-4 py-8 text-center text-muted">
            Siyahın boşdur. Yaz, şəkil çək və ya «Tez əlavə et»-dən seç.
          </p>
        ) : (
          <>
            <ul className="mt-2 flex flex-wrap gap-2">
              {items.map((item) =>
                editing?.id === item.id ? (
                  <li key={item.id}>
                    <form
                      onSubmit={saveRename}
                      className="inline-flex items-center gap-0.5 rounded-full border-2 border-forest-700 bg-white py-0.5 pr-0.5 pl-3"
                    >
                      <label htmlFor={`rename-${item.id}`} className="sr-only">
                        {item.name} üçün yeni ad
                      </label>
                      <input
                        id={`rename-${item.id}`}
                        autoFocus
                        value={editing.name}
                        maxLength={50}
                        size={Math.max(6, editing.name.length)}
                        onChange={(event) => setEditing({ id: item.id, name: event.target.value })}
                        onKeyDown={(event) => event.key === "Escape" && setEditing(null)}
                        className="bg-transparent text-[16px] outline-none"
                      />
                      <button
                        type="submit"
                        aria-label="Yadda saxla"
                        disabled={busy === `rename-${item.id}`}
                        className="grid size-8 place-items-center rounded-full bg-forest-800 text-cream"
                      >
                        <Check className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label="Ləğv et"
                        onClick={() => setEditing(null)}
                        className="grid size-8 place-items-center rounded-full text-muted hover:bg-forest-900/5"
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    </form>
                  </li>
                ) : (
                  <li
                    key={item.id}
                    className="inline-flex items-center rounded-full border border-forest-900/15 bg-white shadow-card"
                  >
                    <button
                      type="button"
                      title="Adını dəyiş"
                      aria-label={`${item.name} — adını dəyiş`}
                      onClick={() => setEditing({ id: item.id, name: item.name })}
                      className="min-h-10 rounded-l-full py-1.5 pr-1 pl-3.5 text-[15px] text-ink hover:text-forest-700"
                    >
                      {item.name}
                    </button>
                    <button
                      type="button"
                      aria-label={`${item.name} — sil`}
                      onClick={() => remove(item)}
                      disabled={busy === `remove-${item.id}`}
                      className="grid size-9 place-items-center rounded-full text-muted hover:bg-[#a3261a]/8 hover:text-[#a3261a]"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </li>
                ),
              )}
            </ul>
            <p className="mt-3 text-xs text-muted">Adı dəyişmək üçün ərzağa toxun.</p>
          </>
        )}
      </section>

      {count > 0 && (
        <div className="sticky bottom-24 mt-8 md:bottom-6">
          <Link
            href="/app/recipes?start=1"
            className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-orange-500 font-semibold text-forest-950 shadow-lg shadow-forest-950/25 transition-colors hover:bg-orange-600"
          >
            <UtensilsCrossed className="size-5" aria-hidden />
            Nə bişirim?
            <span className="rounded-full bg-forest-950/10 px-2 py-0.5 text-sm">{count} ərzaq</span>
          </Link>
        </div>
      )}
    </>
  );
}
