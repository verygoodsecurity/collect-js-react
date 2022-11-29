import React from 'react'

import {
  CollectForm,
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  TextareaField,
  NumberField,
} from 'collect-js-react'

const App = () => {
  const onSubmitCallback = (status: any, resp: any) => {
    console.log(status, resp)
  }
  const onUpdateCallback = (state: any) => {
    console.log(state)
  }

  return (
    <CollectForm
      vaultId="tntnmemz6i7"
      environment="sandbox"
      submitParameters={{}}
      onUpdateCallback={onUpdateCallback} 
      onSubmitCallback={onSubmitCallback}
    >
      <TextField
        validations={["required"]}
        // placeholder="Text"
      />        
      <CardNumberField
        successColor="green"
        validations={["required", "validCardNumber"]}
        // placeholder="4111 1111 1111 1111"
      />
      <CardExpirationDateField
        validations={["required"]}
        // placeholder="12 / 25"
      />
      <CardSecurityCodeField
        validations={["required"]}
        // placeholder="12 / 25"
      />
      <PasswordField
        validations={["required"]}
        // placeholder="password"
      /> 
      <NumberField
        validations={["required"]}
        // placeholder="password"
      /> 
      <TextareaField
        validations={["required"]}
        className="custom-class"
        // placeholder="textarea"
      /> 
      <button type="submit">Submit</button>
    </CollectForm>
  )
}

export default App
