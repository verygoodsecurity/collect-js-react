import React from 'react';
import { useEffect } from "react";
import { getFormState } from "./state";
import {
  ITextField,
  ICardNumberField,
  ICardCVCField,
  ICardExpDateField,
  IPasswordField,
  ITextareaField,
  INumberField,
} from "./types/interfaces";

function RenderField(props: any) {
  const {
    placeholder,
    validations,
    css,
    name,
    type,
    className: className = ""
  } = props
  const id = `vgs-${window.crypto.randomUUID()}`

  useEffect(() => {
    const form: any = getFormState()
    form.field(`#${id}`, {
      type,
      name,
      validations,
      placeholder,
      css,
    })
  }, [])

  return (
    <div className={`collect-iframe-wr ${className}`} id={id}></div>
  )
}

const TextField = (props: ITextField) => {
  const defaultParams = {
    type: "text",
    name: "text",
    placeholder: "Cardholder Name",
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}

const CardNumberField = (props: ICardNumberField) => {
  const defaultParams = {
    type: "card-number",
    name: "card-number",
    placeholder: "Credit Card Number",
  }

  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}

const CardExpirationDateField = (props: ICardExpDateField) => {
  const defaultParams = {
    type: "card-expiration-date",
    name: "card-expiration-date",
    placeholder: "Card Expiration Date"
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}
const CardSecurityCodeField = (props: ICardCVCField) => {
  const defaultParams = {
    type: "card-security-code",
    name: "card-security-code",
    placeholder: "CVC/CVV",
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}
const PasswordField = (props: IPasswordField) => {
  const defaultParams = {
    type: "password",
    name: "password",
    placeholder: "Enter password",
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}

const SSNField = (props: IPasswordField) => {
  const defaultParams = {
    type: "ssn",
    name: "ssn",
    placeholder: "SSN",
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}

const ZipCodeField = (props: IPasswordField) => {
  const defaultParams = {
    type: "zip-code",
    name: "zip-code",
    placeholder: "Zip Code",
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}

const TextareaField = (props: ITextareaField) => {
  const defaultParams = {
    type: "textarea",
    name: "textarea",
    placeholder: "Comment",
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}

const NumberField = (props: INumberField) => {
  const defaultParams = {
    type: "number",
    name: "number",
    placeholder: "Number",
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}


export {
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  SSNField,
  ZipCodeField,
  TextareaField,
  NumberField,
}