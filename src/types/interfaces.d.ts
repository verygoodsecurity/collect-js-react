declare global {
  interface Window {
    VGSCollect: ICollect;
  }
  interface Crypto {
    randomUUID: () => string;
  }
}
type YearLength = '2' | '4' | 2 | 4;
type VGSVaultEnvironments = 'sandbox' | 'live' | 'live-eu-1';

interface ICollect {
  create: Function;
}

interface ICollectFormProps {
  vaultId: string;
  environment: VGSVaultEnvironments;
  submitParameters?: any;
  action?: string;
  children?: JSX.Element[] | JSX.Element;
  onUpdateCallback?: (state: object) => void;
  onSubmitCallback?: (status: any, resp: any) => void;
}


interface IDedaultField {
  type?: string; // FieldType;
  name?: string;
  validations?: Array<string>;
  serializers?: any;
  css?: Record<string, any>;
  
  placeholder?: string;
  className?: string;
  hideValue?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  readonly?: string;
}
interface ITextField extends IDedaultField {
  
}

interface CardInfo {
  type: string;
  pattern: RegExp;
  format?: RegExp;
  length?: number[];
  cvvLength?: number[];
  luhn?: Boolean;
}

interface ICardNumberField extends IDedaultField {
  successColor?: string;
  errorColor?: string;
  autoComplete?: string;
  icons?: Record<string, string>;
  showCardIcon?: boolean | Record<string, any>;
  addCardBrands?: Array<CardInfo>;
}

interface ICardExpDateField extends IDedaultField {
  yearLength?: YearLength;
  separator?: string;
}

interface ICardCVCField extends IDedaultField {
  showCardIcon?: boolean | object;
}

interface IPasswordField extends IDedaultField {
  showCardIcon?: boolean | object;
}

interface ITextareaField extends IDedaultField {
  showCardIcon?: boolean | object;
}
interface INumberField extends IDedaultField {
  min?: number;
  max?: number;
  maxLength?: number;
  step?: number;
}
 

  //  * file specific properties
  //  */
  // multiple?: BooleanValue;
  // accept?: FileType[];
  // capture?: FileCapture;
  // maxFileSize?: number;
  // maxFiles?: number;
  // /**
  //  * text specific properties
  //  */

  // /**
  //  * card-expiration-date specific properties
  //  */

  // /**
  //  * checkbox specific properties
  //  */
  // value?: string;
  // /**
  //  * dropdown specific properties
  //  */
  // options?: string[];


export {
  ICollect,
  ICollectFormProps,
  ITextField,
  ICardNumberField,
  ICardExpDateField,
  ICardCVCField,
  IPasswordField,
  ITextareaField,
  INumberField, 
}