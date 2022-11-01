import React from 'react';
import { useEffect } from "react";
import { getFormState } from "./state";

const RenderField = (props: any) => {
  const { id, name, placeholder, validations, css, successColor } = props
  const { type } = props
  useEffect(() => {
    const form: any = getFormState()
    form.field(`#${id}`, {
      type, 
      name,
      validations,
      placeholder,
      css,
      successColor
    })    
  }, [])
  
  return(
    <div id={id}></div>
  )
}
interface ITextField {
  id: string;

  name: string;
  validations: Array<string>;
  placeholder: string
}

const TextField = (props: ITextField) => {
  // const id = generateId()
  let defaultParams = {
    type: "text", 
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )
}

const CardNumberField = (props: any) => {
  // const id = generateId()
  let defaultParams = {
    type: "card-number", 
  }
  
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )  
}

const CardExpirationDateField = (props: any) => {
  let defaultParams = {
    type: "card-expiration-date", 
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )  
}
const CardSecurityCodeField = (props: any) => {
  let defaultParams = {
    type: "card-security-code", 
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )  
}
const PasswordField = (props: any) => {
  let defaultParams = {
    type: "password", 
  }
  return (
    <RenderField
      {...Object.assign(defaultParams, props)}
    />
  )  
}

const TextareaField = (props: any) => {
  let defaultParams = {
    type: "textarea", 
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
}