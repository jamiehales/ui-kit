"use client";

import { useCallback, useEffect, useRef } from "react";

const LOCK_DISTANCE = 8;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.5; // px/ms
const SETTLE_MS = 200;

/**
 * Drag-down-to-dismiss for a bottom sheet (`SheetContent side="bottom"`). A downward touch drag that starts
 * while the sheet is scrolled to the top moves the sheet with the finger;
 * releasing far or fast enough slides it off and calls `onDismiss`, otherwise
 * it springs back. Any other gesture scrolls the sheet as usual.
 *
 * Touch events (not pointer events) because the listener must be non-passive
 * to stop iOS from rubber-banding the scroll container mid-drag.
 */
export function useSwipeToDismiss<T extends HTMLElement>(onDismiss: () => void) {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback((el: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!el) return;

    let start: { x: number; y: number; atTop: boolean } | null = null;
    let mode: "drag" | "scroll" | null = null;
    let offset = 0;
    let last = { y: 0, t: 0 };
    let velocity = 0;

    function setOffset(value: number, transition: string) {
      el!.style.transition = transition;
      el!.style.transform = value ? `translateY(${value}px)` : "";
    }

    function onStart(event: TouchEvent) {
      if (event.touches.length !== 1) {
        start = null;
        return;
      }
      const touch = event.touches[0];
      start = { x: touch.clientX, y: touch.clientY, atTop: el!.scrollTop <= 0 };
      mode = null;
      offset = 0;
      velocity = 0;
      last = { y: touch.clientY, t: event.timeStamp };
    }

    function onMove(event: TouchEvent) {
      if (!start || mode === "scroll") return;
      const touch = event.touches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (!mode) {
        if (Math.abs(dx) < LOCK_DISTANCE && Math.abs(dy) < LOCK_DISTANCE) return;
        mode = start.atTop && dy > 0 && dy > Math.abs(dx) ? "drag" : "scroll";
        if (mode === "scroll") return;
      }
      event.preventDefault();
      offset = Math.max(0, dy);
      const dt = event.timeStamp - last.t;
      if (dt > 0) velocity = (touch.clientY - last.y) / dt;
      last = { y: touch.clientY, t: event.timeStamp };
      setOffset(offset, "none");
    }

    function onEnd() {
      const dragged = mode === "drag";
      start = null;
      mode = null;
      if (!dragged) return;
      if (offset > DISMISS_DISTANCE || (offset > LOCK_DISTANCE * 3 && velocity > DISMISS_VELOCITY)) {
        // Slide off ourselves, then skip the sheet's own close animation so it
        // doesn't jump back up to replay it.
        el!.style.transition = `transform ${SETTLE_MS}ms ease-out`;
        el!.style.transform = "translateY(100%)";
        window.setTimeout(() => {
          el!.style.animation = "none";
          onDismissRef.current();
        }, SETTLE_MS);
      } else {
        setOffset(0, `transform ${SETTLE_MS}ms ease-out`);
      }
    }

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    cleanupRef.current = () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, []);
}
