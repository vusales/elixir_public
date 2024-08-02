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

const userInfoSchema = yup.object().shape({
    name: yup.string().max(32).required(), 
    surName: yup.string().max(32).required(), 
    phone: yup.string()
    .min(9)
    .required(), 
    email: yup.string().email().required(), 
});

export default userInfoSchema ;