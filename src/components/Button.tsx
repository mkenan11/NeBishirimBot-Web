import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "onDark" | "onDarkOutline";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold whitespace-nowrap transition-colors duration-150";

const variants: Record<Variant, string> = {
  primary: "bg-forest-800 text-cream hover:bg-forest-700",
  secondary: "border border-forest-800/25 bg-transparent text-forest-800 hover:border-forest-800/60 hover:bg-forest-800/5",
  onDark: "bg-cream text-forest-900 hover:bg-beige",
  onDarkOutline: "border border-cream/35 text-cream hover:border-cream/70 hover:bg-cream/5",
};

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function ButtonLink({ href, variant = "primary", children, className = "" }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
