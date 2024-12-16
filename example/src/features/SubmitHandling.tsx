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

const { TextField } = VGSCollectForm;

const { REACT_APP_VAULT_ID, REACT_APP_ENVIRONMENT, REACT_APP_COLLECT_VERSION } = process.env;

const SubmitHandling = (e: any) => {
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
    console.log('formInstance', formInstance, form)
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

  const customHandling = (event: any) => {
    event.preventDefault();
    console.log('HERE', formInstance)
    if (!isFormSubmitting && formInstance) {
      setFormSubmitting(true);
      formInstance.submit(
        '/post',
        {},
        (status, data) => {
          console.log('Response:', status, data);
          setFormSubmitting(false);
        },
        (errors) => {
          console.log(errors);
          setFormSubmitting(false);
        }
      );
    }
  };

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <div className='left'>
          <h2>Custom Submit Handling</h2>
          {/**
           * VGS Collect form wrapper element. Abstraction over the VGSCollect.create()
           * https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
           */}
          <VGSCollectForm
            vaultId={REACT_APP_VAULT_ID as string}
            environment={REACT_APP_ENVIRONMENT as VGSCollectVaultEnvironment}
            onCustomSubmit={customHandling}
            onUpdateCallback={onUpdateCallback}
            onErrorCallback={onErrorCallback}
          >
            {/**
             * VGS Collect text field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <TextField name='textField' validations={['required']} css={VGSCollectFieldStyles} />
            <button type='submit'>Submit</button>
          </VGSCollectForm>
        </div>
      )}
    </>
  );
};

export default SubmitHandling;
