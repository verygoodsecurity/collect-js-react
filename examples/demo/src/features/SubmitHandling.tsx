import {
  VGSCollectSession,
  VGSCollectFormState,
  VGSCollectHttpStatusCode,
  VGSCollectVaultEnvironment,
  useVGSCollectResponse,
  useVGSCollectState,
  useVGSCollectFormInstance,
  IVGSCollectForm
} from '@vgs/collect-js-react';
import React, { useEffect, useState } from 'react';

import { loadVGSCollect } from '@vgs/collect-js';
import { COLLECT_VERSION, ENVIRONMENT, FORM_ID, VAULT_ID } from '../env';

const { TextField } = VGSCollectSession;

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
  const sessionFormId = FORM_ID || 'test-simple-form';

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
      vaultId: VAULT_ID,
      environment: ENVIRONMENT as VGSCollectVaultEnvironment,
      version: COLLECT_VERSION
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
    console.log('-->', formInstance);
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
          <VGSCollectSession
            vaultId={VAULT_ID}
            environment={ENVIRONMENT as VGSCollectVaultEnvironment}
            formId={sessionFormId}
            onCustomSubmit={customHandling}
            stateCallback={onUpdateCallback}
            onErrorCallback={onErrorCallback}
          >
            {/**
             * VGS Collect text field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <TextField name='textField' validations={['required']} css={VGSCollectFieldStyles} />
            <button type='submit'>Submit</button>
          </VGSCollectSession>
        </div>
      )}
    </>
  );
};

export default SubmitHandling;
