# @bidikit/cli

> CLI tooling for BidiKit — `init`, `add`, `doctor`, `extract`, `sync`, `lint`.

[![npm](https://img.shields.io/npm/v/@bidikit/cli?style=flat-square)](https://www.npmjs.com/package/@bidikit/cli)

## Usage

```bash
npx @bidikit/cli <command>
```

## Commands

### `init`

Scaffolds `bidikit.config.ts` and initial translation files (`en.json`, `ar.json`).

```bash
npx @bidikit/cli init
```

### `add <lang>`

Adds a new language file with stubbed translations based on `en.json`.

```bash
npx @bidikit/cli add fr
npx @bidikit/cli add he
npx @bidikit/cli add fa
```

### `doctor`

Diagnoses your BidiKit setup — checks packages, config, and translation files.

```bash
npx @bidikit/cli doctor
```

### `extract`

Scans your source files for `t("key")` calls and updates `translations/en.json` with any missing keys.

```bash
npx @bidikit/cli extract
```

### `sync`

Syncs missing translation keys from `en.json` to all other locale files.

```bash
npx @bidikit/cli sync
```

### `lint`

Validates translation files for missing keys, extra keys, and invalid JSON.

```bash
npx @bidikit/cli lint
```

## License

MIT © BhanuHasaranga
