"use client";

import { useState, type ReactNode } from "react";
import { Popover } from "radix-ui";
import { cx } from "./cx";

export interface HelpTooltipProps {
  /** One or two sentences explaining the control beside it. */
  content: ReactNode;
  /** Names what the help is about: "About minimum preview version". */
  "aria-label": string;
  /** Preferred side; flips to the other side when there is no room. */
  side?: "top" | "bottom";
  className?: string;
}

/**
 * A small "?" beside a label that explains it. Hover or keyboard focus shows the
 * bubble; a click or tap pins it open (touch has no hover), and a second click, an
 * outside click, blur or Escape closes it. The bubble floats in a portal, so a
 * parent with `overflow: hidden` never clips it, and it shifts sideways or flips
 * to stay on screen while its arrow keeps pointing at the "?".
 */
export function HelpTooltip({ content, side = "bottom", className, ...props }: HelpTooltipProps) {
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
          className={cx("mm-help", className)}
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
          ?
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
