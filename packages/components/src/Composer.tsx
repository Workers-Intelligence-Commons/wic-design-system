import { type KeyboardEvent, useState } from "react";
import { Button } from "./Button.tsx";

export interface ComposerProps {
  onSend: (text: string) => void | Promise<void>;
  running?: boolean | undefined;
  onStop?: (() => void | Promise<void>) | undefined;
  onCancel?: (() => void) | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  defaultValue?: string | undefined;
  sendLabel?: string | undefined;
}

export function Composer({ onSend, running = false, onStop, onCancel, label = "Message", placeholder, defaultValue = "", sendLabel = "Send" }: ComposerProps) {
  const [text, setText] = useState(defaultValue);
  const [sending, setSending] = useState(false);

  async function submit() {
    const value = text.trim();
    if (!value || sending) return;
    setSending(true);
    try {
      await onSend(value);
      setText("");
    } finally {
      setSending(false);
    }
  }

  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form
      className="wic-composer"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <textarea className="wic-input wic-textarea wic-focus" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKey} placeholder={placeholder} rows={3} aria-label={label} />
      <div className="wic-composer-actions">
        <span className="wic-composer-hint">Enter sends, Shift+Enter adds a line</span>
        {onCancel && (
          <Button variant="quiet" onClick={onCancel}>
            Cancel
          </Button>
        )}
        {running && onStop && (
          <Button variant="ink" onClick={() => void onStop()}>
            Stop
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={sending || !text.trim()}>
          {sendLabel}
        </Button>
      </div>
    </form>
  );
}
