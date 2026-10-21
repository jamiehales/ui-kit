"use client";

import type { ComponentProps, InputHTMLAttributes, Ref } from "react";
import { Label as LabelPrimitive, Select as SelectPrimitive } from "radix-ui";
import { cx } from "./cx";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "./icons";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

/** Text, number, URL, file… Set `aria-invalid` to show the error border. */
export function Input({ className, type = "text", ...props }: InputProps) {
  return <input type={type} className={cx("mm-field", className)} {...props} />;
}

export type TextareaProps = ComponentProps<"textarea">;

export function Textarea({ className, rows = 3, ...props }: TextareaProps) {
  return <textarea rows={rows} className={cx("mm-field", className)} {...props} />;
}

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root>;

/** Short noun above or beside its control: "Name", "File". No helper text under it. */
export function Label({ className, ...props }: LabelProps) {
  return <LabelPrimitive.Root className={cx("mm-form-label", className)} {...props} />;
}

/** One short sentence under a field: what broke and what to do. */
export function FieldError({ className, ...props }: ComponentProps<"p">) {
  return <p role="alert" className={cx("mm-form-error", className)} {...props} />;
}

export interface SearchFieldProps extends Omit<InputProps, "type"> {
  /** Searches have no visible label, so name them. */
  "aria-label": string;
}

export function SearchField({ className, style, ...props }: SearchFieldProps) {
  return (
    <div className={cx("mm-search", className)} style={style}>
      <SearchIcon />
      <Input type="search" {...props} />
    </div>
  );
}

/** Root: `value`, `defaultValue`, `onValueChange`, `name`, `required`, `disabled`. */
export const Select = SelectPrimitive.Root;

export function SelectTrigger({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger className={cx("mm-field mm-select", className)} {...props}>
      {children}
      <SelectPrimitive.Icon className="mm-select-icon">
        <ChevronDownIcon />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/** Shows the chosen item's text, or `placeholder`. */
export const SelectValue = SelectPrimitive.Value;

export function SelectContent({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content position="popper" sideOffset={6} className={cx("mm-menu mm-select-menu", className)} {...props}>
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={cx("mm-mi", className)} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="mm-select-check">
        <CheckIcon size={14} strokeWidth={2.5} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
