import { gql } from 'apollo-server';

export default gql`
  enum Role {
    admin
    member
  }
  enum EventStatus {
    active
    cancelled
  }
  # Event
  type EventMainInfo {
    id: ID!
    organizer: OrganizerMainInfo!
    title: String!
    thumbnail: String
    dates: EventDates!
    status: EventStatus!
    createdAt: String
  }
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
    getEventsByOrganizer(orgId: ID!): [Event!]!
    getEventsByUser(userId: ID!): [Event!]!
    getEventById(eventId: ID!): Event!
  }
`;
