import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import UserService from '../services/user.service';
import { generateToken } from '../utils/auth.util';

class UserController {
  async getUsers(req: any, res: any) {
    try {
      const users = await UserService.getAllUsers();

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getProfile(req: any, res: any) {
    try {
      const { username } = req.params;

      const user = await UserService.getUser({ username });
      delete user.password;

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async signUp(req: any, res: any) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = req.body;
      const newUser = await UserService.createUser({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      });
      delete newUser.password;

      return res.status(201).json(newUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res
          .status(409)
          .json({ error: 'Email/username already exists.' });
      }

      return res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: any, res: any) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      const user = await UserService.getUser({ username });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      delete user.password;

      const token = generateToken(user);

      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req: any, res: any) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username } = req.params;
      const user = req.body;

      const updatedUser = await UserService.updateUser({ ...user }, username);
      delete updatedUser.password;

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();
