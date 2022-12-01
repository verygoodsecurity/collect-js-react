// I don;t like this solution, we need to improve it 

let form: any = {}
let formFields: any = []

const setFormInstance = (newVal:any) => {
  form = newVal
}
const getFormInstance = () => form

const addFieldName = (name: string) => {
  formFields.push(name)
}
const getFieldsName = () => formFields

export {
  setFormInstance,
  getFormInstance,
  getFieldsName,
  addFieldName,
}