import React, { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';
import {
  VGSCollectForm,
  VGSCollectFocusEventData,
  VGSCollectVaultEnvironment,
  VGSCollectFormState,
  VGSCollectStateParams,
  VGSCollectHttpStatusCode,
  VGSCollectKeyboardEventData
} from 'collect-js-react';

import { useVGSState, useSubmit } from 'collect-js-react';

const {
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  TextareaField,
  NumberField,
  SSNField,
  ZipCodeField,
} = VGSCollectForm;

const {
  REACT_APP_VAULT_ID,
  REACT_APP_ENVIRONMENT,
  REACT_APP_COLLECT_VERSION,
} = process.env;

const Basic = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);

  /**
   * VGS Collect state hook
   */
  const [state, dispatch] = useVGSState();

  /**
   * VGS Collect submit hook
   */
  const [stateSubmit, dispatchSubmit] = useSubmit();


  const VGSCollectFieldStyles = {
    padding: '.5rem 1rem',
    boxSizing: 'border-box',
    '&::placeholder': {
      color: '#686868',
    }
  };

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

  const onUpdateCallback = (state: VGSCollectFormState) => {
    /**
     * Listen to the VGS Collect form state
     */
  };

  const onErrorCallback = (errors: VGSCollectFormState) => {
    /**
     * Receive information about Erorrs (client-side validation)
     */
  }

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <div className="left">
          <h2>Basic example</h2>
          {/**
           * VGS Collect form wrapper element. Abstraction over the VGSCollect.create()
           * https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
           */}
          <VGSCollectForm
            vaultId={REACT_APP_VAULT_ID as string}
            environment={REACT_APP_ENVIRONMENT as VGSCollectVaultEnvironment}
            action="/post"
            submitParameters={{}}
            onUpdateCallback={onUpdateCallback}
            onSubmitCallback={onSubmitCallback}
            onErrorCalback={onErrorCallback}
          >
            { /**
             * VGS Collect text field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <TextField
              validations={["required"]}
              /**
               * Track field focus event
               */
              onFocus={(info: VGSCollectFocusEventData) => { }}
              /**
               * Track field blur event
               */
              onBlur={(info: VGSCollectFocusEventData) => { }}
              /**
               * Track field update event. State of the field will be returned in the callback
               */
              onUpdate={(info: VGSCollectStateParams) => { }}
              /**
               * Track field keyup event.
               */
              onKeyUp={(info: VGSCollectKeyboardEventData) => { }}
              /**
               * Track field keydown event.
               */
              onKeyDown={(info: VGSCollectKeyboardEventData) => { }}
              /**
               * Track field keypress event.
               */
              onKeyPress={(info: VGSCollectKeyboardEventData) => { }}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect card number field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <CardNumberField
              validations={["required", "validCardNumber"]}
              showCardIcon={{
                right: '1rem'
              }}
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
            { /**
             * VGS Collect ssn field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <SSNField
              validations={["required", "validSSN"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect zip code field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <ZipCodeField
              validations={["required"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect password field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <PasswordField
              validations={["required"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect number field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <NumberField
              validations={["required"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect textarea field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <TextareaField
              validations={["required"]}
              className="custom-class"
              css={VGSCollectFieldStyles}
            />
            <button type="submit">Submit</button>
          </VGSCollectForm>
        </div>
      )
      }
    </>
  )
}

export default Basic;
