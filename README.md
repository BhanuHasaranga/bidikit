# BidiKit

<div align="center">
  <h1>🌐 BidiKit</h1>
  <p><strong>The missing layer for RTL & LTR web applications.</strong></p>

  [![npm](https://img.shields.io/npm/v/bidikit?style=flat-square&color=blueviolet)](https://www.npmjs.com/package/bidikit)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm)](https://pnpm.io/)
  [![Turborepo](https://img.shields.io/badge/Turborepo-powered-EF4444?style=flat-square)](https://turbo.build/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

  <br/>

  **BidiKit** is not another translation library.  
  It is an **RTL/LTR UI engine** that makes any React/Next.js application  
  automatically adapt between left-to-right and right-to-left layouts  
  with almost zero configuration.

  > Think of it as: **Tailwind + Next-intl + RTL Engine + Direction Manager + UI Mirroring**
</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔄 **Auto Direction** | Automatically sets `document.dir`, `lang`, CSS vars on language switch |
| 🌍 **Language Management** | Detect, set, persist, toggle, and sync language across storage backends |
| 📝 **Translation Engine** | Nested keys, pluralization, interpolation, fallback, lazy loading |
| 🪞 **Icon Mirroring** | Auto-flip directional icons (arrows, chevrons, back/forward) |
| 🎨 **Tailwind Plugin** | Logical property mapping + `rtl:`/`ltr:` variants |
| 🧩 **React Components** | Direction-aware layout and UI primitives |
| ⚡ **Next.js Integration** | Middleware, SSR, App Router, SEO, `hreflang` |
| 🖥️ **CLI** | `npx bidikit init`, `add`, `doctor`, `extract`, `sync`, `lint` |
| 🎭 **Animation Mirroring** | Reverse slides, drawers, toasts for RTL |
| 🔤 **Font Loading** | Auto-load fonts based on active locale |
| 💾 **Persistence** | Cookie, localStorage, session, URL, subdomain, DB callback |
| 🔒 **Type Safe** | 100% TypeScript strict mode |
| 🌱 **Tree Shakable** | ESM-first, zero unnecessary imports |
| 🖥️ **SSR Safe** | Works with Next.js, Remix, Astro |

---

## 📦 Packages

| Package | Version | Description |
|---|---|---|
| [`@bidikit/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@bidikit/core?style=flat-square)](https://www.npmjs.com/package/@bidikit/core) | Zero-dependency RTL/LTR engine |
| [`@bidikit/react`](./packages/react) | [![npm](https://img.shields.io/npm/v/@bidikit/react?style=flat-square)](https://www.npmjs.com/package/@bidikit/react) | React hooks + components |
| [`@bidikit/next`](./packages/next) | [![npm](https://img.shields.io/npm/v/@bidikit/next?style=flat-square)](https://www.npmjs.com/package/@bidikit/next) | Next.js integration |
| [`@bidikit/tailwind`](./packages/tailwind) | [![npm](https://img.shields.io/npm/v/@bidikit/tailwind?style=flat-square)](https://www.npmjs.com/package/@bidikit/tailwind) | Tailwind CSS plugin |
| [`@bidikit/icons`](./packages/icons) | [![npm](https://img.shields.io/npm/v/@bidikit/icons?style=flat-square)](https://www.npmjs.com/package/@bidikit/icons) | Icon mirroring utilities |
| [`@bidikit/css`](./packages/css) | [![npm](https://img.shields.io/npm/v/@bidikit/css?style=flat-square)](https://www.npmjs.com/package/@bidikit/css) | CSS logical utilities |
| [`@bidikit/cli`](./packages/cli) | [![npm](https://img.shields.io/npm/v/@bidikit/cli?style=flat-square)](https://www.npmjs.com/package/@bidikit/cli) | CLI tooling |

---

## 🚀 Quick Start

### Installation

```bash
npm install @bidikit/core @bidikit/react
# or
pnpm add @bidikit/core @bidikit/react
# or
yarn add @bidikit/core @bidikit/react
```

### Zero-config init (CLI)

```bash
npx @bidikit/cli init
```

This scaffolds `bidikit.config.ts` and your first translation files.

### React Setup

```tsx
// app/layout.tsx or main.tsx
import { BidiProvider } from "@bidikit/react";
import type { BidiConfig } from "@bidikit/core";

const config: BidiConfig = {
  defaultLanguage: "en",
  fallbackLanguage: "en",
  supportedLanguages: ["en", "ar", "fr"],
  rtlLanguages: ["ar", "he", "fa", "ur"],
  storage: "localStorage",
  autoDetect: true,
  autoDirection: true,
};

export default function App() {
  return (
    <BidiProvider config={config}>
      <YourApp />
    </BidiProvider>
  );
}
```

### Using Translations

```tsx
// translations/en.json
{
  "welcome": "Welcome to BidiKit",
  "auth": {
    "login": { "title": "Sign In" },
    "logout": "Sign Out"
  },
  "items": {
    "one": "{{count}} item",
    "other": "{{count}} items"
  }
}
```

```tsx
import { useTranslation, useLanguage, useDirection } from "@bidikit/react";

export function Header() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { direction } = useDirection();

  return (
    <header dir={direction}>
      <h1>{t("welcome")}</h1>
      <p>{t("auth.login.title")}</p>
      <p>{t("items", { count: 5 })}</p>
      <button onClick={() => setLanguage(language === "en" ? "ar" : "en")}>
        Switch to {language === "en" ? "Arabic" : "English"}
      </button>
    </header>
  );
}
```

### Next.js Setup

```ts
// middleware.ts
export { bidiMiddleware as middleware } from "@bidikit/next";
export const config = { matcher: ["/((?!_next|api|favicon).*)"] };
```

```tsx
// app/layout.tsx
import { BidiServerProvider } from "@bidikit/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <BidiServerProvider>
      {children}
    </BidiServerProvider>
  );
}
```

### Tailwind Integration

```js
// tailwind.config.js
import { bidikit } from "@bidikit/tailwind";

export default {
  plugins: [bidikit()],
};
```

```tsx
// Now use logical properties in your JSX
<div className="ms-4 me-4 ps-2 pe-2 text-start rounded-s border-e rtl:bg-slate-900 ltr:bg-white">
  Direction-aware layout!
</div>
```

---

## 📖 Configuration

```ts
// bidikit.config.ts
import type { BidiConfig } from "@bidikit/core";

const config: BidiConfig = {
  defaultLanguage: "en",
  fallbackLanguage: "en",
  supportedLanguages: ["en", "ar", "fr", "he", "fa", "ur"],
  rtlLanguages: ["ar", "he", "fa", "ur"],
  storage: "localStorage",  // "cookie" | "session" | "url" | "subdomain" | "callback"
  autoDetect: true,
  autoDirection: true,
  mirrorIcons: true,
  mirrorImages: false,
  animations: true,
};

export default config;
```

---

## 🪝 Hooks API

| Hook | Returns | Description |
|---|---|---|
| `useLanguage()` | `{ language, setLanguage, toggleLanguage, supportedLanguages }` | Language management |
| `useDirection()` | `{ direction, isRTL, isLTR }` | Direction state |
| `useTranslation()` | `{ t, locale }` | Translation function |
| `useRTL()` | `boolean` | Quick RTL check |
| `useLocale()` | `Locale` | Full locale object |
| `useMirror()` | `{ shouldMirror, mirrorStyle }` | Mirror utilities |

---

## 🧩 Components API

```tsx
import {
  BidiProvider,
  Row, Column, Stack, Spacer,
  Container, Card,
  Button, Icon, Text, Avatar,
  Navbar, Sidebar,
} from "@bidikit/react";
```

All components automatically adapt their layout (flex direction, margins, padding, borders) to the current language direction.

---

## 🖥️ CLI Reference

```bash
npx @bidikit/cli init          # Initialize BidiKit in your project
npx @bidikit/cli add ar        # Add Arabic language support
npx @bidikit/cli doctor        # Diagnose configuration issues
npx @bidikit/cli extract       # Extract translation keys from source files
npx @bidikit/cli sync          # Sync missing keys across locale files
npx @bidikit/cli translate     # AI-assisted translation sync
npx @bidikit/cli lint          # Lint translation files for issues
```

---

## 🌐 Supported RTL Languages

| Language | Code | Script |
|---|---|---|
| Arabic | `ar` | Arabic |
| Hebrew | `he` | Hebrew |
| Persian | `fa` | Persian/Arabic |
| Urdu | `ur` | Nastaliq/Arabic |
| Sindhi | `sd` | Arabic |
| Kurdish | `ku` | Arabic |
| Pashto | `ps` | Arabic |
| Kashmiri | `ks` | Arabic |
| Uyghur | `ug` | Arabic |
| Divehi | `dv` | Thaana |
| Maldivian | `dv` | Thaana |

---

## 🧪 Testing

```bash
pnpm test              # Run all tests
pnpm test:coverage     # Run with coverage
```

Coverage target: **≥ 95%**

---

## 📋 Roadmap

### v1.0 (Current)
- [x] Core language management
- [x] RTL/LTR direction switching
- [x] React Provider + hooks + components
- [x] Translation API with nested keys, pluralization, interpolation
- [x] Next.js App Router + Pages Router support
- [x] Tailwind CSS plugin
- [x] CLI tooling
- [x] TypeScript strict mode

### v1.5
- [ ] Icon mirroring (Lucide, Heroicons, Tabler, FontAwesome)
- [ ] Animation mirroring (slides, drawers, toasts)
- [ ] CSS logical property utilities
- [ ] Locale detection improvements

### v2.0
- [ ] AI translation sync
- [ ] Visual RTL inspector
- [ ] VS Code extension
- [ ] Figma plugin
- [ ] Chrome DevTools extension

---

## 🤝 Contributing

We love contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

```bash
git clone https://github.com/BhanuHasaranga/bidikit.git
cd bidikit
pnpm install
pnpm build
pnpm test
```

---

## 📜 License

MIT © [BhanuHasaranga](https://github.com/BhanuHasaranga)

---

<div align="center">
  <sub>Built with ❤️ for the global web. Supporting Arabic, Hebrew, Persian, Urdu, and all bidirectional languages.</sub>
</div>
