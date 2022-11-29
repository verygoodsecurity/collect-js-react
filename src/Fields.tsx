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
    // successColor,
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
  
  return(
    <div className={`collect-iframe-wr ${className}`} id={id}></div>
  )
}


const TextField = (props: ITextField) => {
  const defaultParams = { 
    type: "text",
    name: "text",
    placeholder: "Any text",
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
    placeholder: "4111 1111 1111 1111",
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
    placeholder: `12 / ${new Date().getFullYear() + 3}`
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
    placeholder: "123",
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
    placeholder: "Password",
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
    placeholder: "Text",
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
  TextareaField,
  NumberField,
}