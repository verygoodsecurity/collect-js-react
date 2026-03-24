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

const { CardholderField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectSession;

const Cmp = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);
  const [cardAttributesResponse, setCardAttributesResponse] = useState<any>(null);
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
    /**
     * Loading VGS Collect script from and attaching it to the <head>
     */
    loadVGSCollect({
      vaultId: VAULT_ID,
      environment: ENVIRONMENT as VGSCollectVaultEnvironment,
      version: COLLECT_VERSION
    }).then(() => {
      setCollectScriptLoaded(true);
    });
  }, []);

  const onErrorCallback = (errors: VGSCollectFormState) => {
    console.log('qweqweqweqweqwe', errors)
    setCmpError(errors);
    console.log(errors);
  };

  const onStateCallback = (_state: VGSCollectFormState) => {};

  const onSubmitCallback = (status: VGSCollectHttpStatusCode, resp: any) => {
    console.log('qweqew', resp)
    setCmpError(null);
    setSubmitResponse(resp);
    console.log('Submit callback', status, resp);
  };

  const onGetCardAttributesSuccess = (resp: any) => {
    setCardAttributesResponse(resp);
  };

  const onGetCardAttributesError = (errors: any) => {
    setCardAttributesResponse(errors);
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

  // const formattedSubmitPayload = submitResponse?.data || submitResponse;
  const formattedSubmitPayload = submitResponse;
  const cvcAlias = submitResponse?.data?.attributes?.cvc_alias || submitResponse?.attributes?.cvc_alias;

  const fallbackConfiguration = {
    cardAttributes: {
      enable: true,
      parameters: ['card_brand', 'card_type', 'product_name']
    }
  };

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <>
          <div className='left'>
            <h2>CMP Session</h2>
            <p>Using formId: {sessionFormId}</p>
            <p>Bin for Testing: 487104</p>
            {/**
             * VGS Collect session wrapper element. Abstraction over the VGSCollect.session()
             */}
            <VGSCollectSession
              vaultId={VAULT_ID}
              environment={ENVIRONMENT as VGSCollectVaultEnvironment}
              formId={sessionFormId}
              configuration={fallbackConfiguration}
              authHandler={getAccessApiKey}
              stateCallback={onStateCallback}
              onErrorCallback={onErrorCallback}
              onGetCardAttributesSuccess={onGetCardAttributesSuccess}
              onGetCardAttributesError={onGetCardAttributesError}
              onSubmitCallback={onSubmitCallback}
              submit={{
                api: 'cmp',
                operation: 'createCard',
                submitParameters: {
                  data: {
                    cardholder: {
                      address: {
                        address1: '123 Main St',
                        address2: 'Suite 456',
                        address3: 'Line 3',
                        address4: 'Line 4',
                        city: 'LA',
                        region: 'CA',
                        postal_code: '12345',
                        country: 'USA'
                      }
                    }
                  }
                }
              }}
              // submit={{
              //   api: 'proxy',
              //   action: '/post',
              //   routeId: '95c9e353-e0f6-4665-9acd-fec787ef5337',
              //   submitParameters: {
              //     data: (fields: any) => {
              //       return {
              //         customData: 'test',
              //         textField: 'text 2',
              //         cardNumber: fields['pan']
              //       };
              //     },
              //     headers: {
              //       test1: 'test'
              //     }
              //   }
              // }}
              // submit={{
              //   api: 'vault'
              // }}
            >
              {/**
               * VGS Collect text field component:
               * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
               */}
              <CardholderField css={VGSCollectFieldStyles} defaultValue='John Doe' />

              <CardNumberField css={VGSCollectFieldStyles} />
              <CardExpirationDateField css={VGSCollectFieldStyles} defaultValue='12 / 38' />
              <CardSecurityCodeField css={VGSCollectFieldStyles} defaultValue='123' />
              <button type='submit'>Submit</button>
            </VGSCollectSession>
          </div>
          <div className='right'>
            <h3>Card Attributes</h3>
            <pre>{formatJson(cardAttributesResponse, 'Waiting for card attributes event...')}</pre>
            <h3>CVC Alias</h3>
            <pre>{formatJson(cvcAlias ? { cvc_alias: cvcAlias } : null, 'Submit to get cvc_alias')}</pre>
            <h3>CMP Response</h3>
            <pre>{formatJson(formattedSubmitPayload, 'Submit to create a card')}</pre>
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

export default Cmp;
