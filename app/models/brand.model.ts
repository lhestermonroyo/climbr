import { v4 as uuidv4 } from 'uuid';

import query from '../lib/db';
import { formatColSet } from '../utils/common.util';

class BrandModel {
  private tableName: string;

  constructor() {
    this.tableName = 'brand';
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

  async create(brand: any) {
    try {
      const id = uuidv4();
      const { creator, name, description, thumbnail } = brand;

      const sql = `INSERT INTO ${this.tableName} (id, creator, name, description, thumbnail) VALUES (?, ?, ?, ?, ?)`;
      const values = [id, creator, name, description, thumbnail];

      const { affectedRows } = (await query(sql, values)) as any;
      return affectedRows || 0;
    } catch (error) {
      throw error;
    }
  }

  async update(params: any, id: string) {
    try {
      const { colSet, values } = formatColSet(params);
      const sql = `UPDATE ${this.tableName} SET ${colSet} WHERE id = ?`;

      return await query(sql, [...values, id]);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

      return await query(sql, [id]);
    } catch (error) {
      throw error;
    }
  }
}

export default new BrandModel();
