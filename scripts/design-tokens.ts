// Generates src/mostlymaking/tokens.css from the design system snapshot in
// design/source/system/tokens.json. Run with `pnpm design:tokens` (Node strips
// the types), and see DESIGN.md for how the snapshot is refreshed.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

interface TokenEntry {
  name: string;
  value: string | Record<string, string>;
  usage?: string;
}

interface TypeStyle {
  name: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number | string;
  letterSpacing?: string;
}

export interface DesignTokens {
  name: string;
  color: { themes: { id: string }[]; tokens: TokenEntry[] };
  type: {
    families: Record<string, string>;
    groups: { name: string; family: string; styles: TypeStyle[] }[];
  };
  [family: string]: unknown;
}

const LENGTH_FAMILIES = ["spacing", "radius", "shadow"] as const;

function firstThemeValue(value: TokenEntry["value"], theme: string): string {
  return typeof value === "string" ? value : (value[theme] ?? Object.values(value)[0]);
}

/** `{other}` aliases become `var(--other)` so the CSS keeps the relationship. */
function cssValue(value: string): string {
  const alias = /^\{([A-Za-z0-9_.-]+)\}$/.exec(value);
  return alias ? `var(--${alias[1]})` : value;
}

export function renderTokensCss(tokens: DesignTokens): string {
  const theme = tokens.color.themes[0]?.id ?? "dark";
  const lines: string[] = [
    `/* ${tokens.name} — generated from design/source/system/tokens.json by scripts/design-tokens.ts. Do not edit. */`,
    "",
    ":root {",
    "  color-scheme: dark;",
    "  /* shadcn reads --radius; radius-md is the design's default corner. */",
    "  --radius: var(--radius-md);",
  ];

  for (const token of tokens.color.tokens) {
    lines.push(`  --${token.name}: ${cssValue(firstThemeValue(token.value, theme))};`);
  }
  for (const family of LENGTH_FAMILIES) {
    const group = tokens[family] as { tokens: TokenEntry[] } | undefined;
    for (const token of group?.tokens ?? []) {
      lines.push(`  --${token.name}: ${cssValue(firstThemeValue(token.value, theme))};`);
    }
  }
  lines.push("}", "");

  // Zero specificity, so an app's next/font `--font-*` variables always win.
  lines.push(":where(:root) {");
  for (const [family, stack] of Object.entries(tokens.type.families)) {
    lines.push(`  --font-${family}: ${stack};`);
  }
  lines.push("}", "");

  // Same layer as the controls, so Tailwind utilities still override them.
  lines.push("@layer components {");
  for (const group of tokens.type.groups) {
    for (const style of group.styles) {
      lines.push(`.mm-type-${style.name} {`);
      lines.push(`  font-family: var(--font-${group.family});`);
      lines.push(`  font-size: ${style.fontSize};`);
      lines.push(`  line-height: ${style.lineHeight};`);
      lines.push(`  font-weight: ${style.fontWeight};`);
      if (style.letterSpacing) lines.push(`  letter-spacing: ${style.letterSpacing};`);
      if (style.name === "label") lines.push("  text-transform: uppercase;");
      if (group.family === "mono") lines.push("  font-variant-numeric: tabular-nums;");
      lines.push("}", "");
    }
  }
  lines.push("}", "");

  return lines.join("\n");
}

export const TOKENS_JSON = "design/source/system/tokens.json";
export const TOKENS_CSS = "src/mostlymaking/tokens.css";

if (import.meta.url.startsWith("file:") && process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const tokens = JSON.parse(readFileSync(join(root, TOKENS_JSON), "utf8")) as DesignTokens;
  writeFileSync(join(root, TOKENS_CSS), renderTokensCss(tokens));
  console.log(`Wrote ${TOKENS_CSS}`);
}
