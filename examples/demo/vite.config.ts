import react from '@vitejs/plugin-react';
import type { ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import type { Connect } from 'vite';

const workspaceRoot = resolve(__dirname, '../..');
const defaultAuthUrl = 'https://auth.verygoodsecurity.com/auth/realms/vgs/protocol/openid-connect/token';

const sendJson = (res: ServerResponse, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const createAccessTokenMiddleware = (env: Record<string, string>): Connect.NextHandleFunction => {
  return (req, res, next) => {
    void (async () => {
      if (!req.url) {
        next();
        return;
      }

      const url = new URL(req.url, 'http://localhost');

      if (url.pathname !== '/api/access-token') {
        next();
        return;
      }

      if (!req.method || !['GET', 'POST'].includes(req.method)) {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }

      try {
        const clientId = env.VGS_CLIENT_ID;
        const clientSecret = env.VGS_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          sendJson(res, 500, {
            error: 'Missing VGS client credentials'
          });
          return;
        }

        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('grant_type', 'client_credentials');

        const tokenResponse = await fetch(env.VGS_AUTH_URL || defaultAuthUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        const responseData = await tokenResponse.json();

        sendJson(res, tokenResponse.status, responseData);
      } catch (error) {
        sendJson(res, 500, {
          error: error instanceof Error ? error.message : 'Unexpected error'
        });
      }
    })();
  };
};

const accessTokenPlugin = (env: Record<string, string>) => ({
  name: 'demo-access-token-endpoint',
  configureServer(server: { middlewares: { use: (middleware: Connect.NextHandleFunction) => void } }) {
    server.middlewares.use(createAccessTokenMiddleware(env));
  },
  configurePreviewServer(server: { middlewares: { use: (middleware: Connect.NextHandleFunction) => void } }) {
    server.middlewares.use(createAccessTokenMiddleware(env));
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  return {
    root: __dirname,
    plugins: [
      react({
        jsxRuntime: 'classic'
      }),
      accessTokenPlugin(env)
    ],
    resolve: {
      alias: {
        '@vgs/collect-js-react': resolve(workspaceRoot, 'src/index.tsx'),
        'collect-js-react': resolve(workspaceRoot, 'src/index.tsx')
      }
    },
    server: {
      port: 3000,
      fs: {
        allow: [workspaceRoot]
      }
    },
    preview: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});
