import type { ReactNode } from "react";
import { cx } from "./cx.ts";

export interface PosterProps {
  /** Classes of the consumer, for its size and its place in the page. */
  className?: string | undefined;
  children: ReactNode;
}

export function Poster({ className, children }: PosterProps) {
  return <div className={cx("wic-poster", className)}>{children}</div>;
}
