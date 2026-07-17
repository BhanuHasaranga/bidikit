/**
 * @bidikit/core - LanguageManager
 *
 * Detects, sets, persists, toggles, and synchronises the active language.
 */

import { DirectionManager } from "./direction.js";
import { createStorageAdapter, type StorageAdapter } from "./storage.js";
import type {
  BidiConfig,
  BidiEvent,
  BidiEventListener,
  Direction,
  LanguageCode,
  Locale,
} from "./types.js";

export interface LanguageManagerOptions {
  config: BidiConfig;
}

/**
 * LanguageManager — the central state manager for language and direction.
 *
 * @example
 * const manager = new LanguageManager({ config });
 * await manager.init();
 * manager.setLanguage("ar");
 */
export class LanguageManager {
  private _language: LanguageCode;
  private readonly _config: BidiConfig;
  private readonly _storage: StorageAdapter;
  private readonly _direction: DirectionManager;
  private readonly _listeners = new Map<string, Set<BidiEventListener>>();

  constructor({ config }: LanguageManagerOptions) {
    this._config = config;
    this._language = config.defaultLanguage;
    this._storage = createStorageAdapter(config.storage);
    this._direction = new DirectionManager({
      rtlLanguages: config.rtlLanguages,
      autoDirection: config.autoDirection ?? true,
    });
  }

  // ─── Getters ─────────────────────────────────

  /** Currently active language code */
  get language(): LanguageCode {
    return this._language;
  }

  /** Currently active text direction */
  get direction(): Direction {
    return this._direction.direction;
  }

  /** Whether the current language is RTL */
  get isRTL(): boolean {
    return this._direction.isRTL;
  }

  /** Whether the current language is LTR */
  get isLTR(): boolean {
    return this._direction.isLTR;
  }

  /** Full locale object for the active language */
  get locale(): Locale {
    return {
      code: this._language,
      direction: this._direction.direction,
    };
  }

  /** All supported language codes */
  get supportedLanguages(): LanguageCode[] {
    return [...this._config.supportedLanguages];
  }

  // ─── Lifecycle ───────────────────────────────

  /**
   * Initialise the manager: load persisted language or detect from browser.
   * Should be called once on app startup.
   */
  async init(): Promise<void> {
    let language: LanguageCode | null = null;

    // 1. Try storage
    const stored = await Promise.resolve(this._storage.get());
    if (stored && this._isSupported(stored)) {
      language = stored;
    }

    // 2. Auto-detect from browser
    if (!language && (this._config.autoDetect ?? true)) {
      language = this._detectFromBrowser();
    }

    // 3. Fall back to default
    if (!language) {
      language = this._config.defaultLanguage;
    }

    this._applyLanguage(language, false);
  }

  // ─── Public API ──────────────────────────────

  /**
   * Get the currently active language code.
   */
  getLanguage(): LanguageCode {
    return this._language;
  }

  /**
   * Set the active language. Persists to storage and updates direction.
   *
   * @throws {Error} if the language is not in supportedLanguages
   */
  setLanguage(language: LanguageCode): void {
    if (!this._isSupported(language)) {
      throw new Error(
        `[BidiKit] Language "${language}" is not supported. Supported: ${this._config.supportedLanguages.join(", ")}`,
      );
    }
    if (language === this._language) return;
    this._applyLanguage(language, true);
  }

  /**
   * Toggle between two languages (or cycle through all supported languages).
   *
   * @param languages - Optional pair to toggle between. Defaults to cycling all supported languages.
   */
  toggleLanguage(languages?: [LanguageCode, LanguageCode]): void {
    if (languages) {
      const [a, b] = languages;
      this.setLanguage(this._language === a ? b : a);
    } else {
      const supported = this._config.supportedLanguages;
      const currentIndex = supported.indexOf(this._language);
      const nextIndex = (currentIndex + 1) % supported.length;
      const next = supported[nextIndex];
      if (next) this.setLanguage(next);
    }
  }

  /**
   * Detect the best language from browser/environment signals.
   */
  detectLanguage(): LanguageCode {
    return this._detectFromBrowser() ?? this._config.defaultLanguage;
  }

  /**
   * Save the current language to storage explicitly.
   */
  async saveLanguage(): Promise<void> {
    await Promise.resolve(this._storage.set(this._language));
  }

  /**
   * Load the language from storage and apply it.
   */
  async loadLanguage(): Promise<void> {
    const stored = await Promise.resolve(this._storage.get());
    if (stored && this._isSupported(stored)) {
      this._applyLanguage(stored, false);
    }
  }

  // ─── Event System ────────────────────────────

  /**
   * Subscribe to BidiKit events.
   *
   * @example
   * manager.on("languageChange", ({ language }) => console.log(language));
   */
  on<T extends BidiEvent>(
    event: T["type"],
    listener: BidiEventListener<T>,
  ): () => void {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event)!.add(listener as BidiEventListener);
    return () => this.off(event, listener);
  }

  /**
   * Unsubscribe from BidiKit events.
   */
  off<T extends BidiEvent>(event: T["type"], listener: BidiEventListener<T>): void {
    this._listeners.get(event)?.delete(listener as BidiEventListener);
  }

  // ─── Private ─────────────────────────────────

  private _applyLanguage(language: LanguageCode, persist: boolean): void {
    const previousLanguage = this._language;
    const previousDirection = this._direction.direction;

    this._language = language;
    this._direction.apply(language);

    const currentDirection = this._direction.direction;

    if (persist) {
      void Promise.resolve(this._storage.set(language));
    }

    // Emit languageChange
    this._emit({
      type: "languageChange",
      previousLanguage,
      language,
      direction: currentDirection,
    });

    // Emit directionChange only if direction changed
    if (previousDirection !== currentDirection) {
      this._emit({
        type: "directionChange",
        previousDirection,
        direction: currentDirection,
      });
    }
  }

  private _emit(event: BidiEvent): void {
    const listeners = this._listeners.get(event.type);
    if (!listeners) return;
    for (const listener of listeners) {
      listener(event);
    }
  }

  private _isSupported(language: LanguageCode): boolean {
    return this._config.supportedLanguages.includes(language);
  }

  private _detectFromBrowser(): LanguageCode | null {
    if (typeof navigator === "undefined") return null;

    const candidates = [
      navigator.language,
      ...(navigator.languages ?? []),
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;
      // Exact match
      if (this._isSupported(candidate)) return candidate;
      // Base language match (e.g., "en-US" → "en")
      const base = candidate.split("-")[0];
      if (base && this._isSupported(base)) return base;
    }

    return null;
  }
}
