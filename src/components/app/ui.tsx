import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-[1.9rem] leading-tight font-semibold text-forest-900">{title}</h1>
      {subtitle && <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
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

/** AI cavabı gözlənərkən: animasiya prefers-reduced-motion-da dayanır (globals.css). */
export function Thinking({ label }: { label: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 rounded-3xl bg-sage px-6 py-10 text-center">
      <LoaderCircle className="size-8 animate-spin text-forest-700" aria-hidden />
      <p className="font-medium text-forest-900">{label}</p>
      <p className="text-sm text-muted">Bu, adətən 5–20 saniyə çəkir.</p>
    </div>
  );
}

export function Chip({
  active,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`min-h-10 rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-50 ${
        active ? "bg-forest-800 text-cream" : "bg-white text-forest-800 ring-1 ring-forest-900/12 hover:ring-forest-900/30"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
