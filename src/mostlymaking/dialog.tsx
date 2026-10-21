"use client";

import type { ComponentProps, MouseEvent, ReactElement, ReactNode } from "react";
import { AlertDialog, Dialog as DialogPrimitive } from "radix-ui";
import { Button } from "./button";
import { cx } from "./cx";
import { CloseIcon } from "./icons";

/** Root: `open`, `defaultOpen`, `onOpenChange`. Focus trap, scroll lock, Escape and outside clicks close it. */
export const Dialog = DialogPrimitive.Root;

/** Use `asChild` with the opening button. */
export const DialogTrigger = DialogPrimitive.Trigger;

/** Closes the surrounding Dialog; wrap a Button with it (`asChild`). */
export const DialogClose = DialogPrimitive.Close;

/**
 * The panel, over a dimmed overlay. Needs a DialogTitle (visually hidden with
 * `className="sr-only"` if the design has none). Pass `aria-describedby={undefined}`
 * when there is no DialogDescription.
 */
export function DialogContent({ className, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="mm-overlay" />
      <DialogPrimitive.Content className={cx("mm-dialog", className)} {...props} />
    </DialogPrimitive.Portal>
  );
}

/** A question for confirmations, a noun for forms: "Delete 3 references?", "Rename project". */
export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cx("mm-dialog-title", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cx("mm-dialog-body", className)} {...props} />;
}

/** Buttons, right-aligned: ghost Cancel, then the action. */
export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mm-btn-row", className)} data-align="end" {...props} />;
}

/** Root: `open`, `defaultOpen`, `onOpenChange`. A Dialog docked to an edge, for filters and previews on phones. */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export interface SheetContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  side?: "right" | "left" | "bottom" | "top";
  /** A ghost close button in the top-right corner. */
  showCloseButton?: boolean;
}

/** Needs a SheetTitle (`className="sr-only"` to hide it). Not in the design artifacts; styled like the dialog. */
export function SheetContent({ side = "right", showCloseButton = true, className, children, ...props }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="mm-overlay" />
      <DialogPrimitive.Content data-side={side} className={cx("mm-sheet", className)} {...props}>
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" size="sm" icon className="mm-sheet-close" aria-label="Close">
              <CloseIcon />
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mm-sheet-header", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mm-sheet-footer", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cx("mm-dialog-title", className)} {...props} />;
}

export function SheetDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cx("mm-dialog-body", className)} {...props} />;
}

export interface ConfirmDialogProps {
  /** Opens the dialog when clicked; leave out when `open` is controlled. */
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A question: "Delete this bookmark?" */
  title: ReactNode;
  /** What happens, in a sentence. */
  description?: ReactNode;
  /** One or two words: "Delete", "Revoke all". */
  confirmLabel: ReactNode;
  cancelLabel?: ReactNode;
  /** Danger styling for irreversible actions. */
  destructive?: boolean;
  confirmDisabled?: boolean;
  /** Closes the dialog afterwards unless it calls `event.preventDefault()` (e.g. to stay open while saving). */
  onConfirm: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** Confirmation before an action. Unlike Dialog, outside clicks don't dismiss it; Cancel or Escape do. */
export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  confirmDisabled,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger> : null}
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="mm-overlay" />
        <AlertDialog.Content className="mm-dialog" {...(description ? {} : { "aria-describedby": undefined })}>
          <AlertDialog.Title className="mm-dialog-title">{title}</AlertDialog.Title>
          {description ? <AlertDialog.Description className="mm-dialog-body">{description}</AlertDialog.Description> : null}
          <div className="mm-btn-row" data-align="end">
            <AlertDialog.Cancel asChild>
              <Button variant="ghost">{cancelLabel}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant={destructive ? "danger" : "primary"} disabled={confirmDisabled} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
