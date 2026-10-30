import type { ComponentProps } from "react";
import type { ButtonVariant } from "./Button.tsx";
import { cx } from "./cx.ts";

export interface ButtonLinkProps extends ComponentProps<"a"> {
  href: string;
  variant?: ButtonVariant;
}

export function ButtonLink({ variant = "ink", className, ...rest }: ButtonLinkProps) {
  return <a {...rest} className={cx("wic-btn", "wic-focus", `wic-btn-${variant}`, className)} />;
}
