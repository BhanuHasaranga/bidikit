/**
 * @bidikit/core - StorageAdapter
 *
 * Pluggable storage backends for persisting the active language.
 */

import type { LanguageCode, StorageCallback, StorageOption } from "./types.js";

/** Unified interface for all storage backends */
export interface StorageAdapter {
  /** Read the stored language code */
  get(): LanguageCode | null | Promise<LanguageCode | null>;
  /** Persist a language code */
  set(language: LanguageCode): void | Promise<void>;
  /** Remove the stored language code */
  remove(): void | Promise<void>;
}

const STORAGE_KEY = "bidikit-language";

// ─────────────────────────────────────────────
// localStorage
// ─────────────────────────────────────────────

function createLocalStorageAdapter(): StorageAdapter {
  const isAvailable = (): boolean => {
    try {
      const test = "__bidikit_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  return {
    get(): LanguageCode | null {
      if (typeof window === "undefined" || !isAvailable()) return null;
      return localStorage.getItem(STORAGE_KEY);
    },
    set(language: LanguageCode): void {
      if (typeof window === "undefined" || !isAvailable()) return;
      localStorage.setItem(STORAGE_KEY, language);
    },
    remove(): void {
      if (typeof window === "undefined" || !isAvailable()) return;
      localStorage.removeItem(STORAGE_KEY);
    },
  };
}

// ─────────────────────────────────────────────
// sessionStorage
// ─────────────────────────────────────────────

function createSessionStorageAdapter(): StorageAdapter {
  const isAvailable = (): boolean => {
    try {
      const test = "__bidikit_test__";
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  return {
    get(): LanguageCode | null {
      if (typeof window === "undefined" || !isAvailable()) return null;
      return sessionStorage.getItem(STORAGE_KEY);
    },
    set(language: LanguageCode): void {
      if (typeof window === "undefined" || !isAvailable()) return;
      sessionStorage.setItem(STORAGE_KEY, language);
    },
    remove(): void {
      if (typeof window === "undefined" || !isAvailable()) return;
      sessionStorage.removeItem(STORAGE_KEY);
    },
  };
}

// ─────────────────────────────────────────────
// Cookie
// ─────────────────────────────────────────────

function createCookieAdapter(maxAgeDays = 365): StorageAdapter {
  const getCookie = (): LanguageCode | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${STORAGE_KEY}=([^;]*)`));
    return match?.[1] ?? null;
  };

  const setCookie = (value: string, days: number): void => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  return {
    get(): LanguageCode | null {
      return getCookie();
    },
    set(language: LanguageCode): void {
      setCookie(language, maxAgeDays);
    },
    remove(): void {
      if (typeof document === "undefined") return;
      document.cookie = `${STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    },
  };
}

// ─────────────────────────────────────────────
// URL (query param ?lang=ar)
// ─────────────────────────────────────────────

function createUrlAdapter(paramName = "lang"): StorageAdapter {
  return {
    get(): LanguageCode | null {
      if (typeof window === "undefined") return null;
      const params = new URLSearchParams(window.location.search);
      return params.get(paramName);
    },
    set(language: LanguageCode): void {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      url.searchParams.set(paramName, language);
      window.history.replaceState({}, "", url.toString());
    },
    remove(): void {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      url.searchParams.delete(paramName);
      window.history.replaceState({}, "", url.toString());
    },
  };
}

// ─────────────────────────────────────────────
// Subdomain (ar.example.com)
// ─────────────────────────────────────────────

function createSubdomainAdapter(): StorageAdapter {
  return {
    get(): LanguageCode | null {
      if (typeof window === "undefined") return null;
      const parts = window.location.hostname.split(".");
      if (parts.length > 2) {
        return parts[0] ?? null;
      }
      return null;
    },
    set(_language: LanguageCode): void {
      // Subdomain changes require full navigation
      if (typeof window === "undefined") return;
      console.warn(
        "[BidiKit] Subdomain storage: language change requires full page navigation to the correct subdomain.",
      );
    },
    remove(): void {
      // No-op for subdomain
    },
  };
}

// ─────────────────────────────────────────────
// Null (no persistence)
// ─────────────────────────────────────────────

function createNullAdapter(): StorageAdapter {
  return {
    get(): null {
      return null;
    },
    set(_language: LanguageCode): void {
      // No-op
    },
    remove(): void {
      // No-op
    },
  };
}

// ─────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────

/**
 * Create a StorageAdapter from a StorageOption configuration.
 *
 * @example
 * const adapter = createStorageAdapter("localStorage");
 * const adapter = createStorageAdapter("cookie");
 * const adapter = createStorageAdapter({ get, set, remove });
 */
export function createStorageAdapter(option?: StorageOption): StorageAdapter {
  if (!option) return createNullAdapter();

  if (typeof option === "object") {
    return option as StorageCallback;
  }

  switch (option) {
    case "localStorage":
      return createLocalStorageAdapter();
    case "sessionStorage":
      return createSessionStorageAdapter();
    case "cookie":
      return createCookieAdapter();
    case "url":
      return createUrlAdapter();
    case "subdomain":
      return createSubdomainAdapter();
    default: {
      console.warn(`[BidiKit] Unknown storage backend: "${String(option)}". Using null adapter.`);
      return createNullAdapter();
    }
  }
}
