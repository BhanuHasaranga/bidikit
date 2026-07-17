# BidiKit Roadmap

## v1.0 - Foundation (Current)

Core RTL/LTR engine and React integration.

- [x] `@bidikit/core` - Language manager, direction manager, translation engine, RTL engine, storage adapters
- [x] `@bidikit/react` - `BidiProvider`, hooks (`useLanguage`, `useDirection`, `useTranslation`, `useRTL`, `useLocale`, `useMirror`), direction-aware components
- [x] `@bidikit/next` - Middleware, App Router SSR, Pages Router, SSG, ISR, SEO (`hreflang`, `canonical`, `lang`, `dir`)
- [x] `@bidikit/tailwind` - Logical property plugin, `rtl:`/`ltr:` variants, `ms-*`, `me-*`, `ps-*`, `pe-*`
- [x] `@bidikit/cli` - `init`, `add`, `doctor`, `extract`, `sync`, `lint`
- [x] `@bidikit/css` - CSS logical utilities, RTL-ready stylesheet
- [x] TypeScript strict mode throughout
- [x] Vitest unit + integration tests (≥95% coverage)
- [x] GitHub Actions CI/CD
- [x] Changesets release automation

## v1.5 - Enhanced UI

Icon and animation mirroring.

- [ ] `@bidikit/icons` - Auto-flip directional icons (Lucide, Heroicons, Tabler, FontAwesome, SVG)
- [ ] Animation mirroring - Reverse slide, drawer, sidebar, toast, popover, modal, tooltip for RTL
- [ ] CSS logical property utilities (extended)
- [ ] Locale detection improvements (geo-IP, Accept-Language, subdomain)
- [ ] Font auto-loading by locale (Arabic, Latin, Japanese, Chinese)
- [ ] RTL-aware theming (spacing, border-radius, elevation, shadows)
- [ ] Image mirroring (`<Image mirror />`)
- [ ] Playwright E2E tests

## v2.0 - Tooling & AI

Developer tooling, AI-assisted workflows.

- [ ] AI translation sync (integrate with OpenAI, Google Translate, DeepL)
- [ ] Visual RTL inspector (overlay to highlight direction issues in the browser)
- [ ] VS Code extension - Translation key autocomplete, missing key warnings
- [ ] Figma plugin - RTL layout preview and mirroring
- [ ] Chrome DevTools extension - Live direction debugging
- [ ] Storybook addon
- [ ] Angular adapter (`@bidikit/angular`)
- [ ] Vue adapter (`@bidikit/vue`)
- [ ] Svelte adapter (`@bidikit/svelte`)
- [ ] Astro integration (`@bidikit/astro`)

## Future Ideas

- WebAssembly-based translation engine for maximum performance
- RTL-aware PDF generation
- Expo / React Native adapter
- Edge Runtime optimizations
- Real-time collaborative translation

---

Have an idea? [Open a discussion](https://github.com/BhanuHasaranga/bidikit/discussions) or contribute!
