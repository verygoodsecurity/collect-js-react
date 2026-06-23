# Contributor Agent Instructions

These instructions apply to changes under `.github/`. They are intended for AI
agents updating repository metadata, issue and pull-request templates, security
policy files, workflow automation, and dependency-management configuration.

## Project Security Context

- This repository publishes `@vgs/collect-js-react`, a React wrapper for VGS
  Collect.js secure iframe fields.
- The package is a browser-facing library for payment, identity, password,
  tokenization, proxy-submit, and Card Management Platform flows.
- The published package currently has no runtime `dependencies`; React, React
  DOM, and the optional `@vgs/collect-js` npm loader are peer dependencies,
  while build, lint, test, demo, and compatibility tooling are
  `devDependencies`.
- Treat `@vgs/collect-js`, `src/Session.tsx`, `src/Form.tsx`, field props,
  submit parameters, auth handlers, CNAME/route configuration, demo token
  endpoints, and dependency-resolution overrides as security-sensitive surfaces.

## Project Map

- `src/Session.tsx` and `src/Form.tsx` own the React wrappers around VGS
  Collect session/create flows and form submission behavior.
- `src/Fields.tsx` mounts secure iframe field containers and wires field event
  callbacks.
- `src/provider.tsx`, `src/formStateProvider.tsx`, and `src/state.ts` expose
  shared form state, submit response state, and the active VGS Collect form
  instance.
- `src/types/` defines the public TypeScript API that customers consume.
- `examples/demo/` shows customer integration patterns, including the server-side
  demo access-token endpoint for CMP flows.
- `examples/compat/` verifies React 16, 17, 18, and 19 compatibility.
- `package.json`, `yarn.lock`, `renovate.json`, and `resolutions` are the main
  dependency and supply-chain review surfaces.

## Instruction Precedence

- Follow the nearest applicable `AGENTS.md` first. If a more specific
  instruction file is added under a subtree, it overrides this file for that
  subtree.
- Keep `.github/SECURITY.md` authoritative for vulnerability reporting
  instructions. Do not move security reports into public issue or pull-request
  flows.
