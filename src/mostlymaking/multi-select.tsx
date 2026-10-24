"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Popover } from "radix-ui";
import { cx } from "./cx";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "./icons";

export interface MultiSelectOption {
  value: string;
  /** Defaults to `value`. */
  label?: string;
}

export interface MultiSelectProps {
  /** Plain strings, or `{ value, label }` when the shown text differs. */
  options: (string | MultiSelectOption)[];
  value: string[];
  onValueChange: (value: string[]) => void;
  /** Trigger text with nothing chosen: "Any". */
  placeholder?: string;
  /**
   * For long or server-side lists: called as the search text changes, and the
   * caller passes back the matching `options`. Without it, `options` is
   * filtered here.
   */
  onSearchChange?: (search: string) => void;
  /** Shows "Loading" in place of an empty list while `onSearchChange` results load. */
  loading?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Needed when there is no `<Label htmlFor>`. */
  "aria-label"?: string;
}

function toOption(option: string | MultiSelectOption): Required<MultiSelectOption> {
  return typeof option === "string" ? { value: option, label: option } : { value: option.value, label: option.label ?? option.value };
}

/**
 * Picks several values from a long list: the trigger opens a searchable list with
 * a checkbox per option. Chosen values stay at the top even when the search hides
 * them. Arrow keys move, Enter toggles and Escape closes.
 */
export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Any",
  onSearchChange,
  loading = false,
  disabled,
  id,
  className,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const all = useMemo(() => options.map(toOption), [options]);
  const items = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matching = onSearchChange || !term ? all : all.filter((o) => o.label.toLowerCase().includes(term));
    const chosen = value.map((v) => all.find((o) => o.value === v) ?? { value: v, label: v });
    const rest = matching.filter((o) => !value.includes(o.value));
    return [...chosen, ...rest];
  }, [all, search, value, onSearchChange]);

  const updateSearch = (next: string) => {
    setSearch(next);
    setActive(0);
    onSearchChange?.(next);
  };

  const toggle = (optionValue: string) => {
    onValueChange(value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]);
  };

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(items.length - 1, index));
    setActive(next);
    listRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveTo(active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveTo(active - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = items[active];
      if (item) toggle(item.value);
    }
  };

  const labelFor = (v: string) => all.find((o) => o.value === v)?.label ?? v;
  const summary: ReactNode =
    value.length === 0 ? (
      <span className="mm-multi-placeholder">{placeholder}</span>
    ) : (
      <span className="mm-multi-value">
        {labelFor(value[0])}
        {value.length > 1 ? <span className="mm-multi-more">+{value.length - 1}</span> : null}
      </span>
    );

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && search) updateSearch("");
      }}
    >
      <Popover.Trigger asChild disabled={disabled}>
        <button type="button" id={id} className={cx("mm-field mm-select mm-multi", className)} aria-label={props["aria-label"]} disabled={disabled}>
          {summary}
          <span className="mm-select-icon">
            <ChevronDownIcon />
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={6} collisionPadding={8} className="mm-menu mm-multi-menu">
          <div className="mm-search mm-multi-search">
            <SearchIcon />
            <input
              type="search"
              className="mm-field"
              placeholder="Search"
              aria-label="Search options"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={items[active] ? `${listId}-${active}` : undefined}
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <div ref={listRef} id={listId} role="listbox" aria-multiselectable="true" aria-label={props["aria-label"] ?? "Options"} className="mm-multi-list">
            {items.map((item, index) => {
              const selected = value.includes(item.value);
              return (
                <div
                  key={item.value}
                  id={`${listId}-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={selected}
                  data-highlighted={index === active ? "" : undefined}
                  className="mm-mi mm-multi-item"
                  onPointerMove={() => setActive(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => toggle(item.value)}
                >
                  <span className="mm-box" data-state={selected ? "checked" : "unchecked"} aria-hidden="true">
                    <span className="mm-box-mark">
                      <CheckIcon />
                    </span>
                  </span>
                  <span className="mm-multi-label">{item.label}</span>
                </div>
              );
            })}
            {items.length === 0 ? <p className="mm-multi-empty">{loading ? "Loading" : "No matches"}</p> : null}
          </div>
          {value.length > 0 ? (
            <div className="mm-multi-foot">
              <button type="button" className="mm-btn" data-variant="ghost" data-size="sm" onClick={() => onValueChange([])}>
                Clear
              </button>
            </div>
          ) : null}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
