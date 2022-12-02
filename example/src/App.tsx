import React, { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';

import {
  VGSCollectForm,
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  TextareaField,
  NumberField,
  SSNField,
  ZipCodeField,
} from 'collect-js-react';

const App = () => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false);
  const [collectState, setCollectState] = useState({})

  useEffect(() => {
    loadVGSCollect({
      vaultId: "tntnmemz6i7",
      environment: "sandbox",
      version: "2.18.0"
    }).then(() => {
      setCollectScriptLoaded(true);
    });
  }, []);

  const onSubmitCallback = (status: any, resp: any) => {
    console.log(status, resp)
  }
  const onUpdateCallback = (state: any) => {
    setCollectState(state);
  }

  return (
    <>
      {isVGSCollectScriptLoaded && (
        <div className="container">
          <div className="left">
            <VGSCollectForm
              vaultId="tntnmemz6i7"
              environment="sandbox"
              action="/post"
              submitParameters={{}}
              onUpdateCallback={onUpdateCallback}
              onSubmitCallback={onSubmitCallback}
            >
              <TextField
                validations={["required"]}
              />
              <CardNumberField
                validations={["required", "validCardNumber"]}
                showCardIcon={true}
              />
              <CardExpirationDateField
                validations={["required", "validCardExpirationDate"]}
                yearLength={2}
              />
              <CardSecurityCodeField
                validations={["required", "validCardSecurityCode"]}
              />
              <SSNField
                validations={["required", "validSSN"]}
              />
              <ZipCodeField
                validations={["required"]}
              />
              <PasswordField
                validations={["required"]}
              />
              <NumberField
                validations={["required"]}
              />
              <TextareaField
                validations={["required"]}
                className="custom-class"
              />
              <button type="submit">Submit</button>
            </VGSCollectForm>
          </div>
          <div className="right">
            <pre>
              {JSON.stringify(collectState, undefined, 2)}
            </pre>
          </div>
        </div>
      )
      }
    </>
  )
}

export default App
