import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LeafShape } from "../icons";

/** App ekranının kompakt yaşıl başlığı: brend rəngi var, amma əsas işi aşağı itələmir. */
export function ScreenTitle({
  title,
  subtitle,
  aside,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Sağ tərəfdə kiçik göstərici (məs. ərzaq sayı). */
  aside?: ReactNode;
}) {
  return (
    <div className="relative mb-5 overflow-hidden rounded-3xl bg-forest-800 px-5 py-4 text-cream shadow-card sm:px-6 sm:py-5">
      <LeafShape aria-hidden className="absolute -right-4 -bottom-7 size-24 text-forest-700" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[1.6rem] leading-tight font-semibold text-cream sm:text-[1.9rem]">{title}</h1>
          {subtitle && <div className="mt-1 text-sm leading-relaxed text-cream/80">{subtitle}</div>}
        </div>
        {aside}
      </div>
    </div>
  );
}

/** Başlıqdakı kiçik say göstəricisi. */
export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="shrink-0 rounded-2xl bg-cream/10 px-3.5 py-1.5 text-center ring-1 ring-cream/15">
      <div className="font-display text-xl leading-none font-semibold text-cream">{value}</div>
      <div className="mt-0.5 text-[11px] text-cream/75">{label}</div>
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  busy?: boolean;
};

const variants = {
  primary: "bg-forest-800 text-cream hover:bg-forest-700 disabled:bg-forest-800/50",
  secondary: "border border-forest-800/25 text-forest-800 hover:border-forest-800/60 hover:bg-forest-800/5 disabled:opacity-50",
  ghost: "text-forest-800 hover:bg-forest-900/5 disabled:opacity-50",
  danger: "text-[#a3261a] hover:bg-[#a3261a]/8 disabled:opacity-50",
};

export function Button({ variant = "primary", busy, className = "", children, disabled, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || busy}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  const styles = {
    info: "bg-sage text-forest-900",
    success: "bg-sage text-forest-900",
    error: "bg-[#fbe3dc] text-[#7a2114]",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${styles[tone]}`}>
      {children}
    </div>
  );
}
