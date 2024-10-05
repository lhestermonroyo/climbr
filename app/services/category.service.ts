import { v4 as uuidv4 } from 'uuid';

import query from '../lib/db';
import { formatColSet } from '../utils/common.util';

class CategoryService {
  private tableName: string;

  constructor() {
    this.tableName = 'category';
  }

  async getAllCategories() {
    try {
      const sql = `SELECT * FROM ${this.tableName} order by category.created_at desc`;

      return (await query(sql, [])) as any;
    } catch (error) {
      throw error;
    }
  }

  async getCategoriesBy(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet} order by created_at desc`;

      return (await query(sql, [...values])) as any;
    } catch (error) {
      throw error;
    }
  }

  async getCategory(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet}`;

      const res = await query(sql, [...values]);
      return res[0] as any;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(category: any) {
    try {
      const id = uuidv4();
      const { creator, name, description } = category;

      const sql = `INSERT INTO ${this.tableName} (id, creator, name, description) VALUES (?, ?, ?, ?)`;
      const values = [id, creator, name, description];

      const { affectedRows } = (await query(sql, values)) as any;
      return affectedRows || 0;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(params: any, id: string) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `UPDATE ${this.tableName} SET ${colSet} WHERE id = ?`;
      const res = await query(sql, [...values, id]);

      return res;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

      const res = await query(sql, [id]);
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoryService();
