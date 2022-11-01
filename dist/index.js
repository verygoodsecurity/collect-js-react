function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var form = {};
var setFormState = function setFormState(newVal) {
  form = newVal;
};
var getFormState = function getFormState() {
  return form;
};

var CollectForm = function CollectForm(props) {
  var vaultId = props.vaultId,
    environment = props.environment,
    submitParameters = props.submitParameters;
  var form = window.VGSCollect.create(vaultId, environment, function (state) {
    props.onUpdateCallback(state);
  });
  setFormState(form);
  var submitHandler = function submitHandler(event) {
    event.preventDefault();
    var form = getFormState();
    form.submit("/post", submitParameters, function (status, resp) {
      props.onSubmitCallback(status, resp);
    });
  };
  return React__default.createElement("form", {
    onSubmit: function onSubmit(event) {
      submitHandler(event);
    }
  }, props.children);
};

var RenderField = function RenderField(props) {
  var id = props.id,
    name = props.name,
    placeholder = props.placeholder,
    validations = props.validations,
    css = props.css,
    successColor = props.successColor;
  var type = props.type;
  React.useEffect(function () {
    var form = getFormState();
    form.field("#" + id, {
      type: type,
      name: name,
      validations: validations,
      placeholder: placeholder,
      css: css,
      successColor: successColor
    });
  }, []);
  return React__default.createElement("div", {
    id: id
  });
};
var TextField = function TextField(props) {
  var defaultParams = {
    type: "text"
  };
  return React__default.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
var CardNumberField = function CardNumberField(props) {
  var defaultParams = {
    type: "card-number"
  };
  return React__default.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
var CardExpirationDateField = function CardExpirationDateField(props) {
  var defaultParams = {
    type: "card-expiration-date"
  };
  return React__default.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
var CardSecurityCodeField = function CardSecurityCodeField(props) {
  var defaultParams = {
    type: "card-security-code"
  };
  return React__default.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
var PasswordField = function PasswordField(props) {
  var defaultParams = {
    type: "password"
  };
  return React__default.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};
var TextareaField = function TextareaField(props) {
  var defaultParams = {
    type: "textarea"
  };
  return React__default.createElement(RenderField, Object.assign({}, Object.assign(defaultParams, props)));
};

exports.CardExpirationDateField = CardExpirationDateField;
exports.CardNumberField = CardNumberField;
exports.CardSecurityCodeField = CardSecurityCodeField;
exports.CollectForm = CollectForm;
exports.PasswordField = PasswordField;
exports.TextField = TextField;
exports.TextareaField = TextareaField;
//# sourceMappingURL=index.js.map
