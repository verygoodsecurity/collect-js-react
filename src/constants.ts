import { setDefaultName } from "./utils";

const DEFAULT_CONFIG = {
  TEXT: {
    type: "text",
    name: setDefaultName("text"),
    placeholder: "Cardholder Name",
  },
  CARD_NUMBER: {
    type: "card-number",
    name: setDefaultName("card-number"),
    placeholder: "Credit Card Number",
  },
  CARD_EXPIRATION_DATE: {
    type: "card-expiration-date",
    name: setDefaultName("card-expiration-date"),
    placeholder: "Card Expiration Date"
  },
  CARD_SECURITY_CODE: {
    type: "card-security-code",
    name: setDefaultName("card-security-code"),
    placeholder: "CVC/CVV",
  },
  PASSWORD: {
    type: "password",
    name: setDefaultName("password"),
    placeholder: "Enter password",
  },
  SSN: {
    type: "ssn",
    name: setDefaultName("ssn"),
    placeholder: "SSN",
  },
  ZIP_CODE: {
    type: "zip-code",
    name: setDefaultName("zip-code"),
    placeholder: "Zip Code",
  },
  TEXTAREA: {
    type: "textarea",
    name: setDefaultName("textarea"),
    placeholder: "Comment",
  },
  NUMBER: {
    type: "number",
    name: setDefaultName("number"),
    placeholder: "Number",
  }
};

export { DEFAULT_CONFIG };