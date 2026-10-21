import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

export type IndicatorAxis = "x" | "y";

const ACTIVE = '[data-state="active"], [data-state="on"]';

/**
 * Tracks the active item inside `listRef` (Radix marks it `data-state="active"`
 * or `"on"`) and returns CSS variables for a sliding indicator: --mm-x/--mm-w
 * (or --mm-y/--mm-h), --mm-fx (where it slid from) and `anim`, which alternates
 * between "1" and "2" on every change so the slide keyframes replay. `anim`
 * stays undefined until the first change, so nothing animates on mount.
 */
export function useIndicator(
  listRef: RefObject<HTMLElement | null>,
  axis: IndicatorAxis = "x",
): { style: CSSProperties; anim: "1" | "2" | undefined } {
  const [box, setBox] = useState<{ pos: number; size: number; from: number } | null>(null);
  const [anim, setAnim] = useState<"1" | "2" | undefined>(undefined);
  const active = useRef<Element | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const item = list.querySelector<HTMLElement>(ACTIVE);
      if (!item) return;
      if (active.current && active.current !== item) setAnim((prev) => (prev === "1" ? "2" : "1"));
      active.current = item;
      const pos = axis === "x" ? item.offsetLeft : item.offsetTop;
      const size = axis === "x" ? item.offsetWidth : item.offsetHeight;
      setBox((prev) => (prev?.pos === pos && prev.size === size ? prev : { pos, size, from: prev?.pos ?? pos }));
    };
    measure();
    const mutations = new MutationObserver(measure);
    mutations.observe(list, { subtree: true, attributes: true, attributeFilter: ["data-state"] });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resize?.observe(list);
    return () => {
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [listRef, axis]);

  if (!box) return { style: {}, anim };
  const style =
    axis === "x"
      ? { "--mm-x": `${box.pos}px`, "--mm-w": `${box.size}px`, "--mm-fx": `${box.from}px` }
      : { "--mm-y": `${box.pos}px`, "--mm-h": `${box.size}px` };
  return { style: style as CSSProperties, anim };
}
