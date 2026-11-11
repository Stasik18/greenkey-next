import type { IconProps } from "../types";

export function CloseIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
    >
      <path d="M1 1 13 13M13 1 1 13" />
    </svg>
  );
}
