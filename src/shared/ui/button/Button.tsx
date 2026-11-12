import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

import { Icon, type IconName } from "@/shared/ui/icon/Icon";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type IconPosition = "left" | "right";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: IconName;
  iconPosition?: IconPosition;
  isLoading?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
  children: ReactNode;
}

const baseStyles = [
  "inline-flex items-center justify-center gap-2",
  "rounded-lg font-medium",
  "transition-colors duration-200",
  "cursor-pointer",
  "disabled:pointer-events-none disabled:opacity-50",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-brand-green focus-visible:ring-offset-2",
].join(" ");

const variantStyles: Record<ButtonVariant, string> = {
  primary: ["bg-brand-green text-white", "hover:bg-brand-green/90"].join(" "),

  secondary: ["bg-brand-orange text-white", "hover:bg-brand-orange/90"].join(
    " ",
  ),

  outline: [
    "border border-border bg-transparent text-ink",
    "hover:bg-surface-muted",
  ].join(" "),

  ghost: ["bg-transparent text-ink", "hover:bg-surface-muted"].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-13 px-7 text-lg",
};

const iconSizes: Record<ButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

export function Button({
  variant = "primary",
  size = "md",
  iconName,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const buttonClassName = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className,
  );

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassName}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        iconName &&
        iconPosition === "left" && (
          <Icon name={iconName} size={iconSizes[size]} />
        )
      )}

      <span>{children}</span>

      {!isLoading && iconName && iconPosition === "right" && (
        <Icon name={iconName} size={iconSizes[size]} />
      )}
    </button>
  );
}
