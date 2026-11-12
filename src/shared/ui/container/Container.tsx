import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "header" | "footer";
}

export function Container({
  as: Component = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={clsx("mx-auto w-full max-w-300 px-6 md:px-12", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
