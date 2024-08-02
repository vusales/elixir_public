import * as yup from "yup"; 
import i18next from 'i18next';


yup.setLocale({
    // use constant translation keys for messages without values
    mixed: {
      default: 'fieldinvalid',
    },
    // use functions to generate an error object that includes the value from the schema
    string: {
        required: ({ max }) => ({ key: 'required', values: { max } }) , 
        min: ({ min }) => ({ key: 'min', values: { min } }),
        email : ({email}) => ({ key: 'mail', values: { email } }),
    }
});

const registerValidation =  yup.object().shape({
    name: yup.string().max(32).required(), 
    surname: yup.string().max(32).required(), 
    phone: yup.string()
    .min(9)
    .required(), 
    email: yup.string().max(32).email(), 
    password: yup.string().min(8).required(), 
    passwordAgain: yup.string().min(8).required(), 
    checkboxSelected: yup.bool().oneOf([true]),
}); 

export default registerValidation;