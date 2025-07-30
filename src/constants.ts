const FIELD_EVENTS = {
  onFocus: 'focus',
  onBlur: 'blur',
  onUpdate: 'update',
  onDelete: 'delete',
  onKeyUp: 'keyup',
  onKeyDown: 'keydown',
  onKeyPress: 'keypress'
};

const DEFAULT_CONFIG = {
  TEXT: {
    type: 'text',
    placeholder: 'Cardholder Name',
    defaultValue: 'Test Name'
  },
  CARDHOLDER: {
    type: 'text',
    placeholder: 'Cardholder',
    name: 'cardholder',
    // defaultValue: 'Cardholder'
  },
  CARD_NUMBER: {
    type: 'card-number',
    placeholder: 'Credit Card Number',
    name: 'pan',
    // defaultValue: '4111 1111 1111 1111'
  },
  CARD_EXPIRATION_DATE: {
    type: 'card-expiration-date',
    placeholder: 'Card Expiration Date',
    name: 'exp-date',
    // defaultValue: '12 / 2028'
  },
  CARD_SECURITY_CODE: {
    type: 'card-security-code',
    placeholder: 'CVC/CVV',
    name: 'cvc',
    // defaultValue: '123'
  },
  PASSWORD: {
    type: 'password',
    placeholder: 'Enter password'
  },
  SSN: {
    type: 'ssn',
    placeholder: 'SSN'
  },
  ZIP_CODE: {
    type: 'zip-code',
    placeholder: 'Zip Code'
  },
  TEXTAREA: {
    type: 'textarea',
    placeholder: 'Comment'
  },
  NUMBER: {
    type: 'number',
    placeholder: 'Number'
  },
  FILE: {
    type: 'file',
    placeholder: ''
  },
  DATE: {
    type: 'date',
    placeholder: ''
  }
};

export { DEFAULT_CONFIG, FIELD_EVENTS };
