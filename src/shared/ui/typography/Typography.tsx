import type { ComponentPropsWithoutRef, ElementType } from "react";

type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption"
  | "eyebrow";

type VariantTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface TypographyOwnProps<T extends ElementType> {
  as?: T;
  variant?: TypographyVariant;
  className?: string;
}

type TypographyProps<T extends ElementType> = TypographyOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TypographyOwnProps<T>>;

const variantStyles: Record<TypographyVariant, string> = {
  display:
    "font-heading text-[clamp(2.2rem,5.5vw,5.8rem)] font-black leading-[0.95] tracking-[-0.04em]",
  h1: "font-heading text-[clamp(2.4rem,5vw,4.5rem)] font-black leading-[0.98] tracking-[-0.035em]",
  h2: "font-heading text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.02] tracking-[-0.035em]",
  h3: "font-heading text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl",
  h4: "font-heading text-xl font-bold leading-tight",
  body: "font-sans text-base leading-[1.7]",
  "body-sm": "font-sans text-sm leading-[1.65]",
  caption: "font-sans text-xs leading-[1.5]",
  eyebrow: "font-sans text-[0.7rem] font-bold uppercase tracking-[0.18em]",
};

const defaultTags: Record<TypographyVariant, VariantTag> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
  eyebrow: "span",
};

export function Typography<T extends ElementType = "p">({
  as,
  variant = "body",
  className = "",
  ...props
}: TypographyProps<T>) {
  const Component = as ?? defaultTags[variant];

  return (
    <Component
      className={`${variantStyles[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
