# Compatibility

Use this reference for package installation, version selection, React support, Collect core version selection, and upgrade questions.

## Customer-Safe Rules

- Do not claim a package or CDN version is latest unless it was verified from current public package or documentation metadata.
- Do not infer the Collect core version from the React wrapper version.
- Do not infer the loader package version from the Collect core version.
- For production, use an explicit pinned Collect core version.
- When troubleshooting, prefer the versions already pinned in the customer's package manager files, environment variables, and CDN script URLs.

## Package Roles

| Layer | Customer-facing purpose | Versioning guidance |
| --- | --- | --- |
| `@vgs/collect-js-react` | React components and hooks for rendering VGS Collect fields. | Version separately from the loader and Collect core SDK. Verify React, React DOM, and optional `@vgs/collect-js` peer support from the package metadata when compatibility matters. |
| `@vgs/collect-js` | Browser script loader that loads the Collect core SDK from the CDN. | Version separately from the React wrapper and Collect core SDK. For wrapper versions that declare the loader peer, use a loader version that satisfies the wrapper's peer range. |
| Collect core SDK | Browser runtime used by the React wrapper after loading. | Pin a concrete CDN/core version for production. Use the customer's existing pinned version when diagnosing behavior. |

## Version Selection

- Use `<collect_version>` as a placeholder in examples unless the customer provided a verified target version.
- If the customer asks which exact version to install or pin, verify the current package/CDN version first.
- If verification is unavailable, explain the rule: pin a concrete production version and confirm the target version from VGS docs, package metadata, or the customer's existing project config.
- For React apps that use the npm loader, install both the React wrapper and a compatible `@vgs/collect-js` loader version. If the app already loads the Collect core SDK from the CDN, the loader package is not required.

## React Compatibility

- Check the installed `@vgs/collect-js-react` package metadata when the customer asks which React versions are supported.
- React and React DOM are peer dependencies of the React wrapper.
- `@vgs/collect-js` is an optional peer when the React app uses the npm loader path; CDN/global loading remains supported.
- The React wrapper expects the Collect core SDK to be loaded before fields mount.

## Upgrade Guidance

- Ask for the customer's current package versions, Collect core version, CDN script URL, and relevant console errors.
- Upgrade one layer at a time when possible: wrapper, loader, and core SDK are separate versioned surfaces.
- Keep customer examples on sandbox and placeholders unless the user provides sanitized project config.
