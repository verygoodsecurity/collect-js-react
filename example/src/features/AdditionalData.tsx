import React, { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';
import {
  VGSCollectForm,
  VGSCollectVaultEnvironment,
  VGSCollectFormState,
  VGSCollectHttpStatusCode,
  ICollectFormAdditionalData,
} from 'collect-js-react';

const {
  TextField,
  CardNumberField,
} = VGSCollectForm;

const VGS_CONFIG = {
  vaultId: 'tntnmemz6i7',
  environment: 'sandbox' as VGSCollectVaultEnvironment,
  version: '2.18.0'
}

const AdditionalData = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('')
  const VGSCollectFieldStyles = {
    boxSizing: 'border-box',
    padding: '.5rem 1rem',
    '&::placeholder': {
      color: 'lightgrey'
    }
  };

  useEffect(() => {
    /**
     * Loading VGS Collect script from and attaching it to the <head>
     */
    loadVGSCollect({
      vaultId: VGS_CONFIG.vaultId,
      environment: VGS_CONFIG.environment,
      version: VGS_CONFIG.version
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

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  };
  

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <div className="container">
          <div className="left">
            {/**
             * VGS Collect form wrapper element. Abstraction over the VGSCollect.create()
             * https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
             */}
            <VGSCollectForm
              vaultId={VGS_CONFIG.vaultId}
              environment={VGS_CONFIG.environment}
              action="/post"
              submitParameters={{
                data: (fields: ICollectFormAdditionalData) => {
                  console.log(fields)
                  return {
                    a: inputValue,
                    b: fields.textField,
                    c: fields['card-number'],
                  }
                }
              }}
              onUpdateCallback={onUpdateCallback}
              onSubmitCallback={onSubmitCallback}
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
              <CardNumberField
                name="card-number"
                validations={["required"]}
                css={VGSCollectFieldStyles}
              />
              <div className="vgs-collect-iframe-wr">
                <input 
                  type="text"

                  placeholder="Not sensitive data"
                  onChange={(e) => {inputHandler(e)}}
                />
              </div>
              <button type="submit">Submit</button>
            </VGSCollectForm>
          </div>
        </div>
      )
      }
    </>
  )
}

export default AdditionalData;
