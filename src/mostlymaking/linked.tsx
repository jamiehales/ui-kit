"use client";

import type { CSSProperties, ReactNode } from "react";
import { Toggle } from "radix-ui";
import { cx } from "./cx";
import { Tooltip } from "./feedback";
import { LockIcon, UnlockIcon } from "./icons";

export interface LinkToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  /** What the lock does, e.g. "Link depth to width". */
  "aria-label": string;
  disabled?: boolean;
  className?: string;
}

/** A lock that links one value to another: raised with an open lock, pressed in with a brass closed lock. */
export function LinkToggle({ pressed, onPressedChange, className, ...props }: LinkToggleProps) {
  return (
    <Toggle.Root pressed={pressed} onPressedChange={onPressedChange} className={cx("mm-link-toggle", className)} {...props}>
      {pressed ? <LockIcon /> : <UnlockIcon />}
    </Toggle.Root>
  );
}

export interface LinkedPairProps {
  linked: boolean;
  onLinkedChange: (linked: boolean) => void;
  /** The lock's accessible name, e.g. "Link depth to width". */
  label: string;
  /** Tooltips for the lock; leave out for none. */
  linkedHint?: ReactNode;
  unlinkedHint?: ReactNode;
  /** Where the bracket meets the first and last rows, in px from the top of the first and the bottom of the last. 20 suits 40px rows. */
  firstAnchor?: number;
  lastAnchor?: number;
  className?: string;
  /** The rows, usually two; the second follows the first while linked, so disable it then. */
  children: ReactNode;
}

/** Rows joined by a bracket with a LinkToggle on its spine; solid bracket when linked, dashed when not. */
export function LinkedPair({
  linked,
  onLinkedChange,
  label,
  linkedHint,
  unlinkedHint,
  firstAnchor = 20,
  lastAnchor = 20,
  className,
  children,
}: LinkedPairProps) {
  const style = { "--mm-link-top": `${firstAnchor}px`, "--mm-link-bottom": `${lastAnchor}px` } as CSSProperties;
  const hint = linked ? linkedHint : unlinkedHint;
  const toggle = <LinkToggle pressed={linked} onPressedChange={onLinkedChange} aria-label={label} />;
  return (
    <div className={cx("mm-linked", className)} style={style}>
      <div className="mm-linked-rows">{children}</div>
      <div className="mm-linked-link" data-linked={linked ? "" : undefined}>
        <span className="mm-linked-bracket" aria-hidden="true" />
        {hint ? (
          <Tooltip content={hint} side="left">
            {toggle}
          </Tooltip>
        ) : (
          toggle
        )}
      </div>
    </div>
  );
}
