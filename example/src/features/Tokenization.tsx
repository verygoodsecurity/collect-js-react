import React, { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';
import {
  VGSCollectForm,
  VGSCollectVaultEnvironment,
  VGSCollectHttpStatusCode,
  VGSCollectFormState,
} from 'collect-js-react';

const {
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
} = VGSCollectForm;

const VGS_CONFIG = {
  vaultId: 'tntux31nzpn',
  environment: 'sandbox' as VGSCollectVaultEnvironment,
  version: '2.18.0',
}

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
      vaultId: VGS_CONFIG.vaultId,
      environment: VGS_CONFIG.environment,
      version: VGS_CONFIG.version
    }).then(() => {
      setCollectScriptLoaded(true);
    });
  }, []);
  
  const onSubmitCallback = (status: VGSCollectHttpStatusCode, resp: any) => {    
    console.log(resp);
    
    /**
     * Receive information about HTTP request
     */
  };

  const onUpdateCallback = (state: VGSCollectFormState) => {
    /**
     * Listen to the VGS Collect form state
     */
  };

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <div className="left">
          <h2>Tokenization API</h2>
          {/**
           * VGS Collect form wrapper element. Abstraction over the VGSCollect.create()
           * https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
           */}
          <VGSCollectForm
            vaultId={VGS_CONFIG.vaultId}
            environment={VGS_CONFIG.environment}
            // action="/post"
            tokenizationAPI={true}
            submitParameters={{}}
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
              tokenization={{ format: 'UUID', storage: 'PERSISTENT' }}
            />
            <CardNumberField 
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect card expiration date field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <CardExpirationDateField
              validations={["required", "validCardExpirationDate"]}
              yearLength={2}
              css={VGSCollectFieldStyles}
              tokenization={false}
            /> 
            { /**
             * VGS Collect card security code date field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <CardSecurityCodeField
              validations={["required", "validCardSecurityCode"]}
              css={VGSCollectFieldStyles}
              showCardIcon={{
                right: '1rem'
              }}
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
