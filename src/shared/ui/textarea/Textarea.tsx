import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";

type TextareaVariant = "light" | "dark";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  invalid?: boolean;
}

const variants: Record<TextareaVariant, string> = {
  light: "border-border bg-white text-ink placeholder:text-muted/70",
  dark: "border-white/30 bg-ink/40 text-white placeholder:text-white/45",
};

export function Textarea({
  variant = "light",
  invalid = false,
  className,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={clsx(
        "w-full min-w-0 resize-y rounded border-2 px-4 py-3.5 text-[15px]",
        "outline-none transition-colors duration-200",
        "focus:border-brand-green",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        invalid ? "border-red-500 focus:border-red-500" : "",
        className,
      )}
      {...props}
    />
  );
}
