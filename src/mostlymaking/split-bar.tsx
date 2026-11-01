"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cx } from "./cx";

/**
 * Moves the divider between `values[divider]` and `values[divider + 1]` to `fraction` (0–1 of the total),
 * trading size between those two neighbours only. `step` snaps the position, as a fraction of the total.
 */
export function moveSplitDivider(values: number[], divider: number, fraction: number, step = 0.005): number[] {
  const total = values.reduce((sum, value) => sum + value, 0);
  const start = values.slice(0, divider).reduce((sum, value) => sum + value, 0);
  const end = start + values[divider] + values[divider + 1];
  const snapped = step > 0 ? Math.round(fraction / step) * step * total : fraction * total;
  const clamped = Math.max(start, Math.min(end, snapped));
  return values.map((value, index) => {
    if (index === divider) return clamped - start;
    if (index === divider + 1) return end - clamped;
    return value;
  });
}

function scaleTo(values: number[], target: number): number[] {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (values.length === 0) return values;
  if (total <= 1e-9) return values.map(() => target / values.length);
  return values.map((value) => (value * target) / total);
}

/**
 * Slides segment `index` by `shift` (in value units, towards the end of the list), keeping its own size:
 * the segments before it scale evenly to fill the new space and the ones after it scale to the rest.
 * Always works from `snapshot`, so a shift of 0 gives back the same values.
 */
export function moveSplitSegment(snapshot: number[], index: number, shift: number): number[] {
  const before = snapshot.slice(0, index);
  const after = snapshot.slice(index + 1);
  const beforeTotal = before.reduce((sum, value) => sum + value, 0);
  const room = snapshot.reduce((sum, value) => sum + value, 0) - snapshot[index];
  const nextBefore = before.length === 0 ? 0 : after.length === 0 ? room : Math.max(0, Math.min(room, beforeTotal + shift));
  if (Math.abs(nextBefore - beforeTotal) < 1e-9) return snapshot;
  return [...scaleTo(before, nextBefore), snapshot[index], ...scaleTo(after, room - nextBefore)];
}

export interface SplitBarProps {
  label: ReactNode;
  /** Right-aligned mono detail, e.g. the total in mm. */
  detail?: ReactNode;
  /** Segment sizes; any unit, shown as shares of their total. */
  values: number[];
  onValueChange: (values: number[]) => void;
  selectedIndex?: number;
  /** Tapping a segment without dragging it. */
  onSelect?: (index: number) => void;
  /** Greyed out and inert, e.g. while it follows another bar. */
  disabled?: boolean;
  /** Draws the first value at the right end. */
  reversed?: boolean;
  /** Divider snapping, as a fraction of the total. */
  step?: number;
  /** A segment's content; defaults to its share as a percentage when there is room. */
  renderSegment?: (index: number, share: number) => ReactNode;
  segmentTitle?: (index: number, share: number) => string;
  /** The accessible name of the divider after `values[index]`. */
  dividerLabel?: (index: number) => string;
  className?: string;
}

interface DividerDrag {
  kind: "divider";
  pointerId: number;
  startX: number;
  lowDivider: number;
  highDivider: number;
  divider: number | null;
}

interface SegmentDrag {
  kind: "segment";
  pointerId: number;
  startX: number;
  index: number;
  snapshot: number[];
  moved: boolean;
}

const GRAB_DISTANCE = 18;
const KEY_STEP = 0.01;

/**
 * A bar split into segments that share a fixed total. Dragging a divider trades size between its two
 * neighbours; dragging a segment slides it along, scaling the segments on each side evenly.
 * Arrow keys move a focused divider by 1%.
 */
