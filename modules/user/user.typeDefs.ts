export default `#graphql
  # Types
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
  # Inputs
  input CreateUserInput {
    email: String!
    firstName: String!
    lastName: String!
    avatar: String
  }
  input UpdateUserInput {
    firstName: String
    lastName: String
    pronouns: String
    location: String
    birthDate: String
    bio: String
    avatar: String
    socials: SocialsInput
  }
  input SocialsInput {
    facebook: String
    twitter: String
    tiktok: String
    instagram: String
    threads: String
    youtube: String
  }
  # Queries
  type Query {
    getProfile: User!
    getUserById(userId: ID!): User!
  }
  # Mutations
  type Mutation {
    createUser(createUserInput: CreateUserInput!): User!
    updateUser(updateUserInput: UpdateUserInput!): User!
    setUserArchiveStatus(isArchived: Boolean!): User!
  }
`;
