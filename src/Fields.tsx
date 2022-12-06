import React from 'react';
import { useEffect } from "react";
import { getFormInstance } from "./state";
import { DEFAULT_CONFIG, FIELD_EVENTS } from './constants';

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
  onFocus: any;
  onBlur: any;
  onUpdate: any;
  onDelete: any;
  onKeyUp: any;
  onKeyDown: any;
  onKeyPress: any;
}

function RenderField(props: any) {
  const {
    className,
    onFocus,
    onBlur,
    onUpdate,
    onDelete,
    onKeyPress,
    onKeyUp,
    onKeyDown,
    ...fieldProps
  } = props;

  const fieldId = `vgs-${window.crypto.randomUUID()}`;
  const events = {
    onFocus,
    onBlur,
    onUpdate,
    onKeyUp,
    onKeyDown,
    onKeyPress,
    onDelete
  };

  const eventsToListen = Object.keys(events).filter(e => events[e] !== undefined);

  useEffect(() => {
    const collectFormInstance = getFormInstance() as IVGSCollectForm;
    const secureField = collectFormInstance.field(`#${fieldId}`, fieldProps);

    eventsToListen.forEach(event => {
      secureField.on(FIELD_EVENTS[event], (info) => { events[event](info) })
    });

    return () => {
      eventsToListen.forEach(event => {
        secureField.off(FIELD_EVENTS[event], (info) => { events[event](info) })
      });
    }

  }, []);

  return (
    <div className={`vgs-collect-iframe-wr ${className}`} id={fieldId}></div>
  )
}

const TextField = (props: Partial<IVGSCollectTextField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.TEXT,
        name: DEFAULT_CONFIG.TEXT.getName()
      }, props)}
    />
  )
}

const CardNumberField = (props: Partial<IVGSCollectCardNumberField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.CARD_NUMBER,
        name: DEFAULT_CONFIG.CARD_NUMBER.getName()
      }, props)}
    />
  )
};

const CardExpirationDateField = (props: Partial<IVGSCollectCardExpirationField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.CARD_EXPIRATION_DATE,
        name: DEFAULT_CONFIG.CARD_EXPIRATION_DATE.getName()
      }, props)}
    />
  )
};

const CardSecurityCodeField = (props: Partial<IVGSCollectCardCVCField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.CARD_SECURITY_CODE,
        name: DEFAULT_CONFIG.CARD_SECURITY_CODE.getName()
      }, props)}
    />
  )
};

const PasswordField = (props: Partial<IVGSCollectPasswordField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.PASSWORD,
        name: DEFAULT_CONFIG.PASSWORD.getName()
      }, props)}
    />
  )
};

const SSNField = (props: Partial<IVGSCollectSSNField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.SSN,
        name: DEFAULT_CONFIG.SSN.getName()
      }, props)}
    />
  )
};

const ZipCodeField = (props: Partial<IVGSCollectZipCodeField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.ZIP_CODE,
        name: DEFAULT_CONFIG.ZIP_CODE.getName()
      }, props)}
    />
  )
};

const TextareaField = (props: Partial<IVGSCollectTextareaField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.TEXTAREA,
        name: DEFAULT_CONFIG.TEXTAREA.getName()
      }, props)}
    />
  )
};

const NumberField = (props: Partial<IVGSCollectNumberField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.NUMBER,
        name: DEFAULT_CONFIG.NUMBER.getName()
      }, props)}
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
};
