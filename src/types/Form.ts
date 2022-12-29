import {
  IVGSCollectFieldInstance,
  ClassMap,
  VGSCollectFieldType
} from './Field';
import { HttpStatusCode as VGSCollectHttpStatusCode } from './HttpStatusCode';

declare global {
  interface Window {
    VGSCollect: IVGSCollect;
  }
  interface Crypto {
    randomUUID: () => string;
  }
}

type VGSCollectVaultEnvironment = 'sandbox' | 'live' | 'live-eu-1';
/**
 * Available options for .field() method configuration
 */
type BooleanValue = boolean | 'true' | 'false';
type YearLength = '2' | '4' | 2 | 4;

/**
 * Available options for .submit() method
 */
type SubmitMethod = 'post' | 'patch' | 'put' | 'delete' | 'get';
type SubmitSerializer = 'deep' | 'flat';
type SubmitSerialization = 'json' | 'formData';
type SubmitMapDotToObject = BooleanValue | 'merge' | 'mergeArray';

type InputMode =
  | 'none'
  | 'text'
  | 'decimal'
  | 'numeric'
  | 'tel'
  | 'search'
  | 'email'
  | 'url';

// Available types for Tokenization flow
type StorageTypes = 'PERSISTENT' | 'VOLATILE';
type TokenFormats =
  | 'FPE_ACC_NUM_T_FOUR'
  | 'FPE_ALPHANUMERIC_ACC_NUM_T_FOUR'
  | 'FPE_SIX_T_FOUR'
  | 'FPE_SSN_T_FOUR'
  | 'FPE_T_FOUR'
  | 'RAW_UUID'
  | 'UUID'
  | 'NUM_LENGTH_PRESERVING'
  | 'PFPT';
/**
 * Available options for the form .on() method
 */
type FormEventTypes = 'enterPress';

interface ICollectFormProps {
  vaultId: string;
  environment: VGSCollectVaultEnvironment;
  submitParameters?: any;
  action?: string;
  cname?: string;
  tokenizationAPI?: boolean;
  children?: JSX.Element[] | JSX.Element;
  onUpdateCallback?: (state: VGSCollectFormState | null) => void;
  onSubmitCallback?: (status: any, resp: any) => void;
  onErrorCalback?: (errors: any) => void;
}

interface VGSCollectStateParams {
  name: string;
  errorMessages: string[];
  isDirty: boolean;
  isTouched: boolean;
  isFocused: boolean;
  isValid: boolean;
  isEmpty: boolean;
  last4?: string;
  bin?: string;
  cardType?: string;
  errors?: any[];
}

type VGSCollectFormState = Record<string, VGSCollectStateParams> | null;

interface IFieldTokenization {
  format?: TokenFormats;
  storage?: StorageTypes;
}

interface IDefaultFieldOptions {
  type: VGSCollectFieldType;
  name: string;
  validations?: string[];
  css?: Record<string, any>;
  successColor?: string;
  errorColor?: string;
  classes?: ClassMap;
  serializers?: any;
  autoComplete?: string;
  placeholder?: string;
  autoFocus?: BooleanValue;
  disabled?: BooleanValue;
  ariaLabel?: string;
  readonly?: BooleanValue;
  inputMode?: InputMode;
  tokenization?: IFieldTokenization | boolean;
}

type FieldConfig =
  | IVGSCollectTextField
  | IVGSCollectCardNumberField
  | IVGSCollectCardExpirationField
  | IVGSCollectCardCVCField
  | IVGSCollectSSNField
  | IVGSCollectZipCodeField
  | IVGSCollectPasswordField
  | IVGSCollectNumberField
  | IVGSCollectTextareaField;

interface IVGSCollectTextField extends IDefaultFieldOptions {
  type: 'text';
  min?: number;
  max?: number;
  maxLength?: number;
  step?: number;
  hideValue?: BooleanValue;
}

interface IVGSCollectCardNumberField extends IDefaultFieldOptions {
  type: 'card-number';
  icons?: Record<string, string>;
  showCardIcon?: boolean | Record<string, any>;
  addCardBrands?: Array<CardInfo>;
  validCardBrands: Array<Partial<CardInfo>>;
  hideValue?: BooleanValue;
}

