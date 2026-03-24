import React, { useEffect, useState } from 'react';
import {
  VGSCollectSession,
  VGSCollectFormState,
  VGSCollectHttpStatusCode,
  VGSCollectVaultEnvironment
} from '@vgs/collect-js-react';

import { loadVGSCollect } from '@vgs/collect-js';
import { COLLECT_VERSION, ENVIRONMENT, FORM_ID } from '../env';

const { TextField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectSession;
const vaultId = 'tntux31nzpn';

const CustomPayload = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);
  const sessionFormId = FORM_ID || 'test-simple-form';
  const VGSCollectFieldStyles = {
    padding: '.5rem 1rem',
    boxSizing: 'border-box',
    '&::placeholder': {
      color: '#686868'
    }
  };

  useEffect(() => {
    /**
     * Loading VGS Collect script from and attaching it to the <head>
     */
    loadVGSCollect({
      vaultId: vaultId as string,
      environment: ENVIRONMENT as VGSCollectVaultEnvironment,
      version: COLLECT_VERSION
    }).then(() => {
      setCollectScriptLoaded(true);
    });
  }, []);

  const onSubmitCallback = (status: VGSCollectHttpStatusCode, resp: any) => {
    /**
     * Receive information about HTTP request
     */
  };

  const onUpdateCallback = (state: VGSCollectFormState) => {
    /**
     * Listen to the VGS Collect form state
     */
  };

  const onErrorCallback = (errors: VGSCollectFormState) => {
    /**
     * Receive information about Erorrs (client-side validation)
     */
  };

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <div className='left'>
          <h2>Tokenization API</h2>
          {/**
           * VGS Collect form wrapper element. Abstraction over the VGSCollect.create()
           * https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
           */}
          <VGSCollectSession
            vaultId={vaultId as string}
            environment={ENVIRONMENT as VGSCollectVaultEnvironment}
            formId={sessionFormId}
            submit={{
              api: 'tokenization'
            }}
            stateCallback={onUpdateCallback}
            onSubmitCallback={onSubmitCallback}
            onErrorCallback={onErrorCallback}
          >
            {/**
             * VGS Collect text field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <TextField
              name='textField'
              validations={['required']}
              css={VGSCollectFieldStyles}
              tokenization={{ format: 'UUID', storage: 'PERSISTENT' }}
            />
            <CardNumberField name='card-number' css={VGSCollectFieldStyles} />
            {/**
             * VGS Collect card expiration date field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <CardExpirationDateField
              name='card-expiration-date'
              validations={['required', 'validCardExpirationDate']}
              yearLength={2}
              css={VGSCollectFieldStyles}
              tokenization={{ format: 'UUID', storage: 'PERSISTENT' }}
            />
            <CardSecurityCodeField
              name='card-security-code'
              validations={['required', 'validCardSecurityCode']}
              css={VGSCollectFieldStyles}
              showCardIcon={{
                right: '1rem'
              }}
            />
            <button type='submit'>Submit</button>
          </VGSCollectSession>
        </div>
      )}
    </>
  );
};

export default CustomPayload;
