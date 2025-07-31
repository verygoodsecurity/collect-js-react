import {
  VGSCollectForm,
  VGSCollectFormState,
  VGSCollectHttpStatusCode,
  VGSCollectVaultEnvironment,
  useVGSCollectResponse,
  useVGSCollectState,
  useVGSCollectFormInstance,
  IVGSCollectForm
} from 'collect-js-react';
import React, { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';

const { CardholderField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectForm;
const { REACT_APP_VAULT_ID, REACT_APP_ENVIRONMENT, REACT_APP_COLLECT_VERSION } = process.env;

const Cmp = (e: any) => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);
  const [formInstance, setFormInstance] = useState<IVGSCollectForm | null>(null);
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const VGSCollectFieldStyles = {
    '&::placeholder': {
      color: '#686868'
    },
    padding: '.5rem 1rem',
    boxSizing: 'border-box'
  };

  const [state] = useVGSCollectState();
  const [response] = useVGSCollectResponse();
  const [form] = useVGSCollectFormInstance();

  useEffect(() => {
    /**
     * Track form state
     */
  }, [state]);

  useEffect(() => {
    /**
     * Track response from the VGS Collect form
     */
  }, [response]);

  useEffect(() => {
    setFormInstance(form);
  }, [form]);

  useEffect(() => {
    /**
     * Loading VGS Collect script from and attaching it to the <head>
     */
    loadVGSCollect({
      vaultId: REACT_APP_VAULT_ID as string,
      environment: REACT_APP_ENVIRONMENT as VGSCollectVaultEnvironment,
      version: REACT_APP_COLLECT_VERSION as string
    }).then(() => {
      setCollectScriptLoaded(true);
    });
  }, []);

  const onErrorCallback = (errors: VGSCollectFormState) => {
    /**
     * Receive information about Erorrs (client-side validation, or rejection in async headers function)
     */
  };

  const onUpdateCallback = (state: VGSCollectFormState) => {
    /**
     * Listen to the VGS Collect form state
     */
  };

  const onSubmitCallback = (status: VGSCollectHttpStatusCode, resp: any) => {
    console.log('Submit callback', status, resp);
  };

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <div className='left'>
          <h2>CMP</h2>
          {/**
           * VGS Collect form wrapper element. Abstraction over the VGSCollect.create()
           * https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
           */}
          <VGSCollectForm
            vaultId={REACT_APP_VAULT_ID as string}
            environment={REACT_APP_ENVIRONMENT as VGSCollectVaultEnvironment}
            onUpdateCallback={onUpdateCallback}
            onErrorCallback={onErrorCallback}
            onSubmitCallback={onSubmitCallback}
            submitParameters={{
              createCard: {
                auth: '<VGS_AUTH_TOKEN>',
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
          >
            {/**
             * VGS Collect text field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <CardholderField css={VGSCollectFieldStyles} />
            <CardNumberField css={VGSCollectFieldStyles} />
            <CardExpirationDateField css={VGSCollectFieldStyles} />
            <CardSecurityCodeField css={VGSCollectFieldStyles} />
            <button type='submit'>Submit</button>
          </VGSCollectForm>
        </div>
      )}
    </>
  );
};

export default Cmp;
