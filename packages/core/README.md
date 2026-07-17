# @bidikit/core

> Zero-dependency RTL/LTR engine - The missing layer for bidirectional web applications.

[![npm](https://img.shields.io/npm/v/@bidikit/core?style=flat-square)](https://www.npmjs.com/package/@bidikit/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)

## Installation

```bash
npm install @bidikit/core
```

## Features

- **LanguageManager** - detect, set, persist, toggle, sync language
- **DirectionManager** - auto-update `document.dir`, `lang`, CSS variables
- **TranslationEngine** - nested keys, pluralization, interpolation, fallback
- **RTLEngine** - CSS logical property helpers, icon mirror maps
- **StorageAdapter** - localStorage, cookie, sessionStorage, URL, subdomain, callback

## Quick Start

```ts
import { createBidiKit } from "@bidikit/core";

const bidi = createBidiKit({
  defaultLanguage: "en",
  supportedLanguages: ["en", "ar"],
  rtlLanguages: ["ar"],
  storage: "localStorage",
  autoDetect: true,
  autoDirection: true,
  translations: {
    en: { common: { welcome: "Welcome" } },
    ar: { common: { welcome: "مرحباً" } },
  },
});

await bidi.init();

bidi.setLanguage("ar");
console.log(bidi.direction); // "rtl"
console.log(bidi.t("welcome")); // "مرحباً"
```

## API Reference

### `createBidiKit(config)`

Creates a `BidiKit` instance.

### `BidiKit`

| Method | Description |
|--------|-------------|
| `init()` | Initialize: load persisted language, auto-detect |
| `setLanguage(code)` | Set the active language |
| `toggleLanguage()` | Cycle through supported languages |
| `detectLanguage()` | Detect from browser |
| `on(event, listener)` | Subscribe to events |
| `t(key, options?)` | Translate a key |
| `addTranslations(lang, ns, dict)` | Add translations at runtime |
| `loadNamespace(ns)` | Load a namespace asynchronously |

### Direction utilities

```ts
import { isRTLLanguage, getDirection } from "@bidikit/core";

isRTLLanguage("ar"); // true
getDirection("he");  // "rtl"
```

### RTL utilities

```ts
import { shouldMirrorIcon, getMirrorTransform } from "@bidikit/core";

shouldMirrorIcon("arrow-right", "rtl"); // true
getMirrorTransform(true); // "scaleX(-1)"
```

## License

MIT © BhanuHasaranga
