<p align="center">
  <a href="https://www.verygoodsecurity.com/" rel="nofollow">
    <img src="https://avatars0.githubusercontent.com/u/17788525" width="128" alt="VGS Logo">
  </a>
  <h3 align="center">VGS Collect.js</h3>

  <p align="center">
    React wrapper for VGS Collect.js fields
    <br />
    <a href="https://www.verygoodsecurity.com/docs/vgs-collect/js/overview"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/verygoodsecurity/collect-js-react/issues">Report Bug</a>
    ·
    <a href="https://github.com/verygoodsecurity/collect-js-react/issues">Request Feature</a>
  </p>
</p>

[![CircleCI](https://circleci.com/gh/verygoodsecurity/collect-js-react.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)

* [Overview](#overview)
* [Installation](#installation)
* [How to use](#how-to-use)
* [Documentation](#documentation)
* [Examples](#examples)
* [Contact](#contact)

## Overview

### What is VGS Collect.js?

[VGS Collect.js](https://www.verygoodsecurity.com/docs/vgs-collect/js/overview) is a JavaScript library that allows you to securely collect data via any form. Instantly create custom forms that adhere to PCI, HIPAA, GDPR, or CCPA security requirements. [VGS](https://www.verygoodsecurity.com/) intercepts sensitive data before it hits your servers and replaces it with aliased versions while securing the original data in our vault. The form fields behave like traditional forms while preventing access to unsecured data by injecting secure iframe components.

- [Documentation](https://www.verygoodsecurity.com/docs/vgs-collect/js/overview)
- [Reference Documentation](https://www.verygoodsecurity.com/docs/api/collect/)
- [Examples](https://verygoodsecurity.github.io/vgs-collect-examples)

### Why do I need to use this package?

This package provides a convenient way to use VGS secure frames in the React environment by exposing field components.

## Installation

Install the package using `npm`:

```
npm install @vgs/collect-js-react
```

## How to use

### 1. Define parent form wrapper component

```
import { VGSCollectForm } from '@vgs/collect-js-react';

const myApp = () => {
  const onSubmitCallback = (status, data) => {};
  const onUpdateCallback = (state) => {};

  return (
    <VGSCollectForm 
      vaultId="<vault_id>" // https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
      environment="<environment>" // https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
      action="/post" // endpoint for the HTTP request
      submitParamethers={{}} // https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit (options)
      onUpdateCallback={onUpdateCallback} // https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate (stateCallback)
      onSubmitCallback={onSubmitCallback} // https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit
    >
      // Add secure fields here
    </VGSCollectForm>
  )
};
```

| Property           | Description                                                |
|--------------------|------------------------------------------------------------|
| vaultId            | A string value beginning with the prefix `tnt`.            |
| environment        | Vault environment: `sanbdox` \| `live` or region specific. |
| action             | Endpoint for the HTTP request.                             |
| cname?             | String represents CNAME the request will be submitted to.  |
| submitParamethers? | HTTP request configuration.                                |
| onUpdateCallback?  | Returns the form state in the callback.                    |
| onSubmitCallback?  | Returns status and response data in the callback.          |

<br/>

### 2. Define secure input fields

| Collect.js input type  | Collect.js React Component                  | Default Prop Values                                                                               |
|------------------------|---------------------------------------------|---------------------------------------------------------------------------------------------------|
| `text`                 | `<VGSCollectForm.TextField/>`               | ` {   type: 'text',   name: 'text',   placeholder: 'Cardholder Name'   }`                         |
| `card-number`          | `<VGSCollectForm.CardNumberField/>`         | ` {   type: 'card-number',   name: 'card-number',   placeholder: 'Credit Card Number'   } `       |
| `card-expiration-date` | `<VGSCollectForm.CardExpirationDateField/>` | ` {   type: 'card-expiration-date',   name: 'card-expiration-date',   placeholder: 'MM/YY'   } `  |
| `card-security-code`   | `<VGSCollectForm.CardSecurityCodeField/>`   | ` {   type: 'card-security-code',   name: 'card-security-code',   placeholder: 'CVC/CVV'   } `    |
| `password`             | `<VGSCollectForm.PasswordField/>`           | ` {   type: 'password',   name: 'password',   placeholder: 'Enter Password'   } `                 |
| `ssn`                  | `<VGSCollectForm.SSNField/>`                | ` {   type: 'ssn',   name: 'ssn',   placeholder: 'SSN'   } `                                      |
| `zip-code`             | `<VGSCollectForm.ZipCodeField/>`            | ` {   type: 'zip-code',   name: 'zip-code',   placeholder: 'Zip Code'   } `                       |
| `number`               | `<VGSCollectForm.NumberField/>`             | ` {   type: 'number',   name: 'number',   placeholder: 'Number'   } `                             |
| `textarea`             | `<VGSCollectForm/TextareaField/>`           | ` {   type: 'textarea',   name: 'textarea',   placeholder: 'Comment'   } `                        |


The complete list of supported properties you can find here: https://www.verygoodsecurity.com/docs/api/collect/#api-formfield.
All configuration properties available in the Reference Documentation can be passed in the component props using the same name.

*Example:*

```
import { VGSCollectForm } from '@vgs/collect-js-react';

const { 
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField
} = VGSCollectForm;

const myApp = () => {
  const onSubmitCallback = (status, data) => {};
  const onUpdateCallback = (state) => {};

  return (
    <CollectForm 
      vaultId="<vault_id>"
      environment="<environment>"
      action="/post"
      submitParamethers={{
        headers: {
          myHeader: 'MyHeader'
        }
      }}
      onUpdateCallback={onUpdateCallback}
      onSubmitCallback={onSubmitCallback}
    >
      <CardNumberField 
        validations={["required", "validCardNumber"]}
        placeholder="XXXX XXXX XXXX XXXX"
        showCardIcon={true}
        css={{}}
      />
      <CardEpirationDateField 
        validations={["required", validCardExpirationDate"]}
        placeholder="MM / YY"
        yearLength={2}
        css={{}}
      />
      <CardSecurityCodeField 
        validations={["required", "validCardSecurityCode"]}
        placeholder="CVV"
        css={{}}
      />
    </CollectForm>
  )
};
```

<br/>

### 3. Field event handlers

VGS Collect.js allows listening to input changes. 
The library exposes the following handlers: `onFocus`, `onBlur`, `onUpdate`, `onDelete`, `onKeyUp`, `onKeyDown`, `onKeyPress`.

```
<TextField
  validations={["required"]}
  onFocus={(info: VGSCollectFocusEventData) => { }}
  onBlur={(info: VGSCollectFocusEventData) => { }}
  onUpdate={(info: VGSCollectStateParams) => { }}
  onKeyUp={(info: VGSCollectKeyboardEventData) => { }}
  onKeyDown={(info: VGSCollectKeyboardEventData) => { }}
  onKeyPress={(info: VGSCollectKeyboardEventData) => { }}
/>
```

## Documentation

- [Collect.js Documentation](https://www.verygoodsecurity.com/docs/vgs-collect/js/integration)
- [Collect.js Reference Documentation](https://www.verygoodsecurity.com/docs/api/collect)

## Examples

- [VGS Collect + React](https://stackblitz.com/edit/vgs-collect-js-react?file=src/App.js)

## Contact

If you have any questions please reach out to [support](mailto:support@verygoodsecurity.com) or open issue [here](https://github.com/verygoodsecurity/vgs-collect-js/issues).

