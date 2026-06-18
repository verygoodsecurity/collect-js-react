import { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';
import {
  VGSCollectProvider,
  VGSCollectSession,
  VGSCollectVaultEnvironment
} from '@vgs/collect-js-react';

const { CardholderField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectSession;

const cmpConfiguration = {
  cardAttributes: {
    enable: true,
    parameters: ['card_brand', 'card_type', 'product_name']
  }
};

async function getAccessToken(): Promise<string> {
  const response = await fetch('/api/access-token');
  const data = await response.json();

  if (!response.ok || typeof data.access_token !== 'string') {
    throw new Error(data.error_description || data.error || 'Failed to fetch access token');
  }

  return data.access_token;
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadVGSCollect({
      vaultId: '<vault_id>',
      environment: 'sandbox' as VGSCollectVaultEnvironment,
      version: '<collect_version>'
    }).then(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId='<vault_id>'
        environment='sandbox'
        formId='<collect_form_id>'
        configuration={cmpConfiguration}
        authHandler={getAccessToken}
        submit={{
          api: 'cmp',
          operation: 'createCard',
          submitParameters: {
            data: {
              cardholder: {
                address: {
                  address1: '123 Main St',
                  city: 'LA',
                  region: 'CA',
                  postal_code: '12345',
                  country: 'USA'
                }
              }
            }
          }
        }}
        onSubmitCallback={(status, response) => {
          void status;
          void response;
          // Store aliases, card IDs, or other non-sensitive response values needed by the app.
        }}
        onErrorCallback={(errors) => {
          void errors;
          // Map validation/session errors to customer-safe UI messages.
        }}
        onGetCardAttributesSuccess={(response) => {
          void response;
          // Use card brand/type/product metadata for UI only; do not log sensitive input.
        }}
        onGetCardAttributesError={(errors) => {
          void errors;
        }}
      >
        <CardholderField />
        <CardNumberField />
        <CardExpirationDateField />
        <CardSecurityCodeField />
        <button type='submit'>Submit</button>
      </VGSCollectSession>
    </VGSCollectProvider>
  );
}
