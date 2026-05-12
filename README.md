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

- [Overview](#overview)
- [Installation](#installation)
- [How to use](#how-to-use)
  - [1. Load VGS Collect.js script](#1-load-vgs-collectjs-script)
  - [2. Define parent session wrapper](#2-define-parent-session-wrapper)
  - [3. Submit configuration (`submit`)](#3-submit-configuration-submit)
  - [4. Define secure input fields](#4-define-secure-input-fields)
  - [5. Field event handlers](#5-field-event-handlers)
  - [6. Hooks](#6-hooks)
  - [7. Custom submit handling](#7-custom-submit-handling)
- [Tokenization API](#tokenization-api)
- [Integration with Card Management Platform](#integration-with-card-management-platform)
  - [Create Card](#create-card)
  - [Update Card](#update-card)
  - [Card attributes events](#card-attributes-events)
- [Legacy `VGSCollectForm` API](#legacy-vgscollectform-api)
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

This package provides a convenient way to use VGS secure frames in the React environment by exposing field components, hooks, and a session wrapper that abstracts over `VGSCollect.session()` / `VGSCollect.create()`.

It exports two top-level wrappers:

- `VGSCollectSession` — recommended for new integrations. Built on top of `VGSCollect.session()` and supports proxy, vault, tokenization, and Card Management Platform (CMP) flows through a single declarative `submit` prop.
- `VGSCollectForm` — the original wrapper around `VGSCollect.create()`. Still supported for backward compatibility — see [Legacy `VGSCollectForm` API](#legacy-vgscollectform-api).

## Installation

Install the package using `npm`:

```bash
npm install @vgs/collect-js-react
```

## How to use

### 1. Load VGS Collect.js script

To stay PCI Compliant it is mandatory to load `collect.js` from the `js.verygoodvault.com` domain. There are two common options:

- [Download the file directly from the CDN](https://www.verygoodsecurity.com/docs/vgs-collect/js#quick-start).
- Use the [`@vgs/collect-js`](https://www.npmjs.com/package/@vgs/collect-js) loader. _Example:_ [`examples/demo/src/features/Basic.tsx`](https://github.com/verygoodsecurity/collect-js-react/blob/main/examples/demo/src/features/Basic.tsx).

```javascript
import { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';

const [isScriptLoaded, setScriptLoaded] = useState(false);

useEffect(() => {
  loadVGSCollect({
    vaultId: '<vault_id>',
    environment: 'sandbox',
    version: '2.25.1'
  }).then(() => setScriptLoaded(true));
}, []);
```

Render the secure form only after `loadVGSCollect` has resolved.

<br/>

### 2. Define parent session wrapper

```javascript
import {
  VGSCollectSession,
  VGSCollectFormState,
  VGSCollectHttpStatusCode
} from '@vgs/collect-js-react';

const App = () => {
  const stateCallback = (state: VGSCollectFormState) => {};
  const onSubmitCallback = (status: VGSCollectHttpStatusCode, resp: any) => {};
  const onErrorCallback = (errors: any) => {};

  return (
    <VGSCollectSession
      vaultId='<vault_id>'
      environment='<environment>'
      submit={{ api: 'proxy', action: '/post' }}
      stateCallback={stateCallback}
      onSubmitCallback={onSubmitCallback}
      onErrorCallback={onErrorCallback}
    >
      {/* Add secure fields here */}
    </VGSCollectSession>
  );
};

export default App;
```

| Property                     | Description                                                                                                       | Documentation                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `vaultId`                    | A string value beginning with the prefix `tnt`.                                                                   | [Parameters.vaultId](https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate)       |
| `environment` (alias: `env`) | Vault environment: `sandbox` \| `live` \| `live-eu-1` \| `live-ap-1`.                                             | [Parameters.environment](https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate)   |
| `submit?`                    | Submit configuration object — selects the flow (`proxy`, `vault`, `tokenization`, `cmp`). Defaults to a proxy submit to `/`. See [Submit configuration](#3-submit-configuration-submit). | [.submit()](https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit)                      |
| `formId?`                    | Collect Session form id (required for CMP and configured proxy sessions).                                         | [VGSCollect.session()](https://www.verygoodsecurity.com/docs/api/collect/)                          |
| `configuration?`             | Inline session configuration (fallback used when `formId` configuration is not available, e.g. `cardAttributes`). | [VGSCollect.session()](https://www.verygoodsecurity.com/docs/api/collect/)                          |
| `authHandler?`               | String token or `() => string \| Promise<string \| { token }>` resolver used by CMP / authenticated sessions.     | [VGSCollect.session()](https://www.verygoodsecurity.com/docs/api/collect/)                          |
| `stateCallback?`             | Returns the form state on every field update.                                                                     | [Parameters.stateCallback](https://www.verygoodsecurity.com/docs/api/collect/#api-vgscollectcreate) |
| `onUpdateCallback?`          | Alias for `stateCallback` (kept for backward compatibility).                                                      | —                                                                                                   |
| `onSubmitCallback?`          | Returns status and response data after a successful submit.                                                       | [Parameters.responseCallback](https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit)    |
| `onErrorCallback?`           | Receives client-side validation errors, async header rejections, or CMP/proxy errors.                             | —                                                                                                   |
| `onCustomSubmit?`            | Replace the default submit handler with your own — see [Custom submit handling](#7-custom-submit-handling).       | —                                                                                                   |
| `onGetCardAttributesSuccess?`| CMP only. Fires when card attributes (BIN lookup) succeed.                                                        | [CMP Card Attributes](https://docs.verygoodsecurity.com/card-management/api)                        |
| `onGetCardAttributesError?`  | CMP only. Fires when card attributes lookup fails.                                                                | —                                                                                                   |
| `cname?`                     | Custom CNAME the request will be submitted to.                                                                    | [.useCNAME()](https://www.verygoodsecurity.com/docs/api/collect/#api-formusecname)                  |
| `routeId?`                   | Inbound Route ID. Can also be passed via `submit.routeId` for proxy/tokenization flows.                           | [.setRouteId()](https://www.verygoodsecurity.com/docs/api/collect/#api-formsetrouteid)              |

<br/>

### 3. Submit configuration (`submit`)

`VGSCollectSession` accepts a discriminated `submit` object that selects the API used when the form is submitted:

```typescript
type ICollectSessionSubmit =
  | { api: 'proxy'; action: string; routeId?: string; submitParameters?: Partial<VGSCollectSubmitOptions> }
  | { api: 'vault'; submitParameters?: Record<string, any> }
  | { api: 'tokenization'; routeId?: string }
  | { api: 'cmp'; operation: 'createCard'; submitParameters?: Partial<VGSCollectSubmitOptions> }
  | { api: 'cmp'; operation: 'updateCard'; params: { cardId: string; [key: string]: any } };
```

#### Proxy submit

Posts the collected values to a vault route. `submitParameters` mirrors the `options` argument of [`form.submit()`](https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit) and supports both static values and async functions for `data` and `headers`:

```javascript
import { ICollectFormPayloadStructure } from '@vgs/collect-js-react';

<VGSCollectSession
  vaultId='<vault_id>'
  environment='sandbox'
  submit={{
    api: 'proxy',
    action: '/post',
    submitParameters: {
      // Build a custom request body using aliased field tokens and any extra state from your app.
      data: (fields: ICollectFormPayloadStructure) => ({
        customData: 'some-non-sensitive-value',
        textField: fields.textField,
        cardNumber: fields['card-number']
      }),
      // Headers can be a plain object or an async function. Rejections are surfaced via onErrorCallback.
      headers: async () => ({
        'X-Custom-1': '1',
        'X-Custom-2': '2'
      })
    }
  }}
  stateCallback={onStateCallback}
  onSubmitCallback={onSubmitCallback}
  onErrorCallback={onErrorCallback}
>
  {/* fields */}
</VGSCollectSession>
```

#### Vault submit (createAliases)

Creates aliases against the vault without performing an HTTP proxy request. `submitParameters` is passed through to `form.createAliases()`.

```javascript
<VGSCollectSession
  vaultId='<vault_id>'
  environment='sandbox'
  submit={{ api: 'vault', submitParameters: { /* createAliases options */ } }}
>
  {/* fields */}
</VGSCollectSession>
```

#### Tokenization submit

See [Tokenization API](#tokenization-api) for the full example.

#### CMP submit

See [Integration with Card Management Platform](#integration-with-card-management-platform) for `createCard` and `updateCard` flows.

<br/>

### 4. Define secure input fields

Field components are exposed on both `VGSCollectSession` and `VGSCollectForm`.

| **Collect.js input type** | **Component**                                | **Default props**                                                                                              |
| ------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `text`                    | `<VGSCollectSession.TextField />`            | `{ type: 'text', placeholder: 'Cardholder Name' }`                                                             |
| `text`                    | `<VGSCollectSession.CardholderField />`      | `{ type: 'text', name: 'cardholder', placeholder: 'Cardholder' }`                                              |
| `card-number`             | `<VGSCollectSession.CardNumberField />`      | `{ type: 'card-number', name: 'pan', validations: ['required', 'validCardNumber'], placeholder: 'Credit Card Number' }` |
| `card-expiration-date`    | `<VGSCollectSession.CardExpirationDateField />` | `{ type: 'card-expiration-date', name: 'exp-date', validations: ['required', 'validCardExpirationDate'], yearLength: 2, placeholder: 'MM/YY' }` |
| `card-security-code`      | `<VGSCollectSession.CardSecurityCodeField />`| `{ type: 'card-security-code', name: 'cvc', validations: ['required', 'validCardSecurityCode'], placeholder: 'CVC/CVV' }` |
| `password`                | `<VGSCollectSession.PasswordField />`        | `{ type: 'password', placeholder: 'Enter Password' }`                                                          |
| `ssn`                     | `<VGSCollectSession.SSNField />`             | `{ type: 'ssn', placeholder: 'SSN' }`                                                                          |
| `zip-code`                | `<VGSCollectSession.ZipCodeField />`         | `{ type: 'zip-code', placeholder: 'Zip Code' }`                                                                |
| `number`                  | `<VGSCollectSession.NumberField />`          | `{ type: 'number', placeholder: 'Number' }`                                                                    |
| `textarea`                | `<VGSCollectSession.TextareaField />`        | `{ type: 'textarea', placeholder: 'Comment' }`                                                                 |
| `file`                    | `<VGSCollectSession.FileField />`            | `{ type: 'file', placeholder: '' }`                                                                            |
| `date`                    | `<VGSCollectSession.DateField />`            | `{ type: 'date', placeholder: '' }`                                                                            |

The complete list of supported props is documented here: https://www.verygoodsecurity.com/docs/api/collect/#api-formfield. Any property in that reference can be passed to a field component using the same name (`validations`, `css`, `classes`, `style`, `placeholder`, `autoFocus`, `disabled`, `readonly`, `inputMode`, `defaultValue`, `serializers`, `tokenization`, etc.).

_Example (full set of field types):_

```javascript
import { VGSCollectSession } from '@vgs/collect-js-react';

const {
  TextField,
  CardholderField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  TextareaField,
  NumberField,
  SSNField,
  ZipCodeField,
  FileField,
  DateField
} = VGSCollectSession;

const styles = {
  padding: '.5rem 1rem',
  boxSizing: 'border-box',
  '&::placeholder': { color: '#686868' }
};

<VGSCollectSession
  vaultId='<vault_id>'
  environment='sandbox'
  submit={{ api: 'proxy', action: '/post' }}
>
  <TextField name='text' validations={['required']} css={styles} />
  <CardholderField name='cardholder' css={styles} defaultValue='John Doe' />
  <CardNumberField name='card-number' validations={['required', 'validCardNumber']} showCardIcon={{ right: '1rem' }} css={styles} />
  <CardExpirationDateField name='exp-date' validations={['required', 'validCardExpirationDate']} yearLength={2} css={styles} />
  <CardSecurityCodeField name='card-security-code' validations={['required', 'validCardSecurityCode']} showCardIcon={{ right: '1rem' }} css={styles} />
  <SSNField name='ssn' validations={['required', 'validSSN']} css={styles} />
  <ZipCodeField name='zip-code' validations={['required']} css={styles} />
  <PasswordField name='password' validations={['required']} css={styles} />
  <NumberField name='number' validations={['required']} css={styles} />
  <TextareaField name='textarea' validations={['required']} css={styles} />
  <DateField name='date' validations={['required']} css={styles} />
  <FileField name='file' validations={['required']} serializers={[{ name: 'toBase64' }]} css={styles} />
  <button type='submit'>Submit</button>
</VGSCollectSession>
```

<br/>

### 5. Field event handlers

VGS Collect.js exposes input lifecycle events on every field: `onFocus`, `onBlur`, `onUpdate`, `onDelete`, `onKeyUp`, `onKeyDown`, `onKeyPress`.

```javascript
import {
  VGSCollectFocusEventData,
  VGSCollectKeyboardEventData,
  VGSCollectStateParams
} from '@vgs/collect-js-react';

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

### 6. Hooks

Wrap your app in `VGSCollectProvider` to expose the form state, submit response, and form instance through hooks.

```javascript
import {
  VGSCollectProvider,
  VGSCollectSession,
  useVGSCollectState,
  useVGSCollectResponse,
  useVGSCollectFormInstance
} from '@vgs/collect-js-react';

const { TextField } = VGSCollectSession;

const App = () => (
  <VGSCollectProvider>
    <SecureForm />
  </VGSCollectProvider>
);

const SecureForm = () => {
  const [state] = useVGSCollectState();
  const [response] = useVGSCollectResponse();
  const [form] = useVGSCollectFormInstance();

  useEffect(() => {
    if (state) {
      // observe per-field state
    }
  }, [state]);

  return (
    <VGSCollectSession
      vaultId='<vault_id>'
      environment='sandbox'
      submit={{ api: 'proxy', action: '/post' }}
    >
      <TextField name='cardholder-name' validations={['required']} placeholder='Cardholder name' />
      <button type='submit'>Submit</button>
    </VGSCollectSession>
  );
};
```

| Hook                         | Returns                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `useVGSCollectState()`       | `[VGSCollectFormState]` — current per-field state, or `null` when unmounted.  |
| `useVGSCollectResponse()`    | `[{ status, data }]` — response from the last proxy submit.                   |
| `useVGSCollectFormInstance()`| `[IVGSCollectForm]` — the underlying Collect.js form instance.                |

### 7. Custom submit handling

Pass `onCustomSubmit` to replace the default submit flow. Combine it with `useVGSCollectFormInstance` to drive `form.submit()` yourself — useful for guarding submits, retries, or chaining requests.

```javascript
import {
  VGSCollectSession,
  useVGSCollectFormInstance,
  IVGSCollectForm
} from '@vgs/collect-js-react';

const { TextField } = VGSCollectSession;

const SubmitHandling = () => {
  const [form] = useVGSCollectFormInstance() as [IVGSCollectForm | null];
  const [isSubmitting, setSubmitting] = useState(false);

  const customHandling = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (isSubmitting || !form) return;

    setSubmitting(true);
    form.submit(
      '/post',
      {},
      (status, data) => {
        console.log('Response:', status, data);
        setSubmitting(false);
      },
      (errors) => {
        console.log(errors);
        setSubmitting(false);
      }
    );
  };

  return (
    <VGSCollectSession
      vaultId='<vault_id>'
      environment='sandbox'
      onCustomSubmit={customHandling}
    >
      <TextField name='textField' validations={['required']} />
      <button type='submit'>Submit</button>
    </VGSCollectSession>
  );
};
```

## Tokenization API

Use `submit.api: 'tokenization'` to tokenize the collected fields against the vault. Per-field tokenization options are configured via the `tokenization` prop on each field.

```javascript
import { VGSCollectSession } from '@vgs/collect-js-react';

const { CardNumberField, CardExpirationDateField, CardSecurityCodeField, TextField } = VGSCollectSession;

<VGSCollectSession
  vaultId='<vault_id>'
  environment='sandbox'
  submit={{ api: 'tokenization' }}
  onSubmitCallback={(status, resp) => {}}
  onErrorCallback={(errors) => {}}
>
  <TextField
    name='textField'
    validations={['required']}
    tokenization={{ format: 'UUID', storage: 'PERSISTENT' }}
  />
  <CardNumberField name='card-number' />
  <CardExpirationDateField
    name='card-expiration-date'
    validations={['required', 'validCardExpirationDate']}
    yearLength={2}
    tokenization={{ format: 'UUID', storage: 'PERSISTENT' }}
  />
  <CardSecurityCodeField
    name='card-security-code'
    validations={['required', 'validCardSecurityCode']}
  />
  <button type='submit'>Submit</button>
</VGSCollectSession>
```

Supported `tokenization.format` values: `UUID`, `RAW_UUID`, `NUM_LENGTH_PRESERVING`, `PFPT`, `FPE_ACC_NUM_T_FOUR`, `FPE_ALPHANUMERIC_ACC_NUM_T_FOUR`, `FPE_SIX_T_FOUR`, `FPE_SSN_T_FOUR`, `FPE_T_FOUR`.
Supported `tokenization.storage` values: `PERSISTENT`, `VOLATILE`.

## Integration with Card Management Platform

`VGSCollectSession` integrates with the [VGS Card Management Platform](https://docs.verygoodsecurity.com/card-management/api). Both create-card and update-card flows are supported through the `submit` prop.

Minimum CollectJS version: **3.2.2**.

CMP sessions require:

- `formId` — Collect session form id provisioned for CMP.
- `authHandler` — a string OAuth access token, or a function returning a token (or `{ token }`). The token is resolved on every submit. Resolve it on your backend rather than embedding it in the client bundle.

### Create Card

```javascript
import {
  VGSCollectSession,
  VGSCollectVaultEnvironment
} from '@vgs/collect-js-react';

const { CardholderField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectSession;

const getAccessToken = async (): Promise<string> => {
  const response = await fetch('/api/access-token');
  const data = await response.json();
  if (!response.ok || typeof data.access_token !== 'string') {
    throw new Error(data.error_description || data.error || 'Failed to fetch access token');
  }
  return data.access_token;
};

const fallbackConfiguration = {
  cardAttributes: {
    enable: true,
    parameters: ['card_brand', 'card_type', 'product_name']
  }
};

<VGSCollectSession
  vaultId='<vault_id>'
  environment='sandbox'
  formId='<collect_form_id>'
  configuration={fallbackConfiguration}
  authHandler={getAccessToken}
  stateCallback={(state) => {}}
  onErrorCallback={(errors) => {}}
  onGetCardAttributesSuccess={(resp) => {}}
  onGetCardAttributesError={(errors) => {}}
  onSubmitCallback={(status, resp) => {}}
  submit={{
    api: 'cmp',
    operation: 'createCard',
    submitParameters: {
      data: {
        cardholder: {
          address: {
            address1: '123 Main St',
            address2: 'Suite 456',
            city: 'LA',
            region: 'CA',
            postal_code: '12345',
            country: 'USA'
          }
        }
      }
    }
  }}
>
  <CardholderField defaultValue='John Doe' />
  <CardNumberField />
  <CardExpirationDateField defaultValue='12 / 38' />
  <CardSecurityCodeField defaultValue='123' />
  <button type='submit'>Submit</button>
</VGSCollectSession>;
```

### Update Card

Use `operation: 'updateCard'` and pass the target card id via `params.cardId`. Typically only the expiration date and security code are collected for an update flow.

```javascript
const { CardExpirationDateField, CardSecurityCodeField } = VGSCollectSession;

<VGSCollectSession
  vaultId='<vault_id>'
  environment='sandbox'
  authHandler={getAccessToken}
  onSubmitCallback={(status, resp) => {}}
  onErrorCallback={(errors) => {}}
  submit={{
    api: 'cmp',
    operation: 'updateCard',
    params: { cardId: 'CRDe4CxWRkZZYZ8cGumTbESMP' }
  }}
>
  <CardExpirationDateField />
  <CardSecurityCodeField />
  <button type='submit'>Submit</button>
</VGSCollectSession>;
```

### Card attributes events

CMP sessions emit BIN-lookup events as the user types a card number. Subscribe to them via the session props:

```javascript
<VGSCollectSession
  /* …other CMP props… */
  onGetCardAttributesSuccess={(resp) => {
    // { card_brand, card_type, product_name, ... }
  }}
  onGetCardAttributesError={(errors) => {}}
>
  {/* fields */}
</VGSCollectSession>
```

## Legacy `VGSCollectForm` API

`VGSCollectForm` wraps `VGSCollect.create()` and is kept for backward compatibility. New integrations should prefer `VGSCollectSession`.

```javascript
import { VGSCollectForm } from '@vgs/collect-js-react';

const { CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectForm;

const App = () => (
  <VGSCollectForm
    vaultId='<vault_id>'
    environment='<environment>'
    action='/post'
    submitParameters={{ headers: { myHeader: 'MyHeader' } }}
    onUpdateCallback={(state) => {}}
    onSubmitCallback={(status, data) => {}}
    onErrorCallback={(errors) => {}}
  >
    <CardNumberField name='card-number' validations={['required', 'validCardNumber']} showCardIcon />
    <CardExpirationDateField name='exp-date' validations={['required', 'validCardExpirationDate']} yearLength={2} />
    <CardSecurityCodeField name='cvv' validations={['required', 'validCardSecurityCode']} />
  </VGSCollectForm>
);
```

| Property            | Description                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `vaultId`           | A string value beginning with `tnt`.                                                                                |
| `environment`       | `sandbox` \| `live` \| `live-eu-1` \| `live-ap-1`.                                                                  |
| `action`            | Endpoint for the HTTP request.                                                                                      |
| `submitParameters?` | HTTP request configuration. Pass `submitParameters.createCard` to integrate with the CMP create-card flow.          |
| `tokenizationAPI?`  | When `true`, the form calls `form.tokenize()` instead of `form.submit()` on submit.                                 |
| `onUpdateCallback?` | Returns the form state.                                                                                             |
| `onSubmitCallback?` | Returns status and response data.                                                                                   |
| `onErrorCallback?`  | Returns validation / submit errors.                                                                                 |
| `onCustomSubmit?`   | Replace the default submit handler.                                                                                 |
| `cname?`            | Custom CNAME the request will be submitted to.                                                                      |
| `routeId?`          | Inbound Route ID.                                                                                                   |

Legacy CMP create-card example:

```javascript
<VGSCollectForm
  vaultId='<vault_id>'
  environment='sandbox'
  submitParameters={{
    createCard: {
      auth: '<vgs_auth_token>', // or: async () => '<vgs_auth_token>'
      data: {
        cardholder: {
          name: 'Cardholder Name',
          company: 'A Corp, LLC',
          address: {
            address1: '123 Main St',
            city: 'LA',
            region: 'CA',
            postal_code: '12345',
            country: 'USA'
          }
        }
      }
    }
  }}
  onSubmitCallback={(status, data) => {}}
  onUpdateCallback={(state) => {}}
>
  <CardholderField />
  <CardNumberField />
  <CardExpirationDateField />
  <CardSecurityCodeField />
</VGSCollectForm>
```

## Documentation

- [Collect.js Documentation](https://www.verygoodsecurity.com/docs/vgs-collect/js/integration)
- [Collect.js Reference Documentation](https://www.verygoodsecurity.com/docs/api/collect)
- [Card Management Platform API](https://docs.verygoodsecurity.com/card-management/api)

## Examples

The runnable apps now live under `examples/`:

```txt
examples/
  demo/
  compat/
```

`examples/demo` is the full demo app and covers every supported flow:

| Page                                | Source                                                                                                                                  | Demonstrates                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Basic                               | [`Basic.tsx`](https://github.com/verygoodsecurity/collect-js-react/blob/main/examples/demo/src/features/Basic.tsx)                       | All field types, field event handlers, proxy submit.    |
| Custom Payload                      | [`CustomPayload.tsx`](https://github.com/verygoodsecurity/collect-js-react/blob/main/examples/demo/src/features/CustomPayload.tsx)       | `data` function, async `headers`, non-sensitive inputs. |
| Tokenization API                    | [`Tokenization.tsx`](https://github.com/verygoodsecurity/collect-js-react/blob/main/examples/demo/src/features/Tokenization.tsx)         | `submit: { api: 'tokenization' }`, per-field tokenization. |
| Submit Handling                     | [`SubmitHandling.tsx`](https://github.com/verygoodsecurity/collect-js-react/blob/main/examples/demo/src/features/SubmitHandling.tsx)     | `onCustomSubmit`, `useVGSCollectFormInstance`.          |
| Card Management (Create Card)       | [`Cmp.tsx`](https://github.com/verygoodsecurity/collect-js-react/blob/main/examples/demo/src/features/Cmp.tsx)                           | CMP `createCard`, `authHandler`, card attributes events.|
| Card Management (Update Card)       | [`CmpUpdateCard.tsx`](https://github.com/verygoodsecurity/collect-js-react/blob/main/examples/demo/src/features/CmpUpdateCard.tsx)       | CMP `updateCard` with `params.cardId`.                  |

`examples/compat` contains minimal React compatibility fixtures for 16, 17, 18, and 19.

To run them from the repository root:

```sh
yarn install
```

Configure the demo env file:

```sh
cp examples/demo/.env.example examples/demo/.env
```

Then edit `examples/demo/.env`:

```sh
VITE_VAULT_ID=<vault_id>
VITE_ENVIRONMENT=<env>
VITE_COLLECT_VERSION=<collect_version>
VITE_FORM_ID=<collect_form_id>
# Required only for CMP flows — used by the Vite dev server to mint an access token at /api/access-token.
VGS_AUTH_URL=https://auth.verygoodsecurity.com/auth/realms/vgs/protocol/openid-connect/token
VGS_CLIENT_ID=<client_id>
VGS_CLIENT_SECRET=<client_secret>
```

Start the full demo app:

```sh
yarn demo:dev
```

Open [http://localhost:3000/](http://localhost:3000/).

Build the demo app:

```sh
yarn demo:build
```

`yarn start` and `yarn example:dev` are kept as aliases for `yarn demo:dev`.

If you want to rebuild the published library in watch mode while working on the demo:

```sh
yarn dev:lib
```

Build the React compatibility fixtures:

```sh
yarn compat:build
```

Run the browser compatibility checks for all supported React fixtures:

```sh
yarn compat:test:ui
```

Run a single browser compatibility check:

```sh
yarn compat:test:ui:react19
```

Run a React compatibility fixture locally:

```sh
yarn compat:dev:react16
yarn compat:dev:react17
yarn compat:dev:react18
yarn compat:dev:react19
```

Ports:

```txt
demo: 3000
react16 fixture: 3016
react17 fixture: 3017
react18 fixture: 3018
react19 fixture: 3019
```

External:

- [Stackblitz](https://stackblitz.com/edit/react-ts-kuxtvv?file=App.tsx)

## Contact

If you have any questions please reach out to [support](mailto:support@verygoodsecurity.com) or open an issue [here](https://github.com/verygoodsecurity/vgs-collect-js/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file
for details.
