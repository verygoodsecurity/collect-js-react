This demo app is served with Vite from the root workspace.

Run `yarn install` in the repository root, copy `.env.example` to `.env`, then start the demo with `yarn demo:dev`.

Environment variables:

```
VITE_VAULT_ID=<vault_id>
VITE_ENVIRONMENT=<env>
VITE_COLLECT_VERSION=<collect_version>
VITE_FORM_ID=<collect_form_id>
VGS_AUTH_URL=https://auth.verygoodsecurity.com/auth/realms/vgs/protocol/openid-connect/token
VGS_CLIENT_ID=<default_client_id>
VGS_CLIENT_SECRET=<default_client_secret>
```

The Vite server now exposes `/api/access-token`.
It always uses `VGS_CLIENT_ID` / `VGS_CLIENT_SECRET`.

The CMP demo page now uses `VGSCollectSession` and expects a Collect session config identified by `VITE_FORM_ID`.
It fetches the OAuth token server-side via `/api/access-token` instead of hardcoding an access token in the browser.
