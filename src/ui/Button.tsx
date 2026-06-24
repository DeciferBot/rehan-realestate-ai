import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

type Variant = "primary" | "outline" | "ghost" | "subtle" | "danger";

export function Button({
  variant = "subtle",
  size = "md",
  block,
  loading,
  icon,
  className,
  children,
  disabled,
  ...rest
}: {
  variant?: Variant;
  size?: "sm" | "md";
  block?: boolean;
  loading?: boolean;
  icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx("u-btn", `u-btn--${variant}`, size === "sm" && "u-btn--sm", block && "u-btn--block", className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="u-btn__spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}

export function IconButton({
  label, className, children, ...rest
}: { label: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx("u-iconbtn", className)} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
