"use client";

import type { ComponentProps, ReactNode } from "react";
import { DropdownMenu } from "radix-ui";
import { cx } from "./cx";
import { CheckIcon } from "./icons";

/** Root: `open`, `onOpenChange`, `modal`. */
export const Menu = DropdownMenu.Root;

/** Use `asChild` with the opening button, usually an IconButton labelled "More". */
export const MenuTrigger = DropdownMenu.Trigger;

/** Arrow keys, typeahead, Escape and outside clicks; flips to stay on screen. */
export function MenuContent({ className, sideOffset = 6, collisionPadding = 8, ...props }: ComponentProps<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content sideOffset={sideOffset} collisionPadding={collisionPadding} className={cx("mm-menu", className)} {...props} />
    </DropdownMenu.Portal>
  );
}

export interface MenuItemProps extends ComponentProps<typeof DropdownMenu.Item> {
  /** Delete and other irreversible actions; keep them last, after a separator. */
  destructive?: boolean;
  /** Mono hint on the right: "↵", "M", "⌘L". */
  shortcut?: ReactNode;
}

/** `onSelect` runs the action; `asChild` turns a next/link `Link` into the item. */
export function MenuItem({ destructive, shortcut, className, children, asChild, ...props }: MenuItemProps) {
  return (
    <DropdownMenu.Item
      className={cx("mm-mi", className)}
      data-destructive={destructive ? "" : undefined}
      asChild={asChild}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children}
          {shortcut ? <span className="mm-kbd">{shortcut}</span> : null}
        </>
      )}
    </DropdownMenu.Item>
  );
}

/** Toggle in a menu. Call `event.preventDefault()` in `onSelect` to keep the menu open. */
export function MenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof DropdownMenu.CheckboxItem>) {
  return (
    <DropdownMenu.CheckboxItem className={cx("mm-mi", className)} {...props}>
      {children}
      <DropdownMenu.ItemIndicator className="mm-select-check">
        <CheckIcon size={14} strokeWidth={2.5} />
      </DropdownMenu.ItemIndicator>
    </DropdownMenu.CheckboxItem>
  );
}

/** Section heading inside a menu, in the `label` style. */
export function MenuLabel({ className, ...props }: ComponentProps<typeof DropdownMenu.Label>) {
  return <DropdownMenu.Label className={cx("mm-menu-label", className)} {...props} />;
}

export function MenuSeparator({ className, ...props }: ComponentProps<typeof DropdownMenu.Separator>) {
  return <DropdownMenu.Separator className={cx("mm-menu-sep", className)} {...props} />;
}

/** One choice from several in a menu: `value`, `onValueChange`. */
export const MenuRadioGroup = DropdownMenu.RadioGroup;

export function MenuRadioItem({ className, children, ...props }: ComponentProps<typeof DropdownMenu.RadioItem>) {
  return (
    <DropdownMenu.RadioItem className={cx("mm-mi", className)} {...props}>
      {children}
      <DropdownMenu.ItemIndicator className="mm-select-check">
        <CheckIcon size={14} strokeWidth={2.5} />
      </DropdownMenu.ItemIndicator>
    </DropdownMenu.RadioItem>
  );
}
