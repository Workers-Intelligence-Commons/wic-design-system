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

/** `name` is the key of the value in a submitted form: the consumer may replace the default. */
type CredentialProps = FieldProps & Omit<ComponentProps<"input">, "type" | "autoComplete">;

export type AccountFieldProps = CredentialProps & {
  type?: "email" | "text";
  /** The person types the identifier of an account they are creating, not of one they have. */
  creating?: boolean;
};
export type CurrentPasswordFieldProps = CredentialProps;
export type NewPasswordFieldProps = CredentialProps;
export type SecretFieldProps = FieldProps & Omit<ComponentProps<"input">, "type" | "autoComplete">;

/**
 * The identifier of the person's own account, which a password manager stores as the username. An
 * email address for a new account asks for an email, so that the manager offers the person's
 * addresses rather than a username.
 */
export function AccountField({ type = "email", creating = false, name = "username", ...rest }: AccountFieldProps) {
  const autoComplete = creating && type === "email" ? "email" : "username";
  return <TextInput autoCapitalize="none" spellCheck={false} {...rest} type={type} name={name} autoComplete={autoComplete} />;
}

/** The person's current password, which a password manager fills. */
export function CurrentPasswordField({ name = "current-password", ...rest }: CurrentPasswordFieldProps) {
  return <TextInput {...rest} type="password" name={name} autoComplete="current-password" />;
}

/** A password the person chooses; its length limits also reach the managers that generate one. */
export function NewPasswordField({ minLength, maxLength, name = "new-password", ...rest }: NewPasswordFieldProps) {
  const rules = [minLength !== undefined && `minlength: ${minLength};`, maxLength !== undefined && `maxlength: ${maxLength};`].filter(Boolean).join(" ");
  return <TextInput {...rest} {...(rules ? { passwordrules: rules } : {})} minLength={minLength} maxLength={maxLength} type="password" name={name} autoComplete="new-password" />;
}

/** The opt-out attribute of each common password manager: 1Password, LastPass, Bitwarden and Dashlane. */
const MANAGERS_IGNORE = { "data-1p-ignore": "", "data-lpignore": "true", "data-bwignore": "", "data-form-type": "other" };

/** A secret that is not the person's own password, such as a token: password managers neither fill nor save it. */
export function SecretField(props: SecretFieldProps) {
  return <TextInput {...props} {...MANAGERS_IGNORE} type="password" autoComplete="off" />;
}
