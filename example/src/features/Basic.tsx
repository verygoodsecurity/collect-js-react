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

const VGS_CONFIG = {
  vaultId: 'tntnmemz6i7',
  environment: 'sandbox' as VGSCollectVaultEnvironment,
  version: '2.18.0'
}

const Basic = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);

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
              submitParameters={{}}
              onUpdateCallback={onUpdateCallback}
              onSubmitCallback={onSubmitCallback}
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
        </div>
      )
      }
    </>
  )
}

export default Basic;