- Keep `.github/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, and
  `.github/ISSUE_TEMPLATE.md` concise and compatible with this package's public
  contributor workflow.

## OWASP Baseline

Use current OWASP guidance as a baseline for security-sensitive changes. Keep
the instructions practical and repo-specific instead of expanding this file into
a detailed OWASP checklist.

## Sensitive Data Rules

- Never ask contributors to paste raw PAN, CVC/CVV, SSN, passwords, OAuth
  access tokens, client secrets, session IDs, vault credentials, bearer tokens,
  production route IDs, or production CNAME details into GitHub issues, pull
  requests, logs, screenshots, examples, or workflow output.
- Use placeholders such as `<vault_id>`, `<route_id>`, `<client_id>`, and
  `<client_secret>`. Use sandbox vaults and documented test data for examples.
- Do not add issue-template fields that solicit secrets or regulated data.
  Direct suspected vulnerabilities and sensitive evidence to
  `.github/SECURITY.md`.
- Do not recommend storing sensitive data in `localStorage`, `sessionStorage`,
  browser-readable cookies, query strings, source-controlled config, or demo
  bundles.
- Do not log request headers, authorization values, token responses, card data,
  field payloads, or full VGS Collect form state. Redact before displaying
  examples or diagnostic output.

## VGS Collect Security Model

- Preserve the secure iframe boundary. Do not suggest collecting PAN, CVC, SSN,
  passwords, or equivalent sensitive values in React-controlled inputs before
  passing them to VGS.
- Keep examples and contributor guidance clear that VGS Collect.js must be
  loaded from the approved VGS domain for PCI-sensitive collection flows.
- Treat field `name`, validation, tokenization, serializer, `submitParameters`,
  headers, `authHandler`, `routeId`, `cname`, `formId`, and inline session
  `configuration` changes as potential security changes.
- Client-side code cannot provide authoritative access control. Do not describe
  client-only checks as sufficient for authentication, authorization, fraud
  controls, rate limiting, or data entitlement.
- For CMP or authenticated flows, prefer backend-minted short-lived tokens.
  Never hardcode OAuth tokens or client secrets in browser code, documentation
  examples, templates, or workflow files.

## GitHub And CI/CD Hardening

- Use least-privilege `GITHUB_TOKEN` permissions in every workflow. Declare
  explicit `permissions:` blocks instead of relying on broad defaults.
- Do not expose secrets to untrusted pull requests, forked code, matrix values,
  dependency scripts, or workflow commands that can be influenced by a
  contributor.
- Avoid `pull_request_target` for workflows that check out or execute
  contributor-controlled code. If it is unavoidable, document why and keep the
  workflow read-only unless a maintainer-controlled handoff is used.
- Pin third-party GitHub Actions to immutable commit SHAs for security-sensitive
  workflows. If tags are used for low-risk workflows, explain the tradeoff.
- Do not add workflows that run arbitrary package lifecycle scripts with access
  to secrets.
- Keep build artifacts, coverage files, and dependency caches out of published
  release assets unless they are intentionally needed and reviewed.
- Mask secrets in workflow output and avoid printing environment variables.

## Dependency And Supply Chain Rules

- Use Yarn v1 and the committed `yarn.lock` as the source of truth.
- Review changes to `resolutions` carefully. Do not remove a security override
  unless the vulnerable transitive path is gone or the replacement version is
  still patched.
- Treat `@vgs/collect-js`, `tsdown`, `vite`, `@vitejs/plugin-react`,
  TypeScript major changes, ESLint major changes, React peer range changes, and
  React compatibility fixture changes as deep-review items.
- Type definitions, lint-format tooling, test-only packages, and patch/minor
  updates to isolated dev tools are lower risk, but still require lockfile
  review and relevant validation.
- Prefer narrow, documented dependency overrides over broad overrides. Include a
  removal condition when adding a security override.
- Do not rely only on vulnerability scanner output. Check the installed version,
  affected range, fixed version, dependency path, package scope, and whether the
  dependency affects the published package or only local build/test/demo tools.

## Template And Policy Changes

- Keep public templates safe by default: request versions, browsers, operating
  systems, minimal repro steps, and sandbox configuration only.
- Security issue text must route private reports to VGS security contacts and
  avoid asking for public proof-of-concept details.
- Pull-request templates should ask for testing, documentation impact, and
  security/privacy impact when the change touches sensitive flows.
- Avoid adding legal, compliance, PCI, HIPAA, GDPR, or CCPA guarantees unless
  they already appear in approved VGS source material and the wording remains
  accurate.

## Documentation And Instruction Updates

- After every repository change, check whether contributor instructions,
  security policy, issue or pull-request templates, workflow guidance, or the
  README should be updated.
- Update instructions when the change affects agent workflow, validation
  expectations, dependency handling, release behavior, security review, or
  contributor process.
- Update `README.md` only for customer-facing integration changes: public API,
  setup, supported environments, examples, documented behavior, or migration
  guidance.
- Keep `README.md` focused on customers integrating the package and using its
  public API. Do not add internal implementation details, agent workflow notes,
  private security triage details, or repo-maintenance process there.
- Treat `skills/` as public customer integration guidance. Keep committed skill
  routers, references, and examples accurate against the current source, package
  metadata, README, and examples. When a requested change includes packaged
  skill artifacts outside `skills/`, keep those artifacts accurate as well.
- When public API, documented behavior, supported environments, compatibility
  ranges, or package versions change, update the relevant public skill router,
  references, and examples in the same change.
- Back public skill API and version claims with current repo evidence. If a
  claim cannot be verified, label it as `HYPOTHESIS` and add a TODO instead of
  presenting it as fact.

## Validation Expectations

- For Markdown-only `.github` changes, at minimum inspect the rendered structure
  mentally and run `git diff --check`.
- For workflow or dependency-automation changes, validate syntax and run the
  narrowest relevant package checks. Prefer:
  - `yarn test:lint`
  - `yarn test:unit`
  - `yarn test:build`
  - `yarn test:demobuild`
  - `yarn test:compatbuild`
  - `yarn test`
- If a requested validation step cannot be run, report the exact blocker and
  the residual risk.

## Review Checklist For Agents

Before finalizing `.github` changes, confirm:

- No secret, regulated data, production credential, or sensitive vulnerability
  detail is requested in a public channel.
- The change preserves private security reporting through `.github/SECURITY.md`.
- Workflow permissions are explicit and least-privileged.
- Any dependency guidance respects the no-runtime-dependencies package shape.
- Any security wording maps to OWASP guidance and this repo's VGS secure iframe
  model.
- Contributor instructions and `README.md` were checked for required updates,
  with README changes limited to customer-facing public API and integration
  content.
- Public `skills/` were checked for required updates when public API, versions,
  compatibility, setup, examples, or documented behavior changed.
- Required validation was run, or the blocker was reported.
