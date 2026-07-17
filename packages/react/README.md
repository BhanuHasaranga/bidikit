# @bidikit/react

> React hooks, direction-aware components, and language switcher for BidiKit.

[![npm](https://img.shields.io/npm/v/@bidikit/react?style=flat-square)](https://www.npmjs.com/package/@bidikit/react)

## Installation

```bash
npm install @bidikit/core @bidikit/react
```

## Setup

```tsx
import { BidiProvider } from "@bidikit/react";

export function App() {
  return (
    <BidiProvider config={{
      defaultLanguage: "en",
      supportedLanguages: ["en", "ar", "fr"],
      rtlLanguages: ["ar"],
      translations: {
        en: { welcome: "Welcome" },
        ar: { welcome: "مرحباً" },
        fr: { welcome: "Bienvenue" },
      },
    }}>
      <YourApp />
    </BidiProvider>
  );
}
```

---

## Language Switcher

Drop-in ready - no configuration needed.

### `<LanguageSwitcher />` - pre-built

```tsx
import { LanguageSwitcher } from "@bidikit/react";

// Pill toggle (default) - one button per language
<LanguageSwitcher />

// Dropdown with flag + native name
<LanguageSwitcher variant="dropdown" display="flag+native" />

// Minimal - just the current language, click to cycle
<LanguageSwitcher variant="minimal" display="flag+code" />

// With change callback
<LanguageSwitcher onLanguageChange={(lang) => console.log(lang)} />
```

**`variant`** - `"pill"` (default) · `"dropdown"` · `"minimal"`

**`display`** - what label to show for each language:

| Value | Example |
|---|---|
| `"native"` (default) | `العربية`, `English` |
| `"english"` | `Arabic`, `English` |
| `"code"` | `AR`, `EN` |
| `"flag"` | `🇸🇦`, `🇬🇧` |
| `"flag+native"` | `🇸🇦 العربية` |
| `"flag+code"` | `🇸🇦 AR` |

Language name + flag lookup is built-in for 16 languages: AR, EN, FR, DE, ES, HE, FA, UR, ZH, JA, KO, PT, RU, TR, NL, IT.

---

### `<LanguageSwitcherRoot>` - headless, build your own

Render prop that gives you full control over the UI. All language state wired automatically.

```tsx
import { LanguageSwitcherRoot } from "@bidikit/react";

// Custom toggle button
<LanguageSwitcherRoot>
  {({ language, setLanguage }) => (
    <button onClick={() => setLanguage(language === "en" ? "ar" : "en")}>
      {language === "en" ? "🇸🇦 العربية" : "🇬🇧 English"}
    </button>
  )}
</LanguageSwitcherRoot>

// Custom dropdown
<LanguageSwitcherRoot>
  {({ language, languages, setLanguage }) => (
    <select value={language} onChange={e => setLanguage(e.target.value)}>
      {languages.map(lang => (
        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
      ))}
    </select>
  )}
</LanguageSwitcherRoot>

// Use isRTL inside the custom UI
<LanguageSwitcherRoot>
  {({ language, setLanguage, isRTL }) => (
    <nav style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
      <span>{language}</span>
      <button onClick={() => setLanguage("ar")}>AR</button>
      <button onClick={() => setLanguage("en")}>EN</button>
    </nav>
  )}
</LanguageSwitcherRoot>
```

Render prop receives:
| Prop | Type | Description |
|---|---|---|
| `language` | `string` | Current active language code |
| `languages` | `string[]` | All supported language codes |
| `setLanguage` | `(lang: string) => void` | Switch to a specific language |
| `toggleLanguage` | `(pair?: [string, string]) => void` | Cycle through languages |
| `isRTL` | `boolean` | Whether current direction is RTL |

---

## Hooks

```tsx
import {
  useLanguage,
  useDirection,
  useTranslation,
  useRTL,
  useLocale,
  useMirror,
  useT,
} from "@bidikit/react";

function Component() {
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const { direction, isRTL } = useDirection();
  const { t } = useTranslation();
  const isRTL2 = useRTL();          // shorthand boolean
  const { mirrorStyle } = useMirror();
  const t2 = useT();                 // shorthand t()

  return (
    <div dir={direction}>
      <p>{t("welcome")}</p>
      <button onClick={() => setLanguage("ar")}>Switch to Arabic</button>
    </div>
  );
}
```

| Hook | Returns |
|---|---|
| `useLanguage()` | `{ language, setLanguage, toggleLanguage, supportedLanguages }` |
| `useDirection()` | `{ direction, isRTL, isLTR }` |
| `useTranslation()` | `{ t, locale, language }` |
| `useRTL()` | `boolean` |
| `useLocale()` | Full `Locale` object |
| `useMirror()` | `{ shouldMirror, mirrorTransform, mirrorStyle }` |
| `useT()` | `t` function directly |

---

## Layout Components

All components automatically adapt to the current direction:

```tsx
import {
  Row, Column, Stack, Spacer,
  Container, Card,
  Text, Button, Icon, Avatar,
  Navbar, Sidebar, BidiImage,
  LanguageSwitcher,
  LanguageSwitcherRoot,
} from "@bidikit/react";

// Row reverses in RTL
<Row gap={16}>
  <Avatar initials="JD" size={40} />
  <Column gap={4}>
    <Text as="h3">{t("name")}</Text>
    <Text as="p">{t("title")}</Text>
  </Column>
</Row>

// Navbar with built-in language switcher
<Navbar
  logo={<Logo />}
  links={navLinks}
  actions={<LanguageSwitcher display="flag+native" />}
/>

// Sidebar position adapts: "start" = left in LTR, right in RTL
<Sidebar position="start" width={256}>
  <Nav />
</Sidebar>
```

---

## License

MIT © BhanuHasaranga
