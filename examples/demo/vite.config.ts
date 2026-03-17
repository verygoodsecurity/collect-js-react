import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { accessTokenPlugin } from './server/accessTokenPlugin';

const workspaceRoot = resolve(__dirname, '../..');

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