interface IVGSCollectCardExpirationField extends IDefaultFieldOptions {
  type: 'card-expiration-date';
  yearLength?: YearLength;
  separator?: string;
  hideValue?: BooleanValue;
}

interface IVGSCollectCardCVCField extends IDefaultFieldOptions {
  type: 'card-security-code';
  showCardIcon?: boolean | object;
  icons?: Record<string, string>;
  hideValue?: BooleanValue;
}

interface IVGSCollectSSNField extends IDefaultFieldOptions {
  type: 'ssn';
  hideValue?: BooleanValue;
}

interface IVGSCollectZipCodeField extends IDefaultFieldOptions {
  type: 'zip-code';
  hideValue?: BooleanValue;
}

interface IVGSCollectPasswordField extends IDefaultFieldOptions {
  type: 'password';
  hideValue?: BooleanValue;
}

interface IVGSCollectNumberField extends IDefaultFieldOptions {
  type: 'number';
  hideValue?: BooleanValue;
}

interface IVGSCollectTextareaField extends IDefaultFieldOptions {
  type: 'textarea';
  min?: number;
  max?: number;
  maxLength?: number;
  step?: number;
  hideValue?: BooleanValue;
}

interface CardInfo {
  type: string;
  pattern: RegExp;
  format?: RegExp;
  length?: number[];
  cvvLength?: number[];
  luhn?: Boolean;
}

interface VGSCollectSubmitOptions {
  data: object | ((values: any) => any);
  headers: object;
  method: SubmitMethod;
  serailizer: SubmitSerializer;
  serialization: SubmitSerialization;
  mapDotToObject: SubmitMapDotToObject;
  withCredentials: BooleanValue;
}

interface IVGSCollectForm {
  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-formfield
   */
  field(selector: string, options: FieldConfig): IVGSCollectFieldInstance;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fieldon
   *       https://www.verygoodsecurity.com/docs/api/collect/#api-fieldoff
   */
  on(event: FormEventTypes, callback: (info: { name: string }) => void): void;
  off(event: FormEventTypes, callback: () => void): void;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-formsubmit
   */
  submit(
    path: string,
    options: Partial<VGSCollectSubmitOptions>,
    successCallback?: (
      status: VGSCollectHttpStatusCode | null,
      data: any
    ) => any,
    errorCallback?: (error: VGSCollectFormState) => any
  ): any;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-formtokenize
   */
  tokenize(
    successCallback: (
      status: VGSCollectHttpStatusCode | null,
      data: any
    ) => any,
    errorCallback: (error: VGSCollectFormState) => any
  ): any;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fieldreset
   */
  reset(): any;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-formunmount
   */
  unmount(): void;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/vgs-collect/js/cookbook#how-to-integrate-vgs-collectjs-with-vgs-satellite
   */
  connectSatellite(port: number): any;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/vgs-collect/js/integration#vgs-collect-with-cname
   */
  useCname(cname: string): void;
}

interface IVGSCollect {
  create(
    vaultId: string,
    environment: string,
    stateCallback?: (state: VGSCollectFormState) => void
  ): any;
}

type ICollectFieldAlias = {
  __type: string;
  elementIndex: any;
  key: string;
};

interface ICollectFormPayloadStructure {
  [key: string]: ICollectFieldAlias;
}

export type {
  IVGSCollect,
  IVGSCollectForm,
  IVGSCollectTextField,
  IVGSCollectCardNumberField,
  IVGSCollectCardExpirationField,
  IVGSCollectCardCVCField,
  IVGSCollectSSNField,
  IVGSCollectZipCodeField,
  IVGSCollectPasswordField,
  IVGSCollectNumberField,
  IVGSCollectTextareaField,
  ICollectFormProps,
  ICollectFormPayloadStructure,
  VGSCollectFormState,
  VGSCollectStateParams,
  VGSCollectVaultEnvironment,
  VGSCollectHttpStatusCode
};
