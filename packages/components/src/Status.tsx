import type { ReactNode } from "react";

export type StatusKind = "running" | "waiting" | "offline" | "done";

export interface StatusProps {
  kind: StatusKind;
  children?: ReactNode;
}

const GLYPH: Record<StatusKind, string> = { running: "○", waiting: "○", offline: "✕", done: "■" };
const WORD: Record<StatusKind, string> = { running: "running", waiting: "waiting", offline: "offline", done: "done" };

export function Status({ kind, children }: StatusProps) {
  return (
    <span className={`wic-status wic-status-${kind}`} role={kind === "running" ? "status" : undefined}>
      <span aria-hidden="true">{GLYPH[kind]}</span>
      {children ?? WORD[kind]}
    </span>
  );
}
