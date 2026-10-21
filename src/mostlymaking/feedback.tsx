"use client";

import type { AnchorHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { Progress as ProgressPrimitive, Slot, Toast as ToastPrimitive, Tooltip as TooltipPrimitive } from "radix-ui";
import { cx } from "./cx";
import { AlertIcon, CheckIcon } from "./icons";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** `default` is the rose tag; `neutral` for status like "Beta"; `outline` for the quietest; `success` for "Stable". */
  variant?: "default" | "neutral" | "outline" | "success";
  /** Style the single child instead, e.g. a button that toggles something. */
  asChild?: boolean;
}

export function Tag({ variant = "default", asChild = false, className, ...props }: TagProps) {
  const Comp = asChild ? Slot.Root : "span";
  return <Comp data-variant={variant} className={cx("mm-tag", className)} {...props} />;
}

export interface ProgressProps {
  /** 0–`max`. Leave undefined for a running (indeterminate) bar. */
  value?: number;
  max?: number;
  "aria-label"?: string;
  className?: string;
}

export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const clamped = value === undefined ? null : Math.min(max, Math.max(0, value));
  return (
    <ProgressPrimitive.Root value={clamped} max={max} className={cx("mm-progress", className)} {...props}>
      <ProgressPrimitive.Indicator
        className="mm-progress-bar"
        style={clamped === null ? undefined : { width: `${(clamped / max) * 100}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Style the single child instead, e.g. next/link's `<Link>`. */
  asChild?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

/** Brass inline link that underlines on hover. */
export function TextLink({ asChild = false, className, ...props }: TextLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return <Comp className={cx("mm-link", className)} {...props} />;
}

export interface TooltipProps {
  /** A few words naming the action: "Copy link". */
  content: ReactNode;
  /** One focusable element, usually an IconButton. */
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  /** Hover delay in ms. */
  delayDuration?: number;
}

/** Shows beside its child on hover and keyboard focus; flips to stay on screen. */
export function Tooltip({ content, children, side = "top", delayDuration = 300 }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content side={side} sideOffset={8} collisionPadding={8} className="mm-tip">
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Default time on screen in ms. */
  duration?: number;
}

/** Wrap the app once; toasts stack bottom-right. */
export function ToastProvider({ children, duration = 5000 }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider duration={duration} swipeDirection="right">
      {children}
      <ToastPrimitive.Viewport className="mm-toast-viewport" />
    </ToastPrimitive.Provider>
  );
}

export interface ToastAction {
  label: ReactNode;
  onClick: () => void;
  /** How to do the same thing without the toast, for screen readers: "Open Exports to see the files". */
  altText: string;
}

export interface ToastProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  tone?: "success" | "error" | "neutral";
  /** Short status: "Exported 12 files". Only when the person needs it to act. */
  children: ReactNode;
  /** Usually one word: "Show", "Undo". */
  action?: ToastAction;
  /** Overrides the provider's duration. */
  duration?: number;
  className?: string;
}

/** Needs a ToastProvider above it. */
export function Toast({ tone = "neutral", action, className, children, ...props }: ToastProps) {
  return (
    <ToastPrimitive.Root type={tone === "error" ? "foreground" : "background"} data-tone={tone} className={cx("mm-toast", className)} {...props}>
      {tone === "success" ? <CheckIcon size={16} strokeWidth={3} /> : tone === "error" ? <AlertIcon /> : null}
      <ToastPrimitive.Title className="mm-toast-title">{children}</ToastPrimitive.Title>
      {action ? (
        <ToastPrimitive.Action altText={action.altText} asChild>
          <button type="button" className="mm-link mm-toast-action" onClick={action.onClick}>
            {action.label}
          </button>
        </ToastPrimitive.Action>
      ) : null}
    </ToastPrimitive.Root>
  );
}
