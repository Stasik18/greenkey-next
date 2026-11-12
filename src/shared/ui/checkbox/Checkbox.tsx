import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  children?: ReactNode;
  description?: string;
}

export function Checkbox({
  children,
  description,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label className={clsx(`flex cursor-pointer items-start gap-3`, className)}>
      <input
        type="checkbox"
        className="mt-1 size-4 shrink-0 accent-brand-green"
        {...props}
      />
      <span className="grid gap-1 text-sm leading-relaxed text-muted">
        {children && <span>{children}</span>}
        {description && (
          <span className="text-xs text-muted/80">{description}</span>
        )}
      </span>
    </label>
  );
}
