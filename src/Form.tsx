import React from 'react';
import { setFormInstance, getFormInstance } from "./state";
import { ICollect, ICollectFormProps } from "./types/interfaces";


export const CollectForm = (props: ICollectFormProps) => {
  const {
    vaultId,
    environment = 'sandbox',
    action = '/',
    submitParameters,
    onUpdateCallback,
    onSubmitCallback,
    children
  } = props;

  if (window.VGSCollect) {
    const form: ICollect = window.VGSCollect.create(vaultId, environment, (state: any) => {
      if (onUpdateCallback) {
        onUpdateCallback(state);
      }
    });

    setFormInstance(form);
  }

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form: any = getFormInstance();

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
