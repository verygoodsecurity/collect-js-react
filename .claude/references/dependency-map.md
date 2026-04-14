# collect-js-react-private Dependency Map

## Project Structure

`@vgs/collect-js-react` is a React wrapper library for VGS Collect.js. It is a
single-package Node.js project (yarn v1) that publishes a compiled library with
no runtime dependencies.

- `src/` — Library source (React components: Fields, Form, Session, provider)
- `src/tests/` — Unit tests (Jest + Testing Library)
- `examples/demo/` — Demo app (Vite + React)
- `examples/compat/` — Cross-version compatibility test fixtures (React 16–19)
- `scripts/` — Build/release scripts

**Key characteristic:** The `dependencies` field is empty — all npm packages are
either `peerDependencies` (react, react-dom) or `devDependencies`. This means
Renovate updates only affect the dev/build/test toolchain, not the published
package's runtime behavior.

## Dependency Categories

### Always Low Risk (Auto-merge Candidates)

| Pattern | Example | Reason |
|---------|---------|--------|
| Type definition packages | `@types/jest`, `@types/node`, `@types/react`, `@types/react-dom` | Type-only, no runtime impact |
| Test-only dependencies | `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`, `jest`, `ts-jest` | Test scope only, unit tests validate correctness |
| Lint/format tools | `prettier`, `eslint-config-prettier`, `eslint-config-standard`, `eslint-config-standard-react` | Code style only, no runtime impact |
| ESLint plugins (patch/minor) | `eslint-plugin-prettier`, `eslint-plugin-promise`, `eslint-plugin-node`, `eslint-plugin-import`, `eslint-plugin-react` | Lint rules only |
| Build utilities | `cross-env`, `npm-run-all` | Script runners, no build output impact |
| Compat-test React aliases | `react-16`, `react-17`, `react-18`, `react-19`, `react-dom-16`, `react-dom-17`, `react-dom-18`, `react-dom-19` | Only used in compat test fixtures |

### Needs Quick Review

| Pattern | Example | Reason | Expected Test Coverage |
|---------|---------|--------|----------------------|
| Babel plugins | `@babel/eslint-parser`, `@babel/plugin-transform-react-jsx` | Used in ESLint parsing and JSX transform; minor bumps safe | Lint + build tests |
| ESLint core (minor) | `eslint` | Lint engine — minor/patch safe | `test:lint` script |
| TypeScript (patch) | `typescript` | Compiler — patch bumps safe, minor may flag new errors | `build` + `test:unit` |
| Playwright | `playwright-core` | UI compat tests only | `compat:test:ui` scripts |
| Replacement packages | `npm-run-all2`, `eslint-plugin-n` | Drop-in replacements for deprecated packages | Full test suite |

### Needs Deep Review

| Pattern | Example | Reason | Expected Test Coverage |
|---------|---------|--------|----------------------|
| React / React DOM (peer dep range) | `react`, `react-dom` (dev install) | Dev install matches peer dep range; major bumps affect compat testing | Unit + compat build/UI tests |
| VGS Collect.js SDK | `@vgs/collect-js` | Core upstream SDK this library wraps — API changes directly affect library behavior | Unit tests + compat tests |
| TypeScript (major) | `typescript` | Major bumps can break compilation | Build + all tests |
| Build toolchain | `tsdown`, `vite`, `@vitejs/plugin-react` | Produce the published dist artifacts — changes can affect output bundles | `build`, `demo:build`, `compat:build` |
| ESLint core (major) | `eslint`, `@typescript-eslint/*` | Major bumps may require config migration | `test:lint` |
| react-router-dom | `react-router-dom` | Used in demo app; major bumps need migration | `demo:build` |

## Historical Patterns (from PR analysis)

There are currently 10 open Renovate PRs, mostly minor/patch bumps to dev
tooling:

- **Lint plugins**: eslint-plugin-react, eslint-plugin-import (minor bumps)
- **Build tools**: postcss (resolution override), typescript (patch), prettier (patch)
- **Babel**: @babel/plugin-transform-react-jsx (patch)
- **Replacements**: npm-run-all → npm-run-all2, eslint-plugin-node → eslint-plugin-n
- **Pin dependencies**: Two PRs to pin react monorepo and other floating deps

The volume is moderate. Most PRs are low-risk dev tooling updates that have been
open since January 2026, suggesting no active review cadence is in place.

## Renovate Configuration

The `renovate.json` is minimal — it contains only the JSON schema reference and
no custom configuration:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json"
}
```

This means Renovate uses the default preset with no custom grouping, automerge
rules, package rules, or label configuration. The `renovate` label seen on
existing PRs is likely applied by an org-level Renovate config or default
behavior.
