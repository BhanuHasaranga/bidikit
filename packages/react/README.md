# @bidikit/react

> React hooks and direction-aware components for BidiKit.

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
      supportedLanguages: ["en", "ar"],
      rtlLanguages: ["ar"],
    }}>
      <YourApp />
    </BidiProvider>
  );
}
```

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
  const { language, setLanguage } = useLanguage();
  const { direction, isRTL } = useDirection();
  const { t } = useTranslation();
  const isRTL2 = useRTL(); // shorthand boolean
  const { mirrorStyle } = useMirror();
  const t2 = useT(); // shorthand t()

  return (
    <div dir={direction}>
      <p>{t("welcome")}</p>
      <button onClick={() => setLanguage("ar")}>Switch to Arabic</button>
    </div>
  );
}
```

## Components

```tsx
import {
  Row, Column, Stack, Spacer,
  Container, Card,
  Text, Button, Icon, Avatar,
  Navbar, Sidebar, BidiImage,
} from "@bidikit/react";

// All components automatically adapt to RTL/LTR
<Row gap={16}>
  <Avatar initials="JD" size={40} />
  <Column gap={4}>
    <Text as="h3">{t("name")}</Text>
    <Text as="p">{t("title")}</Text>
  </Column>
</Row>
```

## License

MIT © BhanuHasaranga
