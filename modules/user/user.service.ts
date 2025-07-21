import { UserInputError } from 'apollo-server';
import User from './user.model';
import { CreateUserInput, UpdateUserInput } from '../../types';

export default {
  async createUser(createUserInput: CreateUserInput) {
    const existingUser = await this.getActiveUserByEmail(createUserInput.email);

    if (existingUser) {
      throw new UserInputError('User already exists');
    }

    const newUser = new User({ ...createUserInput });
    return await newUser.save();
  },
  async updateUser(email: string, updateUserInput: Partial<UpdateUserInput>) {
    const user = await this.getActiveUserByEmail(email);

    if (!user) {
      throw new UserInputError('User not found');
    }

    return await User.findOneAndUpdate(
      { email },
      { $set: updateUserInput },
      { new: true }
    );
  },
  async setUserArchiveStatus(email: string, isArchived: boolean) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    user.isArchived = isArchived;
    return await user.save();
  },
  async getActiveUserById(id: string) {
    return await User.findById(id).where({ isArchived: false });
  },
  async getActiveUserByEmail(email: string) {
    return await User.findOne({ email, isArchived: false });
  },
  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }
};
