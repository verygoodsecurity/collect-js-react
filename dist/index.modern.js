import React, { useEffect } from 'react';

let form = {};
const setFormState = newVal => {
  form = newVal;
};
const getFormState = () => form;

const CollectForm = props => {
  const {
    vaultId,
    environment,
    submitParameters
  } = props;
  const form = window.VGSCollect.create(vaultId, environment, state => {
    props.onUpdateCallback(state);
  });
  setFormState(form);
  const submitHandler = event => {
    event.preventDefault();
    const form = getFormState();
    form.submit("/post", submitParameters, (status, resp) => {
      props.onSubmitCallback(status, resp);
    });
  };
  return React.createElement("form", {
    onSubmit: event => {
      submitHandler(event);
    }
  }, props.children);
};

const RenderField = props => {
  const {
    id,
    name,
    placeholder,
    validations,
    css,
    successColor
  } = props;
  const {
    type
  } = props;
  useEffect(() => {
    const form = getFormState();
    form.field(`#${id}`, {
      type,
      name,
      validations,
      placeholder,
      css,
      successColor
    });
  }, []);
  return React.createElement("div", {
    id: id
  });
};
const TextField = props => {
  let defaultParams = {
    type: "text"
  };
  return React.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
const CardNumberField = props => {
  let defaultParams = {
    type: "card-number"
  };
  return React.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
const CardExpirationDateField = props => {
  let defaultParams = {
    type: "card-expiration-date"
  };
  return React.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
const CardSecurityCodeField = props => {
  let defaultParams = {
    type: "card-security-code"
  };
  return React.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
const PasswordField = props => {
  let defaultParams = {
    type: "password"
  };
  return React.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
const TextareaField = props => {
  let defaultParams = {
    type: "textarea"
  };
  return React.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};

export { CardExpirationDateField, CardNumberField, CardSecurityCodeField, CollectForm, PasswordField, TextField, TextareaField };
//# sourceMappingURL=index.modern.js.map
