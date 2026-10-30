import type { ReactNode } from "react";

export type BadgeStatus = "admitted" | "refused" | "pending" | "license" | "neutral";

export interface BadgeProps {
  status?: BadgeStatus;
  children?: ReactNode;
}

const GLYPH: Partial<Record<BadgeStatus, string>> = { admitted: "■", refused: "✕", pending: "○" };
const WORD: Partial<Record<BadgeStatus, string>> = { admitted: "admitted", refused: "refused", pending: "pending" };

export function Badge({ status = "neutral", children }: BadgeProps) {
  const glyph = GLYPH[status];
  return (
    <span className={`wic-badge wic-badge-${status}`}>
      {glyph && <span aria-hidden="true">{glyph}</span>}
      {children ?? WORD[status]}
    </span>
  );
}
