import {
  ApolloError,
  AuthenticationError,
  UserInputError
} from 'apollo-server';
import ChatroomService from './chatroom.service';
import { messageSchema } from '../../middleware/validator.middleware';
import { ContextType, MessageInput } from '../../types';

export default {
  Mutation: {
    createChatRoom: async (
      _: {},
      {
        eventId
      }: {
        eventId: string;
      },
      ctx: ContextType
    ) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const savedChatRoom = await ChatroomService.createChatRoom(eventId);

        return {
          id: savedChatRoom._id,
          ...savedChatRoom.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'CHATROOM_CREATION_ERROR');
      }
    },
    setChatRoomArchiveStatus: async (
      _: {},
      {
        chatRoomId,
        isArchived
      }: {
        chatRoomId: string;
        isArchived: boolean;
      },
      ctx: ContextType
    ) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const updatedChatRoom = await ChatroomService.setChatRoomArchiveStatus(
          chatRoomId,
          isArchived
        );

        return {
          id: updatedChatRoom._id,
          ...updatedChatRoom.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'CHATROOM_ARCHIVE_ERROR');
      }
    },
    sendMessage: async (
      _: {},
      {
        chatRoomId,
        messageInput
      }: {
        chatRoomId: string;
        messageInput: MessageInput;
      },
      ctx: ContextType
    ) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        await messageSchema.validate(messageInput, {
          abortEarly: false
        });

        const newMessage = await ChatroomService.sendMessage(
          chatRoomId,
          authUser._id,
          messageInput
        );

        return {
          id: newMessage._id,
          ...newMessage.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'MESSAGE_SEND_ERROR');
      }
    },
    markMessageAsRead: async (
      _: {},
      {
        chatRoomId,
        messageId
      }: {
        chatRoomId: string;
        messageId: string;
      },
      ctx: ContextType
    ) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const updatedChatRoom = await ChatroomService.markMessageAsRead(
          chatRoomId,
          messageId,
          authUser._id
        );

        return {
          id: updatedChatRoom._id,
          ...updatedChatRoom.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'MESSAGE_READ_ERROR');
      }
    }
  },
  Query: {
    getChatRoomByEventId: async (
      _: {},
      {
        eventId
      }: {
        eventId: string;
      },
      ctx: ContextType
    ) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const chatRoom = await ChatroomService.getActiveChatRoomByEventId(
          eventId
        );

        return {
          id: chatRoom._id,
          ...chatRoom.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'CHATROOM_FETCH_ERROR');
      }
    },
    getChatRoomById: async (
      _: {},
      {
        chatRoomId
      }: {
        chatRoomId: string;
      },
      ctx: ContextType
    ) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const chatRoom = await ChatroomService.getActiveChatRoomById(
          chatRoomId
        );

        if (!chatRoom) {
          throw new UserInputError('Chat room not found');
        }

        return {
          id: chatRoom._id,
          ...chatRoom.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'CHATROOM_FETCH_ERROR');
      }
    }
  }
};
