import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx.ts";
import { Status } from "./Status.tsx";

export interface ConversationListProps {
  label?: string | undefined;
  children: ReactNode;
}

export type ConversationLinkProps = Pick<ComponentProps<"a">, "className" | "children" | "aria-current">;

export interface ConversationItemProps {
  title: string;
  current?: boolean | undefined;
  running?: boolean | undefined;
  /** Arrives pasted: for a conversation added while the list is shown. */
  entering?: boolean | undefined;
  href?: string | undefined;
  link?: ((props: ConversationLinkProps) => ReactNode) | undefined;
}

export function ConversationList({ label = "Conversations", children }: ConversationListProps) {
  return (
    <nav className="wic-conversations" aria-label={label}>
      <ul>{children}</ul>
    </nav>
  );
}

export function ConversationItem({ title, current = false, running = false, entering = false, href, link = (props) => <a href={href} {...props} /> }: ConversationItemProps) {
  return (
    <li className={cx("wic-conversation", current && "wic-conversation-current", entering && "wic-enter")}>
      {link({
        className: "wic-conversation-link wic-focus",
        "aria-current": current ? "page" : undefined,
        children: (
          <>
            <span className="wic-conversation-title">{title}</span>
            {running && <Status kind="running" />}
          </>
        ),
      })}
    </li>
  );
}
