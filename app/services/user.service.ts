import UserModel from '../models/user.model';

class UserService {
  async getAllUsers() {
    try {
      return await UserModel.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getUsers(params: any) {
    try {
      return await UserModel.find(params);
    } catch (error) {
      throw error;
    }
  }

  async getUser(params: any) {
    try {
      return await UserModel.findOne(params);
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: any) {
    try {
      return await UserModel.create(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(params: any, username: string) {
    try {
      return await UserModel.update(params, username);
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
