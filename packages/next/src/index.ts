/**
 * @bidikit/next
 *
 * Next.js integration for BidiKit.
 *
 * @packageDocumentation
 */

export { BidiServerProvider } from "./provider.js";
export type { BidiServerProviderProps } from "./provider.js";

export {
  getServerLocale,
  getServerDirection,
  getTranslation,
  generateBidiMetadata,
} from "./server.js";
export type { GetTranslationOptions, BidiMetadataOptions } from "./server.js";

export {
  createBidiMiddleware,
  bidiMiddleware,
  detectLocale,
} from "./middleware.js";
export type { BidiMiddlewareOptions } from "./middleware.js";
