# Changelog

This changelog is written for coding agents that update apps using this kit. The kit has no releases; apps pin it as a git submodule commit. Each section is a date, newest first, and entries are added in the same commit as the change. To see what changed between the commit an app pins and a newer one, run `git -C vendor/ui-kit diff <old>..<new> -- CHANGELOG.md`.

Each entry looks like this: `- **Kind** \`entry point\`: what changed. Migration: what a consuming app must do.`

- **Kind** is one of Added, Changed, Renamed, Removed, Deprecated, Fixed or Security. An entry that breaks consuming apps also gets **Breaking**.
- The entry point is the `package.json` export, such as `@jamiehales/ui-kit/mostlymaking`.
- Name the exact symbols, parameters and variables in backticks, both old and new.
- Leave out the Migration part when an app has nothing to do.

## 2026-11-01

- **Added** `@jamiehales/ui-kit/mostlymaking`: `Accordion` takes `trailingDivider` (default `true`). Set it to `false` to drop the divider under the last item of a `plain` or `minimal` accordion, e.g. when a `Separator` already follows it. It sets `data-trailing-divider="false"` on `.mm-acc`.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `IconTooltip` (`icon`, `content`, `aria-label`, `side`, `className`), the bubble behind `HelpTooltip` with any icon as its trigger, and `WarningTooltip` (`content`, `aria-label`, `side`, `className`), a warning triangle in `--brass` with the same bubble. `HelpTooltip` is now built on `IconTooltip`; its props and look are unchanged. New types: `IconTooltipProps`, `WarningTooltipProps`.
- **Added** `@jamiehales/ui-kit/mostlymaking.css`: `.mm-icon-tip` (the shared trigger styles, now also on every `HelpTooltip` button) and `.mm-warning`. The bubble is still `.mm-help-tip` / `.mm-help-arrow` for all three.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `LinkToggle` (a lock toggle on Radix Toggle: `pressed`, `onPressedChange`), `LinkedPair` (rows joined by a bracket with a `LinkToggle` on it: `linked`, `onLinkedChange`, `label`, `linkedHint`, `unlinkedHint`, `firstAnchor`, `lastAnchor`) and `SplitBar` (a bar split into segments that share a fixed total: `values`, `onValueChange`, `selectedIndex`, `onSelect`, `disabled`, `reversed`, `step`, `renderSegment`, `segmentTitle`, `dividerLabel`), plus the pure helpers `moveSplitDivider` and `moveSplitSegment`.
- **Added** `@jamiehales/ui-kit/mostlymaking.css`: `.mm-link-toggle`, `.mm-linked*` and `.mm-split*` styles, and the `--mm-link-top` / `--mm-link-bottom` variables `LinkedPair` sets.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `Button` / `IconButton` `fullWidth`, which stretches the button to its container. Migration: replace `width: 100%` / `w-full` classes on buttons with `fullWidth`.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `Button` `destructive`, red text (`--destructive-text`) for a `ghost`, `neutral` or `link` button that deletes or cancels. Migration: replace classes that set `color: var(--destructive-text)` on those buttons with `destructive`.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `ButtonRow` `align="between"` and `DialogFooter` `align` (`"end"`, the default, or `"between"`), plus the `DialogFooterProps` type. Migration: replace `justify-content: space-between` on a `DialogFooter` with `align="between"`.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `DialogContent` `size` (`"sm"` 340px, the default; `"md"` 560px; `"lg"` 1000px; each capped at `100vw - 32px`) and the `DialogContentProps` type. Migration: replace width classes on `DialogContent` with `size`.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `SegmentedControl` `size` (`"md"` or `"sm"`, 30px tall) and `fullWidth` (fills its container and shares it equally between segments), and `SegmentedControlItem` `layout` (`"inline"` or `"stacked"`: an icon above an 11px caption) and `icon` (a square, icon-only segment), plus the `SegmentedControlItemProps` type. Migration: replace `.mm-seg-b { flex: 1 }` overrides with `fullWidth`, and column-stacked segment overrides with `layout="stacked"`.
- **Changed** `@jamiehales/ui-kit/mostlymaking.css`: `SegmentedControlItem` (`.mm-seg-b`) is now an `inline-flex` row that centres its content with a 6px gap, so an icon beside text lines up without app CSS.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `size` (`"md"` or `"sm"`, 32px tall) on `Input`, `Textarea`, `SearchField` and `SelectTrigger`, and the `FieldSize` and `SelectTriggerProps` types. `InputProps` no longer accepts the native numeric `size` attribute. Migration: replace height and font-size classes on those fields with `size="sm"`.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `CardContent` and `AccordionContent` `stack` (`"sm"` 8px, `"md"` 12px or `"lg"` 16px), which lays the children out in a column with that gap, plus the `StackGap`, `CardContentProps` and `AccordionContentProps` types. Migration: replace `flex flex-col gap-*` classes on them with `stack`, and `className="mm-stack"` on `CardContent` with `stack="lg"`.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `Spinner` `size` (`"xs"` 12px, `"sm"` 14px, `"md"` 16px, the default, or `"lg"` 24px). Migration: replace `size-3` / `size-3.5` / `size-6` and width/height classes on `Spinner` with `size`, and drop `size-4`.

