import { type ReactNode, useLayoutEffect, useRef } from "react";

export interface MessageListProps {
  label?: string | undefined;
  children: ReactNode;
}

/** Distance under which the reader counts as being at the bottom of the list. */
const BOTTOM_PX = 40;

export function MessageList({ label = "Messages", children }: MessageListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  // Runs after every render, so a reply that grows while streaming keeps the list pinned to its end,
  // unless the reader has scrolled up to read.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && atBottom.current) el.scrollTop = el.scrollHeight;
  });
  return (
    <div
      ref={ref}
      className="wic-messages"
      role="log"
      aria-label={label}
      tabIndex={0}
      onScroll={(e) => {
        const el = e.currentTarget;
        atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_PX;
      }}
    >
      {children}
    </div>
  );
}
