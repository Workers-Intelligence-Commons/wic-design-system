import { type MouseEvent, type ReactNode, type SyntheticEvent, useEffect, useId, useRef } from "react";
import { Button } from "./Button.tsx";
import { cx } from "./cx.ts";

export interface DialogProps {
  open: boolean;
  /** Escape, the close button and a click on the screen around the sheet all call it. */
  onClose: () => void;
  title: string;
  /** `center`: a sheet over the page. `side`: a sheet the height of the page, from its left edge. */
  placement?: "center" | "side";
  closeLabel?: string;
  /** Shown beside the title, before the close button. */
  actions?: ReactNode;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, placement = "center", closeLabel = "Close", actions, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // The browser's modal dialog keeps focus inside and the rest of the page inert while open.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Escape: the consumer closes, so that its state and the dialog never disagree.
  const onCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  // The sheet fills the dialog: a click whose target is the dialog itself landed on the screen around it.
  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog ref={ref} className={cx("wic-dialog", `wic-dialog-${placement}`)} aria-labelledby={titleId} onCancel={onCancel} onClick={onClick}>
      <div className="wic-dialog-sheet">
        <header className="wic-dialog-head">
          <h2 id={titleId} className="wic-dialog-title">
            {title}
          </h2>
          {actions}
          <Button variant="quiet" onClick={onClose}>
            {closeLabel}
          </Button>
        </header>
        <div className="wic-dialog-body">{children}</div>
      </div>
    </dialog>
  );
}
