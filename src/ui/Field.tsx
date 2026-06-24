import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export function Field({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="u-field">
      <label className="u-field__label" htmlFor={htmlFor}>{label}</label>
      {hint && <span className="u-field__hint">{hint}</span>}
      {children}
    </div>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx("u-input", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx("u-textarea", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx("u-select", className)} {...rest}>{children}</select>;
}

export function Chip({ on, className, children, ...rest }: { on?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cx("u-chip", on && "u-chip--on", className)} aria-pressed={on} {...rest}>
      {children}
    </button>
  );
}
