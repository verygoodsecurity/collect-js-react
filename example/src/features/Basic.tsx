import React, { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';
import {
  VGSCollectForm,
  VGSCollectFocusEventData,
  VGSCollectVaultEnvironment,
  VGSCollectFormState,
  VGSCollectStateParams,
  VGSCollectHttpStatusCode,
  VGSCollectKeyboardEventData,
  useVGSCollectState,
  useVGSCollectResponse
} from 'collect-js-react';

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

const Basic = React.memo(() => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);

  /**
   * VGS Collect state hook to retrieve the form state
   */
  const [state] = useVGSCollectState();

  /**
   * VGS Collect submit hook to retrieve the form response
   */
  const [response] = useVGSCollectResponse();

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
              name="text"
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
              name="card-number"
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
              name="exp-date"
            />
            { /**
             * VGS Collect card security code date field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <CardSecurityCodeField
              name="card-security-code"
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
              name="ssn"
              validations={["required", "validSSN"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect zip code field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <ZipCodeField
              name="zip-code"
              validations={["required"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect password field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <PasswordField
              name="password"
              validations={["required"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect number field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <NumberField
              name="number"
              validations={["required"]}
              css={VGSCollectFieldStyles}
            />
            { /**
             * VGS Collect textarea field component:
             * https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
             */}
            <TextareaField
              name="textarea"
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
});

export default Basic;
