import React, { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';
import {
  VGSCollectForm,
  VGSCollectVaultEnvironment,
  VGSCollectFormState,
  VGSCollectHttpStatusCode,
  ICollectFormPayloadStructure,
  useVGSCollectResponse,
  useVGSCollectState
} from 'collect-js-react';

const {
  TextField,
  CardNumberField,
} = VGSCollectForm;

const {
  REACT_APP_VAULT_ID,
  REACT_APP_ENVIRONMENT,
  REACT_APP_COLLECT_VERSION,
} = process.env;

const CustomPayload = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const VGSCollectFieldStyles = {
    padding: '.5rem 1rem',
    boxSizing: 'border-box',
    '&::placeholder': {
      color: '#686868'
    }
  };

  const [state] = useVGSCollectState();
  const [response] = useVGSCollectResponse();

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
    /**
     * Loading VGS Collect script from and attaching it to the <head>
     */
    loadVGSCollect({
      vaultId: REACT_APP_VAULT_ID as string,
      environment: REACT_APP_ENVIRONMENT as VGSCollectVaultEnvironment,
      version: REACT_APP_COLLECT_VERSION as string,
    }).then(() => {
      setCollectScriptLoaded(true);
    });
  }, []);

  const onSubmitCallback = (status: VGSCollectHttpStatusCode, resp: any) => {
    /**
     * Receive information about HTTP request
     */
  };

  const onErrorCallback = (errors: VGSCollectFormState) => {
    /**
     * Receive information about Erorrs (client-side validation)
     */
  }

  const onUpdateCallback = (state: VGSCollectFormState) => {
    /**
     * Listen to the VGS Collect form state
     */
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  };


  return (
    <>
      {isVGSCollectScriptLoaded && (
        <div className="left">
          <h2>Custom payload and additional data</h2>
          {/**
           * VGS Collect form wrapper element. Abstraction over the VGSCollect.create()
           * https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
           */}
          <VGSCollectForm
            vaultId={REACT_APP_VAULT_ID as string}
            environment={REACT_APP_ENVIRONMENT as VGSCollectVaultEnvironment}
            action="/post"
            submitParameters={{
              // JSON request body generated on the form submission including custom parameters
              // https://www.verygoodsecurity.com/docs/vgs-collect/js/integration#form-submit
              data: (fields: ICollectFormPayloadStructure) => {
                return {
                  cusomData: inputValue,
                  textField: fields.textField,
                  cardNumber: fields['card-number'],
                }
              }
            }}
            onUpdateCallback={onUpdateCallback}
            onSubmitCallback={onSubmitCallback}
            onErrorCalback={onErrorCallback}
          >
            { /**
             * VGS Collect text field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <TextField
              name="textField"
              validations={["required"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect text field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <CardNumberField
              name="card-number"
              validations={["required"]}
              css={VGSCollectFieldStyles}
            />
            <input
              className="vgs-collect-native-input"
              type="text"
              placeholder="Not sensitive data"
              onChange={(e) => { inputHandler(e) }}
            />
            <button type="submit">Submit</button>
          </VGSCollectForm>
        </div>
      )
      }
    </>
  )
}

export default CustomPayload;
