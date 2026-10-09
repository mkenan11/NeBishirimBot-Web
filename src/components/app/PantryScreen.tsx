"use client";

import Link from "next/link";
import { Camera, Check, Pencil, Trash2, UtensilsCrossed, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { api, ApiError, type PantryItem, type TextResult } from "@/lib/api";
import { Button, Notice, ScreenTitle } from "./ui";

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
  const [items, setItems] = useState<PantryItem[] | null>(null);
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
      .then((data) => setItems(data.items))
      .catch((error: ApiError) => {
        setItems([]);
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
    setItems(result.items);
    setText("");
    const lines = summarize(result);
    if (result.unknown.length) {
      setPending({ names: result.unknown, selected: new Set(result.unknown) });
    } else if (!lines.length) {
      lines.push("Ərzaq müəyyən edə bilmədim. Məsələn: Kartof, yumurta, soğan");
    }
    setMessage(lines.length ? { tone: result.added.length ? "success" : "info", lines } : null);
  }

  async function confirmPending() {
    if (!pending) return;
    const names = pending.names.filter((name) => pending.selected.has(name));
    if (names.length) {
      const result = await run("confirm", () => api.addNames(names));
      if (!result) return;
      setItems(result.items);
      setMessage({ tone: "success", lines: [`Əlavə olundu: ${names.join(", ")}`] });
    }
    setPending(null);
  }

  async function saveRename(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const result = await run(`rename-${editing.id}`, () => api.rename(editing.id, editing.name));
    if (!result) return;
    setItems(result.items);
    setEditing(null);
    setMessage(null);
  }

  async function remove(item: PantryItem) {
    const result = await run(`remove-${item.id}`, () => api.remove(item.id));
    if (!result) return;
    setItems(result.items);
    setUndo(`«${item.name}» silindi.`);
    setMessage(null);
  }

  async function clearAll() {
    const result = await run("clear", () => api.clear());
    setConfirmClear(false);
    if (!result) return;
    setItems(result.items);
    setUndo(`${result.removed} ərzaq silindi.`);
  }

  async function restore() {
    const result = await run("undo", () => api.undo());
    setUndo(null);
    if (result) setItems(result.items);
  }

  const count = items?.length ?? 0;

  return (
    <>
      <ScreenTitle
        title="Ərzaqlarım"
        subtitle="Evdə olanları yaz — sonra «Nə bişirim?» ilə uyğun reseptləri tap."
      />

      <form onSubmit={addText} className="rounded-3xl bg-white p-4 ring-1 ring-forest-900/10 sm:p-5">
        <label htmlFor="ingredients" className="text-sm font-semibold text-forest-900">
          Ərzaq əlavə et
        </label>
        <textarea
          id="ingredients"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={2}
          maxLength={1500}
          placeholder="Kartof, yumurta, soğan"
          className="mt-2 w-full resize-none rounded-2xl bg-cream px-4 py-3 text-[16px] text-ink ring-1 ring-forest-900/10 outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-forest-700"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="submit" busy={busy === "add"} disabled={!text.trim()}>
            Əlavə et
          </Button>
          <Link
            href="/app/photo"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-forest-800 hover:bg-forest-900/5"
          >
            <Camera className="size-4" aria-hidden />
            Şəkildən əlavə et
          </Link>
        </div>
        <p className="mt-2 text-xs text-muted">Vergül və ya yeni sətirlə ayır. Bir dəfəyə ən çox 30 ərzaq.</p>
      </form>

      <div className="mt-4 space-y-3" aria-live="polite">
        {message && (
          <Notice tone={message.tone}>
            {message.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </Notice>
        )}

        {pending && (
          <div className="rounded-3xl bg-beige p-4 sm:p-5">
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
                        checked ? "bg-forest-800 text-cream" : "bg-cream text-muted line-through ring-1 ring-forest-900/15"
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

      <section aria-labelledby="pantry-list" className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 id="pantry-list" className="font-sans text-lg font-semibold tracking-normal text-forest-900">
            Siyahı {items && <span className="font-normal text-muted">({count})</span>}
          </h2>
          {count > 0 &&
            (confirmClear ? (
              <span className="flex items-center gap-1">
                <Button variant="danger" className="min-h-9! px-3! text-sm!" onClick={clearAll} busy={busy === "clear"}>
                  Bəli, hamısını sil
                </Button>
                <Button variant="ghost" className="min-h-9! px-3! text-sm!" onClick={() => setConfirmClear(false)}>
                  Ləğv et
                </Button>
              </span>
            ) : (
              <Button variant="ghost" className="min-h-9! px-3! text-sm!" onClick={() => setConfirmClear(true)}>
                Hamısını sil
              </Button>
            ))}
        </div>

        {items === null ? (
          <ul className="mt-3 space-y-2" aria-hidden>
            {[0, 1, 2].map((n) => (
              <li key={n} className="h-12 animate-pulse rounded-2xl bg-forest-900/5" />
            ))}
          </ul>
        ) : count === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-forest-900/20 px-4 py-6 text-center text-muted">
            Siyahın boşdur. Yuxarıda ərzaqlarını yaz və ya şəklini göndər.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-forest-900/8 rounded-3xl bg-white ring-1 ring-forest-900/10">
            {items.map((item) => (
              <li key={item.id} className="flex min-h-14 items-center gap-2 px-4 py-1.5">
                {editing?.id === item.id ? (
                  <form onSubmit={saveRename} className="flex flex-1 items-center gap-1">
                    <label htmlFor={`rename-${item.id}`} className="sr-only">
                      {item.name} üçün yeni ad
                    </label>
                    <input
                      id={`rename-${item.id}`}
                      autoFocus
                      value={editing.name}
                      maxLength={50}
                      onChange={(event) => setEditing({ id: item.id, name: event.target.value })}
                      className="min-h-10 flex-1 rounded-xl bg-cream px-3 text-[16px] ring-1 ring-forest-900/15 outline-none focus:ring-2 focus:ring-forest-700"
                    />
                    <button
                      type="submit"
                      aria-label="Yadda saxla"
                      disabled={busy === `rename-${item.id}`}
                      className="grid size-10 place-items-center rounded-full text-forest-800 hover:bg-forest-900/5"
                    >
                      <Check className="size-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label="Ləğv et"
                      onClick={() => setEditing(null)}
                      className="grid size-10 place-items-center rounded-full text-muted hover:bg-forest-900/5"
                    >
                      <X className="size-5" aria-hidden />
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="flex-1 text-[16px] text-ink">{item.name}</span>
                    <button
                      type="button"
                      aria-label={`${item.name} — adını dəyiş`}
                      onClick={() => setEditing({ id: item.id, name: item.name })}
                      className="grid size-10 place-items-center rounded-full text-muted hover:bg-forest-900/5 hover:text-forest-900"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`${item.name} — sil`}
                      onClick={() => remove(item)}
                      disabled={busy === `remove-${item.id}`}
                      className="grid size-10 place-items-center rounded-full text-muted hover:bg-[#a3261a]/8 hover:text-[#a3261a]"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {count > 0 && (
        <div className="sticky bottom-24 mt-6 md:bottom-6">
          <Link
            href="/app/recipes?start=1"
            className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-forest-800 font-semibold text-cream shadow-lg shadow-forest-950/20 hover:bg-forest-700"
          >
            <UtensilsCrossed className="size-5" aria-hidden />
            Nə bişirim?
          </Link>
        </div>
      )}
    </>
  );
}
