# @bidikit/react

## 1.1.1

### Patch Changes

- Add `LanguageSwitcher` and `LanguageSwitcherRoot` components

  - `<LanguageSwitcher />` - pre-built drop-in switcher with three variants:
    - `pill` (default) - segmented pill button group
    - `dropdown` - native `<select>` element
    - `minimal` - plain text button that cycles through languages
  - `display` prop controls label format: `native`, `english`, `code`, `flag`, `flag+native`, `flag+code`
  - `<LanguageSwitcherRoot>` - headless render-prop component for fully custom UI
  - Built-in language name + flag lookup for 16 languages (AR, EN, FR, DE, ES, HE, FA, UR, ZH, JA, KO, PT, RU, TR, NL, IT)
  - `onLanguageChange` callback prop
  - Fully typed, accessible (`aria-pressed`, `aria-label`, `role="group"`)

## 1.1.0

### Minor Changes

- Initial release of BidiKit - the RTL-first internationalization framework.

  ## What's included
  - **@bidikit/core** - Zero-dependency RTL/LTR engine with LanguageManager, DirectionManager, TranslationEngine, RTL utilities, and pluggable StorageAdapter
  - **@bidikit/react** - React hooks (`useLanguage`, `useDirection`, `useTranslation`, `useT`, `useMirror`) and direction-aware components (`Row`, `Column`, `Navbar`, `Sidebar`, `Avatar`, `Icon`, etc.)
  - **@bidikit/next** - Next.js App Router integration: SSR-safe middleware, server provider, and `generateBidiMetadata`
  - **@bidikit/tailwind** - Tailwind CSS plugin with `rtl:`/`ltr:` variants and logical property utilities (`ms-`, `me-`, `ps-`, `pe-`, `rounded-s-`, etc.)
  - **@bidikit/icons** - Auto-mirroring icon wrapper (`MirrorableIcon`) compatible with Lucide, Heroicons, and Tabler
  - **@bidikit/css** - CSS custom properties, logical utility classes, and RTL-aware reset
  - **@bidikit/cli** - CLI tools: `init`, `add`, `doctor`, `extract`, `sync`, `lint`

  Supports Arabic, Hebrew, Persian, Urdu, and any future RTL language.

### Patch Changes

- Updated dependencies
  - @bidikit/core@1.1.0
