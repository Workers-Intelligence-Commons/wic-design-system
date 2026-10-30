import type { ComponentProps } from "react";
import { cx } from "./cx.ts";

export type ButtonVariant = "primary" | "ink" | "quiet";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({ variant = "ink", type = "button", className, ...rest }: ButtonProps) {
  return <button type={type} {...rest} className={cx("wic-btn", "wic-focus", `wic-btn-${variant}`, className)} />;
}
