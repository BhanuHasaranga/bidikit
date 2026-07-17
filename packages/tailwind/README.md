# @bidikit/tailwind

> Tailwind CSS plugin for BidiKit — logical properties, `rtl:` / `ltr:` variants.

[![npm](https://img.shields.io/npm/v/@bidikit/tailwind?style=flat-square)](https://www.npmjs.com/package/@bidikit/tailwind)

## Installation

```bash
npm install @bidikit/tailwind
```

## Setup

```js
// tailwind.config.js
import { bidikit } from "@bidikit/tailwind";

export default {
  plugins: [bidikit()],
};
```

## Utilities

### RTL/LTR Variants

```html
<div class="rtl:text-right ltr:text-left">
  Direction-aware text alignment
</div>

<div class="rtl:bg-slate-900 ltr:bg-white">
  Direction-aware background
</div>
```

### Logical Spacing (margin-inline, padding-inline)

```html
<!-- margin-inline-start -->
<div class="ms-4">...</div>

<!-- margin-inline-end -->
<div class="me-4">...</div>

<!-- padding-inline-start -->
<div class="ps-2">...</div>

<!-- padding-inline-end -->
<div class="pe-2">...</div>
```

### Logical Positioning

```html
<div class="start-0"><!-- inset-inline-start: 0 --></div>
<div class="end-0"><!-- inset-inline-end: 0 --></div>
```

### Logical Border Radius

```html
<div class="rounded-s-lg"><!-- border-start-start-radius + border-end-start-radius --></div>
<div class="rounded-e-lg"><!-- border-start-end-radius + border-end-end-radius --></div>
```

### Logical Borders

```html
<div class="border-s border-s-color-gray-200"><!-- inline-start border --></div>
<div class="border-e"><!-- inline-end border --></div>
```

### Text Alignment

```html
<p class="text-start">Always aligns to the start (left in LTR, right in RTL)</p>
<p class="text-end">Always aligns to the end</p>
```

## Options

```js
bidikit({
  variants: true,      // rtl: / ltr: variants
  spacing: true,       // ms-*, me-*, ps-*, pe-*
  borderRadius: true,  // rounded-s-*, rounded-e-*
  borders: true,       // border-s-*, border-e-*
  textAlign: true,     // text-start, text-end
  inset: true,         // start-*, end-*
})
```

## License

MIT © BhanuHasaranga
