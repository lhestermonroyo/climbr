import { UserInputError, AuthenticationError } from 'apollo-server';

import User from '../../models/User';
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

        const { email, firstName, lastName, avatar } = createUserInput;

        const existingUser = await User.findOne({ email, isArchived: false });

        if (existingUser) {
          throw new UserInputError('User already exists');
        }

        const newUser = new User({
          email,
          firstName,
          lastName,
          avatar
        });
        const response = await newUser.save();

        return {
          id: response._id,
          ...response.toObject()
        };
      } catch (error) {
        console.log('Error creating user:', error);
        throw error;
      }
    },
    async updateUser(
      _: {},
      { updateUserInput }: { updateUserInput: UpdateUserInput },
      ctx: ContextType
    ) {
      try {
        await updateUserSchema.validate(updateUserInput, { abortEarly: false });

        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const user = await User.findOne({ email: authUser.email });

        if (!user) {
          throw new UserInputError('User not found');
        }

        Object.assign(user, {
          phoneNumber: updateUserInput.phoneNumber,
          firstName: updateUserInput.firstName,
          lastName: updateUserInput.lastName,
          pronouns: updateUserInput.pronouns,
          location: updateUserInput.location,
          birthdate: updateUserInput.birthdate,
          bio: updateUserInput.bio,
          avatar: updateUserInput.avatar
        });

        if (updateUserInput.socials) {
          user.socials = {
            ...user.socials,
            ...updateUserInput.socials
          };
        }

        const updatedUser = await user.save();

        return {
          id: updatedUser._id,
          ...updatedUser.toObject()
        };
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
    async archiveUser(_: {}, __: {}, ctx: ContextType) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new UserInputError('Unauthorized');
        }

        const user = await User.findOne({
          email: authUser.email
        });

        if (!user) {
          throw new UserInputError('User not found');
        }

        if (user.isArchived) {
          throw new UserInputError('User is already archived');
        }

        user.isArchived = true;
        await user.save();

        return {
          id: user._id,
          ...user.toObject()
        };
      } catch (error) {
        console.error('Error archiving user:', error);
        throw error;
      }
    },
    async unarchiveUser(_: {}, __: {}, ctx: ContextType) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new UserInputError('Unauthorized');
        }

        const user = await User.findOne({
          email: authUser.email
        });

        if (!user) {
          throw new UserInputError('User not found');
        }

        if (!user.isArchived) {
          throw new UserInputError('User is not archived');
        }

        user.isArchived = false;
        await user.save();

        return {
          id: user._id,
          ...user.toObject()
        };
      } catch (error) {
        console.error('Error unarchiving user:', error);
        throw error;
      }
    }
  },
  Query: {
    getProfile: async (_: {}, __: {}, ctx: ContextType) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new UserInputError('Unauthorized');
        }

        const user = await User.findOne({ email: authUser.email });

        if (!user) {
          throw new UserInputError('User not found');
        }

        return {
          id: user._id,
          ...user.toObject()
        };
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
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
          throw new UserInputError('Unauthorized');
        }

        const user = await User.findById(userId);
        if (!user) {
          throw new UserInputError('User not found');
        }
        return {
          id: user._id,
          ...user.toObject()
        };
      } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
      }
    }
  }
};
