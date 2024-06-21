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
import { DispatchStateContext, DispatchSubmitContext, DispatchFormContext, Action } from './provider';
import {
  ICollectFormProps,
  IVGSCollectForm,
  VGSCollectFormState
} from './types/Form';
import React, { useContext, useEffect, Dispatch } from 'react';
import { getFormInstance, setFormInstance } from './state';

import { HttpStatusCode } from './types/HttpStatusCode';

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
    onErrorCallback,
    children
  } = props;

  if (!vaultId) {
    throw new Error(`@vgs/collect-js-react: vaultId is required.`);
  }

  const dispatchFormStateUpdate = useContext(DispatchStateContext);
  const dispatchResponseUpdate = useContext(DispatchSubmitContext);

  //test
  const dispatchFormСontext = useContext(DispatchFormContext);

  let dispatchFormState: Dispatch<Action> | undefined  = undefined;
  if (dispatchFormСontext) {
    dispatchFormState = dispatchFormСontext.dispatchFormState;
  }
  
  //test
  console.log('dispatchFormStateUpdate ->', dispatchFormStateUpdate);
  console.log('dispatchResponseUpdate ->', dispatchResponseUpdate);
  console.log('dispatchFormCreated ->', dispatchFormСontext);

  const isProviderExists =
    typeof dispatchFormStateUpdate === 'function' &&
    typeof dispatchResponseUpdate === 'function';
  console.log('isProviderExists ->', isProviderExists);

  useEffect(() => {
    console.log("Lets init the form, shall we?")
    console.log("Object.keys(getFormInstance()).length ->", Object.keys(getFormInstance()).length)
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
      console.log('created form is --->', form);
      
      // TEST
      if (dispatchFormState) {
        dispatchFormState({ type: 'FORM_MOUNTED' });
      }
      // TEST

      if (cname) {
        form.useCname(cname);
      }
      setFormInstance(form);
    }

    // CLEAR BLOCK
    return () => {
      console.log('Object.keys(activeForm).length INSIDE CLEAN FUNCTION', (Object.keys(getFormInstance()).length));
      const activeForm = getFormInstance();
      if (Object.keys(activeForm).length !== 0) {
        console.log('activeForm.unmount() -> we will unmount!');
        activeForm.unmount();
        setFormInstance({} as IVGSCollectForm);
      }
      if (isProviderExists) {
        dispatchFormStateUpdate(null);
        dispatchResponseUpdate(null);
        // TEST
        if (dispatchFormState) {
          dispatchFormState({ type: 'FORM_UNMOUNTED' });
        }
      // TEST
      }
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
      onSubmit={(event) => {
        submitHandler(event);
      }}
    >
      {children}
    </form>
  );
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
