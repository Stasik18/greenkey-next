import type { InputHTMLAttributes } from "react";

type InputVariant = "light" | "dark";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  invalid?: boolean;
}

const variants: Record<InputVariant, string> = {
  light: "border-border bg-white text-ink placeholder:text-muted/70",
  dark: "border-white/30 bg-ink/40 text-white placeholder:text-white/45",
};

export function Input({
  variant = "light",
  invalid = false,
  className = "",
  type = "text",
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={invalid || undefined}
      className={[
        "w-full min-w-0 rounded border-2 px-4 py-3.5 text-[15px]",
        "outline-none transition-colors duration-200",
        "focus:border-brand-green",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        invalid ? "border-red-500 focus:border-red-500" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