export function SplitBar({
  label,
  detail,
  values,
  onValueChange,
  selectedIndex = -1,
  onSelect,
  disabled = false,
  reversed = false,
  step = 0.005,
  renderSegment,
  segmentTitle,
  dividerLabel,
  className,
}: SplitBarProps) {
  const drag = useRef<DividerDrag | SegmentDrag | null>(null);
  const [activeDivider, setActiveDivider] = useState(-1);
  const [draggingSegment, setDraggingSegment] = useState(-1);

  const ends: number[] = [];
  let running = 0;
  for (const value of values) {
    running += value;
    ends.push(running);
  }
  const total = running;
  const dividers = ends.slice(0, -1);
  const shareOf = (value: number) => (total > 0 ? value / total : 0);
  const displayFraction = (fraction: number) => (reversed ? 1 - fraction : fraction);

  const positionOf = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return displayFraction(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))) * total;
  };

  const segmentAt = (position: number) => {
    const index = values.findIndex((value, valueIndex) => value > 1e-9 && position <= ends[valueIndex] + 1e-9);
    return index === -1 ? values.length - 1 : index;
  };

  const resetDrag = () => {
    drag.current = null;
    setActiveDivider(-1);
    setDraggingSegment(-1);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || total <= 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    let nearest = -1;
    let nearestDistance = Infinity;
    dividers.forEach((end, index) => {
      const distance = Math.abs(displayFraction(shareOf(end)) * rect.width - pointerX);
      if (distance < nearestDistance - 0.5) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    if (nearest === -1 || nearestDistance > GRAB_DISTANCE) {
      drag.current = { kind: "segment", pointerId: event.pointerId, startX: event.clientX, index: segmentAt(positionOf(event)), snapshot: values, moved: false };
      return;
    }
    let lowDivider = nearest;
    let highDivider = nearest;
    while (lowDivider > 0 && Math.abs(dividers[lowDivider - 1] - dividers[nearest]) < 1e-9) lowDivider--;
    while (highDivider < dividers.length - 1 && Math.abs(dividers[highDivider + 1] - dividers[nearest]) < 1e-9) highDivider++;
    drag.current = { kind: "divider", pointerId: event.pointerId, startX: event.clientX, lowDivider, highDivider, divider: null };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    if (state.kind === "segment") {
      if (!state.moved && Math.abs(event.clientX - state.startX) < 3) return;
      state.moved = true;
      setDraggingSegment(state.index);
      const rect = event.currentTarget.getBoundingClientRect();
      const moved = ((event.clientX - state.startX) / rect.width) * total;
      onValueChange(moveSplitSegment(state.snapshot, state.index, reversed ? -moved : moved));
      return;
    }
    const position = positionOf(event);
    let divider = state.divider;
    if (divider === null) {
      if (Math.abs(event.clientX - state.startX) < 3) return;
      divider = position > dividers[state.lowDivider] ? state.highDivider : state.lowDivider;
      state.divider = divider;
      setActiveDivider(divider);
    }
    onValueChange(moveSplitDivider(values, divider, position / total, step));
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    resetDrag();
    if (!state || state.pointerId !== event.pointerId) return;
    const stayed = state.kind === "segment" ? !state.moved : state.divider === null;
    if (stayed && Math.abs(event.clientX - state.startX) < 6) onSelect?.(segmentAt(positionOf(event)));
  };

  const handleDividerKey = (index: number) => (event: KeyboardEvent<HTMLSpanElement>) => {
    const forward = event.key === "ArrowRight" || event.key === "ArrowUp";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowDown";
    if ((!forward && !backward) || total <= 0) return;
    event.preventDefault();
    const direction = (forward ? 1 : -1) * (reversed ? -1 : 1);
    onValueChange(moveSplitDivider(values, index, shareOf(dividers[index]) + direction * KEY_STEP, step));
  };

  const order = values.map((value, index) => ({ value, index }));
  if (reversed) order.reverse();

  return (
    <div className={cx("mm-split", className)} data-disabled={disabled ? "" : undefined}>
      <div className="mm-split-head">
        <span>{label}</span>
        {detail !== undefined ? <span className="mm-split-detail">{detail}</span> : null}
      </div>
      <div
        className="mm-split-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetDrag}
      >
        {order.map(({ value, index }, position) => {
          const share = shareOf(value);
          return (
            <div
              key={index}
              className="mm-split-seg"
              data-alternate={position % 2 === 1 ? "" : undefined}
              data-selected={index === selectedIndex ? "" : undefined}
              data-dragging={index === draggingSegment ? "" : undefined}
              style={{ width: `${share * 100}%` }}
              title={segmentTitle?.(index, share)}
            >
              {renderSegment ? renderSegment(index, share) : share >= 0.14 ? `${Math.round(share * 100)}%` : null}
            </div>
          );
        })}
        {dividers.map((end, index) => (
          <span
            key={index}
            className="mm-split-divider"
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={dividerLabel?.(index) ?? `Divider ${index + 1}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(displayFraction(shareOf(end)) * 100)}
            aria-disabled={disabled || undefined}
            data-active={index === activeDivider ? "" : undefined}
            style={{ left: `${displayFraction(shareOf(end)) * 100}%` }}
            onKeyDown={disabled ? undefined : handleDividerKey(index)}
          />
        ))}
      </div>
    </div>
  );
}
