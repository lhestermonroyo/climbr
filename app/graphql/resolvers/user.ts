import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';

import UserService from '../../services/user.service';
import {
  validateSignIn,
  validateSignUp,
} from '../../middleware/validator.middleware';
import { checkAuth, generateToken } from '../../utils/auth.util';

export default {
  Query: {
    async getAllUsers(_, __, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        if (user.role !== 'admin') {
          throw new Error('Permission denied.');
        }

        const users = await UserService.getAllUsers();

        return users;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getUsersBy(_, { params }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        if (user.role !== 'admin') {
          throw new Error('Permission denied.');
        }

        const users = await UserService.getUsersBy({ ...params });

        return users;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getProfile(_, __, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const profile = await UserService.getUser({ username: user.username });
        delete profile.password;

        return profile;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async signUp(_, { payload }) {
      try {
        // validate the user input using the signUpValidator
        const { valid, errors } = validateSignUp(payload);

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }

        const response = await UserService.createUser({
          ...payload,
          password: bcrypt.hashSync(payload.password, 10),
        });

        if (response) {
          const user = await UserService.getUser({
            username: payload.username,
          });
          delete user.password;

          const token = generateToken(user);

          return {
            user,
            token,
          };
        }
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new UserInputError('Errors', {
            errors: {
              general: 'Email/username already exists.',
            },
          });
        }

        throw new Error(error.message);
      }
    },
    async signIn(_, { payload }) {
      try {
        const { valid, errors } = validateSignIn(payload);

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }

        const { username, password } = payload;
        const user = await UserService.getUser({ username });

        if (!user) {
          throw new UserInputError('Errors', {
            errors: {
              general: 'User not found.',
            },
          });
        }

        const match = await bcrypt.compareSync(password, user.password);

        if (!match) {
          throw new UserInputError('Errors', {
            errors: {
              general: 'Invalid credentials.',
            },
          });
        }
        delete user.password;

        const token = generateToken(user);

        return {
          user,
          token,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async updateProfile(_, { payload }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const response = await UserService.updateUser(payload, user.username);

        if (response) {
          const profile = await UserService.getUser({
            username: user.username,
          });
          delete profile.password;

          return profile;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
