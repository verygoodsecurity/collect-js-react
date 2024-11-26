import {
  CardExpirationDateField,
  CardNumberField,
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
import {
  ICollectFormProps,
  IVGSCollectForm,
  VGSCollectFormState
} from './types/Form';
import React, { useContext, useEffect } from 'react';
import { getFormInstance, setFormInstance } from './state';

import { HttpStatusCode } from './types/HttpStatusCode';

const isBrowser = typeof window !== 'undefined';


function CollectForm(props: ICollectFormProps) {
  const {
    vaultId,
    environment = 'sandbox',
    action = '/',
    cname,
    routeId,
    submitParameters,
    tokenizationAPI = false,
    onCustomSubmit,
    onUpdateCallback,
    onSubmitCallback,
    onErrorCallback,
    children,
  } = props;

  if (!vaultId) {
    throw new Error(`@vgs/collect-js-react: vaultId is required.`);
  }

  const dispatchFormStateUpdate = useContext(DispatchStateContext);
  const dispatchResponseUpdate = useContext(DispatchSubmitContext);
  const dispatchFormСontext = useContext(DispatchFormContext);
  const dispatchFormInstanceContextUpdate = useContext(DispatchFormInstanceContext);

  const isProviderExists =
    typeof dispatchFormStateUpdate === 'function' &&
    typeof dispatchResponseUpdate === 'function';

  useEffect(() => {
    if (
      isBrowser &&
      window.VGSCollect &&
      Object.keys(getFormInstance()).length === 0
    ) {
      const form: IVGSCollectForm = window.VGSCollect.create(
        vaultId,
        environment,
        (state: VGSCollectFormState) => {
          if (onUpdateCallback) {
            onUpdateCallback(state);
          } 
          isProviderExists && dispatchFormStateUpdate(state);
        }
      );
      
      dispatchFormСontext({ type: 'FORM_MOUNTED' });
      
      if (cname) {
        form.useCname(cname);
      }

      if (routeId) {
        form.setRouteId(routeId);
      }

      setFormInstance(form);
      dispatchFormInstanceContextUpdate(getFormInstance());
    }

    return () => {
      const activeForm = getFormInstance();
      if (Object.keys(activeForm).length !== 0) {
        activeForm.unmount();
        setFormInstance({} as IVGSCollectForm);
      }
      if (isProviderExists) {
        dispatchFormStateUpdate(null);
        dispatchResponseUpdate(null);
      }
      dispatchFormСontext({ type: 'FORM_UNMOUNTED' });
    };
  }, []);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();    
    const form: IVGSCollectForm = getFormInstance();

    if (!form) {
      throw new Error('@vgs/collect-js-react: VGS Collect form not found.');
    }
    if (tokenizationAPI) {
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
    } else {
      form.submit(
        action,
        submitParameters,
        (status: HttpStatusCode | null, data: any) => {
          if (onSubmitCallback) {
            onSubmitCallback(status, data);
          }
          dispatchResponseUpdate({
            status,
            data
          });
        },
        (errors: any) => {
          if (onErrorCallback) {
            onErrorCallback(errors);
          }
        }
      );
    }
  };

  return (
    <form 
      onSubmit={(event) => (onCustomSubmit || submitHandler)(event)}
    >
      {children}
    </form>
  );
}

export function VGSCollectForm(props: ICollectFormProps) {
  return (
    <FormStateProvider>
      <CollectForm {...props} />
    </FormStateProvider>
  )
}

VGSCollectForm.TextField = TextField;
VGSCollectForm.CardNumberField = CardNumberField;
VGSCollectForm.CardExpirationDateField = CardExpirationDateField;
VGSCollectForm.CardSecurityCodeField = CardSecurityCodeField;
VGSCollectForm.PasswordField = PasswordField;
VGSCollectForm.SSNField = SSNField;
VGSCollectForm.ZipCodeField = ZipCodeField;
VGSCollectForm.TextareaField = TextareaField;
VGSCollectForm.NumberField = NumberField;
VGSCollectForm.FileField = FileField;
VGSCollectForm.DateField = DateField;
