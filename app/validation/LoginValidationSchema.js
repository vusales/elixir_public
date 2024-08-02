import * as yup from 'yup'; 


yup.setLocale({
    // use constant translation keys for messages without values
    mixed: {
      default: 'fieldinvalid',
    },
    // use functions to generate an error object that includes the value from the schema
    string: {
        required: ({ max }) => ({ key: 'required', values: { max } }) , 
        min: ({ min }) => ({ key: 'min', values: { min } }),
    }
});

const loginSchema = yup.object().shape({
    phoneNumber: yup.string()
    .min(9)
    .required(), 
    password: yup.string().min(8).required(),
});

export default loginSchema ;


// const phoneRegex = /^(\+?\d{0,3})?\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\(?\d{2}\)?)?$/;
// yup.string().when("isEmailValue", {
//     is: true , 
//     then: yup.string().email("Email duzgun deyil").required("Email ve ya nomre qeyd edin"),
//     otherwise: yup.string(phoneRegex , 'Please enter valid phone number' ).required('This field is required'),
// }), 