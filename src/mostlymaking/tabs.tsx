"use client";

import { createContext, useContext, useRef, type ComponentProps, type ReactNode } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cx } from "./cx";
import { useIndicator } from "./indicator";

/**
 * - `underline`: the default; a sliding oxblood underline.
 * - `count`: underline per tab with a count badge (`count` on TabsTrigger).
 * - `segment`: a raised indicator in a recessed track.
 * - `latch`: separate buttons; the active one stays pressed in.
 * - `folder`: file-folder tabs over a raised panel.
 * - `vertical`: a side list with a sliding left bar, for settings pages.
 */
export type TabsVariant = "underline" | "count" | "segment" | "latch" | "folder" | "vertical";

const VariantContext = createContext<TabsVariant>("underline");

export interface TabsProps extends ComponentProps<typeof TabsPrimitive.Root> {
  variant?: TabsVariant;
}

/** Root: `value`, `defaultValue`, `onValueChange`, `activationMode`. */
export function Tabs({ variant = "underline", className, ...props }: TabsProps) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.Root
        orientation={variant === "vertical" ? "vertical" : "horizontal"}
        className={cx("mm-tabs", className)}
        data-variant={variant}
        {...props}
      />
    </VariantContext.Provider>
  );
}

const SLIDING: Partial<Record<TabsVariant, "x" | "y">> = { underline: "x", segment: "x", vertical: "y" };

export function TabsList({ className, children, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  const variant = useContext(VariantContext);
  const listRef = useRef<HTMLDivElement>(null);
  const axis = SLIDING[variant];
  const indicator = useIndicator(listRef, axis ?? "x");
  const segment = variant === "segment";
  return (
    <TabsPrimitive.List
      ref={listRef}
      className={cx("mm-tablist", segment && "mm-seg", className)}
      data-anim={segment ? indicator.anim : undefined}
      style={axis ? indicator.style : undefined}
      {...props}
    >
      {segment ? <span className="mm-seg-ind" aria-hidden="true" /> : null}
      {children}
      {variant === "underline" || variant === "vertical" ? <span className="mm-tab-ind" aria-hidden="true" /> : null}
    </TabsPrimitive.List>
  );
}

export interface TabsTriggerProps extends ComponentProps<typeof TabsPrimitive.Trigger> {
  /** Shown in a badge by the `count` variant. */
  count?: ReactNode;
}

export function TabsTrigger({ count, className, children, ...props }: TabsTriggerProps) {
  const variant = useContext(VariantContext);
  return (
    <TabsPrimitive.Trigger className={cx(variant === "segment" ? "mm-seg-b" : "mm-tab", className)} {...props}>
      {children}
      {variant === "count" && count !== undefined ? <span className="mm-badge">{count}</span> : null}
    </TabsPrimitive.Trigger>
  );
}

/** Pass `forceMount` to keep an inactive panel mounted so its state survives switching. */
export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cx("mm-tabpanel", className)} {...props} />;
}
