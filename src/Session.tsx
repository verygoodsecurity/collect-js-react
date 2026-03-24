import {
  CardExpirationDateField,
  CardNumberField,
  CardholderField,
  CardSecurityCodeField,
  DateField,
  FileField,
  NumberField,
  PasswordField,
  SSNField,
  TextField,
  TextareaField,
  ZipCodeField
} from './Fields';
import { DispatchStateContext, DispatchSubmitContext, DispatchFormInstanceContext } from './provider';
import { FormStateProvider, DispatchFormContext } from './formStateProvider';
import { ICollectSessionProps, ICollectSessionSubmit, IVGSCollectForm, VGSCollectFormState } from './types/Form';
import React, { useContext, useEffect } from 'react';
import { getFormInstance, setFormInstance } from './state';

import { HttpStatusCode } from './types/HttpStatusCode';

const isBrowser = typeof window !== 'undefined';

const DEFAULT_PROXY_ACTION = '/';

const resolveCMPSubmitParameters = async (submitParameters?: Record<string, any>) => {
  const cmpSubmitParameters = {
    ...(submitParameters || {})
  };

  if (typeof cmpSubmitParameters.auth !== 'undefined') {
    const authToken =
      typeof cmpSubmitParameters.auth === 'function' ? await cmpSubmitParameters.auth() : cmpSubmitParameters.auth;

    if (typeof authToken === 'string') {
      cmpSubmitParameters.auth = authToken;
    } else {
      throw new Error('Access token should be a string');
    }
  }

  return cmpSubmitParameters;
};

