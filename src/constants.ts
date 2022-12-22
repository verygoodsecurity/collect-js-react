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
  CARD_NUMBER: {
    type: 'card-number',
    placeholder: 'Credit Card Number'
  },
  CARD_EXPIRATION_DATE: {
    type: 'card-expiration-date',
    placeholder: 'Card Expiration Date'
  },
  CARD_SECURITY_CODE: {
    type: 'card-security-code',
    placeholder: 'CVC/CVV'
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
  }
};

export { DEFAULT_CONFIG, FIELD_EVENTS };
