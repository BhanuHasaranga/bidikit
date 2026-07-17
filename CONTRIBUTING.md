# Contributing to BidiKit

Thank you for your interest in contributing to BidiKit! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** 9+
- **Git**

### Setup

```bash
# Clone the repository
git clone https://github.com/BhanuHasaranga/bidikit.git
cd bidikit

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Project Structure

```
bidikit/
├── packages/
│   ├── core/      → @bidikit/core     (zero-dep engine)
│   ├── react/     → @bidikit/react    (hooks + components)
│   ├── next/      → @bidikit/next     (Next.js integration)
│   ├── tailwind/  → @bidikit/tailwind (Tailwind plugin)
│   ├── cli/       → @bidikit/cli      (CLI tooling)
│   ├── icons/     → @bidikit/icons    (icon mirroring)
│   └── css/       → @bidikit/css      (CSS utilities)
├── examples/
│   ├── next-app/
│   └── vite-react/
└── docs/
```

## Development Workflow

### Branch naming
- `feat/feature-name` — new features
- `fix/bug-description` — bug fixes
- `docs/topic` — documentation updates
- `refactor/description` — refactoring
- `test/description` — test additions

### Commit Messages (Conventional Commits)

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(core): add language provider
fix(react): resolve hydration mismatch
docs: improve installation guide
test(cli): add init command tests
refactor(core): simplify direction manager
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

### Making Changes

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Add tests for any new functionality
5. Run the full test suite: `pnpm test`
6. Run linting: `pnpm lint`
7. Run type checking: `pnpm typecheck`
8. Commit using conventional commits
9. Push and open a Pull Request

### Adding a Changeset

Every non-trivial change requires a changeset:

```bash
pnpm changeset
```

Follow the prompts to select the affected packages and describe the change.

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm --filter @bidikit/core test

# Run with coverage
pnpm test:coverage
```

### Adding Tests

- Tests live in `packages/<name>/tests/` or alongside source files as `*.test.ts`
- Use Vitest for unit and integration tests
- Aim for ≥95% coverage on new code
- Every exported API must have a corresponding test

## Code Standards

### TypeScript

- Strict mode is enabled throughout
- No `any` without justification
- Use `type` imports for type-only imports
- Document all public APIs with JSDoc

### ESLint

```bash
pnpm lint
```

### Prettier

```bash
pnpm format
```

## Pull Request Guidelines

- Keep PRs focused and small
- Include tests for new features
- Update documentation for user-facing changes
- Add a changeset if publishing a new version
- Ensure CI passes before requesting review

## Reporting Bugs

Use GitHub Issues with the **bug** template. Include:
- BidiKit version
- Framework (React, Next.js, etc.)
- Reproduction steps
- Expected vs actual behavior

## Feature Requests

Use GitHub Issues with the **feature request** template. Explain:
- The problem you're solving
- Your proposed solution
- Alternatives you considered

## Questions?

- Open a [GitHub Discussion](https://github.com/BhanuHasaranga/bidikit/discussions)
- Check existing issues and discussions first

---

Thank you for making BidiKit better! 🌐
