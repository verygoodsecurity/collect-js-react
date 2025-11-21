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
    placeholder: 'Cardholder Name'
  },
  CARDHOLDER: {
    type: 'text',
    placeholder: 'Cardholder',
    name: 'cardholder'
  },
  CARD_NUMBER: {
    type: 'card-number',
    name: 'pan',
    validations: ['required', 'validCardNumber'],
    placeholder: 'Credit Card Number'
  },
  CARD_EXPIRATION_DATE: {
    type: 'card-expiration-date',
    name: 'exp-date',
    placeholder: 'Card Expiration Date',
    yearLength: 2,
    validations: ['required', 'validCardExpirationDate']
  },
  CARD_SECURITY_CODE: {
    name: 'cvc',
    type: 'card-security-code',
    placeholder: 'CVC/CVV',
    validations: ['required', 'validCardSecurityCode']
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
