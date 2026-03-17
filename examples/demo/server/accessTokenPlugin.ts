import type { ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';
import { requestAccessToken } from './requestAccessToken';

type DemoServerEnv = Record<string, string>;
type DemoMiddlewareRequest = {
  method?: string;
  url?: string;
};

const sendJson = (res: ServerResponse, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const createAccessTokenMiddleware = (env: DemoServerEnv): Connect.NextHandleFunction => {
  return (req, res, next) => {
    const request = req as DemoMiddlewareRequest;

    void (async () => {
      if (!request.url) {
        next();
        return;
      }

      const url = new URL(request.url, 'http://localhost');

      if (url.pathname !== '/api/access-token') {
        next();
        return;
      }

      if (!request.method || !['GET', 'POST'].includes(request.method)) {
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

        const tokenResponse = await requestAccessToken({
          authUrl: env.VGS_AUTH_URL,
          clientId,
          clientSecret
        });

        sendJson(res, tokenResponse.statusCode, tokenResponse.data);
      } catch (error) {
        sendJson(res, 500, {
          error: error instanceof Error ? error.message : 'Unexpected error'
        });
      }
    })();
  };
};

export const accessTokenPlugin = (env: DemoServerEnv): Plugin => ({
  name: 'demo-access-token-endpoint',
  configureServer(server) {
    server.middlewares.use(createAccessTokenMiddleware(env));
  },
  configurePreviewServer(server) {
    server.middlewares.use(createAccessTokenMiddleware(env));
  }
});
