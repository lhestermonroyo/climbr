export default `#graphql
  # Enums
  enum Role {
    admin
    member
  }
  # Types
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
  # Inputs
  input OrganizerInput {
    name: String!
    description: String
    logo: String
    cover: String
    phone: String
    email: String
    socials: SocialsInput!
  }

  # Queries
  type Query {
    getOrganizersByUser(userId: ID!): [Organizer!]!
    getOrganizerById(orgId: ID!): Organizer!
  }
  # Mutations
  type Mutation {
    createOrganizer(organizerInput: OrganizerInput): Organizer!
    updateOrganizer(orgId: ID!, organizerInput: OrganizerInput): Organizer!
    setOrganizerArchiveStatus(orgId: ID!, isArchived: Boolean): Organizer!
    addMember(orgId: ID!, userId: ID!, role: Role): Organizer!
    updateMemberRole(orgId: ID!, userId: ID!, role: Role!): Organizer!
    removeMember(orgId: ID!, userId: ID!): Organizer!
  }
`;
