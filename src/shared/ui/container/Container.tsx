import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "header" | "footer";
}

export function Container({
  as: Component = "div",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full max-w-[1200px] px-6 md:px-12 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
