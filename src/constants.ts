const FIELD_EVENTS = {
  onFocus: 'focus',
  onBlur: 'blur',
  onUpdate: 'update',
  onDelete: 'delete',
  onKeyUp: 'keyup',
  onKeyDown: 'keydown',
  onKeyPress: 'keypress'
};
const framework = 'react-wrapper'
const DEFAULT_CONFIG = {
  TEXT: {
    type: 'text',
    placeholder: 'Cardholder Name',
    framework,
  },
  CARD_NUMBER: {
    type: 'card-number',
    placeholder: 'Credit Card Number',
    framework,
  },
  CARD_EXPIRATION_DATE: {
    type: 'card-expiration-date',
    placeholder: 'Card Expiration Date',
    framework,
  },
  CARD_SECURITY_CODE: {
    type: 'card-security-code',
    placeholder: 'CVC/CVV',
    framework,
  },
  PASSWORD: {
    type: 'password',
    placeholder: 'Enter password',
    framework,
  },
  SSN: {
    type: 'ssn',
    placeholder: 'SSN',
    framework,
  },
  ZIP_CODE: {
    type: 'zip-code',
    placeholder: 'Zip Code',
    framework,
  },
  TEXTAREA: {
    type: 'textarea',
    placeholder: 'Comment',
    framework,
  },
  NUMBER: {
    type: 'number',
    placeholder: 'Number',
    framework,
  }
};

export { DEFAULT_CONFIG, FIELD_EVENTS };
