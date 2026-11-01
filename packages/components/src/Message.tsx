import type { ReactNode } from "react";
import { cx } from "./cx.ts";

export type MessageEnd = "interrupted" | "failed";

export interface MessageProps {
  from: "user" | "assistant";
  label?: string | undefined;
  streaming?: boolean | undefined;
  end?: MessageEnd | undefined;
  actions?: ReactNode;
  /** A short line about the message (its model, its timings), shown on hover or focus beside the actions. */
  details?: ReactNode;
  /** Arrives pasted: for a message written while the reader watches, not for one already there. */
  entering?: boolean | undefined;
  children: ReactNode;
}

const LABEL = { user: "you", assistant: "assistant" } as const;
const END: Record<MessageEnd, { glyph: string; word: string }> = {
  interrupted: { glyph: "○", word: "interrupted" },
  failed: { glyph: "✕", word: "failed" },
};

export function Message({ from, label = LABEL[from], streaming = false, end, actions, details, entering = false, children }: MessageProps) {
  return (
    <article
      className={cx("wic-message", `wic-message-${from}`, end && `wic-message-${end}`, entering && "wic-enter")}
      aria-busy={streaming || undefined}
      // A tap focuses the message, which shows its details on a touch screen; no stop for the Tab key.
      tabIndex={details ? -1 : undefined}
    >
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
      {(actions || details) && (
        <div className="wic-message-actions">
          {actions}
          {details && <span className="wic-message-details">{details}</span>}
        </div>
      )}
    </article>
  );
}
