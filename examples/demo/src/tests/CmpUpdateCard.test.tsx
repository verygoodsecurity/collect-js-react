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

const CmpUpdateCard = require('../features/CmpUpdateCard').default;

describe('CMP update card demo page', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    latestSessionProps = undefined;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLoadVGSCollect.mockClear();
    mockUseVGSCollectState.mockReset();
    mockUseVGSCollectState.mockReturnValue([
      {
        cvc: {
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

  test('loads Collect.js and renders update card session with expected props', async () => {
    render(<CmpUpdateCard />);

    await waitFor(() => expect(screen.getByTestId('session-form')).toBeInTheDocument());

    expect(mockLoadVGSCollect).toHaveBeenCalledWith({
      vaultId: demoEnv.VAULT_ID,
      environment: demoEnv.ENVIRONMENT,
      version: demoEnv.COLLECT_VERSION
    });

    expect(screen.getByText('Card Management (Update Card)')).toBeInTheDocument();
    expect(screen.getByText(`Using formId: ${demoEnv.FORM_ID}`)).toBeInTheDocument();
    expect(screen.getByText('Card ID: CRDe4CxWRkZZYZ8cGumTbESMP')).toBeInTheDocument();
    expect(screen.getByTestId('card-exp-field')).toBeInTheDocument();
    expect(screen.getByTestId('card-cvc-field')).toBeInTheDocument();

    expect(latestSessionProps.vaultId).toBe(demoEnv.VAULT_ID);
    expect(latestSessionProps.environment).toBe(demoEnv.ENVIRONMENT);
    expect(latestSessionProps.authHandler).toEqual(expect.any(Function));
    expect(latestSessionProps.stateCallback).toEqual(expect.any(Function));
    expect(latestSessionProps.onErrorCallback).toEqual(expect.any(Function));
    expect(latestSessionProps.onSubmitCallback).toEqual(expect.any(Function));
    expect(latestSessionProps.submit).toEqual({
      api: 'cmp',
      operation: 'updateCard',
      params: {
        cardId: 'CRDe4CxWRkZZYZ8cGumTbESMP'
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

    render(<CmpUpdateCard />);

    await waitFor(() => expect(latestSessionProps?.authHandler).toEqual(expect.any(Function)));

    await expect(latestSessionProps.authHandler()).resolves.toBe('demo-access-token');
    expect(global.fetch).toHaveBeenCalledWith('/api/access-token');
  });

  test('renders update card response, errors and state from callbacks', async () => {
    render(<CmpUpdateCard />);

    await waitFor(() => expect(latestSessionProps?.onSubmitCallback).toEqual(expect.any(Function)));

    await act(async () => {
      latestSessionProps.onSubmitCallback(200, {
        data: {
          id: 'CRDe4CxWRkZZYZ8cGumTbESMP',
          attributes: {
            cvc_alias: 'tok_cvc_456'
          }
        }
      });
    });

    expect(screen.getByText('Card ID: CRDe4CxWRkZZYZ8cGumTbESMP')).toBeInTheDocument();
    expect(screen.getByText(/"cardId": "CRDe4CxWRkZZYZ8cGumTbESMP"/)).toBeInTheDocument();
    expect(screen.getByText(/"id": "CRDe4CxWRkZZYZ8cGumTbESMP"/)).toBeInTheDocument();
    expect(screen.getByText(/"cvc_alias": "tok_cvc_456"/)).toBeInTheDocument();
    expect(screen.getByText(/"isDirty": true/)).toBeInTheDocument();
    expect(screen.getByText(/"isValid": true/)).toBeInTheDocument();

    await act(async () => {
      latestSessionProps.onErrorCallback({
        cvc: {
          errorMessages: ['CVC is invalid']
        }
      });
    });

    expect(screen.getByText(/CVC is invalid/)).toBeInTheDocument();
  });
});
