
import { IVGSCollectForm } from './types/Form';

let form = {} as IVGSCollectForm;
let formFields: string[] = [];

const setFormInstance = (newVal: IVGSCollectForm) => {
  form = newVal;
}

const getFormInstance = () => form;

const addFieldName = (name: string) => {
  formFields.push(name);
}
const getFieldsName = () => formFields;

export {
  setFormInstance,
  getFormInstance,
  getFieldsName,
  addFieldName,
};