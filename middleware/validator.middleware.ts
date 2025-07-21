import { array, object, string } from 'yup';

// User schema
export const createUserSchema = object({
  email: string().email().required(),
  firstName: string().required(),
  lastName: string().required()
});

export const updateUserSchema = object({
  firstName: string(),
  lastName: string(),
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

// Event schema
export const eventSchema = object({
  title: string().required(),
  description: string().required(),
  location: string().required(),
  difficultyLevel: string().nullable(),
  trailLengthKm: string().nullable(),
  elevationGainM: string().nullable(),
  maxParticipants: string().nullable(),
  dates: object({
    start: string().required(),
    end: string().required()
  }).required(),
  price: string().nullable(),
  itinerary: string().nullable(),
  thumbnail: string().nullable(),
  photos: array().of(string().url()).nullable().required()
});

export const messageSchema = object({
  content: string().required(),
  files: array().of(string().url()).nullable()
});
