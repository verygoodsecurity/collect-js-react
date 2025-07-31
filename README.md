<p align="center">
  <a href="https://www.verygoodsecurity.com/" rel="nofollow">
    <img src="https://avatars0.githubusercontent.com/u/17788525" width="128" alt="VGS Logo">
  </a>
  <h3 align="center">VGS Collect.js React Wrapper</h3>

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

- [Overview](#overview)
- [Installation](#installation)
- [How to use](#how-to-use)
- [Documentation](#documentation)
- [Examples](#examples)
- [Contact](#contact)
- [License](#license)

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

```bash
npm install @vgs/collect-js-react
```

## How to use

### 1. Load VGS Collect.js script:

To stay PCI Compliant it's a mandatory to load js from our `js.verygoodvault.com` domain as a consequence you need to find the most suitable way to download it.
There are couple of options here:

- [Download file directly from the CDN](https://www.verygoodsecurity.com/docs/vgs-collect/js#quick-start).
- Use our loading [npm module](https://www.npmjs.com/package/@vgs/collect-js). _[Example](https://github.com/verygoodsecurity/collect-js-react/blob/main/example/src/features/Basic.tsx#L45)_.

<br/>

### 2. Define parent form wrapper component:

```javascript
import { VGSCollectForm } from '@vgs/collect-js-react';

const App = () => {
  const onSubmitCallback = (status, data) => {};
  const onUpdateCallback = (state) => {};

  return (
    <VGSCollectForm
      vaultId='<vault_id>'
      environment='<environment>'
      action='/post'
      submitParameters={{}}
      onUpdateCallback={onUpdateCallback}
      onSubmitCallback={onSubmitCallback}
    >
      // Add secure fields here
    </VGSCollectForm>
  );
};
export default App;
```

| Property           | Description                                                | Documentation                                                                                       |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| vaultId            | A string value beginning with the prefix `tnt`.            | [Parameters.vaultId](https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate)       |
| environment        | Vault environment: `sanbdox` \| `live` or region specific. | [Parameters.environment](https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate)   |
| action             | Endpoint for the HTTP request.                             | [Parameters.path](https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit)                |
| submitParamethers? | HTTP request configuration.                                | [Parameters.options](https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit)             |
| onUpdateCallback?  | Returns the form state in the callback.                    | [Parameters.stateCallback](https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate) |
| onSubmitCallback?  | Returns status and response data in the callback.          | [Parameters.responseCallback](https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit)    |
| cname?             | String represents CNAME the request will be submitted to.  | [.useCNAME()](https://www.verygoodsecurity.com/docs/api/collect/#api-formusecname)                  |
| routeId?           | Inbound Route ID.                                          | [.setRouteId()](https://www.verygoodsecurity.com/docs/api/collect/#api-formsetrouteid)              |

<br/>

### 3. Define secure input fields:

| Collect.js input type  | Collect.js React Component                  | Default Prop Values                                        |
| ---------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| `text`                 | `<VGSCollectForm.TextField/>`               | ` {type: 'text', placeholder: 'Cardholder Name'}`          |
| `card-number`          | `<VGSCollectForm.CardNumberField/>`         | `{type: 'card-number', placeholder: 'Credit Card Number'}` |
| `card-expiration-date` | `<VGSCollectForm.CardExpirationDateField/>` | `{type: 'card-expiration-date', placeholder: 'MM/YY'}`     |
| `card-security-code`   | `<VGSCollectForm.CardSecurityCodeField/>`   | `{type: 'card-security-code', placeholder: 'CVC/CVV'}`     |
| `password`             | `<VGSCollectForm.PasswordField/>`           | `{type: 'password', placeholder: 'Enter Password'}`        |
| `ssn`                  | `<VGSCollectForm.SSNField/>`                | `{type: 'ssn', placeholder: 'SSN'}`                        |
| `zip-code`             | `<VGSCollectForm.ZipCodeField/>`            | `{type: 'zip-code', placeholder: 'Zip Code'}`              |
| `number`               | `<VGSCollectForm.NumberField/>`             | `{type: 'number', placeholder: 'Number'}`                  |
| `textarea`             | `<VGSCollectForm/TextareaField/>`           | `{type: 'textarea',  placeholder: 'Comment'}`              |
| `file`                 | `<VGSCollectForm/FileField/>`               | `{type: 'file',  placeholder: ''}`                         |
| `date`                 | `<VGSCollectForm/DateField/>`               | `{type: 'date',  placeholder: ''}`                         |

The complete list of supported properties you can find here: https://www.verygoodsecurity.com/docs/api/collect/#api-formfield.
All configuration properties available in the Reference Documentation can be passed in the component props using the same name.

_Example:_

```javascript
import { VGSCollectForm } from '@vgs/collect-js-react';

const { CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectForm;

const myApp = () => {
  const onSubmitCallback = (status, data) => {};
  const onUpdateCallback = (state) => {};

  return (
    <VGSCollectForm
      vaultId='<vault_id>'
      environment='<environment>'
      action='/post'
      submitParamethers={{
        headers: {
          myHeader: 'MyHeader'
        }
      }}
      onUpdateCallback={onUpdateCallback}
      onSubmitCallback={onSubmitCallback}
    >
      <CardNumberField
        name='card-number'
        validations={['required', 'validCardNumber']}
        placeholder='XXXX XXXX XXXX XXXX'
        showCardIcon={true}
        css={{}}
      />
      <CardExpirationDateField
        name='exp-date'
        validations={['required', 'validCardExpirationDate']}
        placeholder='MM / YY'
        yearLength={2}
        css={{}}
      />
      <CardSecurityCodeField
        name='cvv'
        validations={['required', 'validCardSecurityCode']}
        placeholder='CVV'
        css={{}}
      />
    </VGSCollectForm>
  );
};
```

<br/>

### 3. Field event handlers

VGS Collect.js allows listening to input changes.
The library exposes the following handlers: `onFocus`, `onBlur`, `onUpdate`, `onDelete`, `onKeyUp`, `onKeyDown`, `onKeyPress`.

```javascript
<TextField
  name='text'
  validations={['required']}
  onFocus={(info: VGSCollectFocusEventData) => {}}
  onBlur={(info: VGSCollectFocusEventData) => {}}
  onUpdate={(info: VGSCollectStateParams) => {}}
  onKeyUp={(info: VGSCollectKeyboardEventData) => {}}
  onKeyDown={(info: VGSCollectKeyboardEventData) => {}}
  onKeyPress={(info: VGSCollectKeyboardEventData) => {}}
/>
```

### 4. Hooks

In order to access the form state and response from the hook, wrap consumer component with the form in `VGSCollectProvider` context provider.

```javascript
import { VGSCollectProvider, useVGSCollectState, useVGSCollectResponse, VGSCollectForm } from '@vgs/collect-js-react';

const { TextField } = VGSCollectForm;

const App = () => {
  return (
    <VGSCollectProvider>
      <VGSCollectSecureForm />
    </VGSCollectProvider>
  );
};

const VGSCollectSecureForm = () => {
  const [state] = useVGSCollectState();
  const [response] = useVGSCollectResponse();

  useEffect(() => {
    if (state) {
      // do something
    }
  }, [state]);

  return (
    <VGSCollectForm vaultId='<vault_id>' environment='<environment>' action='/post'>
      <TextField name='cardholder-name' validations={['required']} placeholder='Cardholder name' />
    </VGSCollectForm>
  );
};
```

## Integration with Card Management Platform 

You can create a predefined Collect.js form to integrate with the [VGS Card Management Platform](https://docs.verygoodsecurity.com/card-management/api)
 
```javascript
import { VGSCollectForm } from '@vgs/collect-js-react';

const {CardholderField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectForm;

const myApp = () => {
  const onSubmitCallback = (status, data) => {};
  const onUpdateCallback = (state) => {};

  return (
    <VGSCollectForm
      vaultId='<vault_id>'
      environment='<environment>'
      submitParamethers={{
        createCard: {
          auth: <vgs_auth_token>
        }
      }}
      onUpdateCallback={onUpdateCallback}
      onSubmitCallback={onSubmitCallback}
    >
      <CardholderField css={{}} />
      <CardNumberField css={{}} />
      <CardExpirationDateField css={{}} />
      <CardSecurityCodeField css={{}} />
    </VGSCollectForm>
  );
};
```


## Documentation

- [Collect.js Documentation](https://www.verygoodsecurity.com/docs/vgs-collect/js/integration)
- [Collect.js Reference Documentation](https://www.verygoodsecurity.com/docs/api/collect)

## Examples

To run exmaples locally, in the core folder run:

```sh
yarn install
yarn start
```

Switch the folder to `example` and configure `.env` file, simply rename `.env.example` and replace values

```sh
REACT_APP_VAULT_ID=<vault_id>
REACT_APP_ENVIRONMENT=<env>
REACT_APP_COLLECT_VERSION=<collect_version>
```

From `example` folder run:

```sh
yarn install
yarn start
```

Open [http://localhost:3000/](http://localhost:3000/)

- [Simple Configuration](https://github.com/verygoodsecurity/collect-js-react/blob/main/example/src/features/Basic.tsx)
- [Custom Payload Configuration](https://github.com/verygoodsecurity/collect-js-react/blob/main/example/src/features/CustomPayload.tsx)
- [Stackblitz](https://stackblitz.com/edit/react-ts-kuxtvv?file=App.tsx)

## Contact

If you have any questions please reach out to [support](mailto:support@verygoodsecurity.com) or open issue [here](https://github.com/verygoodsecurity/vgs-collect-js/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file
for details.
