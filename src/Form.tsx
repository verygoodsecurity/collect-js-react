import React from 'react'
import { setFormInstance, getFormInstance } from './state'
import {
  IVGSCollectForm,
  VGSCollectFormState,
  ICollectFormProps
} from './types/Form'

import {
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  SSNField,
  ZipCodeField,
  TextareaField,
  NumberField
} from './Fields'

import { useVGSState } from './provider'

export function VGSCollectForm(props: ICollectFormProps) {
  const {
    vaultId,
    environment = 'sandbox',
    action = '/',
    cname,
    submitParameters,
    onUpdateCallback,
    onSubmitCallback,
    children
  } = props

  const [, dispatch] = useVGSState()

  if (typeof window !== 'undefined' && window.VGSCollect) {
    const form: IVGSCollectForm = window.VGSCollect.create(
      vaultId,
      environment,
      (state: VGSCollectFormState) => {
        if (onUpdateCallback) {
          onUpdateCallback(state)
        }
        // @ts-ignore
        dispatch(form)
      }
    )

    if (cname) {
      form.useCname(cname)
    }
    setFormInstance(form)
  }

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()

    const form: IVGSCollectForm = getFormInstance()

    if (form) {
      form.submit(action, submitParameters, (status: any, resp: any) => {
        if (onSubmitCallback) {
          onSubmitCallback(status, resp)
        }
      })
    } else {
      throw new Error('@vgs/collect-js-react: VGS Collect form not found.')
    }
  }

  return (
    <form
      onSubmit={(event) => {
        submitHandler(event)
      }}
    >
      {children}
    </form>
  )
}

VGSCollectForm.TextField = TextField
VGSCollectForm.CardNumberField = CardNumberField
VGSCollectForm.CardExpirationDateField = CardExpirationDateField
VGSCollectForm.CardSecurityCodeField = CardSecurityCodeField
VGSCollectForm.PasswordField = PasswordField
VGSCollectForm.SSNField = SSNField
VGSCollectForm.ZipCodeField = ZipCodeField
VGSCollectForm.TextareaField = TextareaField
VGSCollectForm.NumberField = NumberField
