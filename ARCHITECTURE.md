# BidiKit Architecture

## Overview

BidiKit is a TypeScript-first monorepo organized as a layered architecture, where each package has a well-defined responsibility and minimal surface area.

```
┌─────────────────────────────────────────────────────────┐
│                      User Applications                   │
│         (React, Next.js, Vite, Remix, Astro)            │
├─────────────┬──────────────┬───────────────┬────────────┤
│ @bidikit/   │ @bidikit/    │ @bidikit/     │ @bidikit/  │
│ react       │ next         │ tailwind       │ cli        │
├─────────────┴──────────────┴───────────────┴────────────┤
│                    @bidikit/core                         │
│   LanguageManager | DirectionManager | TranslationEngine│
│   RTLEngine | StorageAdapter                            │
├─────────────────────────────────────────────────────────┤
│              Browser/Node.js APIs                        │
└─────────────────────────────────────────────────────────┘
```

## Package Responsibilities

### `@bidikit/core`

The zero-dependency foundation. Everything else builds on this.

- **LanguageManager**: Detect, set, persist, toggle, and sync the active language. Integrates with StorageAdapters.
- **DirectionManager**: Manages `document.dir`, `document.lang`, CSS custom properties, and body/html classes based on the active language.
- **TranslationEngine**: Loads and resolves translation keys from JSON files. Supports nested keys (dot notation), pluralization, string interpolation, fallback language, and lazy loading of namespace chunks.
- **RTLEngine**: Provides helpers for CSS logical properties, direction detection, icon mirror maps, and animation direction.
- **StorageAdapter**: Pluggable storage for language persistence. Backends: `localStorage`, `cookie`, `sessionStorage`, `url`, `subdomain`, and custom `callback`.
- **Types**: All shared TypeScript types and interfaces exported from a single barrel.

### `@bidikit/react`

React-specific integration. Wraps `@bidikit/core` in React Context and provides hooks + components.

- **BidiContext**: Internal React context holding the core instances.
- **BidiProvider**: Top-level context provider. Initializes `@bidikit/core`, subscribes to language changes, and re-renders the tree.
- **Hooks**: Thin wrappers over core state. Stable references, memoized selectors.
- **Components**: Direction-aware layout and UI primitives using CSS logical properties internally.

### `@bidikit/next`

Next.js adapter. Handles server-side concerns that `@bidikit/react` cannot.

- **Middleware**: Detects locale from headers/cookies/URL. Performs locale-based redirects. Sets response headers.
- **BidiServerProvider**: Server Component wrapper that reads locale from headers and passes it as a prop to `BidiProvider`.
- **getTranslation()**: Server-side translation loader. Works in Server Components, `generateMetadata`, and Route Handlers.
- **SEO helpers**: `generateBidiMetadata()` produces `lang`, `dir`, `hreflang`, `canonical`, and `alternates` for `generateMetadata`.

### `@bidikit/tailwind`

A Tailwind CSS v3/v4 plugin that adds logical property support and direction-aware variants.

- Maps `ms-*`, `me-*`, `ps-*`, `pe-*` to `margin-inline-start`, etc.
- Adds `rtl:` and `ltr:` variants for conditional styling.
- Adds `start-*`, `end-*`, `rounded-s-*`, `rounded-e-*`, `border-s-*`, `border-e-*`.

### `@bidikit/icons`

Icon mirroring utilities.

- Maintains a list of directional icon names that should be mirrored in RTL.
- `mirrorIcon(name, isRTL)`: Returns CSS transform or boolean for whether to mirror.
- `MirrorableIcon`: React wrapper component that applies mirroring automatically.

### `@bidikit/css`

Zero-JS CSS utilities.

- Prebuilt stylesheet with CSS logical properties.
- `[dir="rtl"]` and `[dir="ltr"]` selector patterns.
- CSS custom property defaults for direction.

### `@bidikit/cli`

Node.js CLI tool.

- Reads `bidikit.config.ts` from the project root.
- Scaffolds translation file structure.
- Extracts translation keys using AST parsing (Babel).
- Syncs missing keys across locale files.
- Lints for missing keys, duplicate keys, incorrect value types.

## Data Flow

```
User action (language toggle)
  │
  ▼
BidiProvider (React)
  │
  ├─→ LanguageManager.setLanguage("ar")
  │       │
  │       ├─→ StorageAdapter.save("ar")
  │       └─→ DirectionManager.setDirection("rtl")
  │               │
  │               ├─→ document.documentElement.dir = "rtl"
  │               ├─→ document.documentElement.lang = "ar"
  │               └─→ CSS vars: --bidi-direction: rtl
  │
  └─→ React context re-render
          │
          ├─→ useLanguage() consumers re-render
          ├─→ useDirection() consumers re-render
          └─→ useTranslation() consumers re-render (new t() function)
```

## Translation Resolution

```
t("auth.login.title", { count: 2 })
  │
  ├─→ Load namespace (lazy or eager)
  ├─→ Resolve nested key: translations.auth.login.title
  ├─→ Apply interpolation: replace {{count}} with 2
  ├─→ Apply pluralization: select "one" or "other" form
  └─→ Return string (or fallback language string if not found)
```

## SSR Flow (Next.js)

```
Request arrives
  │
  ├─→ Middleware detects locale (cookie/header/URL)
  ├─→ Sets x-bidi-locale header
  ├─→ BidiServerProvider reads header
  ├─→ Renders Server Components with correct locale
  └─→ Client hydrates with matching locale (no flash)
```

## Build System

Each package uses `tsup` to produce:
- `dist/index.js` - CommonJS bundle
- `dist/index.mjs` - ESM bundle
- `dist/index.d.ts` - TypeScript declarations

TurboRepo orchestrates builds in dependency order:
```
@bidikit/core → @bidikit/react → @bidikit/next
                              → @bidikit/icons
@bidikit/tailwind (independent)
@bidikit/css (independent)
@bidikit/cli (independent)
```

## Design Principles

1. **Zero dependencies in core** - `@bidikit/core` has no runtime npm dependencies
2. **Lazy by default** - Translation namespaces load on demand
3. **SSR safe** - No `window` access without guards
4. **Type safe** - TypeScript strict throughout; `any` is banned
5. **Tree shakable** - ESM-first, named exports, no side-effect barrel re-exports
6. **Composable** - Each piece can be used independently; no mandatory coupling
