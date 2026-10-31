import type { ReactNode } from "react";
import { cx } from "./cx.ts";

export type ToolCallState = "running" | "awaiting_approval" | "done" | "error";

export interface ToolCallProps {
  name: string;
  state: ToolCallState;
  progress?: string | undefined;
  children?: ReactNode;
}

const STATE: Record<ToolCallState, { glyph: string; word: string }> = {
  running: { glyph: "○", word: "running" },
  awaiting_approval: { glyph: "○", word: "awaiting approval" },
  done: { glyph: "■", word: "done" },
  error: { glyph: "✕", word: "error" },
};

export function ToolCall({ name, state, progress, children }: ToolCallProps) {
  const { glyph, word } = STATE[state];
  return (
    <details className={cx("wic-tool", `wic-tool-${state}`)}>
      <summary className="wic-tool-head wic-focus">
        <span className="wic-tool-name">{name}</span>
        <span className="wic-tool-state">
          <span aria-hidden="true">{glyph}</span>
          {word}
        </span>
        {progress && <span className="wic-tool-progress">{progress}</span>}
      </summary>
      {children && <div className="wic-tool-body">{children}</div>}
    </details>
  );
}
