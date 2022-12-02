import React from 'react';
import { useEffect } from "react";
import { getFormInstance } from "./state";
import { DEFAULT_CONFIG } from './constants';

import {
  IVGSCollectTextField,
  IVGSCollectCardNumberField,
  IVGSCollectCardExpirationField,
  IVGSCollectCardCVCField,
  IVGSCollectPasswordField,
  IVGSCollectSSNField,
  IVGSCollectNumberField,
  IVGSCollectZipCodeField,
  IVGSCollectTextareaField,
  IVGSCollectForm
} from './types/Form';

type GeneralFieldProps = {
  className: string;
}

function RenderField(props: any) {
  const {
    className,
    ...fieldProps
  } = props;

  const fieldId = `vgs-${window.crypto.randomUUID()}`;

  useEffect(() => {
    const VGSCollectForm = getFormInstance() as IVGSCollectForm;
    VGSCollectForm.field(`#${fieldId}`, fieldProps);
  }, []);

  return (
    <div className={`vgs-collect-iframe-wr ${className}`} id={fieldId}></div>
  )
}

const TextField = (props: Partial<IVGSCollectTextField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.TEXT, props)}
    />
  )
}

const CardNumberField = (props: Partial<IVGSCollectCardNumberField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.CARD_NUMBER, props)}
    />
  )
};

const CardExpirationDateField = (props: Partial<IVGSCollectCardExpirationField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.CARD_EXPIRATION_DATE, props)}
    />
  )
};

const CardSecurityCodeField = (props: Partial<IVGSCollectCardCVCField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.CARD_SECURITY_CODE, props)}
    />
  )
};

const PasswordField = (props: Partial<IVGSCollectPasswordField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.PASSWORD, props)}
    />
  )
};

const SSNField = (props: Partial<IVGSCollectSSNField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.SSN, props)}
    />
  )
};

const ZipCodeField = (props: Partial<IVGSCollectZipCodeField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.ZIP_CODE, props)}
    />
  )
};

const TextareaField = (props: Partial<IVGSCollectTextareaField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.TEXTAREA, props)}
    />
  )
};

const NumberField = (props: Partial<IVGSCollectNumberField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign(DEFAULT_CONFIG.NUMBER, props)}
    />
  )
};

export {
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  SSNField,
  ZipCodeField,
  TextareaField,
  NumberField,
}