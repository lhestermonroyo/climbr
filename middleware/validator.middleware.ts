import { object, string } from 'yup';

// User schema
export const createUserSchema = object({
  email: string().email().required(),
  firstName: string().required(),
  lastName: string().required()
});

export const updateUserSchema = object({
  phoneNumber: string().nullable(),
  firstName: string().required(),
  lastName: string().required(),
  pronouns: string().nullable(),
  location: string().nullable(),
  birthdate: string().nullable(),
  bio: string().nullable(),
  avatar: string().nullable(),
  socials: object({
    facebook: string().nullable(),
    twitter: string().nullable(),
    tiktok: string().nullable(),
    instagram: string().nullable(),
    threads: string().nullable(),
    youtube: string().nullable()
  }).required()
});

export const loginSchema = object({
  email: string().email().required(),
  password: string().min(8).required()
});

// Organizer schema
export const organizerSchema = object({
  name: string().required(),
  description: string().nullable(),
  logo: string().nullable(),
  cover: string().nullable(),
  phone: string().nullable(),
  email: string().email().nullable(),
  socials: object({
    facebook: string().nullable(),
    twitter: string().nullable(),
    tiktok: string().nullable(),
    instagram: string().nullable(),
    threads: string().nullable(),
    youtube: string().nullable()
  }).required()
});
