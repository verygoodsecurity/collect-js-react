This demo app is served with Vite from the root workspace.

Run `yarn install` in the repository root, copy `.env.example` to `.env`, then start the demo with `yarn demo:dev`.

Environment variables:

```
VITE_VAULT_ID=<vault_id>
VITE_ENVIRONMENT=<env>
VITE_COLLECT_VERSION=<collect_version>
VGS_AUTH_URL=https://auth.verygoodsecurity.com/auth/realms/vgs/protocol/openid-connect/token
VGS_CLIENT_ID=<default_client_id>
VGS_CLIENT_SECRET=<default_client_secret>
```

The Vite server now exposes `/api/access-token`.
It always uses `VGS_CLIENT_ID` / `VGS_CLIENT_SECRET`.

The CMP demo page uses this endpoint to fetch an OAuth token server-side instead of hardcoding an access token in the browser.
