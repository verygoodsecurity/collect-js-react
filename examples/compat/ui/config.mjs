import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(currentDir, '../fixtures');

export const compatFixtures = {
  react16: {
    key: 'react16',
    title: 'React 16 compatibility fixture',
    port: 3016,
    configFile: resolve(fixturesDir, 'react16/vite.config.ts')
  },
  react17: {
    key: 'react17',
    title: 'React 17 compatibility fixture',
    port: 3017,
    configFile: resolve(fixturesDir, 'react17/vite.config.ts')
  },
  react18: {
    key: 'react18',
    title: 'React 18 compatibility fixture',
    port: 3018,
    configFile: resolve(fixturesDir, 'react18/vite.config.ts')
  },
  react19: {
    key: 'react19',
    title: 'React 19 compatibility fixture',
    port: 3019,
    configFile: resolve(fixturesDir, 'react19/vite.config.ts')
  }
};
