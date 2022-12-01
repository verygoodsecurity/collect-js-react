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

[VGS Collect.js](https://www.verygoodsecurity.com/docs/vgs-collect/js/overview) is a JavaScript library that allows you to securely collect data via any form. Instantly create custom forms that adhere to PCI, HIPAA, GDPR, or CCPA security requirements. [VGS](https://www.verygoodsecurity.com/) intercepts sensitive data before it hits your servers and replaces it with aliased versions while securing the original data in our vault. The form fields behave like traditional forms while preventing access to the unsecured data by injecting secure iframe components.

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

### Import parent form wrapper

```
import { CollectForm } from '@vgs/collect-js-react';

const myApp = () => {
  const onSubmitCallback = (status, data) => {};
  const onUpdateCallback = (state) => {};

  return (
    <CollectForm 
      vaultId="<vault_id>" // https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
      environment="<environment>" // https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate
      submitParamethers={{}} // https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit (options)
      onUpdateCallback={} // https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate (stateCallback)
      onSubmitCallback={} // https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit
    >
      // Add secure fields here
    </CollectForm>
  )
};
```

### Import and declare needed input fields

| Collect.js input type  | Collect.js React Component   | Default Prop Values                                                                               |
|------------------------|------------------------------|---------------------------------------------------------------------------------------------------|
| `text`                 | `<TextField/>`               | ` {   type: 'text',   name: 'text',   placeholder: 'Cardholder Name'   }`                         |
| `card-number`          | `<CardNumberField/>`         | ` {   type: 'card-number',   name: 'card-number',   placeholder: 'Credit Card Number'   } `       |
| `card-expiration-date` | `<CardExpirationDateField/>` | ` {   type: 'card-expiration-date',   name: 'card-expiration-date',   placeholder: 'MM/YY'   } `  |
| `card-security-code`   | `<CardSecurityCodeField/>`   | ` {   type: 'card-security-code',   name: 'card-security-code',   placeholder: 'CVC/CVV'   } `    |
| `password`             | `<PasswordField/>`           | ` {   type: 'password',   name: 'password',   placeholder: 'Enter Password'   } `                 |
| `ssn`                  | `<SSNField/>`                | ` {   type: 'ssn',   name: 'ssn',   placeholder: 'SSN'   } `                                      |
| `zip-code`             | `<ZipCodeField/>`            | ` {   type: 'zip-code',   name: 'zip-code',   placeholder: 'Zip Code'   } `                       |
| `number`               | `<NumberField/>`             | ` {   type: 'number',   name: 'number',   placeholder: 'Number'   } `                             |
| `textarea`             | `<TextareaField/>`           | ` {   type: 'textarea',   name: 'textarea',   placeholder: 'Comment'   } `                        |

Full list of supported properties: https://www.verygoodsecurity.com/docs/api/collect/#api-formfield

*Example:*

```
import { 
  CollectForm,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField
} from '@vgs/collect-js-react';

const myApp = () => {
  const onSubmitCallback = (status, data) => {};
  const onUpdateCallback = (state) => {};

  return (
    <CollectForm 
      vaultId="<vault_id>"
      environment="<environment>"
      submitParamethers={{}}
      onUpdateCallback={}
      onSubmitCallback={}
    >
      <CardNumberField validations={["required", "validCardNumber"]} />
      <CardEpirationDateField validations={["required", validCardExpirationDate"]} />
      <CardSecurityCodeField validations={["required", "validCardSecurityCode"]} />
    </CollectForm>
  )
};
```

## Documentation

- [Collect.js Documentation](https://www.verygoodsecurity.com/docs/vgs-collect/js/integration)
- [Collect.js Reference Documentation](https://www.verygoodsecurity.com/docs/api/collect)

## Examples

- [VGS Collect + React](https://stackblitz.com/edit/vgs-collect-js-react?file=src/App.js)

## Contact

If you have any questions please reach out to [support](mailto:support@verygoodsecurity.com) or open issue [here](https://github.com/verygoodsecurity/vgs-collect-js/issues).

