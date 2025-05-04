import { gql } from 'apollo-server';

export default gql`
  scalar DateTime
  enum Role {
    admin
    member
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

  # Query and Mutation
  type Mutation {
    # User
    createUser(createUserInput: CreateUserInput): User!
    updateUser(updateUserInput: UpdateUserInput): User!
    archiveUser: User!
    unarchiveUser: User!
    # Organizer
    createOrganizer(organizerInput: OrganizerInput): Organizer!
    updateOrganizer(orgId: ID!, organizerInput: OrganizerInput): Organizer!
    archiveOrganizer(orgId: ID!): Organizer!
    unarchiveOrganizer(orgId: ID!): Organizer!
    addMember(orgId: ID!, userId: ID!, role: Role): Organizer!
    updateMemberRole(orgId: ID!, userId: ID!, role: Role!): Organizer!
    removeMember(orgId: ID!, userId: ID!): Organizer!
  }
  type Query {
    # User
    getProfile: User!
    getUserById(userId: ID!): User!
    # Organizer
    getOrganizersByUser(userId: ID!): [Organizer!]!
    getOrganizerById(orgId: ID!): Organizer!
  }
`;
