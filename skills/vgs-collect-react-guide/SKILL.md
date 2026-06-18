---
name: vgs-collect-react-guide
description: Help VGS customers integrate, implement, migrate, troubleshoot, or review the public @vgs/collect-js-react wrapper. Use when users ask to add VGS Collect to React apps, create cards with Card Management Platform through VGSCollectSession, configure VGSCollectSession or VGSCollectForm, render secure React field components, use VGS Collect React provider/hooks, submit or tokenize through the React wrapper, handle version-sensitive React wrapper behavior, or troubleshoot customer-facing React integration code.
metadata:
  author: verygoodsecurity
  version: '1.0.0'
---

# VGS Collect React Guide

Use this skill for public customer integration guidance for `@vgs/collect-js-react` only. Keep answers and bundled references limited to public React wrapper APIs, required public loader setup, examples, and troubleshooting.

## Route First

1. Read `references/react.md` for React wrapper setup, components, hooks, props, submit modes, and examples.
2. Read `references/compatibility.md` when the answer mentions wrapper installation, React support, Collect core version selection, or upgrade questions.
3. Use `examples/react-basic/App.tsx` only when the selected flow is the default React CMP create-card flow.

Do not load or answer with vanilla JavaScript-only integration patterns unless the user explicitly asks to leave React. If they need direct CDN script tags, `window.VGSCollect`, or non-React `loadVGSCollect` examples, use a vanilla JavaScript Collect guide instead.

## Task Routing

Choose one primary task mode before answering. The primary mode controls the shape of the output.

- `integrate`: first-time React wrapper setup. Confirm the app loads Collect core before rendering fields, choose `VGSCollectSession` for new work, and use the selected submit flow.
- `implement`: add or change a wrapper feature in the customer's app context. Generate code with explicit validation, error handling, and placeholders for secrets, identifiers, endpoints, and environment values the user has not supplied.
- `migrate`: move between wrapper, loader, or Collect core versions, or replace legacy `VGSCollectForm` usage. Compare current and target versions separately for `@vgs/collect-js-react`, `@vgs/collect-js`, and Collect core.
- `troubleshoot`: localize the failure before changing code. Prefer package state, loader/CDN configuration, console errors, network errors, sanitized logs, or a minimal repro.
- `review`: review code against public wrapper APIs, selected flow, version evidence, security rules, compatibility, and missing tests. Flag private, deprecated, insecure, or version-incompatible behavior.

## Use-Case Routing

CMP create-card is the primary default, not the only supported use case. First identify the customer's requested flow, then generate guidance for that flow.

Default to a Card Management Platform create-card integration only when the customer asks for a React card form, card entry, add-card, save-card, or payment-method setup and does not name another submission family. Use `VGSCollectSession` with:

- `submit={{ api: 'cmp', operation: 'createCard', ... }}`.
- `formId` for the Collect Session form configured for CMP.
- `authHandler` that fetches a short-lived access token from the customer's backend.
- `CardholderField`, `CardNumberField`, `CardExpirationDateField`, and `CardSecurityCodeField`.
- `onGetCardAttributesSuccess` / `onGetCardAttributesError` when BIN/card-attributes events are useful.

Use the requested flow instead when the customer asks for proxy submission, vault alias creation, tokenization, CMP update-card, legacy `VGSCollectForm`, non-card fields, file upload fields, hooks/state access, custom submit handling, styling, validation, masking, or UI-only field wiring.

## Clarifying Questions

Ask only when the missing information materially changes the recommendation:

- target flow: CMP create-card, CMP update-card, proxy submit, vault aliases, tokenization, legacy form, or UI-only wiring
- installed `@vgs/collect-js-react` version, `@vgs/collect-js` loader version, or Collect core version when behavior is version-sensitive
- loader path: `@vgs/collect-js`, CDN script, or app-provided `window.VGSCollect`
- target wrapper surface: `VGSCollectSession` or legacy `VGSCollectForm`
- relevant sanitized error, console output, network status, package manifest, lockfile, or code snippet for troubleshooting

## Version And Evidence Policy

Treat the React wrapper, loader, and Collect core as separate versioned surfaces. Do not infer one from another.

When the customer's installed package, loader config, CDN script, or requested target version is newer than the versions verified in this skill's references, do not answer from stale bundled guidance alone.

1. Read `references/compatibility.md`.
2. Inspect the customer's current `package.json`, lockfile, installed package metadata, CDN URL, and provided code before making version-specific claims.
3. If current evidence is still unavailable, label the version-specific claim as unverified and ask the customer to confirm it from VGS documentation or package metadata.
4. If this skill was installed through `skills.sh`, tell the user they can refresh the local skill with `npx skills check` and `npx skills update <skill-name>` or `npx skills update`.
5. Do not silently edit or reinstall this skill unless the user explicitly asks for that update.

For version-sensitive answers, state the evidence basis briefly, for example:

- `Using @vgs/collect-js-react 2.1.1 from package.json; Collect core version was not provided.`
- `Detected Collect core version <collect_version> from the loader config.`
- `Could not determine installed wrapper or Collect core versions; using bundled guidance and marking version-specific claims unverified.`

Retrieve additional evidence only when the task needs exact API signatures, version-specific behavior, concrete error detail, or integration examples. Prefer customer project files first, then public package metadata, README/examples, and official VGS documentation.

## Customer Safety Rules

- Preserve public API names exactly as implemented.
- If a claim cannot be verified from public package metadata, VGS documentation, or the customer's provided project files, say what must be confirmed instead of inventing an answer.
- Never ask customers to put PAN, CVC, SSN, passwords, OAuth tokens, client secrets, production route IDs, or production CNAME details in browser code, logs, screenshots, examples, or prompts.
- Keep sensitive values in placeholders such as `<vault_id>`, `<route_id>`, `<collect_version>`, and `<access_token_from_backend>`.