function CollectSession(props: ICollectSessionProps) {
  const {
    vaultId,
    env,
    environment = 'sandbox',
    cname,
    routeId,
    formId,
    configuration,
    authHandler,
    submit,
    onCustomSubmit,
    stateCallback,
    onUpdateCallback,
    onSubmitCallback,
    onErrorCallback,
    onGetCardAttributesSuccess,
    onGetCardAttributesError,
    children
  } = props;

  if (!vaultId) {
    throw new Error(`@vgs/collect-js-react: vaultId is required.`);
  }

  const dispatchFormStateUpdate = useContext(DispatchStateContext);
  const dispatchResponseUpdate = useContext(DispatchSubmitContext);
  const dispatchFormContext = useContext(DispatchFormContext);
  const dispatchFormInstanceContextUpdate = useContext(DispatchFormInstanceContext);

  const isProviderExists =
    typeof dispatchFormStateUpdate === 'function' && typeof dispatchResponseUpdate === 'function';

  useEffect(() => {
    let isMounted = true;
    let sessionForm: IVGSCollectForm | null = null;

    if (isBrowser && window.VGSCollect && Object.keys(getFormInstance()).length === 0) {
      void window.VGSCollect.session({
        vaultId,
        env: env || environment,
        formId,
        configuration,
        authHandler,
        routeId,
        onErrorCallback,
        stateCallback: (state: VGSCollectFormState) => {
          if (stateCallback) {
            stateCallback(state);
          }
          if (onUpdateCallback) {
            onUpdateCallback(state);
          }
          isProviderExists && dispatchFormStateUpdate(state);
        }
      })
        .then((form: IVGSCollectForm) => {
          if (!isMounted) {
            form.unmount();
            return;
          }

          sessionForm = form;

          if (cname) {
            form.useCname(cname);
          }

          if (onGetCardAttributesSuccess) {
            form.on('getCardAttributesSuccess', onGetCardAttributesSuccess);
          }

          if (onGetCardAttributesError) {
            form.on('getCardAttributesError', onGetCardAttributesError);
          }

          setFormInstance(form);
          dispatchFormInstanceContextUpdate(getFormInstance());
          dispatchFormContext({ type: 'FORM_MOUNTED' });
        })
        .catch((error: any) => {
          if (onErrorCallback) {
            onErrorCallback(error);
          }
        });
    }

    return () => {
      isMounted = false;

      const activeForm = sessionForm || getFormInstance();

      if (activeForm && Object.keys(activeForm).length !== 0) {
        if (onGetCardAttributesSuccess) {
          activeForm.off('getCardAttributesSuccess', onGetCardAttributesSuccess);
        }

        if (onGetCardAttributesError) {
          activeForm.off('getCardAttributesError', onGetCardAttributesError);
        }

        activeForm.unmount();
        setFormInstance({} as IVGSCollectForm);
      }

      if (isProviderExists) {
        dispatchFormStateUpdate(null);
        dispatchResponseUpdate(null);
      }

      dispatchFormContext({ type: 'FORM_UNMOUNTED' });
    };
  }, []);

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form: IVGSCollectForm = getFormInstance();
    const submitConfiguration: ICollectSessionSubmit = submit || { api: 'proxy', action: DEFAULT_PROXY_ACTION };

    if (!form) {
      throw new Error('@vgs/collect-js-react: VGS Collect form not found.');
    }

    if (submitConfiguration.api === 'cmp') {
      if (submitConfiguration.operation === 'createCard') {
        const cmpSubmitParameters = await resolveCMPSubmitParameters(submitConfiguration.submitParameters);

        form.createCard(
          cmpSubmitParameters,
          (status: HttpStatusCode | null, resp: any) => {
            if (onSubmitCallback) {
              onSubmitCallback(status, resp);
            }
          },
          (errors: any) => {
            if (onErrorCallback) {
              onErrorCallback(errors);
            }
          }
        );
      } else {
        form.updateCard(
          submitConfiguration.params,
          (status: HttpStatusCode | null, resp: any) => {
            if (onSubmitCallback) {
              onSubmitCallback(status, resp);
            }
          },
          (errors: any) => {
            if (onErrorCallback) {
              onErrorCallback(errors);
            }
          }
        );
      }
    } else if (submitConfiguration.api === 'vault') {
      form.createAliases(
        submitConfiguration.submitParameters || {},
        (status: HttpStatusCode | null, resp: any) => {
          if (onSubmitCallback) {
            onSubmitCallback(status, resp);
          }
        },
        (errors: any) => {
          if (onErrorCallback) {
            onErrorCallback(errors);
          }
        }
      );
    } else if (submitConfiguration.api === 'tokenization') {
      if (submitConfiguration.routeId) {
        form.setRouteId(submitConfiguration.routeId);
      }

      form.tokenize(
        (status: HttpStatusCode | null, resp: any) => {
          if (onSubmitCallback) {
            onSubmitCallback(status, resp);
          }
        },
        (errors: any) => {
          if (onErrorCallback) {
            onErrorCallback(errors);
          }
        }
      );
    } else if (submitConfiguration.api === 'proxy') {
      if (submitConfiguration.routeId) {
        form.setRouteId(submitConfiguration.routeId);
      }

      let isProxySubmitHandled = false;

      const handleProxySuccess = (status: HttpStatusCode | null, data: any) => {
        if (isProxySubmitHandled) {
          return;
        }

        isProxySubmitHandled = true;

        if (onSubmitCallback) {
          onSubmitCallback(status, data);
        }
        dispatchResponseUpdate({
          status,
          data
        });
      };

      const handleProxyError = (errors: any) => {
        if (isProxySubmitHandled) {
          return;
        }

        isProxySubmitHandled = true;

        if (onErrorCallback) {
          onErrorCallback(errors);
        }
      };

      form.submit(
        submitConfiguration.action,
        submitConfiguration.submitParameters || {},
        handleProxySuccess,
        handleProxyError
      );
    }
  };

  return <form onSubmit={(event) => (onCustomSubmit || submitHandler)(event)}>{children}</form>;
}

export function VGSCollectSession(props: ICollectSessionProps) {
  return (
    <FormStateProvider>
      <CollectSession {...props} />
    </FormStateProvider>
  );
}

VGSCollectSession.TextField = TextField;
VGSCollectSession.CardholderField = CardholderField;
VGSCollectSession.CardNumberField = CardNumberField;
VGSCollectSession.CardExpirationDateField = CardExpirationDateField;
VGSCollectSession.CardSecurityCodeField = CardSecurityCodeField;
VGSCollectSession.PasswordField = PasswordField;
VGSCollectSession.SSNField = SSNField;
VGSCollectSession.ZipCodeField = ZipCodeField;
VGSCollectSession.TextareaField = TextareaField;
VGSCollectSession.NumberField = NumberField;
VGSCollectSession.FileField = FileField;
VGSCollectSession.DateField = DateField;
