import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from "react";
import { Slot } from "radix-ui";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "neutral" | "ghost" | "danger" | "link";
export type ButtonSize = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` is the one main action per view; `danger` always says what it deletes; `link` looks like a TextLink. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square, icon-only button; give it an `aria-label`. */
  icon?: boolean;
  /** Render the single child (e.g. next/link's `<Link>`) with the button's styling. */
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/** One or two words that say what happens: "Export", "New board", "Delete". */
export function Button({ variant = "neutral", size = "md", icon = false, type, asChild = false, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? type : (type ?? "button")}
      data-variant={variant}
      data-size={size}
      data-icon={icon ? "" : undefined}
      className={cx("mm-btn", className)}
      {...props}
    />
  );
}

export interface IconButtonProps extends Omit<ButtonProps, "aria-label" | "children"> {
  /** Icon-only buttons need a name for screen readers. */
  "aria-label": string;
  children: ReactNode;
}

export function IconButton(props: IconButtonProps) {
  return <Button icon {...props} />;
}

export interface ButtonRowProps extends HTMLAttributes<HTMLDivElement> {
  /** `end` for dialog footers (Cancel, then the action). */
  align?: "start" | "end";
}

export function ButtonRow({ align = "start", className, ...props }: ButtonRowProps) {
  return <div data-align={align} className={cx("mm-btn-row", className)} {...props} />;
}

