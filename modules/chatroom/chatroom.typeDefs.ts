import { gql } from 'apollo-server';

export default gql`
  type ChatRoom {
    id: ID!
    type: String!
    event: EventMainInfo!
    participants: [SessionUser!]!
    messages: [Message!]!
    isArchived: Boolean!
    createdAt: String!
  }

  type Message {
    id: ID!
    sender: SessionUser!
    content: String!
    files: [String]
    readBy: [SessionUser!]!
    sentAt: String!
  }

  input MessageInput {
    content: String!
    files: [String]
  }

  type Query {
    getChatRoomByEventId(eventId: ID!): [ChatRoom!]!
    getChatRoomById(chatRoomId: ID!): ChatRoom!
  }

  type Mutation {
    createChatRoom(eventId: ID!): ChatRoom!
    setChatRoomArchiveStatus(chatRoomId: ID!, isArchived: Boolean!): ChatRoom!
    sendMessage(chatRoomId: ID!, message: MessageInput!): Message!
    markMessageAsRead(chatRoomId: ID!, messageId: ID!): Message!
  }
`;
