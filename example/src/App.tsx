import React from 'react'
import { useState } from 'react'

import {
  CollectForm,
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  TextareaField,
  NumberField,
  SSNField,
  ZipCodeField,
} from 'collect-js-react'

const App = () => {
  const [collectState, setCollectState] = useState({})

  const onSubmitCallback = (status: any, resp: any) => {
    console.log(status, resp)
  }
  const onUpdateCallback = (state: any) => {
    setCollectState(state)
  }

  return (
    <div className="container">
      <div className="left">
        <CollectForm
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
          <TextField
            validations={["required"]}
          />
          <CardNumberField
            successColor="green"
            validations={["required", "validCardNumber"]}
          />
          <CardExpirationDateField
            validations={["required"]}
          />
          <CardSecurityCodeField
            validations={["required"]}
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
        </CollectForm>
      </div>
      <div className="right">
        <pre>
          {JSON.stringify(collectState, undefined, 2)}
        </pre>
      </div>
    </div>
  )
}

export default App
