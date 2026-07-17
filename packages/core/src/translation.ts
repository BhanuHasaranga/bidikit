/**
 * @bidikit/core - TranslationEngine
 *
 * Loads and resolves translation keys with:
 * - Nested key access (dot notation)
 * - String interpolation ({{variable}})
 * - Pluralization (CLDR plural rules)
 * - Fallback language
 * - Lazy namespace loading
 */

import type {
  LanguageCode,
  PluralTranslation,
  TranslationDictionary,
  TranslationFunction,
  TranslationLoader,
  TranslationOptions,
  TranslationValue,
} from "./types.js";

export interface TranslationEngineOptions {
  /** Default language */
  language: LanguageCode;
  /** Fallback language when key is missing */
  fallbackLanguage?: LanguageCode;
  /** Default namespace (default: "common") */
  defaultNamespace?: string;
  /** Preloaded translations: { [language]: { [namespace]: dict } } */
  translations?: Record<LanguageCode, Record<string, TranslationDictionary>>;
  /** Async loader for namespaces */
  loader?: TranslationLoader;
}

/**
 * TranslationEngine handles all translation lookups.
 */
export class TranslationEngine {
  private _language: LanguageCode;
  private readonly _fallback?: LanguageCode;
  private readonly _defaultNs: string;
  private readonly _loader?: TranslationLoader;
  /** Nested map: language → namespace → dictionary */
  private readonly _store = new Map<LanguageCode, Map<string, TranslationDictionary>>();
  private readonly _loading = new Map<string, Promise<void>>();

  constructor(options: TranslationEngineOptions) {
    this._language = options.language;
    this._fallback = options.fallbackLanguage;
    this._defaultNs = options.defaultNamespace ?? "common";
    this._loader = options.loader;

    // Preload provided translations
    if (options.translations) {
      for (const [lang, namespaces] of Object.entries(options.translations)) {
        for (const [ns, dict] of Object.entries(namespaces)) {
          this._set(lang, ns, dict);
        }
      }
    }
  }

  // ─── Public API ──────────────────────────────

  /** Update the active language */
  setLanguage(language: LanguageCode): void {
    this._language = language;
  }

  /** Get the active language */
  getLanguage(): LanguageCode {
    return this._language;
  }

  /**
   * Add translations for a language/namespace.
   */
  addTranslations(
    language: LanguageCode,
    namespace: string,
    dictionary: TranslationDictionary,
  ): void {
    this._set(language, namespace, dictionary);
  }

  /**
   * Load a namespace asynchronously if a loader is configured.
   */
  async loadNamespace(language: LanguageCode, namespace: string): Promise<void> {
    if (!this._loader) return;
    const cacheKey = `${language}:${namespace}`;
    if (this._has(language, namespace)) return;
    if (this._loading.has(cacheKey)) {
      return this._loading.get(cacheKey);
    }
    const promise = this._loader(language, namespace)
      .then((dict) => {
        this._set(language, namespace, dict);
        this._loading.delete(cacheKey);
      })
      .catch((err: unknown) => {
        this._loading.delete(cacheKey);
        console.warn(`[BidiKit] Failed to load namespace "${namespace}" for "${language}":`, err);
      });
    this._loading.set(cacheKey, promise);
    return promise;
  }

  /**
   * Create a bound translation function for the current state.
   *
   * @example
   * const t = engine.createTranslationFunction();
   * t("welcome");
   * t("auth.login.title");
   * t("items", { count: 5 });
   */
  createTranslationFunction(overrideLanguage?: LanguageCode): TranslationFunction {
    return (key: string, options?: TranslationOptions): string => {
      const language = overrideLanguage ?? this._language;
      return this._resolve(key, language, options);
    };
  }

  // ─── Private resolution ──────────────────────

  private _resolve(
    key: string,
    language: LanguageCode,
    options?: TranslationOptions,
  ): string {
    const ns = options?.ns ?? this._defaultNs;

    // Try active language
    let raw = this._lookup(key, language, ns);

    // Try fallback language
    if (raw === undefined && this._fallback && this._fallback !== language) {
      raw = this._lookup(key, this._fallback, ns);
    }

    // Use defaultValue or raw key as last resort
    if (raw === undefined) {
      return options?.defaultValue ?? key;
    }

    // Pluralization
    if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
      const plural = raw as PluralTranslation;
      const count = options?.count ?? 0;
      const form = getPluralForm(count);
      raw = plural[form] ?? plural.other;
    }

    if (typeof raw !== "string") {
      return options?.defaultValue ?? key;
    }

    // Interpolation
    return interpolate(raw, options);
  }

  private _lookup(
    key: string,
    language: LanguageCode,
    namespace: string,
  ): TranslationValue | undefined {
    const nsMap = this._store.get(language);
    if (!nsMap) return undefined;
    const dict = nsMap.get(namespace);
    if (!dict) return undefined;
    return getNestedValue(dict, key);
  }

  private _set(
    language: LanguageCode,
    namespace: string,
    dictionary: TranslationDictionary,
  ): void {
    if (!this._store.has(language)) {
      this._store.set(language, new Map());
    }
    const nsMap = this._store.get(language)!;
    const existing = nsMap.get(namespace) ?? {};
    nsMap.set(namespace, deepMerge(existing, dictionary));
  }

  private _has(language: LanguageCode, namespace: string): boolean {
    return this._store.get(language)?.has(namespace) ?? false;
  }
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

/**
 * Resolve a dot-separated key against a nested dictionary.
 *
 * @example
 * getNestedValue({ auth: { login: { title: "Sign In" } } }, "auth.login.title")
 * // → "Sign In"
 */
export function getNestedValue(
  obj: Record<string, TranslationValue>,
  key: string,
): TranslationValue | undefined {
  // First try exact key match (flat key with dots, e.g. "auth.login.title")
  if (key in obj) return obj[key];

  // Then resolve as a dot-separated nested path
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return undefined;
    current = current[part];
  }
  return current as TranslationValue | undefined;
}

/**
 * Apply string interpolation, replacing {{variable}} placeholders.
 *
 * @example
 * interpolate("Hello, {{name}}!", { name: "World" })
 * // → "Hello, World!"
 */
export function interpolate(template: string, values?: Record<string, string | number | boolean | undefined>): string {
  if (!values) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

/** CLDR plural categories */
type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

/**
 * Get the CLDR plural category for a count.
 * Simplified English-compatible rule set.
 */
export function getPluralForm(count: number): PluralCategory {
  if (count === 0) return "zero";
  if (count === 1) return "one";
  if (count === 2) return "two";
  return "other";
}

/**
 * Deep merge two plain objects (right overwrites left).
 */
function deepMerge(
  target: Record<string, TranslationValue>,
  source: Record<string, TranslationValue>,
): Record<string, TranslationValue> {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      typeof target[key] === "object" &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, TranslationValue>,
        value as Record<string, TranslationValue>,
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}
