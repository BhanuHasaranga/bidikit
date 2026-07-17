/**
 * @bidikit/next - Middleware
 *
 * Locale detection and direction setup for Next.js middleware.
 * Reads locale from cookie → Accept-Language header → default.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { LanguageCode } from "@bidikit/core";
import { getDirection, DEFAULT_RTL_LANGUAGES } from "@bidikit/core";

export interface BidiMiddlewareOptions {
  /** All supported language codes */
  supportedLanguages?: LanguageCode[];
  /** Default language */
  defaultLanguage?: LanguageCode;
  /** RTL language codes */
  rtlLanguages?: LanguageCode[];
  /** Cookie name for stored language */
  cookieName?: string;
  /** Whether to add locale prefix to URL paths */
  localizeUrl?: boolean;
}

const DEFAULT_OPTIONS: Required<BidiMiddlewareOptions> = {
  supportedLanguages: ["en"],
  defaultLanguage: "en",
  rtlLanguages: [...DEFAULT_RTL_LANGUAGES],
  cookieName: "bidikit-language",
  localizeUrl: false,
};

/**
 * Detect locale from request: cookie → Accept-Language → default.
 */
export function detectLocale(
  request: NextRequest,
  options: Required<BidiMiddlewareOptions>,
): LanguageCode {
  const { supportedLanguages, defaultLanguage, cookieName } = options;

  // 1. Cookie
  const cookie = request.cookies.get(cookieName)?.value;
  if (cookie && supportedLanguages.includes(cookie)) return cookie;

  // 2. Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const locales = acceptLanguage
      .split(",")
      .map((l) => l.split(";")[0]?.trim() ?? "")
      .filter(Boolean);

    for (const locale of locales) {
      if (supportedLanguages.includes(locale)) return locale;
      const base = locale.split("-")[0];
      if (base && supportedLanguages.includes(base)) return base;
    }
  }

  return defaultLanguage;
}

/**
 * BidiKit Next.js middleware.
 *
 * Detects locale, sets headers for SSR, and optionally redirects to locale URLs.
 *
 * @example
 * // middleware.ts
 * import { createBidiMiddleware } from "@bidikit/next/middleware";
 * export const middleware = createBidiMiddleware({
 *   supportedLanguages: ["en", "ar"],
 *   defaultLanguage: "en",
 * });
 * export const config = { matcher: ["/((?!_next|api|favicon).*)"] };
 */
export function createBidiMiddleware(options: BidiMiddlewareOptions = {}) {
  const resolved = { ...DEFAULT_OPTIONS, ...options };

  return function bidiMiddleware(request: NextRequest): NextResponse {
    const locale = detectLocale(request, resolved);
    const direction = getDirection(locale, new Set(resolved.rtlLanguages));

    const response = NextResponse.next();

    // Set locale headers for Server Components to read
    response.headers.set("x-bidi-locale", locale);
    response.headers.set("x-bidi-direction", direction);

    // Set cookie if not already set or different
    const existingCookie = request.cookies.get(resolved.cookieName)?.value;
    if (existingCookie !== locale) {
      response.cookies.set(resolved.cookieName, locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
  };
}

/**
 * Default middleware export for simple setups.
 * Uses `bidikit.config.ts` defaults when available.
 */
export const bidiMiddleware = createBidiMiddleware();
