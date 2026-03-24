import {
  VGSCollectSession,
  VGSCollectFormState,
  VGSCollectHttpStatusCode,
  VGSCollectVaultEnvironment,
  useVGSCollectState
} from '@vgs/collect-js-react';
import React, { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';
import { COLLECT_VERSION, ENVIRONMENT, FORM_ID, VAULT_ID } from '../env';

const { CardExpirationDateField, CardSecurityCodeField } = VGSCollectSession;

const CARD_ID = 'CRDe4CxWRkZZYZ8cGumTbESMP';

const CmpUpdateCard = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);
  const [submitResponse, setSubmitResponse] = useState<any>(null);
  const [cmpError, setCmpError] = useState<any>(null);
  const VGSCollectFieldStyles = {
    '&::placeholder': {
      color: '#686868'
    },
    padding: '.5rem 1rem',
    boxSizing: 'border-box'
  };

  const [state] = useVGSCollectState();
  const sessionFormId = FORM_ID || 'test-simple-form';

  useEffect(() => {
    loadVGSCollect({
      vaultId: VAULT_ID,
      environment: ENVIRONMENT as VGSCollectVaultEnvironment,
      version: COLLECT_VERSION
    }).then(() => {
      setCollectScriptLoaded(true);
    });
  }, []);

  const onErrorCallback = (errors: VGSCollectFormState) => {
    setCmpError(errors);
    console.log(errors);
  };

  const onStateCallback = (_state: VGSCollectFormState) => {};

  const onSubmitCallback = (status: VGSCollectHttpStatusCode, resp: any) => {
    setCmpError(null);
    setSubmitResponse(resp);
    console.log('Submit callback', status, resp);
  };

  const getAccessApiKey = async (): Promise<string> => {
    const response = await fetch('/api/access-token');
    const data = await response.json();

    if (!response.ok || typeof data.access_token !== 'string') {
      throw new Error(data.error_description || data.error || 'Failed to fetch access token');
    }

    return data.access_token;
  };

  const formatJson = (value: unknown, emptyMessage: string) => {
    return value ? JSON.stringify(value, null, 2) : emptyMessage;
  };

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <>
          <div className='left'>
            <h2>Card Management (Update Card)</h2>
            <p>Using formId: {sessionFormId}</p>
            <p>Card ID: {CARD_ID}</p>
            <VGSCollectSession
              vaultId={VAULT_ID}
              environment={ENVIRONMENT as VGSCollectVaultEnvironment}
              formId={sessionFormId}
              authHandler={getAccessApiKey}
              stateCallback={onStateCallback}
              onErrorCallback={onErrorCallback}
              onSubmitCallback={onSubmitCallback}
              submit={{
                api: 'cmp',
                operation: 'updateCard',
                params: {
                  cardId: CARD_ID
                }
              }}
            >
              <CardExpirationDateField css={VGSCollectFieldStyles} />
              <CardSecurityCodeField css={VGSCollectFieldStyles} />
              <button type='submit'>Submit</button>
            </VGSCollectSession>
          </div>
          <div className='right'>
            <h3>Card ID</h3>
            <pre>{formatJson({ cardId: CARD_ID }, 'No card id')}</pre>
            <h3>Response</h3>
            <pre>{formatJson(submitResponse, 'Submit to update the card')}</pre>
            <h3>Errors</h3>
            <pre>{formatJson(cmpError, 'No session or submit errors')}</pre>
            <h3>State</h3>
            <pre>{formatJson(state, 'Waiting for state updates...')}</pre>
          </div>
        </>
      )}
    </>
  );
};

export default CmpUpdateCard;
