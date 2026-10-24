// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { useState } from "react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardImage,
  CardLink,
  CardReveal,
  CardTitle,
  Checkbox,
  Chip,
  ChipGroup,
  ConfirmDialog,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  HelpTooltip,
  IconButton,
  Input,
  Label,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
  MultiSelect,
  Progress,
  RadioGroup,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Slider,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toast,
  ToastProvider,
  Tooltip,
} from "../src/mostlymaking";
import { renderTokensCss, TOKENS_CSS, TOKENS_JSON, type DesignTokens } from "../scripts/design-tokens";

const fromRoot = (path: string) => join(__dirname, "..", path);

afterEach(cleanup);

// jsdom lacks the layout and pointer APIs Radix's popper, slider and select call.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.scrollIntoView ??= () => {};

/** Radix opens menus and selects on a primary-button pointerdown. */
function press(element: Element) {
  fireEvent.pointerDown(element, { button: 0, ctrlKey: false, pointerType: "mouse" });
}

describe("mostlymaking tokens", () => {
  it("tokens.css matches the design snapshot", () => {
    const tokens = JSON.parse(readFileSync(fromRoot(TOKENS_JSON), "utf8")) as DesignTokens;
    expect(readFileSync(fromRoot(TOKENS_CSS), "utf8")).toBe(renderTokensCss(tokens));
  });

  it("turns aliases into var() references", () => {
    const css = renderTokensCss(JSON.parse(readFileSync(fromRoot(TOKENS_JSON), "utf8")));
    expect(css).toContain("--primary: var(--oxblood);");
    expect(css).toContain("--background: #131214;");
  });
});

describe("mostlymaking control styles", () => {
  const css = readFileSync(fromRoot("src/mostlymaking/controls.css"), "utf8");

  it("never lifts, presses or recolours a disabled button", () => {
    const selectors = css.match(/\.mm-btn[^{}]*?:(?:hover|active)(?![\w-])/g) ?? [];
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) {
      expect(selector).toContain(':not(:disabled, [aria-disabled="true"])');
    }
  });

  it("keeps disabled buttons flat", () => {
    expect(css).toMatch(/\.mm-btn:disabled,\s*\.mm-btn\[aria-disabled="true"\] \{[^}]*box-shadow: none;[^}]*\}/);
  });
});

