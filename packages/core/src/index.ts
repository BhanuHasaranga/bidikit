/**
 * @bidikit/core
 *
 * Zero-dependency RTL/LTR engine — The missing layer for bidirectional web applications.
 *
 * @packageDocumentation
 */

// Core facade
export { BidiKit, createBidiKit } from "./bidikit.js";

// Sub-modules (tree-shakable)
export { LanguageManager } from "./language.js";
export { DirectionManager, DEFAULT_RTL_LANGUAGES, isRTLLanguage, getDirection } from "./direction.js";
export { TranslationEngine, getNestedValue, interpolate, getPluralForm } from "./translation.js";
export {
  PHYSICAL_TO_LOGICAL,
  DIRECTIONAL_ICONS,
  getMirrorTransform,
  getLogicalSide,
  isDirectionalIcon,
  shouldMirrorIcon,
  getDirectionalAnimation,
  getInlineMargin,
  getInlinePadding,
} from "./rtl.js";
export { createStorageAdapter } from "./storage.js";

// Types
export type {
  Direction,
  LanguageCode,
  Locale,
  StorageBackend,
  StorageCallback,
  StorageOption,
  TranslationValue,
  PluralTranslation,
  TranslationDictionary,
  InterpolationValues,
  TranslationOptions,
  TranslationLoader,
  TranslationFunction,
  BidiConfig,
  BidiEventType,
  LanguageChangeEvent,
  DirectionChangeEvent,
  BidiEvent,
  BidiEventListener,
  BidiState,
} from "./types.js";

export type { StorageAdapter } from "./storage.js";
export type { DirectionManagerOptions } from "./direction.js";
export type { TranslationEngineOptions } from "./translation.js";
export type { DirectionalAnimation } from "./rtl.js";
