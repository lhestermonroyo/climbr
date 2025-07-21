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
  'id' | 'email' | 'firstName' | 'lastName' | 'avatar'
>;

export type CreateUserInput = Pick<
  UserType,
  'email' | 'firstName' | 'lastName' | 'avatar'
>;

export type UpdateUserInput = Partial<UserType>;

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
  members: MemberType[];
  isArchived: boolean;
  createdAt: string;
};

export type MemberType = {
  user: SessionUser;
  role: RoleType;
};

export type RoleType = 'admin' | 'editor';

export type OrganizerMainInfo = Pick<
  OrganizerType,
  'id' | 'name' | 'logo' | 'createdAt'
>;

export type OrganizerInput = Omit<
  OrganizerType,
  'id' | 'members' | 'isArchived' | 'createdAt'
>;

// Event Types
export type EventType = {
  id: string;
  organizer: OrganizerMainInfo;
  title: string;
  description: string;
  location: string;
  difficultyLevel: string | null;
  trailLengthKm: number | null;
  elevationGainM: number | null;
  maxParticipants: number | null;
  dates: {
    start: string;
    end: string;
  };
  price: number | null;
  itinerary: string | null;
  thumbnail: string | null;
  photos: string[] | null;
  joiners: Joiner[];
  status: EventStatus;
  isArchived: boolean;
  createdAt: string;
};

export type Joiner = {
  user: SessionUser;
  paid: boolean;
  status: EventStatus;
  joinedAt: string;
};

export type EventStatus = 'active' | 'cancelled';

export type EventMainInfo = Pick<
  EventType,
  'id' | 'organizer' | 'title' | 'thumbnail' | 'dates' | 'status' | 'createdAt'
>;

export type EventInput = Omit<
  EventType,
  'id' | 'organizer' | 'status' | 'joiners' | 'createdAt'
>;

// Chat Room Types
export type ChatRoomType = {
  id: string;
  event: EventMainInfo;
  joiners: SessionUser[];
  messages: MessageType[];
  isArchived: boolean;
  createdAt: string;
};

export type MessageType = {
  id: string;
  sender: SessionUser;
  content: string;
  files: string[] | null;
  readBy: SessionUser[];
  sentAt: string;
};

export type MessageInput = Pick<MessageType, 'content' | 'files'>;
