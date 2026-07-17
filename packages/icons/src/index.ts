/**
 * @bidikit/icons - Icon Mirroring Utilities
 *
 * Auto-flip directional icons for RTL layouts.
 * Works with Lucide, Heroicons, Tabler, FontAwesome, and custom SVG.
 */

import { isDirectionalIcon, getMirrorTransform } from "@bidikit/core";
import type { Direction } from "@bidikit/core";

export { isDirectionalIcon } from "@bidikit/core";

// ─────────────────────────────────────────────
// Icon mirroring utilities
// ─────────────────────────────────────────────

export interface IconMirrorOptions {
  /** Current text direction */
  direction: Direction;
  /** Custom set of icon names that should be mirrored */
  customMirrorList?: ReadonlySet<string>;
}

/**
 * Determine if an icon should be mirrored for the given direction.
 *
 * @example
 * shouldMirrorIcon("arrow-right", { direction: "rtl" }) // true
 * shouldMirrorIcon("heart", { direction: "rtl" })       // false
 */
export function shouldMirrorIcon(
  iconName: string,
  options: IconMirrorOptions,
): boolean {
  if (options.direction !== "rtl") return false;
  return isDirectionalIcon(iconName, options.customMirrorList);
}

/**
 * Get the CSS transform for an icon, applying mirror if needed.
 *
 * @example
 * getIconTransform("arrow-right", { direction: "rtl" })
 * // → "scaleX(-1)"
 *
 * getIconTransform("heart", { direction: "rtl" })
 * // → "none"
 */
export function getIconTransform(
  iconName: string,
  options: IconMirrorOptions,
): string {
  return getMirrorTransform(shouldMirrorIcon(iconName, options));
}

/**
 * Get inline style object for an icon with mirroring.
 *
 * @example
 * const style = getIconStyle("chevron-right", { direction: "rtl" });
 * // → { transform: "scaleX(-1)" }
 */
export function getIconStyle(
  iconName: string,
  options: IconMirrorOptions,
): { transform: string } {
  return { transform: getIconTransform(iconName, options) };
}
