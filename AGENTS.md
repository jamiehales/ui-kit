# Agent notes

- Shared UI kit for the Next.js apps, consumed as a git submodule at `vendor/ui-kit` and transpiled by the apps. Each entry point is listed under `exports` in `package.json`.
- next-kit's `ApiTokenCard` (`@jamiehales/next-kit/ui/mostlymaking/api-token-card`) is built from these controls, so check it still typechecks after an API change.
- Check changes with `pnpm typecheck` and `pnpm test`.

## Changelog

Keep [CHANGELOG.md](CHANGELOG.md) up to date in the same change as the code. Agents that update the consuming apps read it to learn what moved.

Add an entry under today's date heading (`## YYYY-MM-DD`, newest first; reuse the heading if it already exists) for any change a consuming app could notice:
- new or removed exports, parameters, options, props or CSS variables
- renames
- changed defaults or behavior
- new peer dependency requirements

Follow the entry format at the top of the file:
- Name the exact old and new identifiers.
- Mark anything that breaks apps as **Breaking**.
- Give a one-line Migration step.

Leave out internal refactors, tests and docs. There is no Unreleased section and no commit hashes: the entry ships in the same commit as the change. To see what changed between two pinned kit commits, run `git diff <old>..<new> -- CHANGELOG.md`.

## Design

The controls in `src/mostlymaking/` follow the mostlymaking design artifacts. Read [DESIGN.md](DESIGN.md) before changing them. It has the artifact links, the snapshot in `design/source/`, and the steps for updating the code when the design changes.
