import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";

type SelectVariant = "light" | "dark";
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
  invalid?: boolean;
  unstyled?: boolean;
}
const variants: Record<SelectVariant, string> = {
  light: "border-border bg-white text-ink",
  dark: "border-white/30 bg-ink/40 text-white",
};
export function Select({
  variant = "light",
  invalid = false,
  unstyled = false,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={clsx(
        !unstyled && [
          "w-full min-w-0 rounded border-2 px-4 py-3.5 text-[15px] outline-none transition-colors duration-200 focus:border-brand-green disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          invalid && "border-red-500 focus:border-red-500",
        ],
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
