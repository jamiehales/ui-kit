# Changelog

This changelog is written for coding agents that update apps using this kit. The kit has no releases; apps pin it as a git submodule commit. Each section is a date, newest first, and entries are added in the same commit as the change. To see what changed between the commit an app pins and a newer one, run `git -C vendor/ui-kit diff <old>..<new> -- CHANGELOG.md`.

Each entry looks like this: `- **Kind** \`entry point\`: what changed. Migration: what a consuming app must do.`

- **Kind** is one of Added, Changed, Renamed, Removed, Deprecated, Fixed or Security. An entry that breaks consuming apps also gets **Breaking**.
- The entry point is the `package.json` export, such as `@jamiehales/ui-kit/mostlymaking`.
- Name the exact symbols, parameters and variables in backticks, both old and new.
- Leave out the Migration part when an app has nothing to do.

## 2026-10-21

- **Added** `@jamiehales/ui-kit/mostlymaking`, `@jamiehales/ui-kit/mostlymaking.css` and `@jamiehales/ui-kit/mostlymaking/tokens.css`: the mostlymaking controls, moved here from `@jamiehales/next-kit/ui/mostlymaking`, `@jamiehales/next-kit/ui/mostlymaking.css` and `@jamiehales/next-kit/ui/mostlymaking/tokens.css` unchanged. Earlier history is in next-kit's CHANGELOG.md.
