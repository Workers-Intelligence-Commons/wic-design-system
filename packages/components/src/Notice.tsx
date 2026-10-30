import type { ReactNode } from "react";

export interface NoticeProps {
  title?: string;
  children: ReactNode;
}

export function Notice({ title = "honest status", children }: NoticeProps) {
  return (
    <aside className="wic-notice">
      <span className="wic-notice-label">{title}</span>
      <p className="wic-notice-body">{children}</p>
    </aside>
  );
}
