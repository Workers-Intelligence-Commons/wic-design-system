import { type ComponentProps, type ReactNode, useId } from "react";
import { cx } from "./cx.ts";

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export type TextInputProps = FieldProps & Omit<ComponentProps<"input">, "type"> & { type?: "text" | "password" | "email" | "url" | "number" | "search" };
export type TextAreaProps = FieldProps & ComponentProps<"textarea">;
export type SelectProps = FieldProps & ComponentProps<"select">;
export type CheckboxProps = FieldProps & Omit<ComponentProps<"input">, "type">;

function useField({ hint, error }: Omit<FieldProps, "label">, given?: string) {
  const own = useId();
  const id = given ?? own;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return { id, control: { id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined } };
}

function Notes({ id, hint, error }: { id: string; hint?: ReactNode; error?: ReactNode }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="wic-field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="wic-field-error" role="alert">
          <span aria-hidden="true">✕</span>
          {error}
        </p>
      )}
    </>
  );
}

export function TextInput({ label, hint, error, className, type = "text", ...rest }: TextInputProps) {
  const { id, control } = useField({ hint, error }, rest.id);
  return (
    <div className={cx("wic-field", className)}>
      <label htmlFor={id} className="wic-label">
        {label}
      </label>
      <input type={type} {...rest} {...control} className="wic-input wic-focus" />
      <Notes id={id} hint={hint} error={error} />
    </div>
  );
}

export function TextArea({ label, hint, error, className, rows = 3, ...rest }: TextAreaProps) {
  const { id, control } = useField({ hint, error }, rest.id);
  return (
    <div className={cx("wic-field", className)}>
      <label htmlFor={id} className="wic-label">
        {label}
      </label>
      <textarea rows={rows} {...rest} {...control} className="wic-input wic-textarea wic-focus" />
      <Notes id={id} hint={hint} error={error} />
    </div>
  );
}

export function Select({ label, hint, error, className, ...rest }: SelectProps) {
  const { id, control } = useField({ hint, error }, rest.id);
  return (
    <div className={cx("wic-field", className)}>
      <label htmlFor={id} className="wic-label">
        {label}
      </label>
      <select {...rest} {...control} className="wic-input wic-select wic-focus" />
      <Notes id={id} hint={hint} error={error} />
    </div>
  );
}

export function Checkbox({ label, hint, error, className, ...rest }: CheckboxProps) {
  const { id, control } = useField({ hint, error }, rest.id);
  return (
    <div className={cx("wic-field", "wic-check", className)}>
      <input type="checkbox" {...rest} {...control} className="wic-check-box wic-focus" />
      <label htmlFor={id} className="wic-check-label">
        {label}
      </label>
      <Notes id={id} hint={hint} error={error} />
    </div>
  );
}
