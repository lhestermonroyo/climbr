import { v4 as uuidv4 } from 'uuid';

import query from '../lib/db';
import { formatColSet } from '../utils/common.util';

class UserService {
  private tableName: string;

  constructor() {
    this.tableName = 'user';
  }

  async getAllUsers() {
    try {
      const sql = `SELECT * FROM ${this.tableName} order by created_at desc`;

      return (await query(sql, [])) as any;
    } catch (error) {
      throw error;
    }
  }

  async getUsersBy(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet} order by created_at desc`;

      return (await query(sql, [...values])) as any;
    } catch (error) {
      throw error;
    }
  }

  async getUser(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet}`;

      const res = await query(sql, [...values]);
      return res[0] as any;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: any) {
    try {
      const id = uuidv4();
      const { username, email, password, fullname, location, bio, role } = user;

      const sql = `INSERT INTO ${this.tableName} (id, username, email, password, fullname, location, bio, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        id,
        username,
        email,
        password,
        fullname,
        location,
        bio,
        role,
      ];

      const { affectedRows } = (await query(sql, values)) as any;
      return affectedRows || 0;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(params: any, username: string) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `UPDATE ${this.tableName} SET ${colSet} WHERE username = ?`;

      const { affectedRows } = (await query(sql, [...values, username])) as any;
      return affectedRows || 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
