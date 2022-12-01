import React from 'react';
import { setFormInstance, getFormInstance } from "./state";
import { IVGSCollectForm, VGSCollectFormState, ICollectFormProps } from "./types/Form";

export const VGSCollectForm = (props: ICollectFormProps) => {
  const {
    vaultId,
    environment = 'sandbox',
    action = '/',
    submitParameters,
    onUpdateCallback,
    onSubmitCallback,
    children
  } = props;

  if (typeof window !== 'undefined' && window.VGSCollect) {
    const form: IVGSCollectForm = window.VGSCollect.create(vaultId, environment, (state: VGSCollectFormState) => {
      if (onUpdateCallback) {
        onUpdateCallback(state);
      }
    });

    setFormInstance(form);
  }

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form: IVGSCollectForm = getFormInstance();

    if (form) {
      form.submit(action, submitParameters, (status: any, resp: any) => {
        if (onSubmitCallback) {
          onSubmitCallback(status, resp);
        }
      });
    } else {
      throw new Error('@vgs/collect-js-react: VGS Collect form not found.')
    }
  }

  return (
    <form onSubmit={(event) => { submitHandler(event) }}>
      {children}
    </form>
  )
}
