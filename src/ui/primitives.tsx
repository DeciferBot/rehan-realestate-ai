import type { CSSProperties, ReactNode } from "react";
import { cx } from "./cx";

type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Div = React.HTMLAttributes<HTMLDivElement>;

/* ── Layout ── */
export function Stack({
  gap, align, between, end, wrap, grow, className, children, style, ...rest
}: { gap?: Gap; align?: CSSProperties["alignItems"]; between?: boolean; end?: boolean; wrap?: boolean; grow?: boolean } & Div) {
  return (
    <div
      className={cx("u-stack", gap && `u-gap-${gap}`, between && "u-row--between", end && "u-row--end", wrap && "u-row--wrap", grow && "u-grow", className)}
      style={align ? { alignItems: align, ...style } : style}
      {...rest}
    >{children}</div>
  );
}
export function Row({
  gap, wrap, between, end, grow, align, className, children, style, ...rest
}: { gap?: Gap; wrap?: boolean; between?: boolean; end?: boolean; grow?: boolean; align?: CSSProperties["alignItems"] } & Div) {
  return (
    <div
      className={cx("u-row", gap && `u-gap-${gap}`, wrap && "u-row--wrap", between && "u-row--between", end && "u-row--end", grow && "u-grow", className)}
      style={align ? { alignItems: align, ...style } : style}
      {...rest}
    >{children}</div>
  );
}

/* ── Text ── */
type Size = "2xs" | "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl";
type Weight = "medium" | "semibold" | "bold";
type Tone = "ink" | "muted" | "dim" | "primary" | "accent" | "success";
type TextProps = {
  as?: "span" | "p" | "div" | "label";
  size?: Size; weight?: Weight; tone?: Tone; mono?: boolean; truncate?: boolean;
  className?: string; children?: ReactNode; htmlFor?: string; style?: CSSProperties;
};
export function Text({ as: Tag = "span", size = "base", weight, tone, mono, truncate, className, children, ...rest }: TextProps) {
  return (
    <Tag className={cx("u-text", `u-${size}`, weight && `u-w-${weight}`, tone && `u-tone-${tone}`, mono && "u-text--mono", truncate && "u-truncate", className)} {...rest}>
      {children}
    </Tag>
  );
}
export function Heading({ size = "xl", className, children, as: Tag = "h2", ...rest }: { as?: "h1" | "h2" | "h3" | "h4"; size?: Size } & React.HTMLAttributes<HTMLHeadingElement>) {
  return <Tag className={cx("u-text", `u-${size}`, "u-w-semibold", className)} {...rest}>{children}</Tag>;
}

/* ── Card / Panel ── */
export function Card({ pad, flush, className, children, ...rest }: { pad?: boolean; flush?: boolean } & Div) {
  return <div className={cx("u-card", pad && "u-card--pad", flush && "u-card--flush", className)} {...rest}>{children}</div>;
}
export function CardHeader({ className, children, ...rest }: Div) {
  return <div className={cx("u-card__header", className)} {...rest}>{children}</div>;
}
export function CardBody({ className, children, ...rest }: Div) {
  return <div className={cx("u-card__body", className)} {...rest}>{children}</div>;
}

/* ── Badge ── */
type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "info" | "purple";
export function Badge({ tone = "neutral", className, children, ...rest }: { tone?: BadgeTone } & React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("u-badge", tone !== "neutral" && `u-badge--${tone}`, className)} {...rest}>{children}</span>;
}

/* ── Status dot ── */
export function StatusDot({ state = "idle", className }: { state?: "live" | "online" | "idle"; className?: string }) {
  return <span className={cx("u-dot", state === "live" && "u-dot--live", state === "online" && "u-dot--online", className)} />;
}

/* ── Empty state ── */
export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="u-empty">
      {icon && <div className="u-empty__icon">{icon}</div>}
      <Text size="md" weight="semibold">{title}</Text>
      {children && <Text size="sm" tone="dim">{children}</Text>}
    </div>
  );
}

/* ── Skeleton ── */
export function Skeleton({ w, h, radius, className }: { w?: number | string; h?: number | string; radius?: number; className?: string }) {
  return <div className={cx("u-skeleton", className)} style={{ width: w, height: h, borderRadius: radius }} />;
}