describe("mostlymaking controls", () => {
  it("Button defaults to a neutral, non-submitting button", () => {
    render(<Button>Duplicate</Button>);
    const button = screen.getByRole("button", { name: "Duplicate" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.dataset.variant).toBe("neutral");
  });

  it("Button asChild styles its child instead", () => {
    render(
      <Button asChild variant="primary">
        <a href="/boards/new">New board</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "New board" });
    expect(link.className).toContain("mm-btn");
    expect(link.dataset.variant).toBe("primary");
    expect(link.hasAttribute("type")).toBe(false);
  });

  it("IconButton is marked for the square layout", () => {
    render(<IconButton aria-label="More">…</IconButton>);
    expect(screen.getByRole("button", { name: "More" }).hasAttribute("data-icon")).toBe(true);
  });

  it("Input and Label pair up and keep the caller's classes", () => {
    render(
      <>
        <Label htmlFor="url">URL</Label>
        <Input id="url" type="url" className="w-full" aria-invalid />
      </>,
    );
    const input = screen.getByLabelText("URL");
    expect(input.className).toBe("mm-field w-full");
    expect(input.getAttribute("type")).toBe("url");
  });

  it("Select opens a list and picks an option", () => {
    const onValueChange = vi.fn();
    render(
      <Select defaultValue="newest" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Sort">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Sort" });
    expect(trigger.textContent).toContain("Newest first");
    press(trigger);
    fireEvent.click(screen.getByRole("option", { name: "Name" }));
    expect(onValueChange).toHaveBeenCalledWith("name");
    expect(trigger.textContent).toContain("Name");
  });

  it("Checkbox toggles uncontrolled, reports changes and is labelled", () => {
    const onChange = vi.fn();
    render(<Checkbox onCheckedChange={onChange}>Include EXIF</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "Include EXIF" });
    expect(box.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(box);
    expect(box.getAttribute("aria-checked")).toBe("true");
    expect(box.dataset.state).toBe("checked");
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("Checkbox without a label renders just the box", () => {
    render(<Checkbox id="nsfw" className="ml-2" aria-label="Show NSFW" />);
    const box = screen.getByRole("checkbox", { name: "Show NSFW" });
    expect(box.className).toBe("mm-box ml-2");
    expect(box.parentElement?.classList.contains("mm-check")).toBe(false);
  });

  it("Checkbox supports the indeterminate state", () => {
    render(<Checkbox checked="indeterminate">Select all</Checkbox>);
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("mixed");
  });

  it("Checkbox submits with a form", () => {
    render(
      <form aria-label="Prefs">
        <Checkbox name="exif" defaultChecked>
          Include EXIF
        </Checkbox>
      </form>,
    );
    const data = new FormData(screen.getByRole("form") as HTMLFormElement);
    expect(data.get("exif")).toBe("on");
  });

  it("Switch toggles and only animates after the first toggle", () => {
    render(<Switch defaultChecked>Auto-save</Switch>);
    const sw = screen.getByRole("switch", { name: "Auto-save" });
    const row = sw.parentElement!;
    expect(row.hasAttribute("data-moved")).toBe(false);
    fireEvent.click(sw);
    expect(sw.getAttribute("aria-checked")).toBe("false");
    expect(row.hasAttribute("data-moved")).toBe(true);
  });

  it("RadioGroup selects with clicks", () => {
    const options = [
      { value: "grid", label: "Grid" },
      { value: "list", label: "List" },
    ];
    render(<RadioGroup aria-label="Layout" options={options} defaultValue="grid" />);
    fireEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(screen.getByRole("radio", { name: "List" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Grid" }).getAttribute("aria-checked")).toBe("false");
  });

  it("SegmentedControl keeps one segment on", () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl aria-label="View" defaultValue="grid" onValueChange={onValueChange}>
        <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
        <SegmentedControlItem value="list">List</SegmentedControlItem>
      </SegmentedControl>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(screen.getByRole("radio", { name: "List" }).dataset.state).toBe("on");
    expect(screen.getByRole("radio", { name: "Grid" }).dataset.state).toBe("off");
    expect(onValueChange).toHaveBeenCalledWith("list");
    fireEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(screen.getByRole("radio", { name: "List" }).dataset.state).toBe("on");
  });

  it("ChipGroup toggles several chips", () => {
    const onValueChange = vi.fn();
    render(
      <ChipGroup type="multiple" aria-label="Tags" onValueChange={onValueChange}>
        <Chip value="dusk">dusk</Chip>
        <Chip value="rain">rain</Chip>
      </ChipGroup>,
    );
    fireEvent.click(screen.getByRole("button", { name: "dusk" }));
    fireEvent.click(screen.getByRole("button", { name: "rain" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["dusk", "rain"]);
  });

  it("Slider moves with the keyboard and shows its value", () => {
    render(<Slider id="opacity" aria-label="Opacity" defaultValue={[40]} formatValue={([v]) => `${v}%`} />);
    const thumb = screen.getByRole("slider", { name: "Opacity" });
    expect(thumb.getAttribute("aria-valuenow")).toBe("40");
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(thumb.getAttribute("aria-valuenow")).toBe("41");
    expect(screen.getByText("41%")).toBeTruthy();
  });

  it("Slider renders a thumb per value for ranges", () => {
    render(<Slider aria-label={["Minimum", "Maximum"]} defaultValue={[10, 80]} />);
    expect(screen.getByRole("slider", { name: "Minimum" }).getAttribute("aria-valuenow")).toBe("10");
    expect(screen.getByRole("slider", { name: "Maximum" }).getAttribute("aria-valuenow")).toBe("80");
  });

  it("Tabs switch panels, show counts and skip disabled tabs", () => {
    render(
      <Tabs variant="count" defaultValue="all">
        <TabsList aria-label="Filter">
          <TabsTrigger value="all" count={48}>
            All
          </TabsTrigger>
          <TabsTrigger value="unsorted" count={6}>
            Unsorted
          </TabsTrigger>
          <TabsTrigger value="fav" disabled>
            Favorites
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">Everything</TabsContent>
        <TabsContent value="unsorted">Loose</TabsContent>
        <TabsContent value="fav">Kept</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tabpanel").textContent).toBe("Everything");
    expect(screen.getByRole("tab", { name: /All/ }).textContent).toBe("All48");
    fireEvent.mouseDown(screen.getByRole("tab", { name: /Unsorted/ }), { button: 0 });
    expect(screen.getByRole("tabpanel").textContent).toBe("Loose");
    fireEvent.mouseDown(screen.getByRole("tab", { name: /Favorites/ }), { button: 0 });
    expect(screen.getByRole("tabpanel").textContent).toBe("Loose");
  });

  it("Accordion composes items from separate components", () => {
    function Panel({ value, title }: { value: string; title: string }) {
      return (
        <AccordionItem value={value}>
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent>{title} body</AccordionContent>
        </AccordionItem>
      );
    }
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" collapsible variant="cards" defaultValue="export" onValueChange={onValueChange}>
        <Panel value="export" title="Export" />
        <Panel value="storage" title="Storage" />
      </Accordion>,
    );
    const exportHeader = screen.getByRole("button", { name: "Export" });
    const storageHeader = screen.getByRole("button", { name: "Storage" });
    expect(exportHeader.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(storageHeader);
    expect(storageHeader.getAttribute("aria-expanded")).toBe("true");
    expect(exportHeader.getAttribute("aria-expanded")).toBe("false");
    expect(onValueChange).toHaveBeenLastCalledWith("storage");
  });

  it("Accordion minimal shows the meta", () => {
    render(
      <Accordion type="multiple" variant="minimal">
        <AccordionItem value="tags">
          <AccordionTrigger meta="12">Tags</AccordionTrigger>
          <AccordionContent>dusk</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole("button", { name: /Tags/ }).textContent).toBe("Tags12");
  });

  it("Card lays out a titled panel", () => {
    render(
      <Card size="sm">
        <CardHeader>
          <CardTitle>API tokens</CardTitle>
        </CardHeader>
        <CardContent>No tokens yet.</CardContent>
      </Card>,
    );
    const title = screen.getByRole("heading", { name: "API tokens" });
    expect(title.closest(".mm-card")?.getAttribute("data-size")).toBe("sm");
  });

  it("Alert announces errors", () => {
    render(<Alert tone="error">Could not save. Try again.</Alert>);
    expect(screen.getByRole("alert").textContent).toBe("Could not save. Try again.");
  });

  it("Spinner is a labelled status", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
  });

  it("Progress is indeterminate without a value", () => {
    render(
      <>
        <Progress aria-label="Exporting" />
        <Progress aria-label="Upload" value={140} />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Exporting" }).dataset.state).toBe("indeterminate");
    expect(screen.getByRole("progressbar", { name: "Upload" }).getAttribute("aria-valuenow")).toBe("100");
  });

  it("Tooltip shows on focus and describes its trigger", () => {
    render(
      <Tooltip content="Copy link">
        <IconButton aria-label="Copy">c</IconButton>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    fireEvent.focus(button);
    expect(screen.getByRole("tooltip").textContent).toBe("Copy link");
    expect(button.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("Menu opens, selects, toggles and closes", () => {
    const onMove = vi.fn();
    const onNsfw = vi.fn();
    render(
      <Menu>
        <MenuTrigger asChild>
          <IconButton aria-label="More">…</IconButton>
        </MenuTrigger>
        <MenuContent align="end">
          <MenuLabel>Board</MenuLabel>
          <MenuItem onSelect={onMove} shortcut="M">
            Move
          </MenuItem>
          <MenuCheckboxItem checked={false} onCheckedChange={onNsfw}>
            Show NSFW
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuItem destructive onSelect={vi.fn()}>
            Delete
          </MenuItem>
        </MenuContent>
      </Menu>,
    );
    const trigger = screen.getByRole("button", { name: "More" });
    press(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Board").className).toBe("mm-menu-label");
    expect(screen.getByRole("menuitem", { name: "Delete" }).hasAttribute("data-destructive")).toBe(true);
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Show NSFW" }));
    expect(onNsfw).toHaveBeenCalledWith(true);
    press(trigger);
    fireEvent.click(screen.getByRole("menuitem", { name: /Move/ }));
    expect(onMove).toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("MenuRadioItem marks and picks one value", () => {
    const onValueChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger asChild>
          <Button>Scope</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value="all" onValueChange={onValueChange}>
            <MenuRadioItem value="all">All bookmarks</MenuRadioItem>
            <MenuRadioItem value="faves">Favorites</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );
    press(screen.getByRole("button", { name: "Scope" }));
    expect(screen.getByRole("menuitemradio", { name: "All bookmarks" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByRole("menuitemradio", { name: "Favorites" }));
    expect(onValueChange).toHaveBeenCalledWith("faves");
  });

  it("Menu closes on Escape", () => {
    render(
      <Menu>
        <MenuTrigger asChild>
          <IconButton aria-label="More">…</IconButton>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Open</MenuItem>
        </MenuContent>
      </Menu>,
    );
    press(screen.getByRole("button", { name: "More" }));
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("Dialog opens from its trigger, is labelled and closes from the footer", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>New project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>Name a collection.</DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    fireEvent.click(screen.getByRole("button", { name: "New project" }));
    const dialog = screen.getByRole("dialog", { name: "New project" });
    expect(document.getElementById(dialog.getAttribute("aria-describedby")!)?.textContent).toBe("Name a collection.");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("ConfirmDialog confirms or cancels", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        trigger={<Button>Revoke</Button>}
        title="Revoke this token?"
        description="The device stops authenticating."
        confirmLabel="Revoke"
        destructive
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Revoke" }));
    const dialog = screen.getByRole("alertdialog", { name: "Revoke this token?" });
    const confirm = within(dialog).getByRole("button", { name: "Revoke" });
    expect(confirm.dataset.variant).toBe("danger");
    fireEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("Toast announces inside a provider and runs its action", () => {
    vi.useFakeTimers();
    const onShow = vi.fn();
    try {
      render(
        <ToastProvider>
          <Toast tone="success" defaultOpen action={{ label: "Show", onClick: onShow, altText: "Open the exports folder" }}>
            Exported 12 files
          </Toast>
        </ToastProvider>,
      );
      expect(screen.getAllByText("Exported 12 files").length).toBeGreaterThan(0);
      fireEvent.click(screen.getByRole("button", { name: "Show" }));
      expect(onShow).toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(6000);
      });
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Sheet", () => {
  it("opens docked to its side and closes from the close button", () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Filters</Button>
        </SheetTrigger>
        <SheetContent side="bottom" aria-describedby={undefined}>
          <SheetTitle>Filters</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const sheet = screen.getByRole("dialog", { name: "Filters" });
    expect(sheet.getAttribute("data-side")).toBe("bottom");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("CardLink", () => {
  it("is one link with an image area and a reveal bar hidden from screen readers", () => {
    render(
      <CardLink href="/belthor" aria-label="Belthor the hunter, Miniature">
        <CardImage ratio={0.8}>
          <img src="/a.jpg" alt="" />
          <CardReveal title="Belthor the hunter" meta="Miniature" />
        </CardImage>
      </CardLink>,
    );
    const link = screen.getByRole("link", { name: "Belthor the hunter, Miniature" });
    expect(link.className).toBe("mm-card-link");
    const image = link.querySelector(".mm-card-image") as HTMLElement;
    expect(image.style.aspectRatio).toBe("0.8 / 1");
    expect(link.querySelector(".mm-card-reveal")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("Miniature").className).toBe("mm-card-reveal-meta");
  });
});

describe("HelpTooltip", () => {
  it("opens on focus, closes on blur and describes the control", () => {
    render(<HelpTooltip aria-label="About preview version" content="Changing it regenerates old previews." />);
    const trigger = screen.getByRole("button", { name: "About preview version" });
    fireEvent.focus(trigger);
    expect(screen.getByText("Changing it regenerates old previews.")).toBeTruthy();
    fireEvent.blur(trigger);
    expect(screen.queryByText("Changing it regenerates old previews.")).toBeNull();
  });

  it("pins open on click for touch, and a second click closes it", () => {
    render(<HelpTooltip aria-label="About raft height" content="Measured from the build plate." />);
    const trigger = screen.getByRole("button", { name: "About raft height" });
    fireEvent.click(trigger);
    expect(screen.getByText("Measured from the build plate.")).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    expect(screen.getByText("Measured from the build plate.")).toBeTruthy();
    fireEvent.click(trigger);
    expect(screen.queryByText("Measured from the build plate.")).toBeNull();
  });

  it("closes on Escape", () => {
    render(<HelpTooltip aria-label="About" content="Help text" />);
    fireEvent.click(screen.getByRole("button", { name: "About" }));
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    expect(screen.queryByText("Help text")).toBeNull();
  });
});

describe("MultiSelect", () => {
  function Harness({ initial = [] as string[], onSearch }: { initial?: string[]; onSearch?: (s: string) => void }) {
    const [value, setValue] = useState(initial);
    return (
      <MultiSelect
        aria-label="Creator"
        options={["Lantern Minis", "Bitebrush Studio", { value: "nf", label: "Northforge" }]}
        value={value}
        onValueChange={setValue}
        onSearchChange={onSearch}
      />
    );
  }

  it("shows the placeholder, then the first choice and a count", () => {
    render(<Harness initial={["Lantern Minis", "nf"]} />);
    const trigger = screen.getByRole("button", { name: "Creator" });
    expect(trigger.textContent).toContain("Lantern Minis");
    expect(trigger.textContent).toContain("+1");
    cleanup();
    render(<Harness />);
    expect(screen.getByRole("button", { name: "Creator" }).textContent).toContain("Any");
  });

  it("toggles options with clicks and keeps chosen ones first", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Creator" }));
    const list = screen.getByRole("listbox");
    fireEvent.click(within(list).getByText("Northforge"));
    const options = within(list).getAllByRole("option");
    expect(options[0].textContent).toBe("Northforge");
    expect(options[0].getAttribute("aria-selected")).toBe("true");
    fireEvent.click(options[0]);
    expect(within(list).getByText("Northforge").closest("[role=option]")?.getAttribute("aria-selected")).toBe("false");
  });

  it("filters locally and toggles with the keyboard", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Creator" }));
    const search = screen.getByRole("combobox", { name: "Search options" });
    fireEvent.change(search, { target: { value: "bite" } });
    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["Bitebrush Studio"]);
    fireEvent.keyDown(search, { key: "Enter" });
    expect(options[0].getAttribute("aria-selected")).toBe("true");
  });

  it("leaves filtering to the caller when onSearchChange is set", () => {
    const onSearch = vi.fn();
    render(<Harness onSearch={onSearch} />);
    fireEvent.click(screen.getByRole("button", { name: "Creator" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Search options" }), { target: { value: "zzz" } });
    expect(onSearch).toHaveBeenCalledWith("zzz");
    expect(within(screen.getByRole("listbox")).getAllByRole("option")).toHaveLength(3);
  });

  it("clears every choice", () => {
    render(<Harness initial={["Lantern Minis"]} />);
    fireEvent.click(screen.getByRole("button", { name: "Creator" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("button", { name: "Creator" }).textContent).toContain("Any");
  });
});
