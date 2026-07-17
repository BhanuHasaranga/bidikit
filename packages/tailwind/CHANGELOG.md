# @bidikit/tailwind

## 1.1.0

### Minor Changes

- Initial release of BidiKit — the RTL-first internationalization framework.

  ## What's included
  - **@bidikit/core** — Zero-dependency RTL/LTR engine with LanguageManager, DirectionManager, TranslationEngine, RTL utilities, and pluggable StorageAdapter
  - **@bidikit/react** — React hooks (`useLanguage`, `useDirection`, `useTranslation`, `useT`, `useMirror`) and direction-aware components (`Row`, `Column`, `Navbar`, `Sidebar`, `Avatar`, `Icon`, etc.)
  - **@bidikit/next** — Next.js App Router integration: SSR-safe middleware, server provider, and `generateBidiMetadata`
  - **@bidikit/tailwind** — Tailwind CSS plugin with `rtl:`/`ltr:` variants and logical property utilities (`ms-`, `me-`, `ps-`, `pe-`, `rounded-s-`, etc.)
  - **@bidikit/icons** — Auto-mirroring icon wrapper (`MirrorableIcon`) compatible with Lucide, Heroicons, and Tabler
  - **@bidikit/css** — CSS custom properties, logical utility classes, and RTL-aware reset
  - **@bidikit/cli** — CLI tools: `init`, `add`, `doctor`, `extract`, `sync`, `lint`

  Supports Arabic, Hebrew, Persian, Urdu, and any future RTL language.
