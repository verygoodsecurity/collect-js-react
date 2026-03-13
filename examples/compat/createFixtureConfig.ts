import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

type CompatFixtureOptions = {
  fixtureRoot: string;
  reactAlias: string;
  reactDomAlias: string;
  reactDomClientAlias?: string;
};

const workspaceRoot = resolve(__dirname, '../..');

export function createFixtureConfig(options: CompatFixtureOptions) {
  const { fixtureRoot, reactAlias, reactDomAlias, reactDomClientAlias } = options;

  return defineConfig({
    root: fixtureRoot,
    plugins: [
      react({
        jsxRuntime: 'classic'
      })
    ],
    resolve: {
      alias: {
        '@vgs/collect-js-react': resolve(workspaceRoot, 'src/index.tsx'),
        react: reactAlias,
        'react-dom': reactDomAlias,
        ...(reactDomClientAlias
          ? {
              'react-dom/client': reactDomClientAlias
            }
          : {})
      }
    },
    server: {
      fs: {
        allow: [workspaceRoot]
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  });
}
