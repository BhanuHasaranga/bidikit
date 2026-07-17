/**
 * @bidikit/tailwind - Tailwind CSS Plugin
 *
 * Adds logical property utilities and rtl:/ltr: variants to Tailwind CSS.
 * Compatible with Tailwind CSS v3 and v4.
 */

import plugin from "tailwindcss/plugin";

export interface BidiKitTailwindOptions {
  /** Include RTL/LTR variants (rtl:, ltr:) - default: true */
  variants?: boolean;
  /** Include logical spacing utilities (ms-*, me-*, ps-*, pe-*) - default: true */
  spacing?: boolean;
  /** Include logical border radius (rounded-s-*, rounded-e-*) - default: true */
  borderRadius?: boolean;
  /** Include logical borders (border-s-*, border-e-*) - default: true */
  borders?: boolean;
  /** Include text-start, text-end - default: true */
  textAlign?: boolean;
  /** Include start-*, end-* inset utilities - default: true */
  inset?: boolean;
}

const DEFAULT_OPTIONS: Required<BidiKitTailwindOptions> = {
  variants: true,
  spacing: true,
  borderRadius: true,
  borders: true,
  textAlign: true,
  inset: true,
};

/**
 * BidiKit Tailwind CSS plugin.
 *
 * @example
 * // tailwind.config.js
 * import { bidikit } from "@bidikit/tailwind";
 * export default {
 *   plugins: [bidikit()],
 * };
 */
export function bidikit(options: BidiKitTailwindOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return plugin(
    function ({ addUtilities, matchUtilities, addVariant, theme }) {
      // ─── RTL/LTR Variants ──────────────────────────────
      if (opts.variants) {
        addVariant("rtl", '[dir="rtl"] &');
        addVariant("ltr", '[dir="ltr"] &');
        // Also handle when dir is on the element itself
        addVariant("rtl-self", '&[dir="rtl"]');
        addVariant("ltr-self", '&[dir="ltr"]');
      }

      // ─── Text Alignment ────────────────────────────────
      if (opts.textAlign) {
        addUtilities({
          ".text-start": { "text-align": "start" },
          ".text-end": { "text-align": "end" },
        });
      }

      // ─── Logical Spacing (margin-inline) ────────────────
      if (opts.spacing) {
        const spacingScale = theme("spacing") as Record<string, string>;

        // margin-inline-start (ms-*)
        matchUtilities(
          {
            ms: (value: string) => ({ "margin-inline-start": value }),
          },
          { values: spacingScale, supportsNegativeValues: true },
        );

        // margin-inline-end (me-*)
        matchUtilities(
          {
            me: (value: string) => ({ "margin-inline-end": value }),
          },
          { values: spacingScale, supportsNegativeValues: true },
        );

        // padding-inline-start (ps-*)
        matchUtilities(
          {
            ps: (value: string) => ({ "padding-inline-start": value }),
          },
          { values: spacingScale },
        );

        // padding-inline-end (pe-*)
        matchUtilities(
          {
            pe: (value: string) => ({ "padding-inline-end": value }),
          },
          { values: spacingScale },
        );
      }

      // ─── Logical Inset (start-*, end-*) ─────────────────
      if (opts.inset) {
        const spacingScale = theme("spacing") as Record<string, string>;
        const insetScale = { ...spacingScale, auto: "auto", "1/2": "50%", full: "100%" };

        matchUtilities(
          {
            start: (value: string) => ({ "inset-inline-start": value }),
          },
          { values: insetScale, supportsNegativeValues: true },
        );

        matchUtilities(
          {
            end: (value: string) => ({ "inset-inline-end": value }),
          },
          { values: insetScale, supportsNegativeValues: true },
        );
      }

      // ─── Logical Border Radius ───────────────────────────
      if (opts.borderRadius) {
        const borderRadiusScale = theme("borderRadius") as Record<string, string>;

        matchUtilities(
          {
            "rounded-s": (value: string) => ({
              "border-start-start-radius": value,
              "border-end-start-radius": value,
            }),
            "rounded-e": (value: string) => ({
              "border-start-end-radius": value,
              "border-end-end-radius": value,
            }),
            "rounded-ss": (value: string) => ({
              "border-start-start-radius": value,
            }),
            "rounded-se": (value: string) => ({
              "border-start-end-radius": value,
            }),
            "rounded-es": (value: string) => ({
              "border-end-start-radius": value,
            }),
            "rounded-ee": (value: string) => ({
              "border-end-end-radius": value,
            }),
          },
          { values: borderRadiusScale },
        );
      }

      // ─── Logical Borders ──────────────────────────────────
      if (opts.borders) {
        const borderWidthScale = theme("borderWidth") as Record<string, string>;
        const borderColorScale = theme("borderColor") as Record<string, string>;

        matchUtilities(
          {
            "border-s": (value: string) => ({ "border-inline-start-width": value }),
            "border-e": (value: string) => ({ "border-inline-end-width": value }),
          },
          { values: borderWidthScale },
        );

        matchUtilities(
          {
            "border-s-color": (value: string) => ({ "border-inline-start-color": value }),
            "border-e-color": (value: string) => ({ "border-inline-end-color": value }),
          },
          { values: borderColorScale },
        );
      }
    },
  );
}

export default bidikit;
