mostlymaking is my personal site: a place for the tools I write and the things I make (photography, art, 3D prints). It isn't selling anything. Everything is dark and plain: a logo, type, and the work itself. No decorative shapes, patterns or illustrations.

The components are Radix Primitives styled through shadcn/ui. Every color token here uses shadcn's variable names, so the system drops straight into `globals.css` (see **Using it with shadcn/ui**).

## Voice

- Say less. Use a label where a sentence would describe it: "Work", "Tools", not "Things I built for my own workbench".
- No subtitles, overlines, taglines or helper text under headings. No descriptions on cards; the name and the image are enough.
- No marketing: no taglines, calls to action, newsletters, testimonials or "about me" story. Show the work and the tools.
- No status chatter ("Saved", "Updated 2 hours ago") unless the person needs it to act.
- Sentence case everywhere. Uppercase only through the `label` style, and only for panel labels in tools.
- Buttons are one or two words that say what happens: "Export", "New board", "Delete".
- Errors are one short sentence: what broke and what to do. "That's a .HEIC file. Use JPG or PNG."
- No emoji in UI chrome.

## Color

Dark only. Neutrals do almost all the work. Two accent colors: oxblood, a deep wine red, and brass, an old gold.

- `background` is the page; `card` lifts panels and sidebars one step; `popover` lifts floating layers one more. Separate regions with `border` hairlines, not brighter fills.
- `primary` (oxblood) is the one accent with weight: the main action per view, an on Switch, a checked Checkbox, the active Tab underline, a selected outline, and the logo's dot. White `primary-foreground` text on it. Never use it as a background behind content.
- Brass is the second color: `link` for inline links, `ring` for keyboard focus (2px solid, 2px offset), and the odd small highlight. Never fill an area with it.
- When oxblood has to be text (an active nav item, an overline), use `primary-text`, a lighter rose that reads on the dark grounds. Raw oxblood is too dark for text.
- `secondary` (faint warm tint) is for the second button and selected rows; `accent` is hover in menus and lists. Tags use `tag` with `tag-foreground`.
- `destructive` is a lighter vermilion with dark text so delete never looks like the oxblood primary. Use `destructive-text` in menus and error messages. Always add a word or icon.
- `heather`, `slate` and `sage` are for data only: chart series and `success` text.
- Text: `foreground` for body, `muted-foreground` for secondary text. All text tokens pass 6.5:1 or better on `background`, `card` and `popover`.
- `shadow-pop` is only for things that float. Cards stay flat.
- Charts take `chart-1` to `chart-5` in order.

### Rules of thumb

- On any screen, colored pixels (anything but neutrals and text) should be a small share of the area: one button, an underline, a selected outline.
- Photography and artwork bring their own color. Frame it with neutrals and keep UI color away from it.
- No decorative shapes, blobs, patterns or color blocks. If a space feels empty, leave it empty.
- Image placeholders are flat `muted` rectangles with no drawing in them.

## Type

Three families, all free on Google Fonts.

- Fira Sans Condensed 600 for the logo and for headings (`logo`, `title-lg`, `title`). Narrow and firm. Use `title-lg` once per page.
- IBM Plex Sans for everything else: `heading` (600) for card and panel titles, `body` for running text and inputs, `small` for captions and dense tool UI, `label` for uppercase panel labels.
- IBM Plex Mono for numbers and machine values (coordinates, dimensions, EXIF, file names, shortcuts) via `mono`, with `font-variant-numeric: tabular-nums`.
- Load all three with one link:
  `https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap`
- In Next.js, use `next/font/google`: `Fira_Sans_Condensed({ subsets: ["latin"], weight: ["600", "700"] })`, `IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] })` and `IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] })`, then point `--font-display` (and `--font-logo`), `--font-sans` and `--font-mono` at them.

## Space and shape

- Spacing runs on a 4px base: `space-1` (4), `space-2` (8), `space-4` (16), `space-6` (24), `space-8` (32). Lay out siblings with `gap`, not margins.
- Tools are dense: `space-2` between controls, `space-4` card padding. The main site breathes: `space-6` and `space-8` between sections.
- Radii are soft but not bubbly: `radius-sm` for checkboxes, tags and small icon buttons; `radius-md` for buttons, inputs, menus and cards; `radius-lg` for dialogs, sheets and image tiles on the main site; `radius-full` for pills and avatars.

## Logo

- The logo is a wordmark: `mostlymaking.` in lowercase Fira Sans Condensed 600 (the `logo` style), letter-spacing −0.02em, in `foreground`, with the final period in `primary` (oxblood).
- The wordmark shares its family with headings, so set the logo apart by the period, not by weight or size tricks.
- On tools and other sub-sites, the product name follows the period with no space, in lowercase, same font and size, colored `muted-foreground`: `mostlymaking.references`, `mostlymaking.findamodel`. The main site uses `mostlymaking.` alone.
- It is the only graphic. Put it top-left in every header (22–24px on the main site and in tools) and nowhere else on the page.
- Don't recolor the letters, add a container or shape behind it, or set it on `primary`.

## Iconography

- Use Lucide (shadcn's default), 16px, 1.5px stroke, colored `currentColor`, and only where an icon does a job (search, add, more, check). No decorative icons on cards or sections.

## Using it with shadcn/ui

Map the tokens onto shadcn's CSS variables in `globals.css`. The site is dark only, so put the values on `:root` and add `class="dark"` to `<html>` so shadcn's `dark:` variants also apply:

```css
:root {
  --radius: 0.625rem;
  --background: #131214;  --foreground: #ecebee;
  --card: #1b1a1d;        --card-foreground: #ecebee;
  --popover: #232126;     --popover-foreground: #ecebee;
  --primary: #a8404f;     --primary-foreground: #ffffff;
  --secondary: #2a2622;   --secondary-foreground: #e0cfa6;
  --muted: #242227;       --muted-foreground: #a9a5b0;
  --accent: #2b2528;      --accent-foreground: #ecebee;
  --destructive: #e2685c;
  --border: #34313a;      --input: #6c6874;  --ring: #c9a45c;
  --chart-1: #a8404f; --chart-2: #c9a45c; --chart-3: #94a7cc;
  --chart-4: #b892c0; --chart-5: #8fb894;
}
```

- shadcn's destructive button puts white text on `--destructive`. Change it to `text-[#1a0f0e]` (the `destructive-foreground` token); white on this vermilion fails contrast.
- Need a hover shade? Lighten the fill a few percent (for example `primary` hover `#b54c5b`) rather than adding a new hue.
- Add `link`, `primary-text`, `tag`, `tag-foreground`, `destructive-text` and `success` as extra variables and register them in your Tailwind theme if you use them as utilities.
