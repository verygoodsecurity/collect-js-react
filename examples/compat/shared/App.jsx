import React from 'react';
import { VGSCollectForm, VGSCollectProvider } from '@vgs/collect-js-react';

export function CompatApp({ title }) {
  return (
    <VGSCollectProvider>
      <main>
        <h1>{title}</h1>
        <VGSCollectForm vaultId='tnt12345678' environment='sandbox'>
          <VGSCollectForm.CardNumberField name='card-number' />
        </VGSCollectForm>
      </main>
    </VGSCollectProvider>
  );
}
