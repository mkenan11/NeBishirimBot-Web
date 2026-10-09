import type { ReactNode } from "react";

type Tone = "cream" | "sage" | "beige";

const tones: Record<Tone, string> = {
  cream: "bg-cream",
  sage: "bg-sage",
  beige: "bg-beige",
};

type SectionProps = {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
};

export function Section({ id, tone = "cream", className = "", children, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} relative overflow-hidden ${className}`}>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">{children}</div>
    </section>
  );
}

type HeadingProps = {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({ id, eyebrow, title, intro, align = "left" }: HeadingProps) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold tracking-wide text-orange-ink uppercase">{eyebrow}</p>
      )}
      <h2 id={id} className="text-[2rem] leading-[1.1] font-semibold text-forest-900 sm:text-[2.6rem]">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
