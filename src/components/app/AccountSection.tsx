"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button, Notice } from "./ui";

export function AccountSection() {
  const [step, setStep] = useState<"idle" | "confirm" | "done">("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setBusy(true);
    try {
      await api.deleteAccount();
      setStep("done");
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="account-title" className="mt-14 border-t border-forest-900/10 pt-6 text-sm text-muted">
      <h2 id="account-title" className="font-sans text-sm font-semibold tracking-normal text-forest-900">
        Məlumatların
      </h2>
      <p className="mt-1.5 leading-relaxed">
        Qeydiyyat yoxdur: siyahın bu brauzerə bağlıdır. Cookie-ləri silsən və ya başqa cihazdan girsən, siyahı
        görünməyəcək. Ətraflı:{" "}
        <Link href="/privacy" className="font-medium text-forest-800 underline underline-offset-4">
          Məxfilik siyasəti
        </Link>
        .
      </p>

      {step === "done" ? (
        <div className="mt-3">
          <Notice tone="success">
            Məlumatların silindi.{" "}
            <button type="button" className="font-semibold underline" onClick={() => window.location.reload()}>
              Yenidən başla
            </button>
          </Notice>
        </div>
      ) : step === "confirm" ? (
        <div className="mt-3 rounded-2xl bg-beige p-4">
          <p className="text-forest-900">
            Ərzaqların, seçilmiş reseptlərin və axtarış tarixçən silinsin? Bunu geri qaytarmaq olmur.
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="danger" onClick={remove} busy={busy}>
              Bəli, hamısını sil
            </Button>
            <Button variant="ghost" onClick={() => setStep("idle")}>
              Ləğv et
            </Button>
          </div>
          {error && <p className="mt-2 text-[#7a2114]">{error}</p>}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setStep("confirm")}
          className="mt-2 font-medium text-[#a3261a] underline-offset-4 hover:underline"
        >
          Bütün məlumatlarımı sil
        </button>
      )}
    </section>
  );
}
