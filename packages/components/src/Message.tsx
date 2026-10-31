import type { ReactNode } from "react";
import { cx } from "./cx.ts";

export type MessageEnd = "interrupted" | "failed";

export interface MessageProps {
  from: "user" | "assistant";
  label?: string | undefined;
  streaming?: boolean | undefined;
  end?: MessageEnd | undefined;
  actions?: ReactNode;
  children: ReactNode;
}

const LABEL = { user: "you", assistant: "assistant" } as const;
const END: Record<MessageEnd, { glyph: string; word: string }> = {
  interrupted: { glyph: "○", word: "interrupted" },
  failed: { glyph: "✕", word: "failed" },
};

export function Message({ from, label = LABEL[from], streaming = false, end, actions, children }: MessageProps) {
  return (
    <article className={cx("wic-message", `wic-message-${from}`, end && `wic-message-${end}`)} aria-busy={streaming || undefined}>
      <span className="wic-message-label">{label}</span>
      <div className="wic-message-body">
        {children}
        {streaming && <span className="wic-message-cursor" aria-hidden="true" />}
      </div>
      {end && (
        <p className="wic-message-end">
          <span aria-hidden="true">{END[end].glyph}</span>
          {END[end].word}
        </p>
      )}
      {actions && <div className="wic-message-actions">{actions}</div>}
    </article>
  );
}
