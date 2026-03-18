import React from 'react';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';

const demoEnv = {
  COLLECT_VERSION: '4.0.0-beta.7',
  ENVIRONMENT: 'sandbox',
  FORM_ID: 'cmp-test-form',
  VAULT_ID: 'tntcd7c3dxb'
};

const mockLoadVGSCollect = jest.fn(() => Promise.resolve());
const mockUseVGSCollectState = jest.fn();

let latestSessionProps: any;

jest.mock('../env', () => ({
  COLLECT_VERSION: '4.0.0-beta.7',
  ENVIRONMENT: 'sandbox',
  FORM_ID: 'cmp-test-form',
  VAULT_ID: 'tntcd7c3dxb'
}));

jest.mock('@vgs/collect-js', () => ({
  loadVGSCollect: mockLoadVGSCollect
}));

jest.mock(
  '@vgs/collect-js-react',
  () => ({
    VGSCollectSession: Object.assign(
      ({ children, ...props }: any) => {
        latestSessionProps = props;
        return <form data-testid='session-form'>{children}</form>;
      },
      {
        CardholderField: ({ defaultValue }: any) => <div data-testid='cardholder-field'>{defaultValue || ''}</div>,
        CardNumberField: () => <div data-testid='card-number-field' />,
        CardExpirationDateField: ({ defaultValue }: any) => (
          <div data-testid='card-exp-field'>{defaultValue || ''}</div>
        ),
        CardSecurityCodeField: ({ defaultValue }: any) => <div data-testid='card-cvc-field'>{defaultValue || ''}</div>
      }
    ),
    useVGSCollectState: mockUseVGSCollectState
  }),
  { virtual: true }
);

const Cmp = require('../features/Cmp').default;

describe('CMP demo page', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    latestSessionProps = undefined;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLoadVGSCollect.mockClear();
    mockUseVGSCollectState.mockReset();
    mockUseVGSCollectState.mockReturnValue([
      {
        pan: {
          isDirty: true,
          isValid: true,
          errorMessages: []
        }
      }
    ]);
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test('loads Collect.js and renders VGSCollectSession with expected props', async () => {
    render(<Cmp />);

    await waitFor(() => expect(screen.getByTestId('session-form')).toBeInTheDocument());

    expect(mockLoadVGSCollect).toHaveBeenCalledWith({
      vaultId: demoEnv.VAULT_ID,
      environment: demoEnv.ENVIRONMENT,
      version: demoEnv.COLLECT_VERSION
    });

    expect(screen.getByText('CMP Session')).toBeInTheDocument();
    expect(screen.getByText(`Using formId: ${demoEnv.FORM_ID}`)).toBeInTheDocument();
    expect(screen.getByTestId('cardholder-field')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('card-exp-field')).toHaveTextContent('12 / 38');
    expect(screen.getByTestId('card-cvc-field')).toHaveTextContent('123');

    expect(latestSessionProps.vaultId).toBe(demoEnv.VAULT_ID);
    expect(latestSessionProps.environment).toBe(demoEnv.ENVIRONMENT);
    expect(latestSessionProps.authHandler).toEqual(expect.any(Function));
    expect(latestSessionProps.stateCallback).toEqual(expect.any(Function));
    expect(latestSessionProps.onErrorCallback).toEqual(expect.any(Function));
    expect(latestSessionProps.onGetCardAttributesSuccess).toEqual(expect.any(Function));
    expect(latestSessionProps.onGetCardAttributesError).toEqual(expect.any(Function));
    expect(latestSessionProps.onSubmitCallback).toEqual(expect.any(Function));
    expect(latestSessionProps.submitParameters).toEqual({
      createCard: {
        data: {
          cardholder: {
            address: {
              address1: '123 Main St',
              address2: 'Suite 456',
              address3: 'Line 3',
              address4: 'Line 4',
              city: 'LA',
              region: 'CA',
              postal_code: '12345',
              country: 'USA'
            }
          }
        }
      }
    });
  });

  test('authHandler fetches access token from the demo endpoint and returns it', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'demo-access-token'
      })
    });

    render(<Cmp />);

    await waitFor(() => expect(latestSessionProps?.authHandler).toEqual(expect.any(Function)));

    await expect(latestSessionProps.authHandler()).resolves.toBe('demo-access-token');
    expect(global.fetch).toHaveBeenCalledWith('/api/access-token');
  });

  test('authHandler rejects when the token endpoint responds with an error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        error: 'token request failed'
      })
    });

    render(<Cmp />);

    await waitFor(() => expect(latestSessionProps?.authHandler).toEqual(expect.any(Function)));

    await expect(latestSessionProps.authHandler()).rejects.toThrow('token request failed');
  });

  test('renders card attributes, CMP response, cvc alias, errors and state from callbacks', async () => {
    render(<Cmp />);

    await waitFor(() => expect(latestSessionProps?.onGetCardAttributesSuccess).toEqual(expect.any(Function)));

    await act(async () => {
      latestSessionProps.onGetCardAttributesSuccess({
        attributes: {
          brand: 'visa'
        }
      });
    });

    expect(screen.getByText(/"brand": "visa"/)).toBeInTheDocument();

    await act(async () => {
      latestSessionProps.onSubmitCallback(200, {
        data: {
          attributes: {
            cvc_alias: 'tok_cvc_123',
            pan_alias: 'tok_pan_123'
          }
        }
      });
    });

    expect(screen.getAllByText(/"cvc_alias": "tok_cvc_123"/)).toHaveLength(2);
    expect(screen.getByText(/"pan_alias": "tok_pan_123"/)).toBeInTheDocument();
    expect(screen.getByText(/"isDirty": true/)).toBeInTheDocument();
    expect(screen.getByText(/"isValid": true/)).toBeInTheDocument();

    await act(async () => {
      latestSessionProps.onErrorCallback({
        pan: {
          errorMessages: ['Card number is invalid']
        }
      });
    });

    expect(screen.getByText(/Card number is invalid/)).toBeInTheDocument();
  });

  test('renders card attributes errors from the session error event', async () => {
    render(<Cmp />);

    await waitFor(() => expect(latestSessionProps?.onGetCardAttributesError).toEqual(expect.any(Function)));

    await act(async () => {
      latestSessionProps.onGetCardAttributesError({
        errors: ['Card attributes failed']
      });
    });

    expect(screen.getByText(/Card attributes failed/)).toBeInTheDocument();
  });
});
