"use client";

import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cx } from "./cx";
import { ChevronDownIcon } from "./icons";

/**
 * - `plain`: hairline-separated rows with a chevron.
 * - `cards`: each section a raised card; the open one gets the oxblood outline.
 * - `minimal`: a plus/minus marker and an optional `meta` on the right.
 */
export type AccordionVariant = "plain" | "cards" | "minimal";

const VariantContext = createContext<AccordionVariant>("plain");

export type AccordionProps = ComponentProps<typeof AccordionPrimitive.Root> & { variant?: AccordionVariant };

/** Root: `type` ("single" | "multiple"), `value`, `defaultValue`, `onValueChange`, `collapsible`. */
export function Accordion({ variant = "plain", className, ...props }: AccordionProps) {
  return (
    <VariantContext.Provider value={variant}>
      <AccordionPrimitive.Root className={cx("mm-acc", className)} data-variant={variant} {...props} />
    </VariantContext.Provider>
  );
}

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cx("mm-acc-item", className)} {...props} />;
}

export interface AccordionTriggerProps extends ComponentProps<typeof AccordionPrimitive.Trigger> {
  /** Right-aligned mono detail, e.g. a count. Shown by `minimal`. */
  meta?: ReactNode;
}

export function AccordionTrigger({ meta, className, children, ...props }: AccordionTriggerProps) {
  const variant = useContext(VariantContext);
  return (
    <AccordionPrimitive.Header asChild>
      <div>
        <AccordionPrimitive.Trigger className={cx("mm-acc-h", className)} {...props}>
          {variant === "minimal" ? (
            <>
              <span className="mm-acc-title">
                <span className="mm-pm" aria-hidden="true" />
                {children}
              </span>
              {meta !== undefined ? <span className="mm-acc-meta">{meta}</span> : null}
            </>
          ) : (
            <>
              <span className="mm-acc-title">{children}</span>
              <ChevronDownIcon className="mm-chev" />
            </>
          )}
        </AccordionPrimitive.Trigger>
      </div>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className="mm-acc-body" {...props}>
      <div className={cx("mm-acc-in", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
