import React, { useEffect, useState } from 'react';
import {
  VGSCollectForm,
  VGSCollectFormState,
  VGSCollectHttpStatusCode,
  VGSCollectVaultEnvironment
} from 'collect-js-react';

import { loadVGSCollect } from '@vgs/collect-js';

const { TextField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectForm;

const { REACT_APP_ENVIRONMENT, REACT_APP_COLLECT_VERSION } = process.env;
const vaultId = 'tntux31nzpn';

const CustomPayload = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);
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
      environment: REACT_APP_ENVIRONMENT as VGSCollectVaultEnvironment,
      version: REACT_APP_COLLECT_VERSION as string
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
          <VGSCollectForm
            vaultId={vaultId as string}
            environment={REACT_APP_ENVIRONMENT as VGSCollectVaultEnvironment}
            tokenizationAPI
            submitParameters={{}}
            onUpdateCallback={onUpdateCallback}
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
          </VGSCollectForm>
        </div>
      )}
    </>
  );
};

export default CustomPayload;
