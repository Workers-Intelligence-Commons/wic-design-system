import { type ReactNode, useLayoutEffect, useRef } from "react";

export interface MessageListProps {
  label?: string | undefined;
  children: ReactNode;
}

/** Distance under which the reader counts as being at the bottom of the list. */
const BOTTOM_PX = 40;

const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MessageList({ label = "Messages", children }: MessageListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const lastTop = useRef(0);
  const shown = useRef(false);
  // Runs after every render, so a reply that grows while streaming keeps the list following its
  // end, unless the reader has scrolled up to read. The first render lands at the end at once; the
  // following ones glide there.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !atBottom.current) return;
    const top = el.scrollHeight - el.clientHeight;
    if (!shown.current || reducedMotion() || typeof el.scrollTo !== "function") el.scrollTop = top;
    else if (top - el.scrollTop > 1) el.scrollTo({ top, behavior: "smooth" });
    shown.current = true;
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
        // Only a move up comes from the reader: the glide to the end only goes down.
        if (el.scrollTop < lastTop.current - 2) atBottom.current = false;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_PX) atBottom.current = true;
        lastTop.current = el.scrollTop;
      }}
    >
      {children}
    </div>
  );
}
