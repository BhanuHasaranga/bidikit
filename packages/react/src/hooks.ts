/**
 * @bidikit/react - Hooks
 *
 * All public React hooks for consuming BidiKit state.
 */

"use client";

import { useMemo } from "react";
import { useBidiContext } from "./context.js";
import type { Direction, LanguageCode, Locale, TranslationFunction, TranslationOptions } from "@bidikit/core";
import { shouldMirrorIcon, getMirrorTransform } from "@bidikit/core";

// ─────────────────────────────────────────────
// useLanguage
// ─────────────────────────────────────────────

export interface UseLanguageReturn {
  /** Currently active language code */
  language: LanguageCode;
  /** All supported language codes */
  supportedLanguages: LanguageCode[];
  /** Set the active language */
  setLanguage: (language: LanguageCode) => void;
  /** Toggle between two languages or cycle through all */
  toggleLanguage: (languages?: [LanguageCode, LanguageCode]) => void;
}

/**
 * Hook for language management.
 *
 * @example
 * const { language, setLanguage, toggleLanguage } = useLanguage();
 * setLanguage("ar");
 */
export function useLanguage(): UseLanguageReturn {
  const { language, supportedLanguages, setLanguage, toggleLanguage } = useBidiContext();
  return useMemo(
    () => ({ language, supportedLanguages, setLanguage, toggleLanguage }),
    [language, supportedLanguages, setLanguage, toggleLanguage],
  );
}

// ─────────────────────────────────────────────
// useDirection
// ─────────────────────────────────────────────

export interface UseDirectionReturn {
  /** Current text direction */
  direction: Direction;
  /** Whether the current direction is RTL */
  isRTL: boolean;
  /** Whether the current direction is LTR */
  isLTR: boolean;
}

/**
 * Hook for direction state.
 *
 * @example
 * const { direction, isRTL } = useDirection();
 */
export function useDirection(): UseDirectionReturn {
  const { direction, isRTL, isLTR } = useBidiContext();
  return useMemo(() => ({ direction, isRTL, isLTR }), [direction, isRTL, isLTR]);
}

// ─────────────────────────────────────────────
// useTranslation
// ─────────────────────────────────────────────

export interface UseTranslationReturn {
  /** Translation function */
  t: TranslationFunction;
  /** Current locale */
  locale: Locale;
  /** Current language code */
  language: LanguageCode;
}

/**
 * Hook for translations.
 *
 * @example
 * const { t } = useTranslation();
 * return <h1>{t("welcome")}</h1>;
 */
export function useTranslation(): UseTranslationReturn {
  const { t, locale, language } = useBidiContext();
  return useMemo(() => ({ t, locale, language }), [t, locale, language]);
}

// ─────────────────────────────────────────────
// useRTL
// ─────────────────────────────────────────────

/**
 * Simple boolean hook — returns true if current direction is RTL.
 *
 * @example
 * const isRTL = useRTL();
 */
export function useRTL(): boolean {
  return useBidiContext().isRTL;
}

// ─────────────────────────────────────────────
// useLocale
// ─────────────────────────────────────────────

/**
 * Hook for the full locale object.
 *
 * @example
 * const locale = useLocale();
 * console.log(locale.code, locale.direction);
 */
export function useLocale(): Locale {
  return useBidiContext().locale;
}

// ─────────────────────────────────────────────
// useMirror
// ─────────────────────────────────────────────

export interface UseMirrorReturn {
  /** Whether content should be mirrored in the current direction */
  shouldMirror: (iconName: string) => boolean;
  /** CSS transform value for mirroring an icon */
  mirrorTransform: (iconName: string) => string;
  /** Inline style object for mirroring */
  mirrorStyle: (iconName: string) => { transform: string };
}

/**
 * Hook for icon and element mirroring.
 *
 * @example
 * const { mirrorStyle } = useMirror();
 * return <ChevronRight style={mirrorStyle("chevron-right")} />;
 */
export function useMirror(): UseMirrorReturn {
  const { direction } = useBidiContext();

  return useMemo(
    () => ({
      shouldMirror: (iconName: string) => shouldMirrorIcon(iconName, direction),
      mirrorTransform: (iconName: string) =>
        getMirrorTransform(shouldMirrorIcon(iconName, direction)),
      mirrorStyle: (iconName: string) => ({
        transform: getMirrorTransform(shouldMirrorIcon(iconName, direction)),
      }),
    }),
    [direction],
  );
}

// ─────────────────────────────────────────────
// useT — shorthand translation hook
// ─────────────────────────────────────────────

/**
 * Shorthand hook that returns just the translation function `t`.
 *
 * @example
 * const t = useT();
 * return <p>{t("greeting", { name: "World" })}</p>;
 */
export function useT(): (key: string, options?: TranslationOptions) => string {
  return useBidiContext().t;
}
