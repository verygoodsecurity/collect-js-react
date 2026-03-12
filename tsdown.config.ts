import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  platform: 'neutral',
  deps: {
    neverBundle: ['react', 'react-dom']
  }
});
