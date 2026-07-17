/**
 * @bidikit/next - Server utilities
 *
 * Server Component helpers: getTranslation, generateBidiMetadata.
 * Works in Next.js Server Components, Route Handlers, and generateMetadata.
 */

import { headers } from "next/headers";
import { TranslationEngine } from "@bidikit/core";
import type {
  Direction,
  LanguageCode,
  TranslationDictionary,
  TranslationFunction,
  TranslationLoader,
} from "@bidikit/core";

// ─────────────────────────────────────────────
// Server-side locale reading
// ─────────────────────────────────────────────

/**
 * Read the active locale from request headers set by bidiMiddleware.
 * Falls back to `defaultLanguage`.
 */
export async function getServerLocale(defaultLanguage = "en"): Promise<LanguageCode> {
  try {
    const headersList = await headers();
    return headersList.get("x-bidi-locale") ?? defaultLanguage;
  } catch {
    return defaultLanguage;
  }
}

/**
 * Read the active direction from request headers set by bidiMiddleware.
 */
export async function getServerDirection(defaultLanguage = "en"): Promise<Direction> {
  try {
    const headersList = await headers();
    const dir = headersList.get("x-bidi-direction");
    if (dir === "rtl" || dir === "ltr") return dir;
    return "ltr";
  } catch {
    return defaultLanguage === "ar" || defaultLanguage === "he" ? "rtl" : "ltr";
  }
}

// ─────────────────────────────────────────────
// getTranslation — server-side t()
// ─────────────────────────────────────────────

export interface GetTranslationOptions {
  language?: LanguageCode;
  namespace?: string;
  translations?: Record<LanguageCode, Record<string, TranslationDictionary>>;
  loader?: TranslationLoader;
  fallbackLanguage?: string;
}

/**
 * Server-side translation function.
 * Use in Server Components, generateMetadata, and Route Handlers.
 *
 * @example
 * // In a Server Component:
 * const { t } = await getTranslation({ language: "ar" });
 * return <h1>{t("welcome")}</h1>;
 */
export async function getTranslation(options: GetTranslationOptions = {}): Promise<{
  t: TranslationFunction;
  locale: LanguageCode;
  direction: Direction;
}> {
  const locale = options.language ?? (await getServerLocale());
  const direction = await getServerDirection(locale);

  const engine = new TranslationEngine({
    language: locale,
    fallbackLanguage: options.fallbackLanguage ?? "en",
    defaultNamespace: options.namespace ?? "common",
    translations: options.translations,
    loader: options.loader,
  });

  if (options.loader) {
    await engine.loadNamespace(locale, options.namespace ?? "common");
  }

  return {
    t: engine.createTranslationFunction(),
    locale,
    direction,
  };
}

// ─────────────────────────────────────────────
// generateBidiMetadata — SEO helpers
// ─────────────────────────────────────────────

export interface BidiMetadataOptions {
  language?: LanguageCode;
  supportedLanguages?: LanguageCode[];
  baseUrl?: string;
  path?: string;
  title?: string;
  description?: string;
}

/**
 * Generate Next.js metadata with correct lang, dir, hreflang, and canonical.
 *
 * @example
 * export const generateMetadata = async () => generateBidiMetadata({
 *   supportedLanguages: ["en", "ar"],
 *   baseUrl: "https://example.com",
 * });
 */
export async function generateBidiMetadata(options: BidiMetadataOptions = {}) {
  const locale = options.language ?? (await getServerLocale());
  const direction = await getServerDirection(locale);
  const { supportedLanguages = ["en"], baseUrl = "", path = "" } = options;

  const alternates: Record<string, string> = {};
  for (const lang of supportedLanguages) {
    alternates[lang] = `${baseUrl}/${lang}${path}`;
  }

  return {
    title: options.title,
    description: options.description,
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    alternates: {
      canonical: `${baseUrl}/${locale}${path}`,
      languages: alternates,
    },
    other: {
      "content-language": locale,
    },
    // Note: dir and lang are set on <html> element via RootLayout
    openGraph: {
      locale,
      alternateLocale: supportedLanguages.filter((l) => l !== locale),
    },
    _bidi: { locale, direction }, // Custom field for layout use
  };
}
