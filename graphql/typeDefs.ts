import { gql } from 'apollo-server';

export default gql`
  scalar DateTime
  enum Role {
    admin
    member
  }
  enum EventStatus {
    active
    cancelled
  }
  # User
  type SessionUser {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    avatar: String
  }
  type User {
    id: ID!
    email: String!
    phoneNumber: String
    firstName: String!
    lastName: String!
    pronouns: String
    location: String
    birthDate: String
    bio: String
    avatar: String
    socials: Socials
    isArchived: Boolean!
    createdAt: String!
  }
  type Socials {
    facebook: String
    twitter: String
    tiktok: String
    instagram: String
    threads: String
    youtube: String
  }

  input CreateUserInput {
    email: String!
    firstName: String!
    lastName: String!
    avatar: String
  }
  input UpdateUserInput {
    phoneNumber: String
    firstName: String!
    lastName: String!
    pronouns: String
    location: String
    birthDate: String
    bio: String
    avatar: String
    socials: SocialsInput!
  }
  input SocialsInput {
    facebook: String
    twitter: String
    tiktok: String
    instagram: String
    threads: String
    youtube: String
  }

  # Organizer
  type OrganizerMainInfo {
    id: ID!
    name: String!
    logo: String
    createdAt: String
  }
  type Organizer {
    id: ID!
    name: String!
    description: String
    logo: String
    cover: String
    phone: String
    email: String
    socials: Socials
    members: [Member!]!
    isArchived: Boolean!
    createdAt: String!
  }
  type Member {
    user: SessionUser!
    role: Role!
  }

  input OrganizerInput {
    name: String!
    description: String
    logo: String
    cover: String
    phone: String
    email: String
    socials: SocialsInput!
  }

  # Event
  type Event {
    id: ID!
    organizer: OrganizerMainInfo!
    title: String!
    description: String!
    location: String!
    difficultyLevel: String
    trailLengthKm: Float
    elevationGainM: Float
    maxParticipants: Int
    dates: EventDates!
    price: Float
    itinerary: String
    thumbnail: String
    photos: [String]
    joiners: [Joiner!]!
    status: String!
    isArchived: Boolean!
    createdAt: String!
  }
  type EventDates {
    start: String!
    end: String!
  }
  type Joiner {
    user: SessionUser!
    paid: Boolean!
    status: EventStatus!
    joinedAt: String!
  }
  input EventInput {
    title: String!
    description: String!
    location: String!
    difficultyLevel: String
    trailLengthKm: Float
    elevationGainM: Float
    maxParticipants: Int
    dates: EventDatesInput!
    price: Float
    itinerary: String
    thumbnail: String
    photos: [String]
  }
  input EventDatesInput {
    start: String!
    end: String!
  }

  # Query and Mutation
  type Mutation {
    # User
    createUser(createUserInput: CreateUserInput): User!
    updateUser(updateUserInput: UpdateUserInput): User!
    setUserArchiveStatus(isArchived: Boolean): User!
    # Organizer
    createOrganizer(organizerInput: OrganizerInput): Organizer!
    updateOrganizer(orgId: ID!, organizerInput: OrganizerInput): Organizer!
    setOrganizerArchiveStatus(orgId: ID!, isArchived: Boolean): Organizer!
    addMember(orgId: ID!, userId: ID!, role: Role): Organizer!
    updateMemberRole(orgId: ID!, userId: ID!, role: Role!): Organizer!
    removeMember(orgId: ID!, userId: ID!): Organizer!
    # Event
    createEvent(orgId: ID!, eventInput: EventInput): Event!
    updateEvent(eventId: ID!, eventInput: EventInput): Event!
    cancelEvent(eventId: ID!): Event!
    setEventArchiveStatus(eventId: ID!, isArchived: Boolean): Event!
    addJoiners(eventId: ID!, userIds: [ID!]!): Event!
    removeJoiners(eventId: ID!, userIds: [ID!]!): Event!
    updateJoinerStatus(eventId: ID!, userId: ID!, status: EventStatus!): Event!
    updateJoinerPayment(eventId: ID!, userId: ID!, paid: Boolean!): Event!
  }
  type Query {
    # User
    getProfile: User!
    getUserById(userId: ID!): User!
    # Organizer
    getOrganizersByUser(userId: ID!): [Organizer!]!
    getOrganizerById(orgId: ID!): Organizer!
    # Event
    getEventsByOrganizer(orgId: ID!): [Event!]!
    getEventsByUser(userId: ID!): [Event!]!
    getEventById(eventId: ID!): Event!
  }
`;