## 2026-10-25

- **Fixed** `@jamiehales/ui-kit/mostlymaking.css`: pressing a button, input or other control inside a `CardLink` (`.mm-card-link`) no longer presses the whole card; only the control plays its press.
- **Changed** `@jamiehales/ui-kit/mostlymaking.css`: disabled controls no longer react to the pointer. A disabled `Button` / `IconButton` (`:disabled` or `aria-disabled="true"`) is flat, with no offset shadow, and no longer recolours, lifts or presses on hover and click. Disabled `Chip`, `Input` / `SelectTrigger` (`.mm-field`), bare `Checkbox` boxes and `SegmentedControl` no longer change on hover either; a disabled `SegmentedControl` is now dimmed.

## 2026-10-24

- **Fixed** `@jamiehales/ui-kit/mostlymaking.css`: `.mm-menu` and `.mm-tip` (`Select`, `Menu`, `MultiSelect`, `Tooltip`) and `.mm-help-tip` (`HelpTooltip`) now use `z-index: 55` instead of `50`, so they show above a `Dialog` or `Sheet` (`51`) they are opened from.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `HelpTooltip` (`content`, `aria-label`, `side`), a "?" beside a label whose bubble opens on hover or focus, pins open on click or tap, and floats in a portal so `overflow: hidden` parents don't clip it. Styles are `.mm-help`, `.mm-help-tip` and `.mm-help-arrow` in `@jamiehales/ui-kit/mostlymaking.css`.
- **Changed** `@jamiehales/ui-kit/mostlymaking.css`: the `Slider` thumb (`.mm-slider-thumb`) now has an edge and a hard offset shadow, lifts up-left on hover like the `Switch` knob and presses in while dragging, instead of scaling up on hover.
- **Fixed** `@jamiehales/ui-kit/mostlymaking`: pressing a `Slider` thumb off-centre no longer nudges the value; the thumb keeps its grab offset and only moves when dragged. Pressing the track still jumps to that spot.
- **Added** `@jamiehales/ui-kit/mostlymaking`: `MultiSelect` (`options`, `value`, `onValueChange`, `placeholder`, `onSearchChange`, `loading`) and the `MultiSelectOption` type, a searchable checkbox list for choosing several values; pass `onSearchChange` to filter on the server. Styles are the `.mm-multi*` classes.

## 2026-10-22

- **Fixed** `@jamiehales/ui-kit/mostlymaking.css`: `.mm-dialog` (`DialogContent`) now caps its height at `100dvh - 32px` instead of `100vh - 32px`, so tall dialogs fit the visible screen on mobile browsers instead of running off the top and bottom.

## 2026-10-21

- **Added** `@jamiehales/ui-kit/mostlymaking`, `@jamiehales/ui-kit/mostlymaking.css` and `@jamiehales/ui-kit/mostlymaking/tokens.css`: the mostlymaking controls, moved here from `@jamiehales/next-kit/ui/mostlymaking`, `@jamiehales/next-kit/ui/mostlymaking.css` and `@jamiehales/next-kit/ui/mostlymaking/tokens.css` unchanged. Earlier history is in next-kit's CHANGELOG.md.
