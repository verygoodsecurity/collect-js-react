import React from 'react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { VGSCollectProvider, VGSCollectForm } from '../index';
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
        <VGSCollectForm.CardNumberField name='card-number'></VGSCollectForm.CardNumberField>
        <VGSCollectForm.CardExpirationDateField name='card-exp'></VGSCollectForm.CardExpirationDateField>
        <VGSCollectForm.CardSecurityCodeField name='card-cvv'></VGSCollectForm.CardSecurityCodeField>
      </VGSCollectForm>
    </VGSCollectProvider>
  );
  expect(screen.getAllByTestId('vgs-collect-field-wrapper')).toHaveLength(3);
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
