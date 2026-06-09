import React from 'react';
import { useEffect } from 'react';
import { generateUUID } from './utils';
import { getFormInstance } from './state';
import { DEFAULT_CONFIG, FIELD_EVENTS } from './constants';
import { useVGSCollectFormState } from './formStateProvider';
import {
  IVGSCollectTextField,
  IVGSCollectCardholderField,
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
  VGSCollectStateParams
} from './types/Form';

import { VGSCollectKeyboardEventData, VGSCollectFocusEventData } from './types/Field';

type GeneralFieldProps = {
  className: string;
  onFocus: (info: VGSCollectFocusEventData) => void;
  onBlur: (info: VGSCollectFocusEventData) => void;
  onUpdate: (state: VGSCollectStateParams) => void;
  onDelete: () => void;
  onKeyUp: (info: VGSCollectKeyboardEventData) => void;
  onKeyDown: (info: VGSCollectKeyboardEventData) => void;
  onKeyPress: (info: VGSCollectKeyboardEventData) => void;
};

type FieldMaskProps = {
  mask?: string;
  maskChar?: string | null;
  formatChars?: Record<string, string>;
};

type CollectFieldProps<T> = Partial<T & GeneralFieldProps>;
type MaskedCollectFieldProps<T> = Partial<T & GeneralFieldProps & FieldMaskProps>;

const MASK_SUPPORTED_FIELD_TYPES = ['text', 'textarea', 'password', 'ssn'];

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
    mask,
    maskChar,
    formatChars,
    ...fieldPropsRaw
  } = props;

  const fieldProps = {
    ...fieldPropsRaw,
    ...(style && { css: style }) //Add css, if style exists
  };

  if (!props.name) {
    throw new Error(`@vgs/collect-js-react: name attribute for ${props.type} is required.`);
  }

  const hasMask = typeof mask !== 'undefined';
  const hasMaskOptions = typeof maskChar !== 'undefined' || typeof formatChars !== 'undefined';

  if (!hasMask && hasMaskOptions) {
    throw new Error('@vgs/collect-js-react: mask field prop is required when maskChar or formatChars is provided.');
  }

  if (hasMask && !MASK_SUPPORTED_FIELD_TYPES.includes(props.type)) {
    throw new Error(`@vgs/collect-js-react: mask field prop is not supported for ${props.type} fields.`);
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
  const [formState] = useVGSCollectFormState();
  const eventsToListen = Object.keys(events).filter((e) => events[e] !== undefined);

  useEffect(() => {
    const collectFormInstance = getFormInstance() as IVGSCollectForm;

    if (Object.keys(collectFormInstance).length !== 0 && formState?.formCreated === true) {
      const secureField = collectFormInstance.field(`#${fieldId}`, fieldProps);

      if (hasMask) {
        secureField.mask(mask, maskChar ?? null, formatChars);
      }

      eventsToListen.forEach((event) => {
        secureField.on(FIELD_EVENTS[event], (info) => {
          events[event](info);
        });
      });

      return () => {
        try {
          secureField?.delete?.();
        } catch (error) {
          if (
            !(error instanceof Error) ||
            (error instanceof Error && error.message !== `The field '${fieldProps?.name}' is already deleted`)
          ) {
            throw error;
          }
        }
        eventsToListen.forEach((event) => {
          secureField.off(FIELD_EVENTS[event], (info) => {
            events[event](info);
          });
        });
      };
    }
  }, [formState?.formCreated]);

  return (
    <div
      className={`vgs-collect-iframe-wr ${className ? className : ''}`}
      id={fieldId}
      data-testid='vgs-collect-field-wrapper'
    />
  );
}

const TextField = React.memo((props: MaskedCollectFieldProps<IVGSCollectTextField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.TEXT
        },
        props
      )}
    />
  );
});

const CardholderField = React.memo((props: MaskedCollectFieldProps<IVGSCollectCardholderField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.CARDHOLDER
        },
        props
      )}
    />
  );
});

const CardNumberField = React.memo((props: CollectFieldProps<IVGSCollectCardNumberField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.CARD_NUMBER
        },
        props
      )}
    />
  );
});

const CardExpirationDateField = React.memo((props: CollectFieldProps<IVGSCollectCardExpirationField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.CARD_EXPIRATION_DATE
        },
        props
      )}
    />
  );
});

const CardSecurityCodeField = React.memo((props: CollectFieldProps<IVGSCollectCardCVCField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.CARD_SECURITY_CODE
        },
        props
      )}
    />
  );
});

const PasswordField = React.memo((props: MaskedCollectFieldProps<IVGSCollectPasswordField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.PASSWORD
        },
        props
      )}
    />
  );
});

const SSNField = React.memo((props: MaskedCollectFieldProps<IVGSCollectSSNField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.SSN
        },
        props
      )}
    />
  );
});

const ZipCodeField = React.memo((props: CollectFieldProps<IVGSCollectZipCodeField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.ZIP_CODE
        },
        props
      )}
    />
  );
});

const TextareaField = React.memo((props: MaskedCollectFieldProps<IVGSCollectTextareaField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.TEXTAREA
        },
        props
      )}
    />
  );
});

const NumberField = React.memo((props: CollectFieldProps<IVGSCollectNumberField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.NUMBER
        },
        props
      )}
    />
  );
});

const DateField = React.memo((props: CollectFieldProps<IVGSCollectDateField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.DATE
        },
        props
      )}
    />
  );
});

const FileField = React.memo((props: CollectFieldProps<IVGSCollectFileField>) => {
  return (
    <RenderField
      {...Object.assign(
        {
          ...DEFAULT_CONFIG.FILE
        },
        props
      )}
    />
  );
});

export {
  TextField,
  CardholderField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  SSNField,
  ZipCodeField,
  TextareaField,
  NumberField,
  FileField,
  DateField,
  getFormInstance
};
