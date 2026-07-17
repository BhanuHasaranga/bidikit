/**
 * @bidikit/core - DirectionManager
 *
 * Manages document direction (dir), language (lang), CSS custom properties,
 * and body classes based on the active language.
 */

import type { Direction, LanguageCode } from "./types.js";

/** Default RTL language codes per Unicode CLDR and browser defaults */
export const DEFAULT_RTL_LANGUAGES: ReadonlySet<LanguageCode> = new Set([
  "ar", // Arabic
  "he", // Hebrew
  "fa", // Persian / Farsi
  "ur", // Urdu
  "sd", // Sindhi
  "ku", // Kurdish (Sorani)
  "ps", // Pashto
  "ks", // Kashmiri
  "ug", // Uyghur
  "dv", // Divehi / Maldivian
  "yi", // Yiddish
  "arc", // Aramaic
  "az-Arab", // Azerbaijani (Arabic script)
]);

export interface DirectionManagerOptions {
  /** Custom set of RTL language codes */
  rtlLanguages?: ReadonlyArray<LanguageCode>;
  /** Whether to auto-update document.dir and document.lang */
  autoDirection?: boolean;
  /** CSS custom property prefix (default: "--bidi") */
  cssPropertyPrefix?: string;
}

/**
 * Determines if a given language code is RTL.
 *
 * @param language - BCP 47 language code
 * @param rtlLanguages - Optional custom set of RTL codes
 */
export function isRTLLanguage(
  language: LanguageCode,
  rtlLanguages?: ReadonlySet<LanguageCode>,
): boolean {
  const set = rtlLanguages ?? DEFAULT_RTL_LANGUAGES;
  // Check exact match first
  if (set.has(language)) return true;
  // Check base language (e.g., "ar-SA" → "ar")
  const base = language.split("-")[0];
  if (base && set.has(base)) return true;
  return false;
}

/**
 * Gets the text direction for a given language code.
 */
export function getDirection(
  language: LanguageCode,
  rtlLanguages?: ReadonlySet<LanguageCode>,
): Direction {
  return isRTLLanguage(language, rtlLanguages) ? "rtl" : "ltr";
}

/**
 * DirectionManager — handles all DOM direction side-effects.
 */
export class DirectionManager {
  private readonly rtlLanguages: ReadonlySet<LanguageCode>;
  private readonly autoDirection: boolean;
  private readonly cssPrefix: string;
  private _direction: Direction = "ltr";
  private _language: LanguageCode = "en";

  constructor(options: DirectionManagerOptions = {}) {
    this.rtlLanguages = new Set([
      ...DEFAULT_RTL_LANGUAGES,
      ...(options.rtlLanguages ?? []),
    ]);
    this.autoDirection = options.autoDirection ?? true;
    this.cssPrefix = options.cssPropertyPrefix ?? "--bidi";
  }

  /** Current text direction */
  get direction(): Direction {
    return this._direction;
  }

  /** Current language code */
  get language(): LanguageCode {
    return this._language;
  }

  /** Whether the current direction is RTL */
  get isRTL(): boolean {
    return this._direction === "rtl";
  }

  /** Whether the current direction is LTR */
  get isLTR(): boolean {
    return this._direction === "ltr";
  }

  /**
   * Updates the direction state and, if autoDirection is enabled,
   * applies all DOM/CSS side-effects.
   */
  apply(language: LanguageCode): void {
    const direction = getDirection(language, this.rtlLanguages);
    const previous = this._direction;

    this._language = language;
    this._direction = direction;

    if (this.autoDirection) {
      this._applyToDOM(language, direction, previous);
    }
  }

  /**
   * Check if a language is RTL using the configured RTL language set.
   */
  isRTLLanguage(language: LanguageCode): boolean {
    return isRTLLanguage(language, this.rtlLanguages);
  }

  // ─── Private DOM mutations ───────────────────

  private _applyToDOM(
    language: LanguageCode,
    direction: Direction,
    previousDirection: Direction,
  ): void {
    if (typeof document === "undefined") return;

    const html = document.documentElement;

    // 1. Set dir attribute
    html.dir = direction;

    // 2. Set lang attribute
    html.lang = language;

    // 3. CSS custom properties on :root
    html.style.setProperty(`${this.cssPrefix}-direction`, direction);
    html.style.setProperty(`${this.cssPrefix}-is-rtl`, direction === "rtl" ? "1" : "0");
    html.style.setProperty(`${this.cssPrefix}-start`, direction === "rtl" ? "right" : "left");
    html.style.setProperty(`${this.cssPrefix}-end`, direction === "rtl" ? "left" : "right");

    // 4. Body classes
    if (typeof document.body !== "undefined") {
      document.body.classList.remove(
        `bidi-${previousDirection}`,
        "bidi-rtl",
        "bidi-ltr",
      );
      document.body.classList.add(`bidi-${direction}`);
    }

    // 5. Meta theme-color is not direction-sensitive, skip.
  }
}
