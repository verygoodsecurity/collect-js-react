import type { IVGSCollect } from './types/Form';

function generateUUID() {
  function getRandomHex(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 16).toString(16);
    }
    return result;
  }

  return (
    getRandomHex(8) +
    '-' +
    getRandomHex(4) +
    '-' +
    '4' +
    getRandomHex(3) +
    '-' +
    (Math.floor(Math.random() * 4) + 8).toString(16) +
    getRandomHex(3) +
    '-' +
    getRandomHex(12)
  );
}

const getCollectLoadErrorMessage = (method: 'create' | 'session') =>
  `@vgs/collect-js-react: VGS Collect.js is not loaded or does not expose .${method}(). ` +
  'Load Collect.js before rendering VGS Collect React fields. ' +
  'If you use the npm loader, install @vgs/collect-js@^0.7.3 and wait for loadVGSCollect(...) to resolve.';

function assertVGSCollectLoaded(method: 'create' | 'session'): IVGSCollect {
  // The React wrapper intentionally supports CDN loading, so runtime validation is required.
  const collect = typeof window !== 'undefined' ? window.VGSCollect : undefined;

  if (!collect || typeof collect[method] !== 'function') {
    throw new Error(getCollectLoadErrorMessage(method));
  }

  return collect;
}

export { generateUUID, assertVGSCollectLoaded };
