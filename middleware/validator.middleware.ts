import { object, ref, string } from 'yup';

export const signUpSchema = object({
  email: string().email().required(),
  password: string().min(8).required(),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .required(),
  firstName: string().required(),
  lastName: string().required()
});

export const loginSchema = object({
  email: string().email().required(),
  password: string().min(8).required()
});
