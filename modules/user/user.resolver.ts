import {
  AuthenticationError,
  ApolloError,
  UserInputError
} from 'apollo-server';

import UserService from './user.service';
import {
  createUserSchema,
  updateUserSchema
} from '../../middleware/validator.middleware';
import { ContextType, CreateUserInput, UpdateUserInput } from '../../types';

export default {
  Mutation: {
    async createUser(
      _: {},
      { createUserInput }: { createUserInput: CreateUserInput },
      __: ContextType
    ) {
      try {
        await createUserSchema.validate(createUserInput, { abortEarly: false });

        const savedUser = await UserService.createUser(createUserInput);

        return {
          id: savedUser._id,
          ...savedUser.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'USER_CREATION_ERROR');
      }
    },
    async updateUser(
      _: {},
      { updateUserInput }: { updateUserInput: UpdateUserInput },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        await updateUserSchema.validate(updateUserInput, { abortEarly: false });

        const updatedUser = await UserService.updateUser(
          authUser.email,
          updateUserInput
        );

        return {
          id: updatedUser._id,
          ...updatedUser.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'USER_UPDATE_ERROR');
      }
    },
    async setUserArchiveStatus(
      _: {},
      {
        isArchived
      }: {
        isArchived: boolean;
      },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const archivedUser = await UserService.setUserArchiveStatus(
          authUser.email,
          isArchived
        );

        return {
          id: archivedUser._id,
          ...archivedUser.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'USER_ARCHIVE_STATUS_ERROR');
      }
    }
  },
  Query: {
    getProfile: async (_: {}, __: {}, ctx: ContextType) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const user = await UserService.getActiveUserByEmail(authUser.email);

        if (!user) {
          throw new UserInputError('User not found');
        }

        return {
          id: user._id,
          ...user.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'USER_PROFILE_ERROR');
      }
    },
    getUserById: async (
      _: {},
      { userId }: { userId: string },
      ctx: ContextType
    ) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const user = await UserService.getActiveUserById(userId);

        if (!user) {
          throw new UserInputError('User not found');
        }

        return {
          id: user._id,
          ...user.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'USER_BY_ID_ERROR');
      }
    }
  }
};
