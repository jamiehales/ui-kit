import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Separator as SeparatorPrimitive, Slot } from "radix-ui";
import { cx } from "./cx";
import { AlertIcon } from "./icons";

export interface CardProps extends ComponentProps<"div"> {
  /** `sm` tightens the padding for dense settings panels. */
  size?: "md" | "sm";
}

/** A flat panel on `card`: hairline edge, small offset shadow. Lays its parts out in a column. */
export function Card({ size = "md", className, ...props }: CardProps) {
  return <div data-size={size} className={cx("mm-card", className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mm-card-header", className)} {...props} />;
}

/** The `heading` style: card and panel titles. */
export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cx("mm-card-title", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mm-card-content", className)} {...props} />;
}

export interface CardLinkProps extends ComponentProps<"a"> {
  /** Style the single child instead, e.g. next/link's `<Link>`. */
  asChild?: boolean;
}

/**
 * A whole card that is one link: lifts on hover and presses in on click. Holds
 * a CardImage (CardTile), a CardImage with a CardReveal (CardReveal), or text.
 */
export function CardLink({ asChild = false, className, ...props }: CardLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return <Comp className={cx("mm-card-link", className)} {...props} />;
}

export interface CardImageProps extends ComponentProps<"div"> {
  /** Width over height, e.g. `4 / 3` or an image's own `width / height`. Defaults to 4:3. */
  ratio?: number;
}

/** The image area of a card. Put an `<img>` inside; it fills the area and zooms slightly on hover. */
export function CardImage({ ratio, className, style, ...props }: CardImageProps) {
  return (
    <div
      className={cx("mm-card-image", className)}
      style={ratio ? ({ aspectRatio: String(ratio), ...style } as CSSProperties) : style}
      {...props}
    />
  );
}

export interface CardRevealProps extends Omit<ComponentProps<"div">, "title"> {
  /** Up to two lines, then an ellipsis. */
  title: ReactNode;
  /** Small mono line under the title: a category, a count. */
  meta?: ReactNode;
}

/**
 * A bar that slides up over the bottom of a CardImage while its CardLink is
 * hovered or focused. Hidden on touch screens, so give the CardLink an
 * `aria-label` that says the same.
 */
export function CardReveal({ title, meta, className, ...props }: CardRevealProps) {
  return (
    <div className={cx("mm-card-reveal", className)} aria-hidden="true" {...props}>
      <span className="mm-card-reveal-title">{title}</span>
      {meta ? <span className="mm-card-reveal-meta">{meta}</span> : null}
    </div>
  );
}

export interface AlertProps extends ComponentProps<"div"> {
  /** `error`: what broke and what to do, in one short sentence. */
  tone?: "neutral" | "error";
}

/** Inline message in the page flow. For transient confirmations use Toast. */
export function Alert({ tone = "neutral", className, children, ...props }: AlertProps) {
  return (
    <div role={tone === "error" ? "alert" : "status"} data-tone={tone} className={cx("mm-alert", className)} {...props}>
      {tone === "error" ? <AlertIcon /> : null}
      <div className="mm-alert-body">{children}</div>
    </div>
  );
}

export interface SpinnerProps extends ComponentProps<"svg"> {
  /** Read out while loading. */
  label?: string;
}

/** 16px loading ring in currentColor; size it with width/height or a class. */
export function Spinner({ label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={cx("mm-spinner", className)}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </svg>
  );
}

export function Separator({ className, ...props }: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return <SeparatorPrimitive.Root className={cx("mm-separator", className)} {...props} />;
}
