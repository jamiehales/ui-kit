"use client";

import { useState, type ReactNode } from "react";
import { Popover } from "radix-ui";
import { cx } from "./cx";
import { WarningIcon } from "./icons";

export interface IconTooltipProps {
  /** What the trigger button shows, e.g. an icon. */
  icon: ReactNode;
  /** One or two sentences about the control beside it. */
  content: ReactNode;
  /** Names what the bubble is about: "About minimum preview version". */
  "aria-label": string;
  /** Preferred side; flips to the other side when there is no room. */
  side?: "top" | "bottom";
  className?: string;
}

export type HelpTooltipProps = Omit<IconTooltipProps, "icon">;
export type WarningTooltipProps = Omit<IconTooltipProps, "icon">;

/**
 * A small icon button beside a label with a bubble about it. Hover or keyboard focus
 * shows the bubble; a click or tap pins it open (touch has no hover), and a second
 * click, an outside click, blur or Escape closes it. The bubble floats in a portal, so
 * a parent with `overflow: hidden` never clips it, and it shifts sideways or flips to
 * stay on screen while its arrow keeps pointing at the icon.
 */
export function IconTooltip({ icon, content, side = "bottom", className, ...props }: IconTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const close = () => {
    setOpen(false);
    setPinned(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cx("mm-icon-tip", className)}
          aria-label={props["aria-label"]}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setOpen(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse" && !pinned) setOpen(false);
          }}
          onFocus={() => setOpen(true)}
          onBlur={close}
          onClick={(event) => {
            // Handle the toggle here instead of Radix's, so an open-on-hover bubble
            // pins on the first click rather than closing.
            event.preventDefault();
            if (pinned) {
              close();
            } else {
              setOpen(true);
              setPinned(true);
            }
          }}
        >
          {icon}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          sideOffset={8}
          collisionPadding={8}
          className="mm-help-tip"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {content}
          <Popover.Arrow asChild width={14} height={7}>
            <svg className="mm-help-arrow" viewBox="0 0 14 7" aria-hidden="true">
              <path d="M0 0 7 7 14 0" />
            </svg>
          </Popover.Arrow>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** A small "?" beside a label that explains it. */
export function HelpTooltip({ className, ...props }: HelpTooltipProps) {
  return <IconTooltip icon="?" className={cx("mm-help", className)} {...props} />;
}

/** A warning triangle beside a control that cautions about its current setting. */
export function WarningTooltip({ className, ...props }: WarningTooltipProps) {
  return <IconTooltip icon={<WarningIcon />} className={cx("mm-warning", className)} {...props} />;
}
