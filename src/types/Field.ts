type FieldState =
  | 'dirty'
  | 'empty'
  | 'valid'
  | 'invalid'
  | 'focused'
  | 'touched';
export type VGSCollectFieldType =
  | 'text'
  | 'card-number'
  | 'card-expiration-date'
  | 'card-security-code'
  | 'ssn'
  | 'zip-code'
  | 'file'
  | 'password'
  | 'number'
  | 'checkbox'
  | 'radio'
  | 'dropdown'
  | 'textarea'
  | 'date';
export type ClassMap = Partial<Record<FieldState, string>>;

type VGSCollectKeyboardEventData<T = 'keydown' | 'keypress' | 'keyup'> = {
  type: T;
  timeStamp: number;
  isTrusted: boolean;
  key: string | null;
  keyCode: number | null;
  which: number | null;
  metaKey: boolean;
  ctrlKey: boolean;
  valueHidden: boolean;
  keyIndex: number;
};

type VGSCollectFocusEventData<T = 'focus' | 'blur'> = {
  type: T;
  timeStamp: number;
  isTrusted: boolean;
};

interface IVGSCollectFieldInstance {
  classes: ClassMap;
  container: HTMLElement;
  debugId: string;
  env: string;
  fieldId: string;
  formId: string;
  name: string;
  tnt: string;
  type: VGSCollectFieldType;
  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fieldon
   */
  on(
    eventType: 'keydown',
    callback: (event: VGSCollectKeyboardEventData<'keydown'>) => void
  ): void;
  on(
    eventType: 'keypress',
    callback: (event: VGSCollectKeyboardEventData<'keypress'>) => void
  ): void;
  on(
    eventType: 'keyup',
    callback: (event: VGSCollectKeyboardEventData<'keyup'>) => void
  ): void;
  on(eventType: 'delete', callback: () => void): void;
  on(eventType: 'update', callback: (fieldState: any) => void): void;
  on(
    eventType: 'focus',
    callback: (event: VGSCollectFocusEventData<'focus'>) => void
  ): void;
  on(
    eventType: 'blur',
    callback: (event: VGSCollectFocusEventData<'blur'>) => void
  ): void;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fieldoff
   */
  off(
    eventType: 'keydown',
    callback: (event: VGSCollectKeyboardEventData<'keydown'>) => void
  ): void;
  off(
    eventType: 'keypress',
    callback: (event: VGSCollectKeyboardEventData<'keypress'>) => void
  ): void;
  off(
    eventType: 'keyup',
    callback: (event: VGSCollectKeyboardEventData<'keyup'>) => void
  ): void;
  off(eventType: 'delete', callback: () => void): void;
  off(eventType: 'update', callback: (fieldState: any) => void): void;
  off(
    eventType: 'focus',
    callback: (event: VGSCollectFocusEventData<'focus'>) => void
  ): void;
  off(
    eventType: 'blur',
    callback: (event: VGSCollectFocusEventData<'blur'>) => void
  ): void;
  off(eventType: 'update', callback: (fieldState: any) => void): void;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fieldoff
   */
  update(params: any): void;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fieldreset
   */
  reset(): void;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fielddelete
   */
  delete(): void;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fieldmask
   */
  mask(mask: string, maskChar: string, formatChar: string): void;

  /**
   * Docs: https://www.verygoodsecurity.com/docs/api/collect/#api-fieldreplacepattern
   */
  replacePattern(regExpString: string, newSubStr: string): void;
}

export type {
  VGSCollectKeyboardEventData,
  VGSCollectFocusEventData,
  IVGSCollectFieldInstance
};
