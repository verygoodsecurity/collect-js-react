import { getFieldsName, addFieldName } from "state";

const setDefaultName = (type: string) => {
  const fields = getFieldsName()
  
  const count = fields.filter((fieldName: string) => {
    return fieldName.startsWith(type)
  });
  addFieldName(type)
  return `${type}-${count.length + 1}`
}

export {
  setDefaultName
}