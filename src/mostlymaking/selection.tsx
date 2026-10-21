"use client";

import { useId, useRef, useState, type ComponentProps, type ReactNode, type Ref } from "react";
import {
  Checkbox as CheckboxPrimitive,
  Label,
  RadioGroup as RadioGroupPrimitive,
  Slider as SliderPrimitive,
  Switch as SwitchPrimitive,
  ToggleGroup,
} from "radix-ui";
import { cx } from "./cx";
import { CheckIcon } from "./icons";
import { useIndicator } from "./indicator";
import { useControllable } from "./use-controllable";

interface FormControlProps {
  /** Submits with a surrounding form under this name. */
  name?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Needed when there is no visible label (`children`). */
  "aria-label"?: string;
}

export type CheckedState = boolean | "indeterminate";

export interface CheckboxProps extends FormControlProps {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  /** Visible label beside the box. */
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

/** `indeterminate` draws a dash, for a "select all" over a partial selection. */
export function Checkbox({ children, className, id, ...props }: CheckboxProps) {
  const autoId = useId();
  const boxId = id ?? autoId;
  const box = (
    <CheckboxPrimitive.Root id={boxId} className={cx("mm-box", !children && className)} {...props}>
      <CheckboxPrimitive.Indicator forceMount className="mm-box-mark">
        <CheckIcon />
        <svg className="mm-box-dash" aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <path d="M6 12h12" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  // Without a label it is just the box, to sit beside a separate <Label htmlFor>.
  if (!children) return box;
  return (
    <span className={cx("mm-check", className)} data-disabled={props.disabled ? "" : undefined}>
      {box}
      <Label.Root htmlFor={boxId} className="mm-check-label">
        {children}
      </Label.Root>
    </span>
  );
}

export interface ChoiceOption<T extends string = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> {
  options: ChoiceOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
}

export function RadioGroup<T extends string = string>({ options, onValueChange, className, orientation = "vertical", ...props }: RadioGroupProps<T>) {
  const id = useId();
  return (
    <RadioGroupPrimitive.Root
      className={cx("mm-radio-group", className)}
      orientation={orientation}
      onValueChange={onValueChange as ((value: string) => void) | undefined}
      {...props}
    >
      {options.map((option, index) => (
        <span key={option.value} className="mm-check" data-disabled={props.disabled || option.disabled ? "" : undefined}>
          <RadioGroupPrimitive.Item id={`${id}-${index}`} value={option.value} disabled={option.disabled} className="mm-box" data-kind="radio">
            <RadioGroupPrimitive.Indicator forceMount className="mm-dot" />
          </RadioGroupPrimitive.Item>
          <Label.Root htmlFor={`${id}-${index}`} className="mm-check-label">
            {option.label}
          </Label.Root>
        </span>
      ))}
    </RadioGroupPrimitive.Root>
  );
}

export interface SwitchProps extends FormControlProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visible label beside the switch. */
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function Switch({ children, className, id, onCheckedChange, ...props }: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  // The knob's slide keyframes only run after a toggle, never on mount.
  const [moved, setMoved] = useState(false);
  // The row carries the hover and press states, so a bare switch still gets one.
  return (
    <span className={cx("mm-switch-row", className)} data-moved={moved ? "" : undefined} data-disabled={props.disabled ? "" : undefined}>
      <SwitchPrimitive.Root
        id={switchId}
        className="mm-switch"
        onCheckedChange={(checked) => {
          setMoved(true);
          onCheckedChange?.(checked);
        }}
        {...props}
      >
        <SwitchPrimitive.Thumb className="mm-knob" />
      </SwitchPrimitive.Root>
      {children ? (
        <Label.Root htmlFor={switchId} className="mm-check-label">
          {children}
        </Label.Root>
      ) : null}
    </span>
  );
}

export interface SegmentedControlProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
  /** SegmentedControlItem elements. */
  children: ReactNode;
}

/** A view switch ("Grid", "List", "Board"); use Tabs when it swaps a panel. Always keeps one segment on. */
export function SegmentedControl({ value, defaultValue, onValueChange, className, children, ...props }: SegmentedControlProps) {
  const [current, setCurrent] = useControllable<string | undefined>(value, defaultValue, onValueChange as (v: string | undefined) => void);
  const listRef = useRef<HTMLDivElement>(null);
  const indicator = useIndicator(listRef);
  return (
    <ToggleGroup.Root
      ref={listRef}
      type="single"
      value={current ?? ""}
      // Radix sends "" when the pressed segment is clicked again; a segmented control never empties.
      onValueChange={(next) => {
        if (next) setCurrent(next);
      }}
      className={cx("mm-seg", className)}
      data-anim={indicator.anim}
      style={indicator.style}
      {...props}
    >
      <span className="mm-seg-ind" aria-hidden="true" />
      {children}
    </ToggleGroup.Root>
  );
}

export function SegmentedControlItem({ className, ...props }: ComponentProps<typeof ToggleGroup.Item>) {
  return <ToggleGroup.Item className={cx("mm-seg-b", className)} {...props} />;
}

export type ChipGroupProps = ComponentProps<typeof ToggleGroup.Root>;

/** Wrapping row of toggleable chips, e.g. tag filters. `type="multiple"` for several at once. */
export function ChipGroup({ className, ...props }: ChipGroupProps) {
  return <ToggleGroup.Root className={cx("mm-chips", className)} {...props} />;
}

export function Chip({ className, ...props }: ComponentProps<typeof ToggleGroup.Item>) {
  return <ToggleGroup.Item className={cx("mm-chip", className)} {...props} />;
}

export interface SliderProps {
  /** One number per thumb: `[40]` for a single slider, `[10, 80]` for a range. */
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  /** Fires once when the person lets go. */
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  name?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  /** Names each thumb; one label for all thumbs, or one per thumb. */
  "aria-label"?: string | string[];
  /** Shows the value beside the track, e.g. `([v]) => `${v}%``. */
  formatValue?: (value: number[]) => ReactNode;
  className?: string;
}

export function Slider({
  value,
  defaultValue = [0],
  onValueChange,
  formatValue,
  className,
  "aria-label": ariaLabel,
  ...props
}: SliderProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  return (
    <div className={cx("mm-slider-row", className)}>
      <SliderPrimitive.Root className="mm-slider" value={current} onValueChange={setCurrent} {...props}>
        <SliderPrimitive.Track className="mm-slider-track">
          <SliderPrimitive.Range className="mm-slider-range" />
        </SliderPrimitive.Track>
        {current.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="mm-slider-thumb"
            aria-label={Array.isArray(ariaLabel) ? ariaLabel[index] : ariaLabel}
          />
        ))}
      </SliderPrimitive.Root>
      {formatValue ? <span className="mm-slider-value">{formatValue(current)}</span> : null}
    </div>
  );
}
