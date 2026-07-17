/**
 * @bidikit/core - Type definitions
 *
 * All shared types for the BidiKit ecosystem.
 */

// ─────────────────────────────────────────────
// Direction & Language
// ─────────────────────────────────────────────

/** Text direction */
export type Direction = "ltr" | "rtl";

/** A BCP 47 language tag string (e.g., "en", "ar", "he") */
export type LanguageCode = string;

/** Full locale object */
export interface Locale {
  /** BCP 47 language code */
  code: LanguageCode;
  /** Text direction */
  direction: Direction;
  /** Human-readable name (in the locale's own language) */
  name?: string;
  /** Human-readable name in English */
  nameInEnglish?: string;
}

// ─────────────────────────────────────────────
// Storage
// ─────────────────────────────────────────────

/** Built-in storage backends */
export type StorageBackend = "localStorage" | "cookie" | "sessionStorage" | "url" | "subdomain";

/** Custom storage callback */
export interface StorageCallback {
  /** Read the stored language code */
  get(): LanguageCode | null | Promise<LanguageCode | null>;
  /** Persist a language code */
  set(language: LanguageCode): void | Promise<void>;
  /** Remove the stored language code */
  remove(): void | Promise<void>;
}

export type StorageOption = StorageBackend | StorageCallback;

// ─────────────────────────────────────────────
// Translation
// ─────────────────────────────────────────────

/** Raw translation message value */
export type TranslationValue = string | PluralTranslation | Record<string, unknown>;

/** Plural translation map */
export interface PluralTranslation {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/** Flat or nested translation dictionary */
export type TranslationDictionary = Record<string, TranslationValue>;

/** Translation interpolation variables */
export type InterpolationValues = Record<string, string | number | boolean>;

/** Options for the t() function */
export interface TranslationOptions {
  /** Count used for pluralization */
  count?: number;
  /** Override namespace for this call */
  ns?: string;
  /** Default value if key is missing */
  defaultValue?: string;
  /** Interpolation variables */
  [key: string]: string | number | boolean | undefined;
}

/** Loader function for async translation namespaces */
export type TranslationLoader = (
  language: LanguageCode,
  namespace: string,
) => Promise<TranslationDictionary>;

/** Translation function */
export type TranslationFunction = (key: string, options?: TranslationOptions) => string;

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

/** BidiKit configuration object */
export interface BidiConfig {
  /** Default language code (e.g., "en") */
  defaultLanguage: LanguageCode;
  /** Fallback language when a translation key is missing */
  fallbackLanguage?: LanguageCode;
  /** All supported language codes */
  supportedLanguages: LanguageCode[];
  /** Language codes that use RTL direction */
  rtlLanguages?: LanguageCode[];
  /** Storage backend for language persistence */
  storage?: StorageOption;
  /** Auto-detect language from browser settings */
  autoDetect?: boolean;
  /** Automatically update document.dir and document.lang on language change */
  autoDirection?: boolean;
  /** Automatically mirror directional icons in RTL */
  mirrorIcons?: boolean;
  /** Automatically mirror images marked with `mirror` prop */
  mirrorImages?: boolean;
  /** Enable RTL-aware animations */
  animations?: boolean;
  /** Namespace for translations (default: "common") */
  defaultNamespace?: string;
  /** Custom translation loader for async/remote translations */
  translationLoader?: TranslationLoader;
  /** Initial translations to preload */
  translations?: Record<LanguageCode, Record<string, TranslationDictionary>>;
}

// ─────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────

export type BidiEventType = "languageChange" | "directionChange";

export interface LanguageChangeEvent {
  type: "languageChange";
  previousLanguage: LanguageCode;
  language: LanguageCode;
  direction: Direction;
}

export interface DirectionChangeEvent {
  type: "directionChange";
  previousDirection: Direction;
  direction: Direction;
}

export type BidiEvent = LanguageChangeEvent | DirectionChangeEvent;

export type BidiEventListener<T extends BidiEvent = BidiEvent> = (event: T) => void;

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────

/** Full BidiKit runtime state */
export interface BidiState {
  language: LanguageCode;
  direction: Direction;
  isRTL: boolean;
  isLTR: boolean;
  locale: Locale;
  supportedLanguages: LanguageCode[];
}
