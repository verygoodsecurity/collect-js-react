# React Integration

Use this reference for customers integrating the public `@vgs/collect-js-react` package.

## Contents

- Installation Shape
- Load Order
- Flow Selection
- Default CMP Create-Card Pattern
- React Wrapper API
- Session Props
- Submit Modes
- Field Components
- Events And Hooks
- Masking Caveat
- CMP Notes

## Installation Shape

Install the React wrapper, React peer dependencies, and a loader for the Collect core SDK.

```bash
npm install @vgs/collect-js-react @vgs/collect-js react react-dom
```

## Load Order

1. Call `loadVGSCollect({ vaultId, environment, version })` from `@vgs/collect-js`.
2. Render VGS React fields only after the loader promise resolves.
3. Use `VGSCollectSession` for new integrations.
4. Use `VGSCollectForm` only for legacy integrations.

## Flow Selection

Start every integration answer by choosing the customer's flow. CMP create-card is the default for ambiguous card-management work, but this reference must still guide other React wrapper use cases when requested.

| Customer request | Recommended React wrapper path |
| --- | --- |
| Add, save, or create a card/payment method and no other submission family is named | `VGSCollectSession` with `{ api: 'cmp', operation: 'createCard' }` |
| Update an existing card | `VGSCollectSession` with `{ api: 'cmp', operation: 'updateCard', params: { cardId, ... } }` |
| Submit collected values to the customer's backend through a VGS route | `VGSCollectSession` with `{ api: 'proxy', action: '/path' }` |
| Create vault aliases directly | `VGSCollectSession` with `{ api: 'vault', submitParameters }` |
| Tokenize fields | `VGSCollectSession` with `{ api: 'tokenization', routeId? }` and field `tokenization` props |
| Maintain older wrapper code | `VGSCollectForm` |
| Style fields, handle events, read state/hooks, mask supported fields, or wire UI only | Render fields and callbacks for that task; do not force CMP submission |
| Collect SSN, password, files, routing numbers, dates, or generic non-card data | Use the matching field components and the requested proxy/vault/tokenization flow; do not use CMP create-card |

If the request is ambiguous but appears to be generic secure collection rather than card creation, ask which submission family they need instead of forcing CMP.

## Default CMP Create-Card Pattern

Use this pattern by default when the customer asks for a React card form, card entry, add-card, save-card, or payment-method setup and does not name another submission family.

```tsx
import { useEffect, useState } from 'react';
import { loadVGSCollect } from '@vgs/collect-js';
import {
  VGSCollectProvider,
  VGSCollectSession,
  VGSCollectVaultEnvironment
} from '@vgs/collect-js-react';

const { CardholderField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectSession;

const cmpConfiguration = {
  cardAttributes: {
    enable: true,
    parameters: ['card_brand', 'card_type', 'product_name']
  }
};

async function getAccessToken(): Promise<string> {
  const response = await fetch('/api/access-token');
  const data = await response.json();

  if (!response.ok || typeof data.access_token !== 'string') {
    throw new Error(data.error_description || data.error || 'Failed to fetch access token');
  }

  return data.access_token;
}

export function PaymentForm() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadVGSCollect({
      vaultId: '<vault_id>',
      environment: 'sandbox' as VGSCollectVaultEnvironment,
      version: '<collect_version>'
    }).then(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId='<vault_id>'
        environment='sandbox'
        formId='<collect_form_id>'
        configuration={cmpConfiguration}
        authHandler={getAccessToken}
        submit={{
          api: 'cmp',
          operation: 'createCard',
          submitParameters: {
            data: {
              cardholder: {
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
        onSubmitCallback={(status, response) => {
          void status;
          void response;
          // Store aliases, card IDs, or other non-sensitive response values needed by the app.
        }}
        onErrorCallback={(errors) => {
          void errors;
          // Map validation/session errors to customer-safe UI messages.
        }}
        onGetCardAttributesSuccess={(response) => {
          void response;
          // Use card brand/type/product metadata for UI only; do not log sensitive input.
        }}
        onGetCardAttributesError={(errors) => {
          void errors;
        }}
      >
        <CardholderField />
        <CardNumberField />
        <CardExpirationDateField />
        <CardSecurityCodeField />
        <button type='submit'>Submit</button>
      </VGSCollectSession>
    </VGSCollectProvider>
  );
}
```

## React Wrapper API

Use these package boundaries in customer answers:

