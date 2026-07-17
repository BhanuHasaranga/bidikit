/**
 * @bidikit/core - BidiKit class
 *
 * Unified facade that composes LanguageManager and TranslationEngine.
 * This is the main entry point for non-React environments.
 */

import { LanguageManager } from "./language.js";
import { TranslationEngine } from "./translation.js";
import type {
  BidiConfig,
  BidiEvent,
  BidiEventListener,
  BidiState,
  Direction,
  LanguageCode,
  Locale,
  TranslationFunction,
  TranslationOptions,
} from "./types.js";

/**
 * BidiKit - the central facade.
 *
 * Composes LanguageManager and TranslationEngine into a single,
 * easy-to-use API.
 *
 * @example
 * const bidi = new BidiKit({
 *   defaultLanguage: "en",
 *   supportedLanguages: ["en", "ar"],
 *   rtlLanguages: ["ar"],
 *   storage: "localStorage",
 * });
 *
 * await bidi.init();
 * bidi.setLanguage("ar");
 * console.log(bidi.direction); // "rtl"
 */
export class BidiKit {
  private readonly _langManager: LanguageManager;
  private readonly _translation: TranslationEngine;

  constructor(config: BidiConfig) {
    this._langManager = new LanguageManager({ config });
    this._translation = new TranslationEngine({
      language: config.defaultLanguage,
      fallbackLanguage: config.fallbackLanguage,
      defaultNamespace: config.defaultNamespace,
      translations: config.translations,
      loader: config.translationLoader,
    });
  }

  // ─── Lifecycle ───────────────────────────────

  /** Initialize: load persisted language, auto-detect, apply direction. */
  async init(): Promise<void> {
    await this._langManager.init();
    this._translation.setLanguage(this._langManager.language);
  }

  // ─── Language ────────────────────────────────

  /** Currently active language code */
  get language(): LanguageCode {
    return this._langManager.language;
  }

  /** Currently active text direction */
  get direction(): Direction {
    return this._langManager.direction;
  }

  /** Whether the current language is RTL */
  get isRTL(): boolean {
    return this._langManager.isRTL;
  }

  /** Whether the current language is LTR */
  get isLTR(): boolean {
    return this._langManager.isLTR;
  }

  /** Full locale object */
  get locale(): Locale {
    return this._langManager.locale;
  }

  /** All supported language codes */
  get supportedLanguages(): LanguageCode[] {
    return this._langManager.supportedLanguages;
  }

  /** Full runtime state snapshot */
  get state(): BidiState {
    return {
      language: this.language,
      direction: this.direction,
      isRTL: this.isRTL,
      isLTR: this.isLTR,
      locale: this.locale,
      supportedLanguages: this.supportedLanguages,
    };
  }

  /** Set the active language */
  setLanguage(language: LanguageCode): void {
    this._langManager.setLanguage(language);
    this._translation.setLanguage(language);
  }

  /** Toggle between languages */
  toggleLanguage(languages?: [LanguageCode, LanguageCode]): void {
    this._langManager.toggleLanguage(languages);
    this._translation.setLanguage(this._langManager.language);
  }

  /** Detect language from browser */
  detectLanguage(): LanguageCode {
    return this._langManager.detectLanguage();
  }

  /** Save language to storage */
  async saveLanguage(): Promise<void> {
    return this._langManager.saveLanguage();
  }

  /** Load language from storage */
  async loadLanguage(): Promise<void> {
    await this._langManager.loadLanguage();
    this._translation.setLanguage(this._langManager.language);
  }

  // ─── Events ──────────────────────────────────

  /** Subscribe to events */
  on<T extends BidiEvent>(event: T["type"], listener: BidiEventListener<T>): () => void {
    return this._langManager.on(event, listener);
  }

  /** Unsubscribe from events */
  off<T extends BidiEvent>(event: T["type"], listener: BidiEventListener<T>): void {
    this._langManager.off(event, listener);
  }

  // ─── Translation ─────────────────────────────

  /** Create a translation function bound to the current language */
  createT(overrideLanguage?: LanguageCode): TranslationFunction {
    return this._translation.createTranslationFunction(overrideLanguage);
  }

  /** Translate a key */
  t(key: string, options?: TranslationOptions): string {
    return this._translation.createTranslationFunction()(key, options);
  }

  /** Add translations at runtime */
  addTranslations(
    language: LanguageCode,
    namespace: string,
    dictionary: Record<string, unknown>,
  ): void {
    this._translation.addTranslations(
      language,
      namespace,
      dictionary as Record<string, string>,
    );
  }

  /** Load a translation namespace asynchronously */
  async loadNamespace(namespace: string, language?: LanguageCode): Promise<void> {
    return this._translation.loadNamespace(language ?? this.language, namespace);
  }

  // ─── Internal access (for framework adapters) ─

  /** @internal */
  get _languageManager(): LanguageManager {
    return this._langManager;
  }

  /** @internal */
  get _translationEngine(): TranslationEngine {
    return this._translation;
  }
}

/**
 * Create a BidiKit instance.
 *
 * @example
 * const bidi = createBidiKit({ defaultLanguage: "en", supportedLanguages: ["en", "ar"] });
 */
export function createBidiKit(config: BidiConfig): BidiKit {
  return new BidiKit(config);
}
