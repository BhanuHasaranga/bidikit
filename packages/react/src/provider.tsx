/**
 * @bidikit/react - BidiProvider
 *
 * Top-level context provider. Initializes BidiKit, subscribes to events,
 * and provides reactive state to all child components.
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BidiKit, type BidiConfig, type Direction, type LanguageCode } from "@bidikit/core";
import { BidiContext, type BidiContextValue } from "./context.js";

export interface BidiProviderProps {
  /** BidiKit configuration */
  config: BidiConfig;
  /** Children to render */
  children: ReactNode;
  /** Override the initial language (useful for SSR) */
  initialLanguage?: LanguageCode;
}

/**
 * BidiProvider - wrap your application with this to enable BidiKit.
 *
 * @example
 * <BidiProvider config={{ defaultLanguage: "en", supportedLanguages: ["en", "ar"] }}>
 *   <App />
 * </BidiProvider>
 */
export function BidiProvider({ config, children, initialLanguage }: BidiProviderProps) {
  // Stable BidiKit instance (created once per mount)
  const bidiRef = useRef<BidiKit | null>(null);
  if (!bidiRef.current) {
    bidiRef.current = new BidiKit(config);
  }
  const bidi = bidiRef.current;

  // Reactive language state
  const [language, setLanguageState] = useState<LanguageCode>(
    initialLanguage ?? config.defaultLanguage,
  );
  const [direction, setDirection] = useState<Direction>(
    bidi.direction,
  );

  // Initialize on mount
  useEffect(() => {
    void bidi.init().then(() => {
      setLanguageState(bidi.language);
      setDirection(bidi.direction);
    });

    // Subscribe to language changes for reactive updates
    const unsub = bidi.on("languageChange", (e: import("@bidikit/core").LanguageChangeEvent) => {
      setLanguageState(e.language);
      setDirection(e.direction);
    });

    return () => {
      unsub();
    };
  }, [bidi]);

  // Stable setLanguage callback
  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      bidi.setLanguage(lang);
    },
    [bidi],
  );

  // Stable toggleLanguage callback
  const toggleLanguage = useCallback(
    (languages?: [LanguageCode, LanguageCode]) => {
      bidi.toggleLanguage(languages);
    },
    [bidi],
  );

  // Memoised context value - only recreates when language/direction changes
  const value = useMemo<BidiContextValue>(
    () => ({
      bidi,
      language,
      direction,
      isRTL: direction === "rtl",
      isLTR: direction === "ltr",
      locale: bidi.locale,
      supportedLanguages: bidi.supportedLanguages,
      t: bidi.createT(language),
      setLanguage,
      toggleLanguage,
    }),
    [bidi, language, direction, setLanguage, toggleLanguage],
  );

  return <BidiContext.Provider value={value}>{children}</BidiContext.Provider>;
}
