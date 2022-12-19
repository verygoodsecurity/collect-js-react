import React, { useEffect, useContext } from 'react';
import { setFormInstance, getFormInstance } from './state';
import { DispatchStateContext, DispatchSubmitContext } from "./provider";
import { HttpStatusCode } from './types/HttpStatusCode';
import {
  IVGSCollectForm,
  VGSCollectFormState,
  ICollectFormProps
} from './types/Form';

import {
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  SSNField,
  ZipCodeField,
  TextareaField,
  NumberField
} from './Fields';

const isBrowser = typeof window !== 'undefined';

export function VGSCollectForm(props: ICollectFormProps) {
  const {
    vaultId,
    environment = 'sandbox',
    action = '/',
    cname,
    submitParameters,
    tokenizationAPI = false,
    onUpdateCallback,
    onSubmitCallback,
    onErrorCalback,
    children
  } = props;

  const dispatchFormStateUpdate = useContext(DispatchStateContext);
  const dispatchResponseUpdate = useContext(DispatchSubmitContext);

  if (
    isBrowser &&
    window.VGSCollect &&
    Object.keys(getFormInstance()).length === 0
  ) {
    const form: IVGSCollectForm = window.VGSCollect.create(vaultId, environment, (state: VGSCollectFormState) => {
      if (onUpdateCallback) {
        onUpdateCallback(state);
      }
      dispatchFormStateUpdate(state);
    });

    if (cname) {
      form.useCname(cname);
    }
    setFormInstance(form);
  }

  useEffect(() => {
    return () => {
      const activeForm = getFormInstance();
      activeForm.unmount();
      setFormInstance({} as IVGSCollectForm);
      dispatchFormStateUpdate(null);
      dispatchResponseUpdate(null);
    }
  }, []);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form: IVGSCollectForm = getFormInstance();

    if (!form) {
      throw new Error('@vgs/collect-js-react: VGS Collect form not found.')
    }

    if (tokenizationAPI) {
      form.tokenize(
        (status: HttpStatusCode, resp: any) => {
          if (onSubmitCallback) {
            onSubmitCallback(status, resp);
          }
        },
        (errors: any) => {
          if (onErrorCalback) {
            onErrorCalback(errors);
          }
        }
      );
    } else {
      form.submit(action, submitParameters,
        (status: HttpStatusCode, data: any) => {
          if (onSubmitCallback) {
            onSubmitCallback(status, data);
          }
          dispatchResponseUpdate({
            status,
            data
          });
        },
        (errors: any) => {
          if (onErrorCalback) {
            onErrorCalback(errors);
          }
        }
      );
    }
  }

  return (
    <React.StrictMode>
      <form
        onSubmit={(event) => {
          submitHandler(event)
        }}
      >
        {children}
      </form>
    </React.StrictMode>
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
