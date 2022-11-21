import React from 'react';
import { setFormState, getFormState } from "./state";
import { ICollect } from "./types/interfaces";


export const CollectForm = (props: any) => {
  const { vaultId, environment, submitParameters } = props
  
  const form: ICollect =  window.VGSCollect.create(vaultId, environment, (state: any) => {
    props.onUpdateCallback(state)
  }) 

  setFormState(form)

  const submitHandler = (event:any) => {
    event.preventDefault()
    const form: any = getFormState()
    form.submit("/post", submitParameters, (status: any, resp: any) => {
      props.onSubmitCallback(status, resp)
    })
  }
  return(
    <form onSubmit={(event) => {submitHandler(event)}}>
      {props.children}
    </form>
  )
}
