import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export type ContextType = ExpressContextFunctionArgument & {
  authUser: DecodedIdToken | null;
};

// User Types
export type UserType = {
  id: string;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  pronouns: string | null;
  location: string | null;
  birthdate: string | null;
  bio: string | null;
  avatar: string | null;
  socials: {
    facebook: string | null;
    twitter: string | null;
    tiktok: string | null;
    instagram: string | null;
    threads: string | null;
    youtube: string | null;
  };
  isArchived: boolean;
  createdAt: string;
};

export type SessionUser = Pick<
  UserType,
  'email' | 'firstName' | 'lastName' | 'avatar'
>;

export type CreateUserInput = Pick<
  UserType,
  'email' | 'firstName' | 'lastName' | 'avatar'
>;

export type UpdateUserInput = Omit<
  UserType,
  'id' | 'createdAt' | 'email' | 'isArchived'
>;

// Organizer Types
export type OrganizerType = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  cover: string | null;
  phone: string | null;
  email: string | null;
  socials: {
    facebook: string | null;
    twitter: string | null;
    tiktok: string | null;
    instagram: string | null;
    threads: string | null;
    youtube: string | null;
  };
  members: {
    user: SessionUser & {
      id: string;
    };
    role: RoleType;
  }[];
  isArchived: boolean;
  createdAt: string;
};

export type RoleType = 'admin' | 'editor';

export type OrganizerInput = Omit<
  OrganizerType,
  'id' | 'members' | 'createdAt'
>;