- `@vgs/collect-js-react` provides React components, provider state, hooks, and React submit orchestration.
- `@vgs/collect-js` loads the Collect core SDK before the React wrapper mounts fields.
- The Collect core SDK is responsible for secure fields, validation, tokenization, and network submission.

Primary exports used by React customers:

- `VGSCollectProvider`: wraps the VGS Collect React tree and provides form state/response context.
- `VGSCollectSession`: preferred React wrapper for session-based integrations.
- `VGSCollectForm`: legacy/manual React wrapper.
- `VGSCollectVaultEnvironment`: environment type used by TypeScript examples.
- `useVGSCollectState()`: reads the current form state from provider context.
- `useVGSCollectResponse()`: reads the latest submit response from provider context.
- `useVGSCollectFormInstance()`: exposes the underlying form instance for custom submit flows.

React field components are available as static properties on `VGSCollectSession` and `VGSCollectForm`.

## Session Props

`VGSCollectSession` accepts:

- `vaultId`: required vault ID.
- `environment` or `env`: vault environment. The wrapper defaults `environment` to `sandbox`.
- `cname`: custom hostname for the Collect endpoint.
- `routeId`: route ID for proxy submit or tokenization flows.
- `formId`: Collect Session form ID.
- `configuration`: inline session configuration.
- `authHandler`: string, function returning string, or function returning `{ token }`.
- `stateCallback` and `onUpdateCallback`: receive form state updates.
- `onSubmitCallback`: receives submit status and response data.
- `onErrorCallback`: receives client validation errors, session/load errors, async header errors, or submit errors depending on the failing path.
- `onGetCardAttributesSuccess` and `onGetCardAttributesError`: card attributes callbacks.
- `onCustomSubmit`: replaces the default submit handler.

## Submit Modes

The `submit` prop is a discriminated object:

- Proxy submit: `{ api: 'proxy', action: '/post', routeId?, submitParameters? }`.
- Vault alias submit: `{ api: 'vault', submitParameters? }`.
- Tokenization: `{ api: 'tokenization', routeId? }`.
- CMP create card: `{ api: 'cmp', operation: 'createCard', submitParameters? }`.
- CMP update card: `{ api: 'cmp', operation: 'updateCard', params: { cardId, ... } }`.

Use `onCustomSubmit` when the customer needs to call the form instance directly instead of using one of the built-in `submit` modes.

## Field Components

Field components are exposed on both `VGSCollectSession` and `VGSCollectForm`:

- `TextField`
- `CardholderField`
- `CardNumberField`
- `CardExpirationDateField`
- `CardSecurityCodeField`
- `PasswordField`
- `SSNField`
- `ZipCodeField`
- `TextareaField`
- `NumberField`
- `FileField`
- `DateField`

The wrapper requires `name` for every rendered field. Common field props include `name`, `validations`, `css`, `style` as an alias for `css`, `placeholder`, `classes`, `serializers`, `defaultValue`, `autoComplete`, `autoFocus`, `disabled`, `readonly`, `inputMode`, `tokenization`, and type-specific props such as `yearLength`, `showCardIcon`, `icons`, `validCardBrands`, `addCardBrands`, file props, and date min/max.

## Events And Hooks

Field event props:

- `onFocus`
- `onBlur`
- `onUpdate`
- `onDelete`
- `onKeyUp`
- `onKeyDown`
- `onKeyPress`

`VGSCollectProvider` enables:

- `useVGSCollectState()` -> `[state]`
- `useVGSCollectResponse()` -> `[response]`
- `useVGSCollectFormInstance()` -> `[form]`

Use `onCustomSubmit` with `useVGSCollectFormInstance()` when the customer needs custom submit orchestration.

Before custom submission, require every rendered field in the current state to have `isValid === true`. Do not persist or log full form state because it can include sensitive metadata.

## Masking Caveat

React wrapper masking is narrower than core masking. `mask`, `maskChar`, and `formatChars` are allowed only for `text`, `textarea`, `password`, and `ssn`. The React wrapper rejects masks on `zip-code`.

## CMP Notes

For CMP flows, keep tokens on the backend. Fetch short-lived access tokens from a backend endpoint, validate that the response includes a string `access_token`, and return it through `authHandler`. Do not hardcode client secrets or bearer tokens in browser code.

CMP create-card requires a Collect Session `formId` configured for CMP and a submit configuration of `{ api: 'cmp', operation: 'createCard' }`. Include `configuration.cardAttributes` when card attributes events should be available as the user enters the card number.
