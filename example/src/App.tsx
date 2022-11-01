import React from 'react'

import {
  CollectForm,
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  TextareaField,
} from 'collect-js-react'

const App = () => {
  
  const onSubmitCallback = (status: any, resp: any) => {
    console.log(status, resp)
  }
  const onUpdateCallback = (state: any) => {
    console.log(state)
  }
  console.log('qweqweqweqwe')
  return (
    <CollectForm
      vaultId="tntnmemz6i7"
      environment="sandbox"
      submitParameters={{}}
      onUpdateCallback={onUpdateCallback} 
      onSubmitCallback={onSubmitCallback}
    >
      <div>
        <TextField
          id="f1"
          name="name"
          validations={["required"]}
          placeholder="placeholder"
        />        
      </div>
      <div>
        <CardNumberField
          id="f2"
          name="card-number"
          successColor="green"
          validations={["required", "validCardNumber"]}
          placeholder="4111 1111 1111 1111"
        />
      </div>
      <div>
        <CardExpirationDateField
          id="f3"
          name="card-exp-date"
          validations={["required"]}
          placeholder="12 / 25"
        />
      </div>
      <div>
        <CardSecurityCodeField
          id="f4"
          name="card-security-date"
          validations={["required"]}
          placeholder="12 / 25"
        />
      </div>
      <div>
        <PasswordField
          id="f5"
          name="passwrod"
          validations={["required"]}
          placeholder="password"
        /> 
      </div>
      <div>
        <TextareaField
          id="f6"
          name="textarea"
          validations={["required"]}
          placeholder="textarea"
        /> 
      </div>
      <button type="submit">Submit</button>
    </CollectForm>
  )
}

export default App
