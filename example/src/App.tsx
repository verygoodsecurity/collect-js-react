import React from 'react';

import {
  CollectForm,
  TextField,
  // CardNumberField,
  // CardExpirationDateField,
  // CardSecurityCodeField,
  // PasswordField,
  // TextareaField,
  // NumberField,
  // SSNField,
  // ZipCodeField,
} from 'collect-js-react';

const App = () => {
  const onSubmitCallback = (status: any, resp: any) => {
    console.log(status, resp);
  }
  const onUpdateCallback = (state: any) => {
    console.log(state);
  }

  return (
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
      {/* <CardNumberField
        successColor="green"
        validations={["required", "validCardNumber"]}
      />
      <CardExpirationDateField
        validations={["required", "validCardExpirationDate"]}
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
      /> */}
      <button type="submit">Submit</button>
    </CollectForm>
  )
}

export default App
