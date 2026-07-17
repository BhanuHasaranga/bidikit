<div align="center">

# 🌐 BidiKit

**The missing layer for Arabic & RTL web applications.**

[![npm](https://img.shields.io/npm/v/@bidikit/core?style=flat-square&color=6366f1)](https://www.npmjs.com/package/@bidikit/core)
[![npm downloads](https://img.shields.io/npm/dm/@bidikit/core?style=flat-square&color=6366f1)](https://www.npmjs.com/package/@bidikit/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

</div>

---

## The Real Problem with Arabic on the Web

Adding Arabic to a website is not just adding a translation file.

Arabic reads **right to left**. That means every single layout assumption your app makes - the padding, the margins, the flex direction, the icon direction, the border side, the scroll position, the input cursor - **everything is inverted.**

Most developers add Arabic and get something like this:

```
[ English App ]          [ Arabic App - broken ]

 Logo     Nav            Nav          Logo     ← header flipped ✓
 
 ←  Back                 Back  →              ← arrow wrong direction ✗
 
 Name: [        ]        [        ] :الاسم    ← label on wrong side ✗
 
 ✓  Save                  Save  ✓             ← icon not mirrored ✗
 
 margin-left: 16px        margin-left: 16px   ← spacing not flipped ✗
```

They got the text right. Everything else is broken.

### The checklist nobody tells you about

When you add Arabic to a React/Next.js app, you actually need to handle **all** of this:

| What breaks | Why it breaks |
|---|---|
| `document.dir` | Needs to be `"rtl"` - browsers don't do this automatically |
| `<html lang="ar">` | Required for correct font rendering and SEO |
| `margin-left` / `padding-left` | Must become `margin-right` / `padding-right` |
| `flex-row` | Must become `flex-row-reverse` |
| `left: 0` / `right: 0` | Must be swapped |
| `←` arrow icons | Must become `→` |
| Scroll position | Starts from right edge |
| `border-left` | Must become `border-right` |
| `text-align: left` | Must become `text-align: right` |
| CSS animations (slide-in-left) | Must slide from opposite direction |
| Dropdown menu positions | `origin-top-left` → `origin-top-right` |
| Tooltips / popovers | Placement logic is inverted |
| Number inputs | Still LTR even in RTL context |
| `border-radius` on one side | Rounded corners on wrong side |
| `text-indent` | Indents in wrong direction |

Most i18n libraries solve only one of these - the translation part.

**BidiKit solves all of them.**

---

## What BidiKit Does

BidiKit is an **RTL-first layout engine** for React and Next.js. It goes far beyond translations - it makes your entire UI automatically mirror itself for Arabic and all other RTL languages.

One line of change:

```tsx
// Before
<App />

// After - full RTL support for Arabic, Hebrew, Persian, Urdu
<BidiProvider config={{ defaultLanguage: "en", rtlLanguages: ["ar"] }}>
  <App />
</BidiProvider>
```

Then switch language:

```tsx
const { setLanguage } = useLanguage();
setLanguage("ar");
```

What happens automatically:

```
✓ document.dir = "rtl"
✓ <html lang="ar">
✓ CSS variables updated   (--bidi-direction: rtl)
✓ margin-left → margin-right
✓ padding-left → padding-right
✓ flex-row → flex-row-reverse
✓ left: 0 → right: 0
✓ ← arrow icons → → arrow icons
✓ border-left → border-right
✓ text-align: left → text-align: right
✓ slide animations reversed
✓ localStorage language persisted
✓ Browser language auto-detected
```

Zero manual work.

---

## Quick Start

```bash
# Install
npm install @bidikit/core @bidikit/react

# Or scaffold a full project
npx @bidikit/cli init
```

```tsx
// app/layout.tsx or main.tsx
import { BidiProvider } from "@bidikit/react";

export default function App({ children }) {
  return (
    <BidiProvider config={{
      defaultLanguage: "en",
      supportedLanguages: ["en", "ar"],
      rtlLanguages: ["ar"],           // ← that's all it takes
      autoDetect: true,               // detects Arabic browser automatically
      storage: "localStorage",        // remembers the user's choice
      translations: {
        en: { welcome: "Welcome", back: "Back", save: "Save" },
        ar: { welcome: "مرحباً", back: "رجوع", save: "حفظ" },
      },
    }}>
      {children}
    </BidiProvider>
  );
}
```

```tsx
// Any component
import { useTranslation, useLanguage, useDirection } from "@bidikit/react";

export function Header() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { isRTL } = useDirection();

  return (
    <header>
      <h1>{t("welcome")}</h1>
      <button onClick={() => setLanguage(language === "en" ? "ar" : "en")}>
        {language === "en" ? "العربية" : "English"}
      </button>
    </header>
  );
}
```

---

## Packages

| Package | Version | Description |
|---|---|---|
| [`@bidikit/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@bidikit/core?style=flat-square)](https://www.npmjs.com/package/@bidikit/core) | Zero-dependency RTL/LTR engine |
| [`@bidikit/react`](./packages/react) | [![npm](https://img.shields.io/npm/v/@bidikit/react?style=flat-square)](https://www.npmjs.com/package/@bidikit/react) | React hooks + direction-aware components |
| [`@bidikit/next`](./packages/next) | [![npm](https://img.shields.io/npm/v/@bidikit/next?style=flat-square)](https://www.npmjs.com/package/@bidikit/next) | Next.js App Router - SSR, middleware, SEO |
| [`@bidikit/tailwind`](./packages/tailwind) | [![npm](https://img.shields.io/npm/v/@bidikit/tailwind?style=flat-square)](https://www.npmjs.com/package/@bidikit/tailwind) | Tailwind plugin - logical properties + `rtl:` variants |
| [`@bidikit/icons`](./packages/icons) | [![npm](https://img.shields.io/npm/v/@bidikit/icons?style=flat-square)](https://www.npmjs.com/package/@bidikit/icons) | Auto-mirroring icon wrapper |
| [`@bidikit/css`](./packages/css) | [![npm](https://img.shields.io/npm/v/@bidikit/css?style=flat-square)](https://www.npmjs.com/package/@bidikit/css) | CSS logical utility classes |
| [`@bidikit/cli`](./packages/cli) | [![npm](https://img.shields.io/npm/v/@bidikit/cli?style=flat-square)](https://www.npmjs.com/package/@bidikit/cli) | `init`, `add`, `doctor`, `sync`, `lint` |

---

## Feature Walkthrough

### 1. Translations - the basics

Translation files are plain JSON:

```json
// translations/en.json
{
  "nav": { "home": "Home", "about": "About" },
  "auth": { "login": "Sign In", "logout": "Sign Out" },
  "items": { "one": "{{count}} item", "other": "{{count}} items" }
}
```

```json
// translations/ar.json
{
  "nav": { "home": "الرئيسية", "about": "حول" },
  "auth": { "login": "تسجيل الدخول", "logout": "تسجيل الخروج" },
  "items": { "one": "{{count}} عنصر", "other": "{{count}} عناصر" }
}
```

```tsx
const { t } = useTranslation();

t("nav.home")              // "Home" or "الرئيسية"
t("auth.login")            // "Sign In" or "تسجيل الدخول"
t("items", { count: 3 })   // "3 items" or "3 عناصر"
```

---

### 2. Automatic layout mirroring

The moment `setLanguage("ar")` is called, the layout flips. You write your CSS once, BidiKit handles both directions.

**Before (LTR - English):**
```
┌─────────────────────────────────┐
│ 🏠 Logo        Home  About  ⚙️  │
│                                 │
│ ← Back                          │
│                                 │
│ Name:  [________________]       │
│ Email: [________________]       │
│                                 │
│ [Cancel]              [Save →]  │
└─────────────────────────────────┘
```

**After (RTL - Arabic) - automatically:**
```
┌─────────────────────────────────┐
│  ⚙️ الرئيسية  حول        شعار 🏠 │
│                                 │
│                          رجوع → │
│                                 │
│       [________________]  :الاسم │
│       [________________] :البريد │
│                                 │
│  [→ حفظ]              [إلغاء]   │
└─────────────────────────────────┘
```

No code changes. No class toggling. No manual `dir="rtl"` attributes scattered everywhere.

---

### 3. Logical spacing - write once, works both ways

Instead of:
```tsx
<div className="ml-4 pl-2 border-l rounded-l text-left">
```

Write:
```tsx
<div className="ms-4 ps-2 border-s rounded-s text-start">
```

`ms` = margin-**start** (left in LTR, right in RTL)  
`me` = margin-**end** (right in LTR, left in RTL)  
`ps` / `pe` = padding start / end  
`border-s` / `border-e` = border start / end  
`rounded-s` / `rounded-e` = border-radius start / end  
`text-start` / `text-end` = text alignment  
`start-0` / `end-0` = `left: 0` / `right: 0`

These are native CSS logical properties, enabled globally by the `@bidikit/tailwind` plugin:

```js
// tailwind.config.js
import { bidikit } from "@bidikit/tailwind";
export default { plugins: [bidikit()] };
```

Also adds `rtl:` and `ltr:` variants:

```tsx
<div className="rtl:flex-row-reverse ltr:flex-row">
  {/* flex direction auto-mirrors */}
</div>
```

---

### 4. Direction-aware components

Instead of wrapping everything in `flex` divs that you manually reverse:

```tsx
import { Row, Column, Navbar, Sidebar, Avatar, Text, Button } from "@bidikit/react";

// Row automatically reverses in RTL
<Row gap={16}>
  <Avatar initials="AR" />
  <Column>
    <Text as="h3">Ahmed Rashid</Text>
    <Text as="p">Developer</Text>
  </Column>
</Row>

// Navbar respects RTL order
<Navbar
  logo={<Logo />}
  links={[...]}
  actions={<LanguageSwitcher />}
/>

// Sidebar: position="start" = left in LTR, right in RTL
<Sidebar position="start" width={256}>
  <Nav />
</Sidebar>
```

---

### 5. Icon mirroring - arrows that always point the right way

Directional icons (arrows, chevrons, back/forward) must flip in RTL. Non-directional icons (heart, star, user) must not.

```tsx
import { MirrorableIcon } from "@bidikit/icons";
import { ArrowRight } from "lucide-react";

// Automatically → in LTR, ← in RTL
<MirrorableIcon icon={ArrowRight} name="arrow-right" size={20} />
```

Or use the utility directly:

```tsx
import { shouldMirrorIcon } from "@bidikit/icons";

const mirror = shouldMirrorIcon("arrow-right", direction); // true in RTL
```

Works with Lucide, Heroicons, Tabler, FontAwesome, or any SVG.

---

### 6. Images with optional mirroring

```tsx
import { BidiImage } from "@bidikit/react";

// Normal image - no mirroring
<BidiImage src="/photo.jpg" alt="Photo" />

// Directional image (e.g., a person pointing) - mirrors in RTL
<BidiImage src="/pointing-hand.png" alt="Hand" mirror />
```

---

### 7. Next.js - full SSR support

```ts
// middleware.ts
export { bidiMiddleware as middleware } from "@bidikit/next";
export const config = { matcher: ["/((?!_next|api|favicon).*)"] };
```

```tsx
// app/layout.tsx
import { BidiServerProvider } from "@bidikit/next";
import { getServerLocale } from "@bidikit/next";

export async function generateMetadata() {
  const { language, direction } = await getServerLocale();
  return {
    title: "My App",
    other: { "content-language": language },
  };
}

export default function RootLayout({ children }) {
  return (
    <BidiServerProvider>
      <html>
        <body>{children}</body>
      </html>
    </BidiServerProvider>
  );
}
```

Middleware auto-detects language from:
1. User's saved preference (cookie)
2. `Accept-Language` header (Arabic browser → Arabic site)
3. URL parameter
4. Default fallback

---

### 8. CLI tools

```bash
# Scaffold config + translation files
npx @bidikit/cli init

# Add a new language (creates ar.json with stubbed keys)
npx @bidikit/cli add ar

# Diagnose your setup
npx @bidikit/cli doctor

# Extract t("key") calls from your source code
npx @bidikit/cli extract

# Sync missing keys from en.json → ar.json
npx @bidikit/cli sync

# Lint translation files for missing/extra keys
npx @bidikit/cli lint
```

---

## Hooks API

| Hook | Returns | Use it for |
|---|---|---|
| `useLanguage()` | `{ language, setLanguage, toggleLanguage, supportedLanguages }` | Language switching |
| `useDirection()` | `{ direction, isRTL, isLTR }` | Conditional RTL logic |
| `useTranslation()` | `{ t }` | Translating strings |
| `useRTL()` | `boolean` | Quick `if (isRTL)` checks |
| `useT()` | `t` shorthand | Concise translation |
| `useMirror()` | `{ shouldMirror, mirrorStyle }` | Manual mirror control |

---

## Configuration

```ts
// bidikit.config.ts
import type { BidiConfig } from "@bidikit/core";

const config: BidiConfig = {
  defaultLanguage: "en",
  fallbackLanguage: "en",
  supportedLanguages: ["en", "ar", "fr", "he", "fa"],
  rtlLanguages: ["ar", "he", "fa", "ur"],    // these trigger RTL mode

  storage: "localStorage",   // "cookie" | "session" | "url" | "subdomain" | "callback"
  autoDetect: true,           // detect from browser Accept-Language
  autoDirection: true,        // auto-set document.dir + lang

  translations: {
    en: { ... },
    ar: { ... },
  },

  // Or load async
  translationLoader: async (lang, namespace) => {
    return import(`./translations/${lang}/${namespace}.json`);
  },
};
```

---

## Supported Languages

BidiKit works with any language. RTL mode is automatically applied for:

| Language | Code | Script |
|---|---|---|
| **Arabic** | `ar` | Arabic |
| **Hebrew** | `he` | Hebrew |
| **Persian / Farsi** | `fa` | Persian/Arabic |
| **Urdu** | `ur` | Nastaliq/Arabic |
| Sindhi | `sd` | Arabic |
| Kurdish (Sorani) | `ckb` | Arabic |
| Pashto | `ps` | Arabic |
| Uyghur | `ug` | Arabic |
| Divehi | `dv` | Thaana |

Any LTR language (French, German, Chinese, Japanese, etc.) works automatically in the same app.

---

## Why Not Just Use react-i18next or next-intl?

Those are excellent libraries for **translations**. BidiKit is built for the **layout problem**.

| Feature | react-i18next | next-intl | **BidiKit** |
|---|---|---|---|
| Translation API | ✅ | ✅ | ✅ |
| Auto `document.dir` | ❌ | ❌ | ✅ |
| Logical spacing utilities | ❌ | ❌ | ✅ |
| Direction-aware components | ❌ | ❌ | ✅ |
| Icon auto-mirroring | ❌ | ❌ | ✅ |
| Image mirroring | ❌ | ❌ | ✅ |
| Tailwind `rtl:` variants | ❌ | ❌ | ✅ |
| `ms-` / `me-` / `ps-` / `pe-` | ❌ | ❌ | ✅ |
| Zero-config Arabic support | ❌ | ❌ | ✅ |
| Works with existing i18n | N/A | N/A | ✅ |

You can even use BidiKit **alongside** react-i18next - use their translation layer and BidiKit's RTL layout engine.

---

## Real-world Example: Arabic e-commerce product card

```tsx
import { Row, Column, Text, Button } from "@bidikit/react";
import { MirrorableIcon } from "@bidikit/icons";
import { ShoppingCart, ArrowRight } from "lucide-react";

export function ProductCard({ product }) {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    // Row automatically reverses in Arabic - logo and content swap sides
    <Row gap={16} style={{ padding: "16px" }}>
      <img src={product.image} style={{ width: 80, borderRadius: 8 }} />

      <Column gap={8} style={{ flex: 1 }}>
        {/* text-start = left in English, right in Arabic */}
        <Text as="h3" style={{ textAlign: "start" }}>
          {product.name}
        </Text>

        {/* Price, currency symbol - correct position in both */}
        <Text style={{ color: "#6366f1" }}>
          {isRTL ? `${product.price} ر.س` : `$${product.price}`}
        </Text>

        <Row gap={8}>
          <Button>
            <ShoppingCart size={16} />
            {/* ms-2 = margin-left in LTR, margin-right in RTL */}
            <span style={{ marginInlineStart: 8 }}>{t("addToCart")}</span>
          </Button>

          {/* Arrow always points in the reading direction */}
          <MirrorableIcon icon={ArrowRight} name="arrow-right" size={20} />
        </Row>
      </Column>
    </Row>
  );
}
```

**In English:**
```
[📦 img]  Product Name
          $29.99
          [🛒 Add to Cart]  →
```

**In Arabic - automatically:**
```
               اسم المنتج  [img 📦]
                   29.99 ر.س
          ←  [إضافة للسلة 🛒]
```

No conditional classes. No `dir` attributes. No manual flips.

---

## Testing

```bash
pnpm test               # Run all tests
pnpm test:coverage      # With coverage report
```

68 tests passing across direction, RTL utilities, translation engine, and language management.

---

## Roadmap

### v1.1 (Current - live on npm)
- [x] Core RTL/LTR engine
- [x] Language management + persistence
- [x] Translation API (nested keys, pluralization, interpolation, fallback)
- [x] React hooks + direction-aware components
- [x] Next.js App Router + middleware
- [x] Tailwind plugin (logical properties + `rtl:`/`ltr:` variants)
- [x] Icon auto-mirroring (Lucide, Heroicons, Tabler)
- [x] CSS logical utility classes
- [x] CLI (`init`, `add`, `doctor`, `extract`, `sync`, `lint`)
- [x] TypeScript strict mode, ESM + CJS

### v1.5
- [ ] AI translation sync (`npx @bidikit/cli translate` via OpenAI/Gemini/DeepL)
- [ ] Animation direction reversal utilities
- [ ] Astro + Remix adapters
- [ ] RTL visual debugger (highlight layout issues)

### v2.0
- [ ] VS Code extension (inline RTL preview)
- [ ] Figma plugin (export RTL variants)
- [ ] Chrome DevTools panel

---

## Contributing

```bash
git clone https://github.com/BhanuHasaranga/bidikit.git
cd bidikit
pnpm install
pnpm build
pnpm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT © [BhanuHasaranga](https://github.com/BhanuHasaranga)

---

<div align="center">
  <sub>Built for the 420 million+ Arabic speakers on the web - and every other RTL language after that.</sub>
</div>
