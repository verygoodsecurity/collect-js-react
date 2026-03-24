import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { VGSCollectProvider, VGSCollectForm, VGSCollectSession } from '../index';
import { VGSCollectVaultEnvironment } from '../types/Form';
import { getFormInstance } from '../state';

import { VGSCollectInstanceMock } from './mocks';

import { generateUUID } from '../utils';

const COLLECT_CONFIG = {
  VAULT_ID: 'tnt1234567',
  ENVIRONMENT: 'sandbox' as VGSCollectVaultEnvironment,
  CNAME: 'my_domain.com',
  ROUTE_ID: '4dfja6ec-b5e2-002e-828d-388dfd169997f'
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('Throw error when vaultId is not in received props', () => {
  const originalError = console.error;
  console.error = jest.fn();

  expect(() =>
    render(
      <VGSCollectProvider>
        {/** @ts-ignore */}
        <VGSCollectForm environment={COLLECT_CONFIG.ENVIRONMENT} />
      </VGSCollectProvider>
    )
  ).toThrowError('@vgs/collect-js-react: vaultId is required.');

  console.error = originalError;
});

test('VGSCollectForm calls .create() method', () => {
  const { unmount } = render(
    <VGSCollectProvider>
      <VGSCollectForm vaultId={COLLECT_CONFIG.VAULT_ID} environment={COLLECT_CONFIG.ENVIRONMENT} />
    </VGSCollectProvider>
  );

  expect(window.VGSCollect.create).toHaveBeenCalledWith(
    COLLECT_CONFIG.VAULT_ID,
    COLLECT_CONFIG.ENVIRONMENT,
    expect.any(Function)
  );
  expect(getFormInstance()).toStrictEqual(VGSCollectInstanceMock);
  unmount();
  expect(getFormInstance()).toStrictEqual({});
});

test('VGSCollectForm calls .useCname() method when CNAME is passed in the props', () => {
  render(
    <VGSCollectProvider>
      <VGSCollectForm
        vaultId={COLLECT_CONFIG.VAULT_ID}
        cname={COLLECT_CONFIG.CNAME}
        environment={COLLECT_CONFIG.ENVIRONMENT}
      />
    </VGSCollectProvider>
  );

  expect(VGSCollectInstanceMock.useCname).toHaveBeenCalledWith(COLLECT_CONFIG.CNAME);
});

test('VGSCollectForm calls .setRouteId() method when routeID is passed in the props', () => {
  render(
    <VGSCollectProvider>
      <VGSCollectForm
        vaultId={COLLECT_CONFIG.VAULT_ID}
        routeId={COLLECT_CONFIG.ROUTE_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
      />
    </VGSCollectProvider>
  );

  expect(VGSCollectInstanceMock.setRouteId).toHaveBeenCalledWith(COLLECT_CONFIG.ROUTE_ID);
});

test('Generate <div> wrapper element for each iframe', () => {
  render(
    <VGSCollectProvider>
      <VGSCollectForm vaultId={COLLECT_CONFIG.VAULT_ID} environment={COLLECT_CONFIG.ENVIRONMENT}>
        <VGSCollectForm.CardNumberField name='card-number' />
        <VGSCollectForm.CardExpirationDateField name='card-exp' />
        <VGSCollectForm.CardSecurityCodeField name='card-cvv' />
      </VGSCollectForm>
    </VGSCollectProvider>
  );
  expect(screen.getAllByTestId('vgs-collect-field-wrapper')).toHaveLength(3);
});

test('VGSCollectSession calls .session() method and subscribes to card attributes events', async () => {
  const authHandler = jest.fn();
  const onGetCardAttributesSuccess = jest.fn();
  const onGetCardAttributesError = jest.fn();

  render(
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId={COLLECT_CONFIG.VAULT_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
        formId='test-simple-form'
        routeId={COLLECT_CONFIG.ROUTE_ID}
        authHandler={authHandler}
        onGetCardAttributesSuccess={onGetCardAttributesSuccess}
        onGetCardAttributesError={onGetCardAttributesError}
      />
    </VGSCollectProvider>
  );

  await waitFor(() =>
    expect(window.VGSCollect.session).toHaveBeenCalledWith(
      expect.objectContaining({
        vaultId: COLLECT_CONFIG.VAULT_ID,
        env: COLLECT_CONFIG.ENVIRONMENT,
        formId: 'test-simple-form',
        routeId: COLLECT_CONFIG.ROUTE_ID,
        authHandler,
        stateCallback: expect.any(Function)
      })
    )
  );

  await waitFor(() => {
    expect(VGSCollectInstanceMock.on).toHaveBeenCalledWith('getCardAttributesSuccess', onGetCardAttributesSuccess);
    expect(VGSCollectInstanceMock.on).toHaveBeenCalledWith('getCardAttributesError', onGetCardAttributesError);
  });
});

test('VGSCollectSession submits CMP createCard payload from submit.api config', async () => {
  render(
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId={COLLECT_CONFIG.VAULT_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
        formId='test-simple-form'
        authHandler={jest.fn()}
        submit={{
          api: 'cmp',
          operation: 'createCard',
          submitParameters: {
            data: {
              cardholder: {
                name: 'test'
              }
            }
          }
        }}
      >
        <button type='submit'>Submit</button>
      </VGSCollectSession>
    </VGSCollectProvider>
  );

  await waitFor(() => expect(window.VGSCollect.session).toHaveBeenCalled());

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() =>
    expect(VGSCollectInstanceMock.createCard).toHaveBeenCalledWith(
      {
        data: {
          cardholder: {
            name: 'test'
          }
        }
      },
      expect.any(Function),
      expect.any(Function)
    )
  );
});

test('VGSCollectSession submits proxy payload from submit.api config', async () => {
  render(
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId={COLLECT_CONFIG.VAULT_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
        formId='test-simple-form'
        submit={{
          api: 'proxy',
          action: '/post',
          routeId: COLLECT_CONFIG.ROUTE_ID,
          submitParameters: {
            headers: {
              Authorization: 'Bearer token'
            }
          }
        }}
      >
        <button type='submit'>Submit</button>
      </VGSCollectSession>
    </VGSCollectProvider>
  );

  await waitFor(() => expect(window.VGSCollect.session).toHaveBeenCalled());

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(VGSCollectInstanceMock.setRouteId).toHaveBeenCalledWith(COLLECT_CONFIG.ROUTE_ID);
    expect(VGSCollectInstanceMock.submit).toHaveBeenCalledWith(
      '/post',
      {
        headers: {
          Authorization: 'Bearer token'
        }
      },
      expect.any(Function),
      expect.any(Function)
    );
  });
});

test('VGSCollectSession submits vault payload from submit.api config', async () => {
  render(
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId={COLLECT_CONFIG.VAULT_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
        formId='test-simple-form'
        submit={{
          api: 'vault',
          submitParameters: {
            access_token: 'vault-token'
          }
        }}
      >
        <button type='submit'>Submit</button>
      </VGSCollectSession>
    </VGSCollectProvider>
  );

  await waitFor(() => expect(window.VGSCollect.session).toHaveBeenCalled());

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() =>
    expect(VGSCollectInstanceMock.createAliases).toHaveBeenCalledWith(
      {
        access_token: 'vault-token'
      },
      expect.any(Function),
      expect.any(Function)
    )
  );
});

test('VGSCollectSession submits tokenization payload from submit.api config', async () => {
  render(
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId={COLLECT_CONFIG.VAULT_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
        formId='test-simple-form'
        submit={{
          api: 'tokenization',
          routeId: COLLECT_CONFIG.ROUTE_ID
        }}
      >
        <button type='submit'>Submit</button>
      </VGSCollectSession>
    </VGSCollectProvider>
  );

  await waitFor(() => expect(window.VGSCollect.session).toHaveBeenCalled());

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(VGSCollectInstanceMock.setRouteId).toHaveBeenCalledWith(COLLECT_CONFIG.ROUTE_ID);
    expect(VGSCollectInstanceMock.tokenize).toHaveBeenCalledWith(expect.any(Function), expect.any(Function))
  });
});

test('VGSCollectSession submits CMP updateCard payload from submit.api config', async () => {
  render(
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId={COLLECT_CONFIG.VAULT_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
        formId='test-simple-form'
        submit={{
          api: 'cmp',
          operation: 'updateCard',
          params: {
            cardId: 'card_123'
          }
        }}
      >
        <button type='submit'>Submit</button>
      </VGSCollectSession>
    </VGSCollectProvider>
  );

  await waitFor(() => expect(window.VGSCollect.session).toHaveBeenCalled());

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() =>
    expect(VGSCollectInstanceMock.updateCard).toHaveBeenCalledWith(
      {
        cardId: 'card_123'
      },
      expect.any(Function),
      expect.any(Function)
    )
  );
});

test('VGSCollectSession calls onSubmitCallback for CMP updateCard success', async () => {
  const onSubmitCallback = jest.fn();

  VGSCollectInstanceMock.updateCard.mockImplementationOnce(
    (_params: any, successCallback: (status: number, resp: any) => void) => {
      successCallback(200, {
        data: {
          id: 'card_123'
        }
      });
    }
  );

  render(
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId={COLLECT_CONFIG.VAULT_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
        formId='test-simple-form'
        onSubmitCallback={onSubmitCallback}
        submit={{
          api: 'cmp',
          operation: 'updateCard',
          params: {
            cardId: 'card_123'
          }
        }}
      >
        <button type='submit'>Submit</button>
      </VGSCollectSession>
    </VGSCollectProvider>
  );

  await waitFor(() => expect(window.VGSCollect.session).toHaveBeenCalled());

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() =>
    expect(onSubmitCallback).toHaveBeenCalledWith(200, {
      data: {
        id: 'card_123'
      }
    })
  );
});

test('VGSCollectSession passes configuration fallback to .session()', async () => {
  const configuration = {
    cardAttributes: {
      enable: true,
      parameters: ['card_brand', 'card_type', 'product_name']
    }
  };

  render(
    <VGSCollectProvider>
      <VGSCollectSession
        vaultId={COLLECT_CONFIG.VAULT_ID}
        environment={COLLECT_CONFIG.ENVIRONMENT}
        formId='missing-form-for-configuration-fallback'
        configuration={configuration}
      />
    </VGSCollectProvider>
  );

  await waitFor(() =>
    expect(window.VGSCollect.session).toHaveBeenCalledWith(
      expect.objectContaining({
        vaultId: COLLECT_CONFIG.VAULT_ID,
        env: COLLECT_CONFIG.ENVIRONMENT,
        formId: 'missing-form-for-configuration-fallback',
        configuration
      })
    )
  );
});

describe('generateUUID', () => {
  it('should generate a valid UUID', () => {
    const uuid = generateUUID();

    // validate format of the UUID XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('should generate unique UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();

    // Validate that we have two unique UUID
    expect(uuid1).not.toBe(uuid2);
  });
});
