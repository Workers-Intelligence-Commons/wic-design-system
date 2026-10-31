import type { FormEvent, ReactNode } from "react";

export interface QuestionProps {
  question: ReactNode;
  from?: string | undefined;
  onSubmit?: ((event: FormEvent<HTMLFormElement>) => void) | undefined;
  actions?: ReactNode;
  children?: ReactNode;
}

export function Question({ question, from = "a question for you", onSubmit, actions, children }: QuestionProps) {
  const body = (
    <>
      <span className="wic-question-label">{from}</span>
      <p className="wic-question-text">{question}</p>
      {children}
      {actions && <div className="wic-question-actions">{actions}</div>}
    </>
  );
  return onSubmit ? (
    <form className="wic-question" onSubmit={onSubmit}>
      {body}
    </form>
  ) : (
    <section className="wic-question">{body}</section>
  );
}
