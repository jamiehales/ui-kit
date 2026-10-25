# Changelog

This changelog is written for coding agents that update apps using this kit. The kit has no releases; apps pin it as a git submodule commit. Each section is a date, newest first, and entries are added in the same commit as the change. To see what changed between the commit an app pins and a newer one, run `git -C vendor/ui-kit diff <old>..<new> -- CHANGELOG.md`.

Each entry looks like this: `- **Kind** \`entry point\`: what changed. Migration: what a consuming app must do.`

- **Kind** is one of Added, Changed, Renamed, Removed, Deprecated, Fixed or Security. An entry that breaks consuming apps also gets **Breaking**.
- The entry point is the `package.json` export, such as `@jamiehales/ui-kit/mostlymaking`.
- Name the exact symbols, parameters and variables in backticks, both old and new.
- Leave out the Migration part when an app has nothing to do.

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
