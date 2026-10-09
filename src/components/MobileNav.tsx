"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { nav, site } from "@/content/site";
import { GitHubIcon, TelegramIcon } from "./icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Menyunu bağla" : "Menyunu aç"}
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full text-forest-900 hover:bg-forest-900/5"
      >
        {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
      </button>

      <nav
        id={panelId}
        aria-label="Mobil menyu"
        hidden={!open}
        className="absolute inset-x-0 top-16 border-b border-forest-900/10 bg-cream px-4 pt-2 pb-6 shadow-lg shadow-forest-950/5"
      >
        <ul className="flex flex-col text-lg text-forest-900">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={close} className="block border-b border-forest-900/8 py-3.5">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex items-center gap-2 py-3.5"
            >
              <GitHubIcon className="size-5" />
              GitHub
            </a>
          </li>
        </ul>
        <Link
          href="/app"
          onClick={close}
          className="mt-3 flex min-h-12 items-center justify-center rounded-full bg-forest-800 font-semibold text-cream"
        >
          İndi sına
        </Link>
        <a
          href={site.links.telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
          className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full border border-forest-800/25 font-semibold text-forest-800"
        >
          <TelegramIcon className="size-4" />
          Telegram-da aç
        </a>
      </nav>
    </div>
  );
}
