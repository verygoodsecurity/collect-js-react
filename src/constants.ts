import { setDefaultName } from "./utils";

const FIELD_EVENTS = {
  onFocus: 'focus',
  onBlur: 'blur',
  onUpdate: 'update',
  onDelete: 'delete',
  onKeyUp: 'keyup',
  onKeyDown: 'keydown',
  onKeyPress: 'keypress'
}

const DEFAULT_CONFIG = {
  TEXT: {
    type: "text",
    placeholder: "Cardholder Name",
    getName: () => setDefaultName("text"),
  },
  CARD_NUMBER: {
    type: "card-number",
    placeholder: "Credit Card Number",
    getName: () => setDefaultName("card-number"),
  },
  CARD_EXPIRATION_DATE: {
    type: "card-expiration-date",
    placeholder: "Card Expiration Date",
    getName: () => setDefaultName("card-expiration-date")
  },
  CARD_SECURITY_CODE: {
    type: "card-security-code",
    placeholder: "CVC/CVV",
    getName: () => setDefaultName("card-security-code")
  },
  PASSWORD: {
    type: "password",
    placeholder: "Enter password",
    getName: () => setDefaultName("password")
  },
  SSN: {
    type: "ssn",
    placeholder: "SSN",
    getName: () => setDefaultName("ssn")
  },
  ZIP_CODE: {
    type: "zip-code",
    placeholder: "Zip Code",
    getName: () => setDefaultName("zip-code")
  },
  TEXTAREA: {
    type: "textarea",
    placeholder: "Comment",
    getName: () => setDefaultName("textarea")
  },
  NUMBER: {
    type: "number",
    placeholder: "Number",
    getName: () => setDefaultName("number")
  }
};

export { DEFAULT_CONFIG, FIELD_EVENTS };