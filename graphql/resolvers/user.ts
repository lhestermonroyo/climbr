import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server';

import User from '../../models/User';
import { signUpSchema } from '../../middleware/validator.middleware';
import { SessionUser, SignUpInput } from '../../types';

export default {
  Mutation: {
    async signUp(
      _: {},
      { signUpInput }: { signUpInput: SignUpInput },
      { sUser }: { sUser: SessionUser | null }
    ) {
      try {
        if (!sUser) {
          throw new UserInputError('User not authenticated');
        }

        if (!sUser.verified) {
          throw new UserInputError('Email not verified');
        }

        await signUpSchema.validate(signUpInput, { abortEarly: false });

        const { email, password, firstName, lastName } = signUpInput;

        const user = await User.findOne({ email });

        if (user) {
          throw new Error('User already exists');
        }

        const newUser = new User({
          email,
          password,
          firstName,
          lastName
        });
      } catch (error) {
        console.log('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    }
  },
  Query: {
    getUsers: async (_: any, __: any, ctx: any) => {
      try {
        // const result = await User.
        // const users = result.rows;
        // return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }
    }
  }
};
