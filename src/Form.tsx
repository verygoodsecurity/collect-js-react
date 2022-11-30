import React from 'react';
import { setFormState, getFormState } from "./state";
import { ICollect } from "./types/interfaces";

type VGSVaultEnvironments = 'sandbox' | 'live' | 'live-eu-1';

interface ICollectFormProps {
  vaultId: string;
  environment: VGSVaultEnvironments;
  onUpdateCallback?: (state: object) => void;
  onSubmitCallback?: (status: any, resp: any) => void;
  submitParameters?: any;
  children: JSX.Element[] | JSX.Element;
}

export const CollectForm = (props: ICollectFormProps) => {
  const {
    vaultId,
    environment = 'sandbox',
    submitParameters,
    onUpdateCallback,
    onSubmitCallback,
    children
  } = props;

  if (!vaultId) {
    throw new Error('@vgs/collect-js-react: vaultId is required.');
  }

  if (window.VGSCollect) {
    const form: ICollect = window.VGSCollect.create(vaultId, environment, (state: any) => {
      if (onUpdateCallback) {
        onUpdateCallback(state);
      }
    });

    setFormState(form);
  }

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form: any = getFormState();

    if (form) {
      form.submit("/post", submitParameters, (status: any, resp: any) => {
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
