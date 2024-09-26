import { v4 as uuidv4 } from 'uuid';

import query from '../lib/db';
import { formatColSet } from '../utils/common.util';

class UserModel {
  private tableName: string;

  constructor() {
    this.tableName = 'users';
  }

  async findAll() {
    try {
      const sql = `SELECT * FROM ${this.tableName}`;

      return await query(sql, []);
    } catch (error) {
      throw error;
    }
  }

  async find(params: string) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet}`;

      return await query(sql, [...values]);
    } catch (error) {
      throw error;
    }
  }

  async findOne(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet}`;
      const result = await query(sql, [...values]);

      return result[0];
    } catch (error) {
      throw error;
    }
  }

  async create(user: any) {
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

      return (await query(sql, values)) as any;
    } catch (error) {
      throw error;
    }
  }

  async update(params: any, username: string) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `UPDATE ${this.tableName} SET ${colSet} WHERE username = ?`;

      return (await query(sql, [...values, username])) as any;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserModel();
