// I don;t like this solution, we need to improve it 
let form = {}

const setFormState = (newVal:any) => {
  form = newVal
}

const getFormState = () => form

export {
  setFormState,
  getFormState,
}