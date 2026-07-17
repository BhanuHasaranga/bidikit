/**
 * @bidikit/react - BidiContext
 *
 * React context that holds the BidiKit instance and reactive state.
 */

import { createContext, useContext } from "react";
import type { BidiKit } from "@bidikit/core";
import type {
  Direction,
  LanguageCode,
  Locale,
  TranslationFunction,
} from "@bidikit/core";

// ─────────────────────────────────────────────
// Context value type
// ─────────────────────────────────────────────

export interface BidiContextValue {
  /** BidiKit instance */
  bidi: BidiKit;
  /** Active language code */
  language: LanguageCode;
  /** Active text direction */
  direction: Direction;
  /** Whether the current language is RTL */
  isRTL: boolean;
  /** Whether the current language is LTR */
  isLTR: boolean;
  /** Full locale object */
  locale: Locale;
  /** All supported language codes */
  supportedLanguages: LanguageCode[];
  /** Translation function bound to active language */
  t: TranslationFunction;
  /** Set the active language */
  setLanguage: (language: LanguageCode) => void;
  /** Toggle between languages */
  toggleLanguage: (languages?: [LanguageCode, LanguageCode]) => void;
}

// ─────────────────────────────────────────────
// Create context (undefined default forces error in useContext)
// ─────────────────────────────────────────────

export const BidiContext = createContext<BidiContextValue | undefined>(undefined);

BidiContext.displayName = "BidiContext";

/**
 * Internal hook to consume BidiContext — throws if used outside BidiProvider.
 */
export function useBidiContext(): BidiContextValue {
  const ctx = useContext(BidiContext);
  if (!ctx) {
    throw new Error(
      "[BidiKit] useBidiContext must be used inside <BidiProvider>. " +
        "Wrap your application with <BidiProvider config={...}>.",
    );
  }
  return ctx;
}
