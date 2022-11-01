interface ITextField {
    id: string;
    name: string;
    validations: Array<string>;
    placeholder: string;
}
declare const TextField: (props: ITextField) => JSX.Element;
declare const CardNumberField: (props: any) => JSX.Element;
declare const CardExpirationDateField: (props: any) => JSX.Element;
declare const CardSecurityCodeField: (props: any) => JSX.Element;
declare const PasswordField: (props: any) => JSX.Element;
declare const TextareaField: (props: any) => JSX.Element;
export { TextField, CardNumberField, CardExpirationDateField, CardSecurityCodeField, PasswordField, TextareaField, };
