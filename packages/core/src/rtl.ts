/**
 * @bidikit/core - RTLEngine
 *
 * CSS logical property helpers, direction utilities, icon mirror maps,
 * and animation direction management.
 */

import type { Direction } from "./types.js";

// ─────────────────────────────────────────────
// CSS Logical Property Mapping
// ─────────────────────────────────────────────

/**
 * Map of physical CSS properties to their logical equivalents.
 * Used for converting LTR-centric CSS to direction-aware CSS.
 */
export const PHYSICAL_TO_LOGICAL: Readonly<Record<string, string>> = {
  left: "inline-start",
  right: "inline-end",
  "margin-left": "margin-inline-start",
  "margin-right": "margin-inline-end",
  "padding-left": "padding-inline-start",
  "padding-right": "padding-inline-end",
  "border-left": "border-inline-start",
  "border-right": "border-inline-end",
  "border-left-width": "border-inline-start-width",
  "border-right-width": "border-inline-end-width",
  "border-top-left-radius": "border-start-start-radius",
  "border-top-right-radius": "border-start-end-radius",
  "border-bottom-left-radius": "border-end-start-radius",
  "border-bottom-right-radius": "border-end-end-radius",
  "text-align: left": "text-align: start",
  "text-align: right": "text-align: end",
  float: "float",
  clear: "clear",
};

/**
 * Returns the CSS transform needed to mirror an element for RTL.
 */
export function getMirrorTransform(isRTL: boolean): string {
  return isRTL ? "scaleX(-1)" : "none";
}

/**
 * Returns "start" for LTR, "end" for RTL (or vice versa).
 */
export function getLogicalSide(
  physicalSide: "left" | "right",
  direction: Direction,
): "start" | "end" {
  if (direction === "ltr") {
    return physicalSide === "left" ? "start" : "end";
  }
  return physicalSide === "left" ? "end" : "start";
}

// ─────────────────────────────────────────────
// Icon Mirror Map
// ─────────────────────────────────────────────

/**
 * Set of icon names that should be mirrored in RTL.
 * These are directional icons whose visual meaning flips in RTL.
 */
export const DIRECTIONAL_ICONS: ReadonlySet<string> = new Set([
  // Arrows
  "arrow-left",
  "arrow-right",
  "arrow-circle-left",
  "arrow-circle-right",
  "arrow-alt-circle-left",
  "arrow-alt-circle-right",
  // Chevrons
  "chevron-left",
  "chevron-right",
  "chevron-double-left",
  "chevron-double-right",
  // Navigation
  "back",
  "forward",
  "next",
  "previous",
  "skip-back",
  "skip-forward",
  // Reply / Send
  "reply",
  "reply-all",
  "send",
  "share",
  // Playback
  "play",
  "play-circle",
  "fast-forward",
  "rewind",
  // Expand / Collapse
  "expand",
  "collapse",
  "open-in-new",
  // Indent
  "indent",
  "outdent",
  // Other directional
  "quote-left",
  "quote-right",
  "align-left",
  "align-right",
  "sort-asc",
  "sort-desc",
  "enter",
  "exit",
  "log-in",
  "log-out",
  "login",
  "logout",
  "arrow-forward",
  "arrow-back",
]);

/**
 * Check if an icon name is directional and should be mirrored in RTL.
 *
 * @example
 * isDirectionalIcon("arrow-right") // true
 * isDirectionalIcon("heart") // false
 */
export function isDirectionalIcon(
  iconName: string,
  customIcons?: ReadonlySet<string>,
): boolean {
  const name = iconName.toLowerCase().replace(/[_\s]/g, "-");
  // If a custom set is provided, use ONLY that set (it replaces the default)
  if (customIcons !== undefined) return customIcons.has(name);
  return DIRECTIONAL_ICONS.has(name);
}

/**
 * Determine if an icon should be mirrored given the current direction.
 *
 * @example
 * shouldMirrorIcon("arrow-right", "rtl") // true
 * shouldMirrorIcon("heart", "rtl") // false
 */
export function shouldMirrorIcon(
  iconName: string,
  direction: Direction,
  customIcons?: ReadonlySet<string>,
): boolean {
  if (direction !== "rtl") return false;
  return isDirectionalIcon(iconName, customIcons);
}

// ─────────────────────────────────────────────
// Animation Direction
// ─────────────────────────────────────────────

/**
 * Animation types that need direction reversal in RTL.
 */
export type DirectionalAnimation =
  | "slide-left"
  | "slide-right"
  | "slide-in"
  | "slide-out"
  | "drawer-left"
  | "drawer-right"
  | "toast-left"
  | "toast-right"
  | "sidebar-left"
  | "sidebar-right";

/**
 * Get the RTL-aware animation name for a given animation.
 *
 * @example
 * getDirectionalAnimation("slide-left", "rtl") // "slide-right"
 * getDirectionalAnimation("slide-left", "ltr") // "slide-left"
 */
export function getDirectionalAnimation(
  animation: DirectionalAnimation,
  direction: Direction,
): DirectionalAnimation {
  if (direction === "ltr") return animation;

  const mirror: Partial<Record<DirectionalAnimation, DirectionalAnimation>> = {
    "slide-left": "slide-right",
    "slide-right": "slide-left",
    "drawer-left": "drawer-right",
    "drawer-right": "drawer-left",
    "toast-left": "toast-right",
    "toast-right": "toast-left",
    "sidebar-left": "sidebar-right",
    "sidebar-right": "sidebar-left",
  };

  return mirror[animation] ?? animation;
}

// ─────────────────────────────────────────────
// Spacing Helpers
// ─────────────────────────────────────────────

/**
 * Returns RTL-aware inline margin style object.
 *
 * @example
 * getInlineMargin(16, 0, "rtl")
 * // → { marginInlineStart: "16px", marginInlineEnd: "0px" }
 */
export function getInlineMargin(
  start: number | string,
  end: number | string,
  _direction: Direction,
): { marginInlineStart: string; marginInlineEnd: string } {
  const fmt = (v: number | string) => (typeof v === "number" ? `${v}px` : v);
  return {
    marginInlineStart: fmt(start),
    marginInlineEnd: fmt(end),
  };
}

/**
 * Returns RTL-aware inline padding style object.
 */
export function getInlinePadding(
  start: number | string,
  end: number | string,
  _direction: Direction,
): { paddingInlineStart: string; paddingInlineEnd: string } {
  const fmt = (v: number | string) => (typeof v === "number" ? `${v}px` : v);
  return {
    paddingInlineStart: fmt(start),
    paddingInlineEnd: fmt(end),
  };
}
