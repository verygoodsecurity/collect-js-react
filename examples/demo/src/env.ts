import type { VGSCollectVaultEnvironment } from '@vgs/collect-js-react';

const env = import.meta.env;

export const VAULT_ID = env.VITE_VAULT_ID as string;
export const ENVIRONMENT = env.VITE_ENVIRONMENT as VGSCollectVaultEnvironment;
export const COLLECT_VERSION = env.VITE_COLLECT_VERSION as string;
