import React from 'react';
import { useEffect } from 'react';
import { generateUUID } from './utils';
import { getFormInstance } from './state';
import { DEFAULT_CONFIG, FIELD_EVENTS } from './constants';
import { useVGSCollectFormState } from './formStateProvider';
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
  IVGSCollectFileField,
  IVGSCollectDateField,
  IVGSCollectForm,
  VGSCollectStateParams,
} from './types/Form';

import {
  VGSCollectKeyboardEventData,
  VGSCollectFocusEventData,
} from './types/Field';

type GeneralFieldProps = {
  className: string;
  onFocus: (info: VGSCollectFocusEventData) => void;
  onBlur: (info: VGSCollectFocusEventData) => void;
  onUpdate: (state: VGSCollectStateParams) => void;
  onDelete: () => void;
  onKeyUp: (info: VGSCollectKeyboardEventData) => void;
  onKeyDown: (info: VGSCollectKeyboardEventData) => void;
  onKeyPress: (info: VGSCollectKeyboardEventData) => void;
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
    style,
    ...fieldPropsRaw
  } = props;
  
  const fieldProps = {
    ...fieldPropsRaw,
    ...(style && { css: style }), // Добавляем css, если style существует
  };

  if (!props.name) {
    throw new Error(`@vgs/collect-js-react: name attribute for ${props.type} is required.`);
  }

  const [fieldId] = React.useState(() => `vgs-${generateUUID()}`);
  const events = {
    onFocus,
    onBlur,
    onUpdate,
    onKeyUp,
    onKeyDown,
    onKeyPress,
    onDelete
  };
  const [ formState ] = useVGSCollectFormState();

  const eventsToListen = Object.keys(events).filter(e => events[e] !== undefined);

  useEffect(() => {
    const collectFormInstance = getFormInstance() as IVGSCollectForm;

    if (Object.keys(collectFormInstance).length !== 0 && formState?.formCreated === true) {
      const secureField = collectFormInstance.field(`#${fieldId}`, fieldProps);

      eventsToListen.forEach(event => {
        secureField.on(FIELD_EVENTS[event], (info) => { events[event](info) })
      });

      return () => {
        try {
          secureField?.delete?.();
        } catch (error) {
          if (
            !(error instanceof Error) ||
            (error instanceof Error &&
              error.message !==
                `The field '${fieldProps?.name}' is already deleted`)
          ) {
            throw error;
          }
        }
        eventsToListen.forEach(event => {
          secureField.off(FIELD_EVENTS[event], (info) => { events[event](info) })
        });
      }
    }
  }, [formState?.formCreated]);

  return (
    <div className={`vgs-collect-iframe-wr ${className ? className : ''}`} id={fieldId} data-testid="vgs-collect-field-wrapper"></div>
  )
}

const TextField = React.memo((props: Partial<IVGSCollectTextField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.TEXT,
      }, props)}
    />
  )
});

const CardNumberField = React.memo((props: Partial<IVGSCollectCardNumberField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.CARD_NUMBER,
      }, props)}
    />
  )
});

const CardExpirationDateField = React.memo((props: Partial<IVGSCollectCardExpirationField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.CARD_EXPIRATION_DATE,
      }, props)}
    />
  )
});

const CardSecurityCodeField = React.memo((props: Partial<IVGSCollectCardCVCField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.CARD_SECURITY_CODE,
      }, props)}
    />
  )
});

const PasswordField = React.memo((props: Partial<IVGSCollectPasswordField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.PASSWORD,
      }, props)}
    />
  )
});

const SSNField = React.memo((props: Partial<IVGSCollectSSNField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.SSN,
      }, props)}
    />
  )
});

const ZipCodeField = React.memo((props: Partial<IVGSCollectZipCodeField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.ZIP_CODE,
      }, props)}
    />
  )
});

const TextareaField = React.memo((props: Partial<IVGSCollectTextareaField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.TEXTAREA,
      }, props)}
    />
  )
});

const NumberField = React.memo((props: Partial<IVGSCollectNumberField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.NUMBER,
      }, props)}
    />
  )
});

const DateField = React.memo((props: Partial<IVGSCollectDateField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.DATE,
      }, props)}
    />
  )
});

const FileField = React.memo((props: Partial<IVGSCollectFileField & GeneralFieldProps>) => {
  return (
    <RenderField
      {...Object.assign({
        ...DEFAULT_CONFIG.FILE,
      }, props)}
    />
  )
});

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
  FileField,
  DateField
};
