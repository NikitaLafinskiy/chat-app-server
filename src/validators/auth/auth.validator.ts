import * as yup from 'yup';

export const registerValidator = yup.object().shape({
  username: yup
    .string()
    .required('The username field is required')
    .min(1)
    .max(30),
  password: yup
    .string()
    .required('The password field is required')
    .min(5)
    .max(100),
});
