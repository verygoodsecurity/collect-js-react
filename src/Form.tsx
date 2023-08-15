import React, {
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle
} from 'react';
import { setFormInstance, getFormInstance } from './state';
import { DispatchStateContext, DispatchSubmitContext } from './provider';
import { HttpStatusCode } from './types/HttpStatusCode';
import {
  IVGSCollectForm,
  VGSCollectFormState,
  ICollectFormProps,
  VGSCollectFormRef
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
  NumberField,
  DateField,
  FileField
} from './Fields';

const isBrowser = typeof window !== 'undefined';

const Form = forwardRef<
  VGSCollectFormRef | undefined | null,
  ICollectFormProps
>(function (props, ref) {
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

  if (!vaultId) {
    throw new Error(`@vgs/collect-js-react: vaultId is required.`);
  }

  const dispatchFormStateUpdate = useContext(DispatchStateContext);
  const dispatchResponseUpdate = useContext(DispatchSubmitContext);

  const isProviderExists = (
    typeof dispatchResponseUpdate === 'function' &&
    typeof dispatchResponseUpdate === 'function'
  )

  if (
    isBrowser &&
    window.VGSCollect &&
    Object.keys(getFormInstance()).length === 0
  ) {
    const form: IVGSCollectForm = window.VGSCollect.create(vaultId, environment, (state: VGSCollectFormState) => {
      if (onUpdateCallback) {
        onUpdateCallback(state);
      };
      isProviderExists && dispatchFormStateUpdate(state);
    });

    if (cname) {
      form.useCname(cname);
    }
    setFormInstance(form);
  }

  useImperativeHandle(ref, () => ({
    unmount: () => {
      const activeForm = getFormInstance();

      if (!activeForm) {
        throw new Error('@vgs/collect-js-react: VGS Collect form not found.');
      }

      activeForm.unmount();
    }
  }));

  useEffect(() => {
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
        (status: HttpStatusCode | null, resp: any) => {
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
          if (onErrorCalback) {
            onErrorCalback(errors);
          }
        }
      );
    }
  }

  return (
    <form
      onSubmit={(event) => {
        submitHandler(event)
      }}
    >
      {children}
    </form>
  )
})

type VGSCollectForm = typeof Form & {
  TextField: typeof TextField;
  CardNumberField: typeof CardNumberField;
  CardExpirationDateField: typeof CardExpirationDateField;
  CardSecurityCodeField: typeof CardSecurityCodeField;
  PasswordField: typeof PasswordField;
  SSNField: typeof SSNField;
  ZipCodeField: typeof ZipCodeField;
  TextareaField: typeof TextareaField;
  NumberField: typeof NumberField;
  FileField: typeof FileField;
  DateField: typeof DateField;
};

const VGSCollectForm = Form as VGSCollectForm;

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

export { VGSCollectForm };
