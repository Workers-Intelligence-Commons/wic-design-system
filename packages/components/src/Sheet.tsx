import type { ReactNode } from "react";
import { cx } from "./cx.ts";

export interface SheetProps {
  tone?: "ink" | "red" | "ochre";
  title: string;
  children: ReactNode;
}

export function Sheet({ tone = "ink", title, children }: SheetProps) {
  return (
    <article className={cx("wic-sheet", tone !== "ink" && `wic-sheet-${tone}`)}>
      <h3 className="wic-sheet-title">{title}</h3>
      {children}
    </article>
  );
}
