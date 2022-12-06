
import { IVGSCollectForm } from './types/Form';

let form = {} as IVGSCollectForm;

const setFormInstance = (newVal: IVGSCollectForm) => {
  form = newVal;
}

const getFormInstance = () => form;

export {
  setFormInstance,
  getFormInstance,
};