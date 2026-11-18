import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
        {eyebrow}
      </p>
      <h2
        className={`mb-6 font-heading text-[clamp(2.4rem,5.5vw,5rem)] font-black leading-[0.98] tracking-[-0.035em] ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-[560px] text-base leading-[1.7] ${dark ? "text-white/45" : "text-muted"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
