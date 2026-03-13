import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const workspaceRoot = resolve(__dirname, '../..');

export default defineConfig({
  root: __dirname,
  plugins: [
    react({
      jsxRuntime: 'classic'
    })
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
});
